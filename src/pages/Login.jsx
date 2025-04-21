import { FaUserCircle  } from "react-icons/fa";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import logo from "../assets/images/kayser_logo.png"
import FooterLogin from "../components/Common/Footer";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { TbLogin2 } from "react-icons/tb";
import { HappyProvider } from "@ant-design/happy-work-theme";


const url_login = "http://10.144.13.5/wl-api/login.php"
//const url_login = "http://10.144.13.5/wl-api/login.php"

const enviarData = async (url, data) => {
    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    //console.log(resp)
    const json = await resp.json()
    //console.log(json)

    return  json
}

const handleButtonClick = () => {
// Realiza la navegación a '/ruta-destino'
return <Navigate to="/register" />;
};

const Login = () => { 

    const navigate = useNavigate();
    const [error,setError] = useState(null)
    const [espera, setEspera] = useState(false)

    const refUsuario = useRef(null)
    const refClave = useRef(null)
    

    const [open,setOpen] = useState(false)
    
    const handleLogin= async () =>{
        setEspera(true)
        const data = {
            "usuario": refUsuario.current.value,
            "clave": refClave.current.input.value
        }
        //console.log(data)
        const respuesta = await enviarData(url_login, data)
        setError(respuesta.error)
        showToastMessage(respuesta.error)
        setEspera(false)
        if (respuesta.conectado) {
            navigate('/home', {
                state: {
                    username: respuesta.usuario,
                    nomina: respuesta.nomina,
                    identificador: respuesta.identificador,
                    id_consulta: respuesta.id_consulta,
                }
            });
        }
        
        
    }

    const showToastMessage = (error) => {
        toast.error(error)
    }
    
    const handleButtonClick = () => {
        navigate('/register'); // Redirige a la ruta de registro
    };

    return (
        <>
        <div className="h-[100vh] flex  flex-col items-center bg-background bg-cover justify-center text-dark">
            <div className="h-[410px] w-80 bg-white/20 border border-white/20 backdrop-blur-lg rounded-lg px-6 my-4 overflow-hidden">
                <div className={`${open ? 'translate-y-[-330px] transition-all': 'translate-y-[40px] transition-all'}`}>
                    <h2 className="text-3xl font-blod pb-6 text-center"><img src={logo} width="100%"/></h2>
                    <form className="flex flex-col items-center" action="">
                        <div className="w-full relative">
                            <input className="border border-red-600 w-full rounded-full py-2 px-4 my-2 bg-transparent" placeholder="Username" type="text" ref={refUsuario}/>
                            <FaUserCircle className="absolute top-[35%] right-3"/>
                        </div>
                        <div className="w-full relative">
                        <Input.Password
                            placeholder="Password"
                            className = "border border-red-600 w-full rounded-full py-2 px-4 my-2 bg-transparent"
                            ref={refClave}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                            
                        </div>
                                
                        <ToastContainer position="top-center" transition={Flip} limit={3} />
                        <HappyProvider>
                        <Button type="primary" icon={<TbLogin2 />} className="my-7 py-2 w-full rounded-full" onClick={handleLogin} disabled={ espera }>
                            Log In
                        </Button>
                        </HappyProvider>
                        {/* <span>Don&apos;t have an account? <span onClick={handleButtonClick}>Register</span></span> */}
                        
                    </form>
                </div>
            </div>
            <FooterLogin />
        </div>
            
        </>
    )
 }

 export default Login