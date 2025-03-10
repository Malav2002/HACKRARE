import { useContext,createContext, useState } from "react";

export const DiseaseContext = createContext();


export function DiseaseContextProvider({children}) {
    const [oldHpoIdList, setOldHpoIdList] = useState([]);
    const [diseaseList, setDiseaseList] = useState([]);
  return (
    <DiseaseContext.Provider value={{oldHpoIdList,setOldHpoIdList,diseaseList,setDiseaseList}}>
      {children}
    </DiseaseContext.Provider>
  )
}