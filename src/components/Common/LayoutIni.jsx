import { Outlet, useLocation } from "react-router-dom"
import NavSideBar from "./NavSideBar"
import FooterLogin from "./Footer"
import logo from '../../assets/images/kayser_logo2.png';

const LayoutIni = () => { 
    const location = useLocation()
    const { username, nomina, identificador, id_consulta, isAuthenticated } = location.state  || {}

    return <>
    <div className="bg-fondo bg-cover">
            
            <div className="flex flex-col md:flex-row">
                
                <NavSideBar username={username} identificador={identificador} id_consulta={id_consulta} nomina={nomina}/>
                
                
                <div className="flex justify-center items-center w-full md:w-[85%] h-screen">
                    
                    <Outlet /> 
                </div>
            </div>
            <div className="flex items-center md:justify-between ml-[800px] mt-[-56px]"><FooterLogin /></div>
    </div>
    </>
 }

 export default LayoutIni