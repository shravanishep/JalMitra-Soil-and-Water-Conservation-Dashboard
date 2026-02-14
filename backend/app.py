from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")


def load_csv(filename):
    file_path = os.path.join(DATA_DIR, filename)

    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"CSV file not found: {file_path}")

    try:
        return pd.read_csv(file_path)
    except Exception as exc:
        raise RuntimeError(f"Failed to read CSV file: {file_path}") from exc


def to_numeric_frame(frame, numeric_columns):
    typed = frame.copy()
    for column in numeric_columns:
        typed[column] = pd.to_numeric(typed[column], errors="coerce")
    return typed


@app.route("/api/v1/health")
def home():
    return "JalMitra Backend Running"

@app.route("/api/v1/summary")
def summary():
    projects = load_csv("projects.csv")
    beneficiaries = load_csv("beneficiaries.csv")
    progress = load_csv("progress.csv")

    data = {
        "total_projects": len(projects),
        "total_beneficiaries": len(beneficiaries),
        "total_water_conserved": round(progress["water_conserved_lakh_liters"].sum(), 1)
    }

    return jsonify(data)


@app.route("/api/v1/yearly-water")
def yearly_water():
    progress = load_csv("progress.csv")

    if progress.empty:
        return jsonify([])

    typed = progress.copy()
    typed["year"] = pd.to_numeric(typed["year"], errors="coerce")
    typed["water_conserved_lakh_liters"] = pd.to_numeric(
        typed["water_conserved_lakh_liters"], errors="coerce"
    )

    typed = typed.dropna(subset=["year", "water_conserved_lakh_liters"])
    if typed.empty:
        return jsonify([])

    grouped = (
        typed.groupby("year", as_index=False)["water_conserved_lakh_liters"]
        .sum()
        .sort_values("year", ascending=True)
    )

    result = [
        {
            "year": int(row["year"]),
            "water_conserved_lakh_liters": round(float(row["water_conserved_lakh_liters"]), 1),
        }
        for _, row in grouped.iterrows()
    ]

    return jsonify(result)


@app.route("/api/v1/yearly-soil")
def yearly_soil():
    soil_metrics = load_csv("soil_metrics.csv")

    if soil_metrics.empty:
        return jsonify([])

    typed = to_numeric_frame(
        soil_metrics, ["year", "land_treated_hectares", "soil_saved_tons"]
    ).dropna(subset=["year", "land_treated_hectares", "soil_saved_tons"])
    if typed.empty:
        return jsonify([])

    grouped = (
        typed.groupby("year", as_index=False)[["land_treated_hectares", "soil_saved_tons"]]
        .sum()
        .sort_values("year", ascending=True)
    )

    result = [
        {
            "year": int(row["year"]),
            "land_treated_hectares": round(float(row["land_treated_hectares"]), 1),
            "soil_saved_tons": round(float(row["soil_saved_tons"]), 1),
        }
        for _, row in grouped.iterrows()
    ]
    return jsonify(result)


@app.route("/api/v1/village-impact")
def village_impact():
    projects = load_csv("projects.csv")
    progress = load_csv("progress.csv")
    soil_metrics = load_csv("soil_metrics.csv")

    if projects.empty:
        return jsonify([])

    project_map = projects[["project_id", "village"]].copy()

    water = to_numeric_frame(
        progress, ["water_conserved_lakh_liters"]
    ).dropna(subset=["water_conserved_lakh_liters"])
    water = water.merge(project_map, on="project_id", how="left").dropna(subset=["village"])
    water_grouped = (
        water.groupby("village", as_index=False)["water_conserved_lakh_liters"]
        .sum()
        .rename(columns={"water_conserved_lakh_liters": "water_conserved_lakh_liters"})
    )

    soil = to_numeric_frame(soil_metrics, ["land_treated_hectares"]).dropna(
        subset=["land_treated_hectares"]
    )
    soil = soil.merge(project_map, on="project_id", how="left").dropna(subset=["village"])
    soil_grouped = (
        soil.groupby("village", as_index=False)["land_treated_hectares"]
        .sum()
        .rename(columns={"land_treated_hectares": "land_treated_hectares"})
    )

    merged = water_grouped.merge(soil_grouped, on="village", how="outer").fillna(0.0)
    merged = merged.sort_values("water_conserved_lakh_liters", ascending=False)

    result = [
        {
            "village": row["village"],
            "water_conserved_lakh_liters": round(float(row["water_conserved_lakh_liters"]), 1),
            "land_treated_hectares": round(float(row["land_treated_hectares"]), 1),
        }
        for _, row in merged.iterrows()
    ]
    return jsonify(result)


@app.route("/api/v1/project-type-impact")
def project_type_impact():
    projects = load_csv("projects.csv")
    progress = load_csv("progress.csv")
    soil_metrics = load_csv("soil_metrics.csv")

    if projects.empty:
        return jsonify([])

    project_map = projects[["project_id", "activity_type"]].copy()

    water = to_numeric_frame(
        progress, ["water_conserved_lakh_liters"]
    ).dropna(subset=["water_conserved_lakh_liters"])
    water = water.merge(project_map, on="project_id", how="left").dropna(subset=["activity_type"])
    water_grouped = water.groupby("activity_type", as_index=False)["water_conserved_lakh_liters"].sum()

    soil = to_numeric_frame(soil_metrics, ["land_treated_hectares"]).dropna(
        subset=["land_treated_hectares"]
    )
    soil = soil.merge(project_map, on="project_id", how="left").dropna(subset=["activity_type"])
    soil_grouped = soil.groupby("activity_type", as_index=False)["land_treated_hectares"].sum()

    merged = water_grouped.merge(soil_grouped, on="activity_type", how="outer").fillna(0.0)
    merged = merged.sort_values("water_conserved_lakh_liters", ascending=False)

    result = [
        {
            "activity_type": row["activity_type"],
            "water_conserved_lakh_liters": round(float(row["water_conserved_lakh_liters"]), 1),
            "land_treated_hectares": round(float(row["land_treated_hectares"]), 1),
        }
        for _, row in merged.iterrows()
    ]
    return jsonify(result)


@app.route("/api/v1/yearly-beneficiaries")
def yearly_beneficiaries():
    enrollments = load_csv("beneficiary_enrollments.csv")

    if enrollments.empty:
        return jsonify([])

    typed = to_numeric_frame(
        enrollments, ["year", "households_enrolled", "people_enrolled"]
    ).dropna(subset=["year", "households_enrolled", "people_enrolled"])
    if typed.empty:
        return jsonify([])

    grouped = (
        typed.groupby("year", as_index=False)[["households_enrolled", "people_enrolled"]]
        .sum()
        .sort_values("year", ascending=True)
    )

    result = [
        {
            "year": int(row["year"]),
            "households_enrolled": int(row["households_enrolled"]),
            "people_enrolled": int(row["people_enrolled"]),
        }
        for _, row in grouped.iterrows()
    ]
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
