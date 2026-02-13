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

if __name__ == "__main__":
    app.run(debug=True)
