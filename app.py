import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from phrank.phrank import Phrank
from phrank.phrank import utils as phrank_utils
import requests


load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["DiseaseDB"]  # Replace with your database name

disease = db["Diseases"]
symptoms = db["HPO_Terms"]



def getPhrankScore(userPhenotype,diseasePhenotype):
    DAG="./phrank/demo/data/hpodag.txt"
    DISEASE_TO_PHENO="./phrank/demo/data/disease_to_pheno.build127.txt"
    DISEASE_TO_GENE="./phrank/demo/data/gene_to_disease.build127.txt"
    p_hpo = Phrank(DAG, diseaseannotationsfile=DISEASE_TO_PHENO, diseasegenefile=DISEASE_TO_GENE)

    # computing the similarity between two sets of phenotypes
    matchscore = p_hpo.compute_phenotype_match(userPhenotype,diseasePhenotype)

    return matchscore


# 0 error code -> no data provided correctly from frontend
# 1 error code -> the symptom provided is not valid one 
# 2 error code -> success

@app.route("/find-symptom", methods=["Post"])
def getSymptomsFromUser():
    data = request.json

    if not data or "phenotypes" not in data:
        return jsonify({"errorCode":0})
    
    symptom = data["phenotypes"]
    symptom_match = symptoms.find_one({"HPOTerm": symptom.lower()})

    if(not symptom_match):
        return jsonify({"errorCode":1})
    
    return jsonify({"errorCode":2,"id":symptom_match.get("HPOId")})

@app.route("/find-disease", methods=["POST"])
def getDisease():
    data = request.json

    if not data or "phenotypesList" not in data:
        return jsonify({"errorCode": 0})
    
    input_phenotypes = set(data["phenotypesList"])  

    userPhenotypes = list(input_phenotypes)
    
    query = {"HPO_Ids": {"$in": userPhenotypes}}
    
    matched_diseases = disease.find(query, {"_id": 0})

    disease_scores = []

    for d in matched_diseases:
        disease_hpo = set(d.get("HPO_Ids", []))  
        matched_hpos = disease_hpo.intersection(input_phenotypes)  
        match_probability = (len(matched_hpos) / len(disease_hpo)) * 100 if disease_hpo else 0 
        d["match_probability"] = match_probability
        disease_scores.append(d)  

    disease_scores.sort(key=lambda d: d["match_probability"], reverse=True)

    s = min(10,len(disease_scores))

    disease_scores = disease_scores[:s]

    disease_phrank_score = []

    for i in disease_scores:
        diseasePhenotype = i["HPO_Ids"]
        score = getPhrankScore(userPhenotypes,diseasePhenotype)
        disease_phrank_score.append([score,i["DiseaseName"]])


    disease_phrank_score.sort(reverse=True)

    return jsonify({"errorCode": 2, "matched_diseases": disease_phrank_score[:min(s,3)]})

@app.route("/getFinal",methods=["POST"])
def getFinal():
    data = request.json

    if not data or "phenotypesList" not in data:
        return jsonify({"errorCode": 0})
    
    input_disease = data["disease"]
    input_phenotypes = set(data["phenotypesList"])  
    overall_phenotypes = []
    
    for i in input_disease:
        print(i[1])
        disease_match = disease.find_one({"DiseaseName": i[1]})    
        overall_phenotypes.extend(disease_match.get("HPO_Ids"))

    leftover_phenotypes = list(set(overall_phenotypes)-set(input_phenotypes))

    leftover_phenotypesTerm = []

    for i in leftover_phenotypes:
        match = symptoms.find_one({"HPOId":i})
        leftover_phenotypesTerm.append(match.get("HPOTerm"))

    return jsonify({"finalPhenotypes":leftover_phenotypesTerm})

@app.route("/getDetailDiagnosis",methods=["POST"])
def getDetailDiagnosis():
    data = request.json

    if not data or "phenotypesList" not in data:
        return jsonify({"errorCode": 0})
    
    oldPhenotypes = data["phenotypesList"]
    newPhenotypes = data["newPhenotypes"]

    newId=[]

    for i in newPhenotypes:
        symptoms_match = symptoms.find_one({"HPOTerm":i.lower()})
        newId.append(symptoms_match.get("HPOId"))
        oldPhenotypes.append(symptoms_match.get("HPOId"))

    payload = {"phenotypesList": oldPhenotypes}

    response = requests.post("https://hackrare.onrender.com/find-disease", json=payload)
    
    data = response.json()
    data['newPhenotypesId'] = newId

    return jsonify(data)

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=8000)