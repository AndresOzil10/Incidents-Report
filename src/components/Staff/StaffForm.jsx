import { useRef, useState } from "react"
import Datepicker from "../Common/DatePicker"
import InputD from "../Common/InputD"
import InputH from "../Common/InputH"
import DateTxT from "../Common/DateTxT"
import Observation from "../Common/Observation"
import { toast, ToastContainer } from "react-toastify"
import IncidentLS from "./IncidentLS"
import VacationsDay from "./VacationsDay"
import NNStaff from "./NNStaff"
import UnpaidList from "../Common/UnpaidList"
import DisabilityList from "../Common/DisabilityList"
import { 
    Button, 
    Checkbox, 
    DatePicker, 
    Input, 
    Modal, 
    TimePicker, 
    Card, 
    Space, 
    Alert, 
    Tag,
    Typography,
    Grid,
    Row,
    Col
} from "antd"
import { HappyProvider } from "@ant-design/happy-work-theme"
import Swal from "sweetalert2"
import { 
    SaveOutlined, 
    ClockCircleOutlined, 
    CalendarOutlined,
    NotificationOutlined,
    FormOutlined,
    CreditCardOutlined,
    UserOutlined,
    InfoCircleOutlined,
    ClearOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const url_login = 'http://localhost/wl-api/StaffInsert.php'

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

const StaffForm = ({username, identificador, id_consulta, nomina}) => { 
    const screens = useBreakpoint()
    const isMobile = !screens.md
    const isTablet = !screens.lg
    
    const [date, setDate] = useState(null)
    const [incident, setIncident] = useState('-')
    const [hd, setHd] = useState('-')
    const [txt, setTxt] = useState('N/A')
    const [inputValue, setInputValue] = useState('-')
    const [unpaidList, setUnpaidList] = useState('-')
    const [disabilityList, setDisabilityList] = useState('-')
    const [observation, setObservation] = useState('-')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [timeStart, setTimeStart] = useState(null)
    const [timeEnd, setTimeEnd] = useState(null)
    const [notification, setNotification] = useState(false)
    const [datePickerValue, setDatePickerValue] = useState(null)

    const refOld = useRef(null)
    const incidentLSRef = useRef(null)
    const InputObservationsRef = useRef(null)

    const handleTimeStart = (time) => {
        setTimeStart(time.format('HH:mm:ss'))
    }

    const handleTimeEnd = (time) => {
        setTimeEnd(time.format('HH:mm:ss'))
    }

    const handleDateChange = (dates) => {
        setDatePickerValue(dates)
    }

    const mostrar = (e) => {
        setNotification(e.target.checked)
    }
    
    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        const fecha = datePickerValue ? datePickerValue.format('YYYY/MM/DD') : null
        const inputValue = refOld.current.input.value
        
        if(!inputValue || !timeStart || !timeEnd) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos requeridos',
                background: '#1e293b',
                color: 'white',
                confirmButtonColor: '#3b82f6',
                iconColor: '#ef4444',
                customClass: { popup: 'rounded-2xl' }
            })
            return
        }

        setLoading(true)
        const data = {
            "nn": inputValue,
            "username": username,
            "in": timeStart,
            "out": timeEnd,
            "fecha": fecha,
        }
        
        try {
            const respuesta = await enviarData('http://localhost/wl-api/olvido.php', data)
            
            if(respuesta.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: respuesta.error,
                    background: '#1e293b',
                    color: 'white',
                    confirmButtonColor: '#3b82f6',
                    iconColor: '#ef4444',
                    customClass: { popup: 'rounded-2xl' }
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: respuesta.success,
                    background: '#1e293b',
                    color: 'white',
                    confirmButtonColor: '#10b981',
                    iconColor: '#10b981',
                    customClass: { popup: 'rounded-2xl' }
                })
                setIsModalOpen(false)
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor',
                background: '#1e293b',
                color: 'white',
                confirmButtonColor: '#3b82f6',
                iconColor: '#ef4444',
                customClass: { popup: 'rounded-2xl' }
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    
    const handleInputChange = (value) => {
        setInputValue(value)
    }

    const rango = (value) => {
        setDate(value)
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

    const unpaid = (value) => {
        setUnpaidList(value)
    }

    const disability = (value) => {
        setDisabilityList(value)
    }

    const observaciones = (value) => {
        setObservation(value)
    }

    const send = async () => {
        if (!date || !incident) {
            Error('Por favor complete los campos de fecha e incidencia')
            return
        }

        setLoading(true)
        const startDate = date[0].format('YYYY/MM/DD')
        const endDate = date[1].format('YYYY/MM/DD')
        
        const data = {
            "nn": nomina,
            "fecha_ini": startDate,
            "fecha_fin": endDate,
            "incident": incident,
            "d": hd,
            "h": inputValue,
            "txt": txt,
            "unpaid": unpaidList,
            "disability": disabilityList,
            "observaciones": observation,
            "username": username,
            "notificacion": notification
        }
        
        try {
            const respuesta = await enviarData(url_login, data)
            
            if(respuesta.error) {
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
            draggable: true,
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
            draggable: true,
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
        setIncident('-')
        setHd('-')
        setTxt('N/A')
        setInputValue('-')
        setUnpaidList('-')
        setDisabilityList('-')
        setObservation('-')
        incidentLSRef.current?.limpiar()
        InputObservationsRef.current?.limpiar()
        setNotification(false)
    }

    const isSpecialUser = username == 'mx-rivera' || username == 'mx-velazquez' || username == 'mx-jortiz' || 
                         username == 'mx-cmendez' || username == 'mx-jaen' || username == 'mx-msanchez'

    return (
        <div className="min-h-full flex flex-col" style={{ 
            minHeight: '100%', 
            maxHeight: '100%', 
            overflow: 'hidden',
            position: 'relative'
        }}>
            <ToastContainer />
            
            {/* Layout principal sin scroll y sin Slide */}
            <div className="flex flex-col h-full overflow-hidden">
                {/* Header fijo */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <FormOutlined className="text-white text-sm" />
                            </div>
                            <div>
                                <Title level={4} className="!mb-0 !text-gray-800">
                                    Registro de Incidencias
                                </Title>
                                <Text type="secondary" className="text-xs">
                                    Nómina: {nomina} • ID: {identificador}
                                </Text>
                            </div>
                        </div>
                        
                        <div className="hidden md:block">
                            <Tag color="blue" className="font-medium">
                                {nomina}
                            </Tag>
                        </div>
                    </div>
                </div>

                {/* Contenido principal - SIN SCROLL */}
                <div className="flex-1 p-3 md:p-4 overflow-hidden">
                    <Row gutter={[12, 12]} className="h-full overflow-hidden">
                        {/* Columna 1: Datos básicos */}
                        <Col xs={24} lg={8} className="h-full overflow-hidden">
                            <Card 
                                className="h-full border-0 shadow-sm rounded-lg flex flex-col overflow-hidden"
                                size="small"
                                title={
                                    <div className="flex items-center gap-2">
                                        <CalendarOutlined className="text-blue-500 text-sm" />
                                        <span className="text-sm font-semibold text-gray-800">Datos Principales</span>
                                    </div>
                                }
                            >
                                <div className="flex-1 overflow-hidden">
                                    <Space direction="vertical" size="small" className="w-full h-full overflow-hidden">
                                        <NNStaff nomina={nomina} compact={true} />
                                        
                                        <div>
                                            <Text strong className="text-xs text-gray-600 block mb-1">
                                                <CalendarOutlined className="mr-1" />
                                                Período
                                            </Text>
                                            <Datepicker rango={rango} compact={true} />
                                        </div>
                                        
                                        <div>
                                            <Text strong className="text-xs text-gray-600 block mb-1">
                                                <InfoCircleOutlined className="mr-1" />
                                                Tipo de Incidencia
                                            </Text>
                                            <IncidentLS 
                                                ref={incidentLSRef} 
                                                incidente={incidente} 
                                                setIncident={setIncident} 
                                                compact={true}
                                            />
                                        </div>
                                    </Space>
                                </div>
                            </Card>
                        </Col>

                        {/* Columna 2: Detalles específicos */}
                        <Col xs={24} lg={8} className="h-full overflow-hidden">
                            <Card 
                                className="h-full border-0 shadow-sm rounded-lg flex flex-col overflow-hidden"
                                size="small"
                                title={
                                    <div className="flex items-center gap-2">
                                        <InfoCircleOutlined className="text-purple-500 text-sm" />
                                        <span className="text-sm font-semibold text-gray-800">Detalles Específicos</span>
                                    </div>
                                }
                            >
                                <div className="flex-1 overflow-hidden">
                                    <Space direction="vertical" size="small" className="w-full h-full overflow-hidden">
                                        {/* Campos condicionales */}
                                        <div className="min-h-[120px]">
                                            {incident == 'Tiempo x Tiempo' ? (
                                                <div className="space-y-3">
                                                    <InputH h incidente={incident} handleInputChange={handleInputChange} compact={true} />
                                                    <DateTxT time={time} compact={true} />
                                                </div>
                                            ) : incident && incident !== '-' ? (
                                                <div>
                                                    <InputD 
                                                        rango={date} 
                                                        handleDaysCalculated={handleDaysCalculated} 
                                                        incidente={incident} 
                                                        compact={true}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center min-h-[120px]">
                                                    <Alert
                                                        message="Seleccione un tipo de incidencia"
                                                        type="info"
                                                        showIcon
                                                        className="text-xs w-full"
                                                        size="small"
                                                    />
                                                </div>
                                            )}

                                            {incident == 'Permiso s/goce' && (
                                                <div className="mt-3">
                                                    <UnpaidList unpaid={unpaid} compact={true} />
                                                </div>
                                            )}

                                            {incident == 'Incapacidad' && (
                                                <div className="mt-3">
                                                    <DisabilityList disability={disability} compact={true} />
                                                </div>
                                            )}
                                        </div>
                                    </Space>
                                </div>
                            </Card>
                        </Col>

                        {/* Columna 3: Observaciones y acciones */}
                        <Col xs={24} lg={8} className="h-full overflow-hidden">
                            <div className="flex flex-col h-full gap-3 overflow-hidden">
                                <Card 
                                    className="flex-1 border-0 shadow-sm rounded-lg flex flex-col overflow-hidden"
                                    size="small"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <FormOutlined className="text-green-500 text-sm" />
                                            <span className="text-sm font-semibold text-gray-800">Información Adicional</span>
                                        </div>
                                    }
                                >
                                    <div className="flex-1 overflow-hidden">
                                        <Space direction="vertical" size="small" className="w-full h-full overflow-hidden">
                                            <Observation 
                                                ref={InputObservationsRef} 
                                                observaciones={observaciones} 
                                                setObservation={setObservation} 
                                                compact={true}
                                            />
                                            
                                            <div className="mt-2">
                                                <VacationsDay nomina={nomina} compact={true} />
                                            </div>
                                            
                                            <div className="mt-3 pt-2 border-t border-gray-100">
                                                <Checkbox 
                                                    onChange={mostrar} 
                                                    checked={notification}
                                                    className="text-gray-700"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <NotificationOutlined className="text-orange-500" />
                                                        <span className="text-sm">Notificar a Vigilancia</span>
                                                    </div>
                                                </Checkbox>
                                            </div>
                                        </Space>
                                    </div>
                                </Card>

                                {/* Panel de acciones fijo en la parte inferior */}
                                <Card 
                                    className="border-0 shadow-sm rounded-lg overflow-hidden"
                                    size="small"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <ClockCircleOutlined className="text-amber-500 text-sm" />
                                            <span className="text-sm font-semibold text-gray-800">Acciones</span>
                                        </div>
                                    }
                                >
                                    <Space direction="vertical" size="small" className="w-full">
                                        <HappyProvider>
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                onClick={send}
                                                loading={loading}
                                                size="large"
                                                className="w-full h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600"
                                            >
                                                Guardar Incidencia
                                            </Button>
                                        </HappyProvider>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                type="default"
                                                icon={<ClearOutlined />}
                                                onClick={limpiarCampos}
                                                size="middle"
                                                className="h-9 rounded-lg border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800"
                                            >
                                                Limpiar
                                            </Button>

                                            {(identificador == 9 || isSpecialUser) && (
                                                <Button
                                                    type="default"
                                                    icon={<CreditCardOutlined />}
                                                    onClick={showModal}
                                                    size="middle"
                                                    className="h-9 rounded-lg border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700"
                                                >
                                                    Tarjeta
                                                </Button>
                                            )}
                                        </div>
                                        
                                        <Alert
                                            message="Todos los campos marcados (*) son obligatorios"
                                            type="info"
                                            showIcon
                                            className="text-xs rounded-lg mt-2"
                                            size="small"
                                        />
                                    </Space>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Modal para Olvido Tarjeta */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <CreditCardOutlined className="text-blue-500" />
                        <span className="font-semibold">Olvido de Tarjeta</span>
                    </div>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText="Registrar"
                cancelText="Cancelar"
                className="rounded-xl"
                width={isMobile ? "90%" : 400}
                destroyOnClose
            >
                <Space direction="vertical" size="middle" className="w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <UserOutlined className="mr-2" />
                            Número de Nómina *
                        </label>
                        <Input
                            placeholder="Ingrese NN"
                            ref={refOld}
                            size="large"
                            className="rounded-lg"
                        />
                    </div>
                    
                    {isSpecialUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarOutlined className="mr-2" />
                                Fecha (fin de semana)
                            </label>
                            <DatePicker 
                                onChange={handleDateChange} 
                                className="w-full rounded-lg"
                                size="large"
                                placeholder="Seleccione fecha"
                            />
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entrada *
                            </label>
                            <TimePicker 
                                onChange={handleTimeStart} 
                                className="w-full rounded-lg"
                                size="large"
                                placeholder="00:00"
                                format="HH:mm"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salida *
                            </label>
                            <TimePicker 
                                onChange={handleTimeEnd} 
                                className="w-full rounded-lg"
                                size="large"
                                placeholder="00:00"
                                format="HH:mm"
                            />
                        </div>
                    </div>
                    
                    <Alert
                        message="Campos obligatorios"
                        description="Los campos marcados con (*) son requeridos para continuar."
                        type="info"
                        showIcon
                        className="rounded-lg text-xs mt-2"
                    />
                </Space>
            </Modal>

            {/* Estilos optimizados para evitar scroll */}
            <style>{`
                /* Forzar no scroll en todos los elementos */
                .overflow-auto, 
                .overflow-scroll, 
                .overflow-y-auto, 
                .overflow-x-auto,
                .ant-card-body,
                .ant-space,
                .ant-space-vertical,
                .ant-col,
                .ant-row {
                    overflow: hidden !important;
                }
                
                /* Asegurar que los componentes hijos tampoco creen scroll */
                .compact-field .ant-form-item,
                .compact-field .ant-input,
                .compact-field .ant-picker,
                .compact-field .ant-select-selector {
                    overflow: hidden !important;
                }
                
                /* Desactivar scrollbars completamente */
                ::-webkit-scrollbar {
                    width: 0px !important;
                    height: 0px !important;
                    display: none !important;
                }
                
                /* Para Firefox */
                * {
                    scrollbar-width: none !important;
                }
            `}</style>
        </div>
    )
}

export default StaffForm