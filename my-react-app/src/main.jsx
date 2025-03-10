import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css' // Import Bootstrap CSS
import './index.css'
import { DiseaseContextProvider } from './DiseaseContext'
 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DiseaseContextProvider>
      <App />
    </DiseaseContextProvider>
  </React.StrictMode>
)