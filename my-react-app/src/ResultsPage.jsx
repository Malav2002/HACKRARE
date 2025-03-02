import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hpoTerms } = location.state || {};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="card-title text-center mb-4 display-4 fw-bold">
                Results
              </h1>

              <div className="mb-4">
                <h2 className="h5 fw-bold">Entered HPO Terms:</h2>
                <ul className="list-group">
                  {hpoTerms?.map((term, index) => (
                    <li key={index} className="list-group-item">
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary btn-lg w-100"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;