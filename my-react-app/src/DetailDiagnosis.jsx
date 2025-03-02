import React, { useState,useContext, useEffect} from 'react';
import { DiseaseContext } from './DiseaseContext';
import axios from 'axios';

const DetailDiagnosis = () => {

    const {diseaseList,oldHpoIdList} = useContext(DiseaseContext);

    useEffect(() => {
        const data = {
            "disease":diseaseList,
            "phenotypesList":oldHpoIdList
        }
        console.log(diseaseList)
        console.log(oldHpoIdList)
        const resp  = axios.post("https://hackrare.onrender.com/getFinal",data);
        const leftoverTerm = resp.data
        console.log(leftoverTerm);

    },[])


    return(
        <div>
            <h1>Detail Diagnosis</h1>
        </div>
    )
}


export default DetailDiagnosis;