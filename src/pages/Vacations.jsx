import { Route, Router, Routes, useLocation } from "react-router-dom"
import VacationList from "../components/Supervisor/VacationList"

const Vacations = () => { 
    const location = useLocation()
    const { username, identificador, id_consulta, nomina } = location.state || { username: '', identificador: '' }

    //console.log(id_consulta)

    return <>

        <VacationList id_consulta={id_consulta} identificador={identificador}  username={username} />

    </>
 }

 export default Vacations