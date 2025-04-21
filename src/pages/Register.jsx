import { MdPassword } from "react-icons/md";
import { FaHashtag, FaUserCircle  } from "react-icons/fa";
import { useRef, useState } from "react";
import logo from "../assets/images/kayser_logo.png"
import { useNavigate } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import FooterLogin from "../components/Common/Footer";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

//const url_login = "http://10.144.13.5/wl-api/login.php"
const url_register = "http://10.144.13.5/wl-api/register.php"

/*const enviarData = async (url, data) => {
    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    //console.log(resp)
    const json = await resp.json()
    //console.log(json)

    return  json
}*/

const crearUsuario = async (url, data) => {
    
    
    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    const json = await resp.json()
    //console.log(json)

    return  json
}

const Register = (props) => { 
    const navigate = useNavigate();
    const handleClick=()=>{
        navigate('/vite/');
    }
    const [error,setError] = useState(null)
    const [espera, setEspera] = useState(false)

    //const refUsuario = useRef(null)
    //const refClave = useRef(null)

    const refUser = useRef(null)
    const refNomina = useRef(null)
    const refPass = useRef(null)


    const [open,setOpen] = useState(true)

    /*const handleLogin= async () =>{
        setEspera(true)
        const data = {
            "usuario": refUsuario.current.value,
            "clave": refClave.current.value
        }
        console.log(data) 
        const respuesta = await enviarData(url_login, data)
        console.log(respuesta)
        props.acceder(respuesta.conectado)
        setError(respuesta.error)
        setEspera(false)
    }*/


    const handleRegister = async () => {
        setEspera(true)
        const data = {
            "usuario": refUser.current.value,
            "nomina": refNomina.current.value,
            "clave": refPass.current.input.value
        }
        //console.log(data) 
        const respuesta = await enviarData(url_register, data)
        console.log(respuesta)
        props.acceder(respuesta.conectado)
        setError(respuesta.error)
        setEspera(false)

    }
    
    return (
        <div className="h-[100vh] flex  flex-col items-center bg-background bg-cover justify-center text-dark">
            <div className="h-[460px] w-80 bg-white/35 border border-white/20 backdrop-blur-lg rounded-lg px-6 my-4 overflow-hidden">
                <div className={`${open ? 'translate-y-[25px] transition-all': 'translate-y-[450px] transition-all'}`}>
                    <h2 className="text-3xl font-blod pb-6 text-center"><img src={logo} width="100%"/></h2>
                    <form className="flex flex-col items-center" action="">
                        <div className="w-full relative">
                            <input className="border border-red-600 w-full rounded-full py-2 px-4 my-2 bg-transparent" placeholder="Username" type="text" ref={refUser} />
                            <FaUserCircle className="absolute top-[35%] right-3"/>
                        </div>
                        <div className="w-full relative">
                            <input className="border border-red-600 w-full rounded-full py-2 px-4 my-2 bg-transparent" placeholder="Numero de Nomina" type="text" ref={refNomina}/>
                            <FaHashtag className="absolute top-[35%] right-3"/>
                        </div>
                        <div className="w-full relative">
                        <Input.Password
                            placeholder="Password"
                            className = "border border-red-600 w-full rounded-full py-2 px-4 my-2 bg-transparent"
                            ref={refPass}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                        </div>
                        <button className="my-2 py-2 w-full rounded-full bg-blue-600" onClick={handleRegister}>Register</button>
                        <span>Already have an account? <span onClick={handleClick}>Login</span></span>
                    </form>
                </div>
            </div>
            <FooterLogin />
        </div>
    )
 }

 export default Register