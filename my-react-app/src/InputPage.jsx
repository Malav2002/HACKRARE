import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InputPage() {
  const [hpoTerms, setHpoTerms] = useState([]);
  const [hpoValue, setHpoValue] = useState([]);
  const [temp, setTemp] = useState(''); // Initialize the state as an empty string
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const navigate = useNavigate(); // To navigate to another page after form submission

  const handleChange = (e) => {
    setTemp(e.target.value); // Update the state with the input value
  };

  const addInput = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post('https://hackrare.onrender.com/find-symptom', {
        phenotypes: temp,
      });
      const output = resp.data;
      if (output.errorCode === 0 || output.errorCode === 1) {
        return alert('Please Provide Correct Data.');
      } else if (output.errorCode === 2) {
        const hpoID = output.id;
        setHpoTerms((prev) => [...prev, hpoID]);
        setHpoValue((prev) => [...prev, temp]); // Add the entered HPO term to hpoValue
      }
      setTemp('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    try {
      const resp = await axios.post('https://hackrare.onrender.com/find-disease', {
        phenotypesList: hpoTerms,
      });
      const output = resp.data;
      console.log(output);

      // Simulate a delay for demonstration purposes
      setTimeout(() => {
        setIsLoading(false); // Set loading state to false
        navigate('/results'); // Redirect to the results page
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false); // Set loading state to false in case of error
      alert('An error occurred while processing your request.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-light">
            <div className="card-body p-5">
              <h1 className="card-title text-center mb-4 display-4 fw-bold text-primary">
                Rare Disease Matcher
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="hpoTerms"
                    className="form-label fs-5 fw-semibold text-secondary"
                  >
                    Enter HPO Terms (comma-separated):
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg p-3"
                    id="hpoTerms"
                    value={temp}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-grid gap-3">
                  <button
                    onClick={addInput}
                    className="btn btn-outline-primary btn-lg shadow-sm hover-shadow-lg"
                  >
                    <i className="bi bi-plus-circle me-2"></i> Add the HPO Term
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-pill shadow hover-shadow-lg"
                    disabled={isLoading} // Disable the button while loading
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i> Find Matches
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Display HPO Terms as a List */}
              <div className="mt-4">
                <h3 className="text-center mb-3 fw-bold text-secondary">Added HPO Terms:</h3>
                <ul className="list-group">
                  {hpoValue.map((value, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {value}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          // Remove the HPO term from the list
                          setHpoValue((prev) => prev.filter((_, i) => i !== index));
                          setHpoTerms((prev) => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputPage;