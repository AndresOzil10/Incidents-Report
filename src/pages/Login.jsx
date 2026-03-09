import { FaUserCircle, FaLock, FaEye, FaEyeSlash, FaRocket } from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import { GiCheckMark } from "react-icons/gi";
import { useRef, useState, useEffect } from "react";
import logo from "../assets/images/kayser_logo.png";
import FooterLogin from "../components/Common/Footer";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

//const url_login = "http://localhost/wl-api/login.php";
const url_login = "http://localhost/wl-api/login.php"

const enviarData = async (url, data) => {
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return await resp.json();
};

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [espera, setEspera] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedUser, setIsFocusedUser] = useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [particles, setParticles] = useState([]);

  const refUsuario = useRef(null);
  const refClave = useRef(null);

  // Crear partículas flotantes
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const handleLogin = async () => {
    if (!refUsuario.current.value || !refClave.current.value) {
      showToastMessage("Por favor complete todos los campos");
      return;
    }

    setEspera(true);
    const data = {
      "usuario": refUsuario.current.value,
      "clave": refClave.current.value
    };

    try {
      const respuesta = await enviarData(url_login, data);
      setError(respuesta.error);

      if (respuesta.error) {
        showToastMessage(respuesta.error);
      }

      if (respuesta.conectado) {
        // Animación de éxito antes de navegar
        showSuccessAnimation();
        setTimeout(() => {
          navigate('/home', {
            state: {
              username: respuesta.usuario,
              nomina: respuesta.nomina,
              identificador: respuesta.identificador,
              id_consulta: respuesta.id_consulta,
            }
          });
        }, 1500);
      }
    } catch (err) {
      showToastMessage("Error de conexión con el servidor");
    } finally {
      setEspera(false);
    }
  };

  const showToastMessage = (error) => {
    toast.error(error, {
      position: "top-center",
      theme: "colored",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showSuccessAnimation = () => {
    toast.success("¡Login exitoso! Redirigiendo...", {
      position: "top-center",
      theme: "colored",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-500 via-slate-400 to-slate-500 overflow-hidden relative">

      {/* Efectos de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/"></div>

      {/* Logo animado */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="relative">
          <img 
            src={logo} 
            alt="Kayser Logo" 
            className="w-64 h-auto filter drop-shadow-2xl"
          />
          <motion.div
            className="absolute -inset-4 rounded-full blur-2xl opacity-30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Card de Login */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-8"
      >
        <div className="relative">
          {/* Efecto de borde luminoso */}
          <div className="absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="relative h-2 bg-gradient-to-r from-red-600 via-black to-white"></div>
            
            <div className="p-8">
              {/* Título */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-3 mb-4"
                >
                  <RiShieldUserFill className="text-3xl text-blue-800" />
                  <h1 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
                    Portal de Incidencias
                  </h1>
                </motion.div>
                <p className="text-gray-400 text-sm">Ingresa tus credenciales para continuar</p>
              </div>

              {/* Formulario */}
              <div className="space-y-6">
                {/* Campo Usuario */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUserCircle className="inline mr-2 text-blue-800" />
                    Usuario
                  </label>
                  <div className="relative">
                    <input
                      className={`w-full px-4 py-3 pl-12 bg-white border rounded-xl text-black placeholder-gray-900 focus:outline-none transition-all duration-300 ${
                        isFocusedUser 
                          ? 'border-blue-500 ring-2 ring-blue-500/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      placeholder="Ingresa tu usuario"
                      type="text"
                      ref={refUsuario}
                      onFocus={() => setIsFocusedUser(true)}
                      onBlur={() => setIsFocusedUser(false)}
                      onKeyPress={handleKeyPress}
                    />
                    <FaUserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  </div>
                </motion.div>

                {/* Campo Contraseña */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2 text-blue-800" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      className={`w-full px-4 py-3 pl-12 pr-12 bg-white border rounded-xl text-black placeholder-gray-900 focus:outline-none transition-all duration-300 ${
                        isFocusedPass 
                          ? 'border-blue-500 ring-2 ring-blue-500/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      placeholder="Ingresa tu contraseña"
                      type={showPassword ? "text" : "password"}
                      ref={refClave}
                      onFocus={() => setIsFocusedPass(true)}
                      onBlur={() => setIsFocusedPass(false)}
                      onKeyPress={handleKeyPress}
                    />
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </motion.div>

                {/* Botón de Login */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={handleLogin}
                    disabled={espera}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                      espera
                        ? 'bg-red-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25'
                    }`}
                  >
                    {espera ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FaRocket className="text-lg" />
                        Iniciar Sesión
                        <GiCheckMark className="text-lg" />
                      </>
                    )}
                  </button>
                </motion.div>
              </div>

              {/* Footer del card */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-gray-800 text-center"
              >
                <p className="text-gray-500 text-sm">
                  ¿Problemas para acceder?{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Contacta al soporte
                  </a>
                </p>
              </motion.div> */}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip}
      />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <FooterLogin />
      </motion.div>

      {/* Efectos adicionales */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Login;