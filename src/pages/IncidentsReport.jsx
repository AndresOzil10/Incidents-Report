import { Route, Router, Routes, useLocation } from "react-router-dom"
import ListIncidents from "../components/Supervisor/ListIncidents"
import StaffIncidents from "../components/Staff/StaffIncidents"
import PersonalIncidents from "../components/Master/PersonalIncidents"

const IncidentsReport = () => { 
    const location = useLocation()
    const { username, identificador, id_consulta, nomina } = location.state || { username: '', identificador: '' }

  //console.log(nomina)

    return <>

        {identificador == 3 || identificador == 2 || identificador == 4 ? <ListIncidents identificador = {identificador} id_consulta={id_consulta} nomina={nomina} username={username}/> : identificador == 5 ? <StaffIncidents identificador = {identificador} id_consulta={id_consulta} nomina={nomina} username={username}/> : identificador == 6 || identificador == 9 ? <PersonalIncidents identificador = {identificador} id_consulta={id_consulta} nomina={nomina} username={username}/> : null}
    </>
 }

 export default IncidentsReport