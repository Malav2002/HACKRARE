import React, { useState, useContext, useEffect } from "react";
import { DiseaseContext } from "./DiseaseContext";
import axios from "axios";

const DetailDiagnosis = () => {
    const { diseaseList, oldHpoIdList } = useContext(DiseaseContext);
    const [phenotypes, setPhenotypes] = useState([]); // Store phenotypes from API
    const [selectedSymptoms, setSelectedSymptoms] = useState({}); // Track user selections
    const [loading, setLoading] = useState(true); // Loading state
    const [submitting, setSubmitting] = useState(false); // Submission state

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const data = {
                    disease: diseaseList,
                    phenotypesList: oldHpoIdList,
                };
                const resp = await axios.post("https://hackrare.onrender.com/getFinal", data);
                console.log("Response Data:", resp.data.finalPhenotypes);

                setPhenotypes(resp.data.finalPhenotypes || []);
                const initialSelections = {};
                (resp.data.finalPhenotypes || []).forEach((symptom) => {
                    initialSelections[symptom] = false;
                });
                setSelectedSymptoms(initialSelections);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []); 

    const handleCheckboxChange = (symptom) => {
        setSelectedSymptoms((prevSelections) => ({
            ...prevSelections,
            [symptom]: !prevSelections[symptom], // Toggle selection
        }));
    };

    const getFinalSymptoms = async () => {
        setSubmitting(true);
        try {
            const finalSymptoms = Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom]);
            const data = {
                phenotypesList: oldHpoIdList,
                newPhenotypes: finalSymptoms
            };
            const resp = await axios.post("https://hackrare.onrender.com/getDetailDiagnosis", data);
            console.log("Final Response:", resp.data);
            const output = resp.data
            navigate('/results', { state: { matchedDiseases: output.matched_diseases } })
        } catch (error) {
            console.error("Error submitting data:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div 
            className="min-vh-100 d-flex align-items-center justify-content-center py-5"
            style={{
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                backgroundAttachment: "fixed"
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card border-0 shadow" style={{ borderRadius: "12px", overflow: "hidden" }}>
                            <div 
                                className="card-header text-white p-4 border-0"
                                style={{ 
                                    background: "linear-gradient(90deg, #4B6CB7 0%, #182848 100%)",
                                }}
                            >
                                <h1 
                                    className="text-center mb-2" 
                                    style={{ 
                                        fontSize: "2.2rem", 
                                        fontWeight: "600",
                                        color: "#FFD700" // Gold color
                                    }}
                                >
                                    Detail Diagnosis
                                </h1>
                                <p className="text-center mb-0 text-white-50">
                                    Select your symptoms for detailed diagnosis
                                </p>
                            </div>
                            
                            <div className="card-body p-4">
                                {loading ? (
                                    <p className="text-center text-gray-500">Loading symptoms...</p>
                                ) : (
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label mb-0" style={{ color: "#4B6CB7", fontWeight: "500" }}>
                                                Please Select Any Of The Additional Symptoms:
                                            </label>
                                          
                                        </div>
                                        
                                        <div className="list-group">
                                            {phenotypes.length > 0 ? (
                                                phenotypes.map((symptom, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                        style={{ borderColor: "#e8eef5" }}
                                                    >
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                id={`symptom-${index}`}
                                                                className="form-check-input"
                                                                checked={selectedSymptoms[symptom] || false}
                                                                onChange={() => handleCheckboxChange(symptom)}
                                                                style={{ accentColor: "#4B6CB7" }}
                                                            />
                                                            <label htmlFor={`symptom-${index}`} className="form-check-label">{symptom}</label>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div 
                                                    className="alert mb-0"
                                                    style={{ backgroundColor: "rgba(75, 108, 183, 0.1)", color: "#4B6CB7", borderColor: "rgba(75, 108, 183, 0.2)" }}
                                                >
                                                    No symptoms available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        onClick={getFinalSymptoms}
                                        disabled={submitting || phenotypes.length === 0}
                                        className="btn btn-lg text-white py-3"
                                        style={{ 
                                            background: phenotypes.length === 0 
                                                ? "#a9b6cb" 
                                                : "linear-gradient(90deg, #4B6CB7 0%, #182848 100%)",
                                            borderRadius: "6px",
                                            border: "none"
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Selected Symptoms'
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div 
                                className="card-footer py-3 text-center"
                                style={{ backgroundColor: "#f8f9fb", borderTop: "1px solid #e8eef5" }}
                            >
                                <small className="text-muted">
                                    This tool helps identify potential rare diseases based on selected symptoms.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(24, 40, 72, 0.7)', zIndex: 1050 }}
                >
                    <div className="bg-white p-4 rounded shadow-lg text-center">
                        <div className="spinner-border mb-3" style={{ color: "#4B6CB7" }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mb-0" style={{ color: "#4B6CB7" }}>Loading symptoms...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailDiagnosis;