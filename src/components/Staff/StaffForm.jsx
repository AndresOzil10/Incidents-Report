
import {  useRef, useState } from "react"
import Datepicker from "../Common/DatePicker"
import InputD from "../Common/InputD"
import InputH from "../Common/InputH"
import DateTxT from "../Common/DateTxT"
import Observation from "../Common/Observation"
import { Slide } from "react-awesome-reveal"
import { Flip, toast, ToastContainer } from "react-toastify"
import IncidentLS from "./IncidentLS"
import VacationsDay from "./VacationsDay"
import NNStaff from "./NNStaff"
import UnpaidList from "../Common/UnpaidList"
import DisabilityList from "../Common/DisabilityList"
import moment from 'moment';
import { Button, Checkbox, DatePicker, Input, Modal, Select, TimePicker } from "antd"
import { HappyProvider } from "@ant-design/happy-work-theme"
import Swal from "sweetalert2"

const enviarData = async (url, data) => {
    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    const json = await resp.json()

    return  json
}


const StaffForm = ({username , identificador, id_consulta, nomina}) => { 
    //console.log(identificador)

    //const url_login = "http://localhosr/wl-api/StaffInsert.php"
    const url_login = "http://10.144.13.5/wl-api/StaffInsert.php"

    const [date, setDate] = useState(null)
    const [incident, setIncident] = useState('-')
    const [hd, setHd] = useState('-')
    const [txt, setTxt] = useState('N/A')
    const [inputValue, setInputValue] = useState('-')
    const [unpaidList, setUnpaidList] = useState('-')
    const [disabilityList, setDisabilityList] = useState('-')
    const [observation, setObservation] = useState('-')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const refOld = useRef(null)
    const [timeStart, setTimeStart] = useState(null)
    const [timeEnd, setTimeEnd] = useState(null)
    const [notification, setNotification] = useState(false)
    const [datePickerValue, setDatePickerValue] = useState(null)

    const handleTimeStart = (time) => {
        setTimeStart(time.format('HH:mm:ss'))
    }

    const handleTimeEnd = (time) => {
        setTimeEnd(time.format('HH:mm:ss'))
    }

    const handleDateChange = (dates) => {
        setDatePickerValue(dates)
        //console.log(dates)
    }

    const mostrar = (e) => {
        setNotification(e.target.checked)
    }
    
    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleOk = async () => {
        const fecha = datePickerValue ? datePickerValue.format('YYYY/MM/DD') : null
        const inputValue = refOld.current.input.value;
        //console.log(inputValue, timeStart, timeEnd)
        if(inputValue== null || timeStart == null || timeEnd == null){
             Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Verifique que los Campos esten completos',
            });
        } else {
            const data = {
                "nn": inputValue,
                "username": username,
                "in": timeStart,
                "out": timeEnd,
                "fecha": fecha,
            }
            const respuesta = await enviarData('http://10.144.13.5/wl-api/olvido.php', data)
            //console.log(respuesta)
            if(respuesta.error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: respuesta.error,
                  });
            }
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: respuesta.success,
              })
            //setIsModalOpen(false)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false);
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
        setHd(value);
        //console.log("Días de incidencia calculados: ", value);
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
        //console.log(notification)
        if (!date || !incident) {
            Error('Campos vacios!!!!!')
            return
        }
        //console.log(date[0].format('YYYY/MM/DD'))
        const startDate = (date[0]).format('YYYY/MM/DD')
        //console.log(startDate)
        const endDate = (date[1]).format('YYYY/MM/DD')
        // if(txt && txt != 'N/A'){
        //     //console.log(txt)
        //     const txt = (txt).format('YYYY/MM/DD')
        // }
        const data = {
            "nn": nomina,
            "fecha_ini": startDate,
            "fecha_fin": endDate,
            "incident": incident,
            "d":  hd,
            "h":  inputValue,
            "txt":  txt,
            "unpaid": unpaidList,
            "disability": disabilityList,
            "observaciones": observation,
            "username": username,
            "notificacion": notification
        }
        //console.log(data)
        const respuesta = await enviarData(url_login, data)
        //console.log(respuesta)
        if(respuesta.error){
            Error(respuesta.error)
        }
        limpiarCampos()
        Success(respuesta.success)
        
        //limpiarCampos()


        //window.location.reload()
    }

    const Error = (error) => {
        toast.error(error)
    }

    const onChange = (value) => {
        setIncident(value)
        //incidente(value)
    }

    const Success = (message) => {
        toast.success(message, //{
        //     onClose: () => {
        //         limpiarCampos()
        //         //window.location.reload();
        //     }
        )
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
        incidentLSRef.current.limpiar()
        InputObservationsRef.current.limpiar()
        setNotification(false)

    }

    const incidentLSRef = useRef(null)
    const InputObservationsRef = useRef(null)

    return <>
        <Slide direction="down">
            <div className="flex">
                <div className="block ml-10">
                    <ToastContainer position="top-center" transition={Flip} limit={3} />
                        
                    <NNStaff nomina={nomina}/>

                    <Datepicker rango={rango}/>
                        
                    <IncidentLS ref={incidentLSRef} incidente={incidente} setIncident={setIncident}/>

                        {
                            incident == 'Tiempo x Tiempo' ? <InputH h incidente={incident} handleInputChange={handleInputChange}/>
                            :<InputD rango={date} handleDaysCalculated={handleDaysCalculated} incidente={incident} />
                        }
                        
                        { incident == 'Tiempo x Tiempo' ? <DateTxT time={time} /> : null}

                        { incident == 'Permiso s/goce' ? <UnpaidList unpaid={unpaid}/> : null}

                        { incident == 'Incapacidad' ? <DisabilityList disability={disability}/> : null}
                    </div>
                    <div className="block ml-[10px] mr-5">
                    
                        <Observation ref={InputObservationsRef} observaciones={observaciones} setObservation={setObservation}/>

                        <VacationsDay nomina={nomina}/>

                        <div className="mt-10">
                            <Checkbox onChange={mostrar} checked={notification}>Notificar a Vigilancia</Checkbox>
                        </div>
                        
                        <div className=" mt-14 animate-pulse ml-2">
                            <label htmlFor="" className="block text-black text-sm font-semibold mb-2"></label>
                            <HappyProvider>
                                <Button className="transition ease-in-out delay-150 bg-white hover:-translate-y-1 hover:scale-110 hover:bg-red-600 duration-300g w-32 rounded-lg border border-black font-bold text-black h-[30px]" onClick={send}>💾​Save</Button>
                            </HappyProvider>
                            {
                            identificador == 9 ? 
                                <>
                                    <Button type="primary" onClick={showModal} className="ml-2">Tarjeta</Button>
                                        <Modal title="Olvido Tarjeta" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                        <label htmlFor="" className="mr-2 font-bold">NN:</label>
                                        <Input
                                            placeholder="NN"
                                            ref={refOld}
                                            className = "border border-red-600 w-20 rounded-full py-2 px-4 my-2 bg-transparent"
                                        
                                        />
                                        <label htmlFor="" className="mr-1 ml-2 font-bold">Entrada:</label>
                                        <TimePicker onChange={handleTimeStart} className="w-28"/>
                                        <label htmlFor="" className="ml-4 mr-1 font-bold">Salida:</label>
                                        <TimePicker onChange={handleTimeEnd} className="w-28"/>
                                    </Modal>
                                </>
                                : username == 'mx-rivera' || username == 'mx-velazquez' || username == 'mx-jortiz' || username == 'mx-cmendez' || username == 'mx-jaen' ?
                                <>
                                    <Button type="primary" onClick={showModal} className="ml-2">Tarjeta</Button>
                                        <Modal title="Olvido Tarjeta" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                            <div className="ml-48">
                                                <label htmlFor="" className="mr-2 font-bold">NN:</label>
                                                <Input
                                                    placeholder="NN"
                                                    ref={refOld}
                                                    className = "border border-red-600 w-20 rounded-full py-2 px-4 my-2 bg-transparent"
                                                
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="" className="mr-1 ml-2 font-bold">Fecha(SI la incidencia fue fin de semana):</label>
                                                <DatePicker onChange={handleDateChange} />
                                            </div>
                                            <div className="mt-2">
                                                <label htmlFor="" className="mr-1 ml-2 font-bold">Entrada:</label>
                                                <TimePicker onChange={handleTimeStart} className="w-28"/>
                                                <label htmlFor="" className="ml-4 mr-1 font-bold">Salida:</label>
                                                <TimePicker onChange={handleTimeEnd} className="w-28"/>
                                            </div>
                                    </Modal>
                                </>
                                : null
                            }  
                        </div>    
                </div>
            </div> 
        </Slide>   
    </>
 }

 export default StaffForm