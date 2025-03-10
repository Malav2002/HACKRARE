import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InputPage from './InputPage';
import ResultsPage from './ResultsPage';
import DetailDiagnosis from './DetailDiagnosis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/detail" element={<DetailDiagnosis />} />
      </Routes>
    </Router>
  );
}

export default App;