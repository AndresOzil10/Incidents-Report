import DisabilityList from "../Common/DisabilityList"
import IncidentsList from "../Supervisor/IncidentsList"
import UnpaidList from "../Common/UnpaidList"
import TurnList from "../Supervisor/TurnList"
import { HappyProvider } from '@ant-design/happy-work-theme';
import { useRef, useState } from "react"
import PersonalList from "../Supervisor/PersonalList"
import Datepicker from "../Common/DatePicker"
import InputD from "../Common/InputD"
import InputH from "../Common/InputH"
import DateTxT from "../Common/DateTxT"
import IncidentExtraTime from "../Supervisor/IncidentExtraTime"
import Observation from "../Common/Observation"
import { Slide } from "react-awesome-reveal"
import { Flip, toast, ToastContainer } from "react-toastify"
import CubreList from "../Supervisor/CubreList"
import Supervisor from "../Supervisor/Supervisor"
import { Button, Checkbox, Card, Space, Divider, Tag, Badge, Alert, Grid, Typography } from "antd";
import { 
    SaveOutlined, 
    UserOutlined, 
    ClockCircleOutlined,
    CalendarOutlined,
    TeamOutlined,
    NotificationOutlined,
    FormOutlined,
    InfoCircleOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const enviarData = async (url, data) => {
    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    const json = await resp.json()
    return json
}

const SupervisorForm = ({username, identificador, id_consulta}) => { 
    const screens = useBreakpoint()
    const isMobile = !screens.md
    
    const url_login = "http://localhost/wl-api/incidentInsert.php"

    const [date, setDate] = useState(null)
    const [incident, setIncident] = useState(null)
    const [number, setNumber] = useState(null)
    const [nn, setNn] = useState(null)
    const [turn, setTurn] = useState('-')
    const [hd, setHd] = useState('-')
    const [txt, setTxt] = useState('N/A')
    const [extra, setExtra] = useState('N/A')
    const [inputValue, setInputValue] = useState('-')
    const [unpaidList, setUnpaidList] = useState('-')
    const [disabilityList, setDisabilityList] = useState('-')
    const [superv, setSupervisor] = useState('-')
    const [observation, setObservation] = useState('-')
    const [notification, setNotification] = useState(false)
    const [loading, setLoading] = useState(false)

    const mostrar = (e) => {
        setNotification(e.target.checked)
    }

    const handleInputChange = (value) => {
        setInputValue(value)
    }

    const rango = (value) => {
        setDate(value)
    }

    const personal = (value)=> {
        setNumber(value)
    }

    const cubre = (value)=> {
        setNn(value)
    }

    const turno = (value) => {
        setTurn(value)
    }

    const incidente = (value) => {
        setIncident(value)
    }

    const handleDaysCalculated = (value) => {
        setHd(value)
    }

    const time = (value) => {
        setTxt(value)
    }

    const timeExtra = (value) => {
        setExtra(value)
    }

    const unpaid = (value) => {
        setUnpaidList(value)
    }

    const disability = (value) => {
        setDisabilityList(value)
    }

    const supervisor = (value) => {
        setSupervisor(value)
    }

    const observaciones = (value) => {
        setObservation(value)
    }

    const send = async () => {
        if (!date || !number || !turn || !incident) {
            Error('Complete los campos obligatorios')
            return
        }
        
        const startDate = date[0].format('YYYY/MM/DD')
        const endDate = date[1].format('YYYY/MM/DD')
        
        if(incident == 'Tiempo Extra' && inputValue > 8.5) {
            Error('El tiempo extra no puede ser mayor a 8.5 horas')
            return
        }
        
        if(incident == 'Tiempo Extra' && !observation) {
            Error('Campo de Observaciones Requerido')
            return
        }

        setLoading(true)
        const data = {
            "nn": number,
            "turno": turn,
            "fecha_ini": startDate,
            "fecha_fin": endDate,
            "incident": incident,
            "d": hd,
            "h": inputValue,
            "txt": txt,
            "extra": extra,
            "unpaid": unpaidList,
            "disability": disabilityList,
            "cubre": nn,
            "supervisor": superv,
            "observaciones": observation,
            "username": username,
            "notificacion": notification
        }
        
        try {
            const respuesta = await enviarData(url_login, data)
            if(respuesta.error){
                Error(respuesta.error)
            } else {
                Success(respuesta.success)
                limpiarCampos()
            }
        } catch (error) {
            Error('Error de conexión con el servidor')
        } finally {
            setLoading(false)
        }
    }

    const Error = (error) => {
        toast.error(error, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
            style: {
                background: '#1e293b',
                color: 'white',
                borderLeft: '4px solid #ef4444',
                borderRadius: '8px'
            }
        })
    }

    const Success = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
            style: {
                background: '#1e293b',
                color: 'white',
                borderLeft: '4px solid #10b981',
                borderRadius: '8px'
            }
        })
    }

    const limpiarCampos = () => {
        setDate(null)
        setIncident(null)
        setNumber(null)
        setNn(null)
        setTurn('-')
        setHd('-')
        setTxt('N/A')
        setExtra('N/A')
        setInputValue('-')
        setUnpaidList('-')
        setDisabilityList('-')
        setSupervisor('-')
        setObservation('-')
        incidentLSRef.current?.limpiar()
        TurnListRef.current?.limpiar()
        NNRef.current?.limpiar()
        NNCubreRef.current?.limpiar()
        InputSupervisorRef.current?.limpiar()
        InputObservationsRef.current?.limpiar()
        DatepickerRef.current?.limpiar()
        setNotification(false)
    }

    const NNRef = useRef(null)
    const incidentLSRef = useRef(null)
    const TurnListRef = useRef(null)
    const NNCubreRef = useRef(null)
    const InputSupervisorRef = useRef(null)
    const InputObservationsRef = useRef(null)
    const DatepickerRef = useRef(null)

    return (
        <div className="min-h-full">
            <ToastContainer />
            
            <Slide direction="down">
                <div className="space-y-4">
                    {/* Formulario en grid compacto */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Columna 1: Datos básicos */}
                        <Card 
                            className="border-0 shadow-lg rounded-xl"
                            size="small"
                            title={
                                <div className="flex items-center gap-2">
                                    <UserOutlined className="text-blue-500 text-sm" />
                                    <span className="text-sm font-semibold text-gray-800">Datos del Personal</span>
                                </div>
                            }
                        >
                            <Space direction="vertical" size="small" className="w-full">
                                <div className="space-y-3">
                                    <div>
                                        <Text strong className="text-xs text-gray-600 mb-1 block">
                                            <UserOutlined className="mr-1" />
                                            Personal
                                        </Text>
                                        <PersonalList ref={NNRef} personal={personal} setNumber={setNumber} compact={true} />
                                    </div>
                                    
                                    <div>
                                        <Text strong className="text-xs text-gray-600 mb-1 block">
                                            <ClockCircleOutlined className="mr-1" />
                                            Turno
                                        </Text>
                                        <TurnList ref={TurnListRef} turno={turno} setTurn={setTurn} compact={true} />
                                    </div>
                                    
                                    <div>
                                        <Text strong className="text-xs text-gray-600 mb-1 block">
                                            <UserOutlined className="mr-1" />
                                            Cubre
                                        </Text>
                                        <CubreList ref={NNCubreRef} cubre={cubre} setNn={setNn} compact={true} />
                                    </div>
                                </div>
                                
                                <Divider className="!my-2" />
                                
                                <div>
                                    <Text strong className="text-xs text-gray-600 mb-1 block">
                                        <CalendarOutlined className="mr-1" />
                                        Período
                                    </Text>
                                    <Datepicker ref={DatepickerRef} rango={rango} compact={true} />
                                </div>
                            </Space>
                        </Card>

                        {/* Columna 2: Tipo y detalles de incidencia */}
                        <Card 
                            className="border-0 shadow-lg rounded-xl"
                            size="small"
                            title={
                                <div className="flex items-center gap-2">
                                    <InfoCircleOutlined className="text-purple-500 text-sm" />
                                    <span className="text-sm font-semibold text-gray-800">Tipo de Incidencia</span>
                                </div>
                            }
                        >
                            <Space direction="vertical" size="small" className="w-full">
                                <div className="space-y-3">
                                    <div>
                                        <Text strong className="text-xs text-gray-600 mb-1 block">
                                            Incidencia
                                        </Text>
                                        <IncidentsList ref={incidentLSRef} incidente={incidente} setIncident={setIncident} compact={true} />
                                    </div>
                                    
                                    <div className="transition-all duration-200">
                                        {/* Campos condicionales */}
                                        {incident && (incident == 'Tiempo Extra' || incident == 'Tiempo x Tiempo' || incident == 'Horas Capacitacion' || incident == 'Retardo') ? (
                                            <div className="space-y-3 animate-fadeIn">
                                                <InputH h incidente={incident} handleInputChange={handleInputChange} compact={true} />
                                            </div>
                                        ) : incident ? (
                                            <div className="animate-fadeIn">
                                                <InputD 
                                                    rango={date} 
                                                    handleDaysCalculated={handleDaysCalculated} 
                                                    incidente={incident} 
                                                    compact={true}
                                                />
                                            </div>
                                        ) : (
                                            <Alert
                                                message="Seleccione un tipo de incidencia"
                                                type="info"
                                                showIcon
                                                className="text-xs"
                                            />
                                        )}

                                        {incident == 'Tiempo x Tiempo' && (
                                            <div className="mt-2">
                                                <DateTxT time={time} compact={true} />
                                            </div>
                                        )}

                                        {incident == 'Tiempo Extra' && (
                                            <div className="mt-2">
                                                <IncidentExtraTime timeExtra={timeExtra} compact={true} />
                                            </div>
                                        )}

                                        {incident == 'Permiso s/goce' && (
                                            <div className="mt-2">
                                                <UnpaidList unpaid={unpaid} compact={true} />
                                            </div>
                                        )}

                                        {incident == 'Incapacidad' && (
                                            <div className="mt-2">
                                                <DisabilityList disability={disability} compact={true} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Space>
                        </Card>

                        {/* Columna 3: Información adicional y acciones */}
                        <div className="space-y-4">
                            <Card 
                                className="border-0 shadow-lg rounded-xl"
                                size="small"
                                title={
                                    <div className="flex items-center gap-2">
                                        <FormOutlined className="text-green-500 text-sm" />
                                        <span className="text-sm font-semibold text-gray-800">Información Adicional</span>
                                    </div>
                                }
                            >
                                <Space direction="vertical" size="small" className="w-full">
                                    <div className="space-y-3">
                                        <div>
                                            <Text strong className="text-xs text-gray-600 mb-1 block">
                                                Supervisor
                                            </Text>
                                            <Supervisor ref={InputSupervisorRef} supervisor={supervisor} setSupervisor={setSupervisor} compact={true} />
                                        </div>
                                        
                                        <div>
                                            <Text strong className="text-xs text-gray-600 mb-1 block">
                                                Observaciones
                                            </Text>
                                            <Observation 
                                                ref={InputObservationsRef} 
                                                observaciones={observaciones} 
                                                setObservation={setObservation} 
                                                compact={true}
                                            />
                                        </div>
                                    </div>
                                    
                                    <Divider className="!my-2" />
                                    
                                    <div>
                                        <Checkbox 
                                            onChange={mostrar} 
                                            checked={notification}
                                            className="text-gray-700 text-sm"
                                        >
                                            <div className="flex items-center gap-1">
                                                <NotificationOutlined className="text-orange-500 text-sm" />
                                                <span className="text-xs font-medium">Notificar a Vigilancia</span>
                                            </div>
                                        </Checkbox>
                                        <Text type="secondary" className="block mt-1 ml-6 text-xs">
                                            Se enviará notificación automática
                                        </Text>
                                    </div>
                                </Space>
                            </Card>

                            {/* Panel de acciones compacto */}
                            <Card 
                                className="border-0 shadow-lg rounded-xl"
                                size="small"
                                title={
                                    <div className="flex items-center gap-2">
                                        <SaveOutlined className="text-amber-500 text-sm" />
                                        <span className="text-sm font-semibold text-gray-800">Acciones</span>
                                    </div>
                                }
                            >
                                <Space direction="vertical" size="small" className="w-full">
                                    <div className="flex flex-col gap-2">
                                        <HappyProvider>
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                onClick={send}
                                                loading={loading}
                                                size={isMobile ? "middle" : "large"}
                                                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 border-0 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                                            >
                                                Guardar Incidencia
                                            </Button>
                                        </HappyProvider>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                type="default"
                                                onClick={limpiarCampos}
                                                size={isMobile ? "middle" : "large"}
                                                className="w-full rounded-lg border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800"
                                            >
                                                Limpiar Todo
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <Divider className="!my-2" />
                                    
                                    <Alert
                                        message="Campos obligatorios"
                                        description="Personal, Turno, Período e Incidencia son campos requeridos."
                                        type="warning"
                                        showIcon
                                        className="text-xs rounded-lg"
                                        size="small"
                                    />
                                </Space>
                            </Card>

                            {/* Tarjeta de estado */}
                            <Card 
                                className="border-0 shadow-lg rounded-xl"
                                size="small"
                                
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${incident ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <Text className="text-xs text-gray-600">
                                            {incident ? `Incidencia: ${incident}` : 'Sin incidencia'}
                                        </Text>
                                    </div>
                                    <Text className="text-xs text-gray-500">
                                        {number ? `NN: ${number}` : 'No seleccionado'}
                                    </Text>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Slide>

            {/* Estilos optimizados */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .compact-field .ant-form-item {
                    margin-bottom: 6px !important;
                }
                
                .compact-field .ant-form-item-label {
                    padding-bottom: 2px !important;
                }
                
                .compact-field .ant-form-item-label > label {
                    font-size: 12px !important;
                    height: 22px !important;
                }
                
                .compact-field .ant-input,
                .compact-field .ant-picker,
                .compact-field .ant-select-selector {
                    height: 32px !important;
                    font-size: 13px !important;
                }
                
                .ant-card-small > .ant-card-head {
                    min-height: 34px;
                    padding: 6px 12px;
                }
                
                .ant-card-small > .ant-card-head-title {
                    font-size: 13px;
                    padding: 0;
                }
                
                .ant-card-small > .ant-card-body {
                    padding: 12px;
                }
                
                .ant-space-vertical > .ant-space-item {
                    margin-bottom: 6px !important;
                }
                
                .ant-space-vertical > .ant-space-item:last-child {
                    margin-bottom: 0 !important;
                }
                
                /* Efecto de elevación suave */
                .ant-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .ant-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.08) !important;
                }
                
                /* Scroll minimalista */
                ::-webkit-scrollbar {
                    width: 3px;
                    height: 3px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.02);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(8, 145, 178, 0.2);
                    border-radius: 1.5px;
                }
                
                /* Optimización para móviles */
                @media (max-width: 768px) {
                    .ant-card {
                        margin-bottom: 6px !important;
                    }
                    
                    .ant-space-vertical {
                        gap: 4px !important;
                    }
                    
                    .ant-btn {
                        font-size: 12px !important;
                        height: 34px !important;
                    }
                    
                    .ant-tag, .ant-badge {
                        font-size: 10px !important;
                        padding: 0 4px !important;
                    }
                    
                    .grid {
                        gap: 6px !important;
                    }
                }
                
                @media (max-width: 1024px) {
                    .lg\\:grid-cols-3 {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default SupervisorForm