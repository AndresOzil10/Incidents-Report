import { Route, Router, Routes, useLocation } from "react-router-dom"
import BHList from "../components/Supervisor/BHList"

const BH = () => { 
    const location = useLocation()
    const { username, identificador, id_consulta, nomina } = location.state || { username: '', identificador: '' }

    //console.log(id_consulta)

    return <>
        <BHList username={username} identificador={identificador} id_consulta={id_consulta} nomina={nomina}/>
    </>
 }

 export default BH