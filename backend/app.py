from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "JalMitra Backend Running"

@app.route("/summary")
def summary():
    projects = pd.read_csv("data/projects.csv")
    beneficiaries = pd.read_csv("data/beneficiaries.csv")
    progress = pd.read_csv("data/progress.csv")

    data = {
        "total_projects": len(projects),
        "total_beneficiaries": len(beneficiaries),
        "total_water_conserved": round(progress["water_conserved_lakh_liters"].sum(), 1)
    }

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
