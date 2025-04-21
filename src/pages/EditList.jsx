import { useLocation } from "react-router-dom"
import ListEdit from "../components/Common/ListEdit"

const EditList = () => { 
    const location = useLocation()
    const { username, identificador, id_consulta, nomina } = location.state || { username: '', identificador: '' }


    return <>
        <ListEdit username={username} nomina={nomina}/>
    </>

 }

 export default EditList