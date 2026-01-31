from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

@app.route("/")
def home():
    return "JalMitra Backend Running"

@app.route("/summary")
def summary():
    projects = pd.read_csv("data/projects.csv")
    beneficiaries = pd.read_csv("data/beneficiaries.csv")
    progress = pd.read_csv("data/progress.csv")

    data = {
        "projects": len(projects),
        "beneficiaries": len(beneficiaries),
        "water_conserved": int(progress["water_conserved_lakh_liters"].sum())
    }

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
