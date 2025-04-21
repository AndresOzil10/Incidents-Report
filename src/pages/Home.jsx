import SupervisorForm from "../components/Supervisor/SupervisorForm"
import StaffForm from "../components/Staff/StaffForm"
import { Route, Router, Routes, useLocation } from "react-router-dom"

const Home = () => { 
    const location = useLocation();
    const { username, nomina, identificador, id_consulta } = location.state || {}
    //console.log(id_consulta)

    return <>
                    <div>
                        <h2 className="ml-[-100px] text-3xl text-center text-red-500 font-bold mb-6">⚠️Control de Incidencias⚠️</h2>
                    </div>
                    {
                        identificador=='3' ?
                          <SupervisorForm username={username} identificador={identificador} id_consulta={id_consulta}/>
                        : identificador =='5' || identificador =='6' || identificador == '9' || identificador == '2' || identificador=='4' || identificador=='1' ?
                            <StaffForm username={username} nomina={nomina} identificador={identificador}/> 
                        :null
                    }
                     
    
    </>
 }

 
 export default Home