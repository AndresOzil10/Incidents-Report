import { useLocation } from "react-router-dom";
import SupervisorForm from "../components/Supervisor/SupervisorForm"
const PersonalIncidents = () => { 
    const location = useLocation();
    const { username, nomina, identificador, id_consulta } = location.state || {}
    

    return <>
                    <div>
                        <h2 className="ml-[-100px] text-3xl text-center text-red-500 font-bold mb-6">⚠️Control de Incidencias⚠️</h2>
                    </div>
                    {
                        identificador=='4' ?
                          <SupervisorForm username={username} identificador={identificador} id_consulta={id_consulta}/> 
                        :null
                    }
                     
    
    </>
 }

 export default PersonalIncidents