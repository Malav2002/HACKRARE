import React from 'react';
import { useLocation,useNavigate} from 'react-router-dom';



function ResultsPage() {
  const location = useLocation();
  const { matchedDiseases } = location.state || { matchedDiseases: [] };
  const navigate = useNavigate();

  const getMoreSymptoms = () => {
    console.log("get more symptoms");
    navigate('/detail');
  } 

  const goToHome = () => {
    navigate('/');
  }

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
                    color: "#39B9A8" // Gold color
                  }}
                >
                  Rare Disease Matcher Results
                </h1>
                <p className="text-center mb-0 text-white-50">
                  Matched diseases based on your HPO terms
                </p>
              </div>
              
              <div className="card-body p-4">
                <div className="mb-4">
                  <h2 className="text-center mb-4" style={{ color: "#4B6CB7", fontWeight: "500" }}>
                    Top Matched Diseases
                  </h2>
                  
                  {matchedDiseases.length > 0 ? (
                    <div className="list-group">
                      {matchedDiseases.map((disease, index) => (
                        <div 
                          key={index} 
                          className="list-group-item d-flex justify-content-between align-items-center mb-3"
                          style={{ 
                            borderColor: "#e8eef5", 
                            borderRadius: "6px",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                          }}
                        >
                          <div>
                            <h5 className="mb-1" style={{ color: "#4B6CB7" }}>
                              {disease[1]}
                            </h5>
                            <small className="text-muted">
                              Confidence Score: {disease[0].toFixed(2)}
                            </small>
                          </div>
                          <span 
                            className="badge"
                            style={{ 
                              backgroundColor: "#4B6CB7", 
                              color: "#fff",
                              borderRadius: "12px",
                              padding: "6px 12px"
                            }}
                          >
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="alert mb-4"
                      style={{ 
                        backgroundColor: "rgba(75, 108, 183, 0.1)", 
                        color: "#4B6CB7", 
                        borderColor: "rgba(75, 108, 183, 0.2)"
                      }}
                    >
                      No matching diseases found. Please try different HPO terms.
                    </div>
                  )}
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-lg text-white py-3"
                    style={{ 
                      background: "linear-gradient(90deg, #4B6CB7 0%, #182848 100%)",
                      borderRadius: "6px",
                      border: "none"
                    }}
                    onClick={goToHome}
                  >
                    Back to Input Page
                  </button>
                  <button className="btn btn-lg text-white py-3"
                    style={{ 
                      background: "linear-gradient(90deg, #4B6CB7 0%, #182848 100%)",
                      borderRadius: "6px",
                      border: "none"
                    }}
                      onClick={getMoreSymptoms}
                    >
                      Get More Detail diagonsis
                  </button>
                </div>
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
    </div>
  );
}

export default ResultsPage;