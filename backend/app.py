from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "JalMitra Backend Running"

@app.route("/summary")
def summary():
    data = {
        "beneficiaries": 10600,
        "water_conserved": 600,
        "projects": 120
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)

