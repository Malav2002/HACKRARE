import xml.etree.ElementTree as ET
from pymongo import MongoClient


client = MongoClient("mongodb+srv://amit:aA123456@cluster0.wp6id.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")



db = client["DiseaseDB"]  
disease_collection = db["Diseases"] 
hpo_collection = db["HPO_Terms"]  

tree = ET.parse("rare.xml")
root = tree.getroot()

disease_data = [] 
hpo_mapping = {}  


for disorder in root.findall(".//Disorder"):
    disorder_name = disorder.find("Name").text if disorder.find("Name") is not None else "Unknown Disorder"
    
    hpo_ids = []  

    for hpo_assoc in disorder.findall(".//HPODisorderAssociation"):
        hpo_element = hpo_assoc.find("HPO")
        if hpo_element is not None:
            hpoid = hpo_element.find("HPOId").text if hpo_element.find("HPOId") is not None else "Unknown HPOId"
            hpoterm = hpo_element.find("HPOTerm").text if hpo_element.find("HPOTerm") is not None else "Unknown HPOTerm"
            
            hpo_mapping[hpoid] = hpoterm.lower()

            hpo_ids.append(hpoid)

    disease_document = {
        "DiseaseName": disorder_name,
        "HPO_Ids": hpo_ids
    }
    disease_data.append(disease_document)


if disease_data:
    disease_collection.insert_many(disease_data)
    print("Diseases successfully inserted into MongoDB!")


hpo_documents = [{"HPOId": hpoid, "HPOTerm": hpoterm} for hpoid, hpoterm in hpo_mapping.items()]
if hpo_documents:
    hpo_collection.insert_many(hpo_documents)
    print("HPO Terms successfully inserted into MongoDB!")


client.close()
