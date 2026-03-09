import { Outlet, useLocation } from "react-router-dom"
import NavSideBar from "./NavSideBar"
import FooterLogin from "./Footer"
import logo from '../../assets/images/kayser_logo2.png';
import { useEffect, useState } from 'react';

const LayoutIni = () => { 
    const location = useLocation()
    const { username, nomina, identificador, id_consulta, isAuthenticated } = location.state || {}
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

    // Obtener el estado del sidebar del NavSideBar
    const handleSidebarToggle = (expanded) => {
        setIsSidebarExpanded(expanded)
    }

    useEffect(() => {
        // Efecto para el fondo dinámico
        const createFloatingElements = () => {
            const container = document.querySelector('.floating-elements-container')
            if (container) {
                for (let i = 0; i < 8; i++) {
                    const element = document.createElement('div')
                    element.className = 'floating-element'
                    element.style.left = `${Math.random() * 100}%`
                    element.style.top = `${Math.random() * 100}%`
                    element.style.animationDelay = `${Math.random() * 5}s`
                    element.style.animationDuration = `${15 + Math.random() * 10}s`
                    container.appendChild(element)
                }
            }
        }

        createFloatingElements()

        // Estilos dinámicos para el fondo
        const style = document.createElement('style')
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            .floating-element {
                position: absolute;
                width: 60px;
                height: 60px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                animation: float infinite ease-in-out;
            }
            
            .glass-effect {
                backdrop-filter: blur(10px);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
            const container = document.querySelector('.floating-elements-container')
            if (container) {
                container.innerHTML = ''
            }
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden relative">
            {/* Elementos flotantes decorativos */}
            <div className="floating-elements-container absolute inset-0 overflow-hidden pointer-events-none"></div>
            
            {/* Efectos de gradiente en esquinas */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            {/* Layout principal */}
            <div className="relative z-10 flex flex-col h-screen">
                {/* Header Superior - Título Centrado */}
                <header className="flex-none glass-effect border-b border-gray-200/50">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-center"> {/* Centrado horizontal */}
                            {/* Logo a la izquierda */}
                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                                <div className="relative group">
                                    <img 
                                        src={logo} 
                                        alt="Kayser Logo" 
                                        className="w-16 h-16 object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                </div>
                            </div>
                            
                            {/* Título centrado */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Control de Incidencias
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Sistema de Gestión de Personal
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido Principal */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className={`transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
                        <NavSideBar 
                            username={username} 
                            identificador={identificador} 
                            id_consulta={id_consulta} 
                            nomina={nomina}
                            onToggle={handleSidebarToggle}
                        />
                    </div>
                    
                    {/* Área de contenido */}
                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-7xl mx-auto">
                            {/* Tarjeta de contenido principal */}
                            <div className="glass-effect rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                                
                                {/* Contenido dinámico */}
                                <div className="p-6">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Footer mejorado */}
                <footer className="flex-none glass-effect border-t border-gray-200/50">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={logo} 
                                    alt="Kayser Logo" 
                                    className="w-8 h-8 opacity-70"
                                />
                                <p className="text-sm text-gray-600">
                                    © {new Date().getFullYear()} Kayser System. Todos los derechos reservados.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <span className="text-sm text-gray-500">
                                    Versión 2.0.0
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-sm text-gray-500">
                                        Sistema en línea
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Estilos adicionales */}
            <style>{`
                /* Animación para el fondo */
                @keyframes subtleBackground {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                /* Efecto de brillo en elementos */
                .glow-effect {
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
                }
                
                /* Transición suave para todos los elementos */
                * {
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }
                
                /* Personalización del scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #667eea, #764ba2);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #5a67d8, #6b46c1);
                }
                
                /* Efecto de elevación al hover */
                .hover-lift {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    )
}

export default LayoutIni