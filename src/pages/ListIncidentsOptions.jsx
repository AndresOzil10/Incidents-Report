import { useLocation } from "react-router-dom"
import ViewList from "../components/Master/ViewList"

const ListIncidentsOptions = () => { 
    const location = useLocation()
    const { username, identificador, id_consulta, nomina } = location.state || { username: '', identificador: '' }
    //console.log(username)
    return <>
        <ViewList username={username} identificador={identificador} nomina={nomina} id_consulta={id_consulta} />
    </>
 }

 export default ListIncidentsOptions