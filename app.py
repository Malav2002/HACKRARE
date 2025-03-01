from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  

def match_phenotypes(phenotypes):
   
    diseases = [
        {"name": "Disease A", "match_score": 85},
        {"name": "Disease B", "match_score": 78},
        {"name": "Disease C", "match_score": 60}
    ]
    return diseases

@app.route('/api/match', methods=['POST'])
def match():
    data = request.get_json()
    phenotypes = data.get('patientSymptoms', [])
    
    # Simulate disease matching
    result = match_phenotypes(phenotypes)

    # Send back a response with disease matches
    return jsonify({"diseases": result})

if __name__ == '__main__':
    app.run(debug=True)