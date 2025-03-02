import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DiseaseContext } from './DiseaseContext';

function InputPage() {
  const [hpoTerms, setHpoTerms] = useState([]);
  const [hpoValue, setHpoValue] = useState([]);
  const [temp, setTemp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {setOldHpoIdList,setDiseaseList} = useContext(DiseaseContext);


  const handleChange = (e) => {
    setTemp(e.target.value);
  };

  const addInput = async (e) => {
    e.preventDefault(); 
    if (!temp.trim()) return;
    setIsLoading(true);
    try {
      const resp = await axios.post('https://hackrare.onrender.com/find-symptom', {
        phenotypes: temp,
      });
      const output = resp.data;
      if (output.errorCode === 0 || output.errorCode === 1) {
        alert('Please provide a valid HPO term.');
      } else if (output.errorCode === 2) {
        const hpoID = output.id;
        setHpoTerms((prev) => [...prev, hpoID]);
        setOldHpoIdList((prev) => [...prev, hpoID]);
        setHpoValue((prev) => [...prev, temp]);
      }
      setTemp('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hpoTerms.length === 0) {
      return alert('Please add at least one HPO term.');
    }
    
    setIsLoading(true);
    try {
      const resp = await axios.post('https://hackrare.onrender.com/find-disease', {
        phenotypesList: hpoTerms,
      });
      const output = resp.data;
      
      if (output.errorCode === 2) {
        navigate('/results', { state: { matchedDiseases: output.matched_diseases } });
        console.log(output.matched_diseases);
        setDiseaseList((prev)=>[...prev,...output.matched_diseases]);
      } else {
        alert('No matching diseases found.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeHpoTerm = (index) => {
    setHpoValue((prev) => prev.filter((_, i) => i !== index));
    setHpoTerms((prev) => prev.filter((_, i) => i !== index));
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
                  Rare Disease Matcher
                </h1>
                <p className="text-center mb-0 text-white-50">
                  Enter HPO terms to find matching rare diseases
                </p>
              </div>
              
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="hpoInput" className="form-label mb-2" style={{ color: "#4B6CB7", fontWeight: "500" }}>
                      Enter HPO Term:
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-2"
                        id="hpoInput"
                        placeholder="e.g., Hypoglycemia, Seizures"
                        value={temp}
                        onChange={handleChange}
                        style={{ borderColor: "#cad5e3", borderRadius: "6px 0 0 6px" }}
                      />
                      <button
                        onClick={addInput}
                        className="btn text-white px-4"
                        type="button" // Prevent form submission
                        disabled={isLoading || !temp.trim()}
                        style={{ 
                          backgroundColor: "#4B6CB7", 
                          borderColor: "#4B6CB7",
                          borderRadius: "0 6px 6px 0" 
                        }}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          'Add'
                        )}
                      </button>
                    </div>
                  </div>

                  {hpoValue.length > 0 ? (
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label mb-0" style={{ color: "#4B6CB7", fontWeight: "500" }}>
                          HPO Terms Added:
                        </label>
                        <span className="badge" style={{ backgroundColor: "#4B6CB7" }}>
                          {hpoValue.length}
                        </span>
                      </div>
                      
                      <div className="list-group">
                        {hpoValue.map((value, index) => (
                          <div 
                            key={index} 
                            className="list-group-item d-flex justify-content-between align-items-center"
                            style={{ borderColor: "#e8eef5" }}
                          >
                            <span>{value}</span>
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => removeHpoTerm(index)}
                              style={{ color: "#e63946", backgroundColor: "rgba(230, 57, 70, 0.1)" }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="alert mb-4"
                      style={{ backgroundColor: "rgba(75, 108, 183, 0.1)", color: "#4B6CB7", borderColor: "rgba(75, 108, 183, 0.2)" }}
                    >
                      No HPO terms added yet. Add at least one term to search for matching diseases.
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg text-white py-3"
                      disabled={isLoading || hpoTerms.length === 0}
                      style={{ 
                        background: hpoTerms.length === 0 
                          ? "#a9b6cb" 
                          : "linear-gradient(90deg, #4B6CB7 0%, #182848 100%)",
                        borderRadius: "6px",
                        border: "none"
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        'Find Matching Diseases'
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
              <div 
                className="card-footer py-3 text-center"
                style={{ backgroundColor: "#f8f9fb", borderTop: "1px solid #e8eef5" }}
              >
                <small className="text-muted">
                  This tool helps identify potential rare diseases based on HPO terms.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(24, 40, 72, 0.7)', zIndex: 1050 }}
        >
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <div className="spinner-border mb-3" style={{ color: "#4B6CB7" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mb-0" style={{ color: "#4B6CB7" }}>Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputPage;