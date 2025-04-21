import DisabilityList from "../Common/DisabilityList"
import IncidentsList from "../Supervisor/IncidentsList"
import UnpaidList from "../Common/UnpaidList"
import TurnList from "../Supervisor/TurnList"
import { HappyProvider } from '@ant-design/happy-work-theme';

import {  useRef, useState } from "react"
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
import { Button, Checkbox } from "antd";

const enviarData = async (url, data) => {
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
}


const SupervisorForm = ({username , identificador, id_consulta}) => { 

    //console.log(identificador)

     const url_login = "http://10.144.13.5/wl-api/incidentInsert.php"
    //const url_login = "http://10.144.13.5/wl-api/incidentInsert.php"

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
    
    const mostrar = (e) => {
        setNotification(e.target.checked)
    }

    const handleInputChange = (value) => {
        setInputValue(value);
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
        setHd(value);
        //console.log("Días de incidencia calculados: ", value);
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
        //console.log(txt)
        if (!date || !number || !turn || !incident) {
            Error('Campos vacios!!!!!')
            return
        }
        const startDate = (date[0]).format('YYYY/MM/DD')
        const endDate = (date[1]).format('YYYY/MM/DD')
        // if(txt !== 'N/A'){
        //     console.log(txt)
        //     const txt = txt.format('YYYY/MM/DD')
            
        // }
        if(incident=='Tiempo Extra' && inputValue > 8.5) {
            Error('El tiempo extra no puede ser mayor a 8.5 horas')
            return
        }
        if(incident=='Tiempo Extra' && observation == '') {
            Error('Campo de Observaciones Requerido')
            return
        }
        const data = {
            "nn": number,
            "turno": turn,
            "fecha_ini": startDate,
            "fecha_fin": endDate,
            "incident": incident,
            "d":  hd,
            "h":  inputValue,
            "txt":  txt,
            "extra": extra,
            "unpaid": unpaidList,
            "disability": disabilityList,
            "cubre": nn,
            "supervisor": superv,
            "observaciones": observation,
            "username": username,
            "notificacion": notification
        }
        const respuesta = await enviarData(url_login, data)
        //console.log(respuesta)
        if(respuesta.error){
            Error(respuesta.error)
        }
        Success(respuesta.success)
        limpiarCampos()
    }

    const Error = (error) => {
        toast.error(error)
    }

    const Success = (message) => {
        toast.success(message)
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
        incidentLSRef.current.limpiar()
        TurnListRef.current.limpiar()
        NNRef.current.limpiar()
        NNCubreRef.current.limpiar()
        InputSupervisorRef.current.limpiar()
        InputObservationsRef.current.limpiar()
        DatepickerRef.current.limpiar()
        setNotification(false)
    }

    const NNRef = useRef(null)
    const incidentLSRef = useRef(null)
    const TurnListRef = useRef(null)
    const NNCubreRef = useRef(null)
    const InputSupervisorRef = useRef(null)
    const InputObservationsRef = useRef(null)
    const DatepickerRef = useRef(null)


    return <>
        <Slide direction="down">
            <div className="flex">
                <div className="block ml-10">
                    <ToastContainer position="top-center" transition={Flip} limit={3} />
                    
                    <PersonalList ref={NNRef} personal={personal} setNumber={setNumber}/>

                    <TurnList ref={TurnListRef} turno={turno} setTurn={setTurn}/>

                    <Datepicker ref={DatepickerRef} rango={rango}/>
                    
                    <IncidentsList ref={incidentLSRef} incidente={incidente} setIncident={setIncident}/>

                    {
                        incident == 'Tiempo Extra' || incident == 'Tiempo x Tiempo' || incident == 'Horas Capacitacion' || incident == 'Retardo' ? <InputH h incidente={incident} handleInputChange={handleInputChange}/>
                        :<InputD rango={date} handleDaysCalculated={handleDaysCalculated} incidente={incident} />
                    }
                    
                    { incident == 'Tiempo x Tiempo' ? <DateTxT time={time} /> : null}

                    { incident == 'Tiempo Extra' ? <IncidentExtraTime  timeExtra={timeExtra}/> : null }

                    { incident == 'Permiso s/goce' ? <UnpaidList unpaid={unpaid}/> : null}

                    { incident == 'Incapacidad' ? <DisabilityList disability={disability}/> : null}
                </div>
                <div className="block ml-[10px] mr-5">
                    
                    <CubreList ref={NNCubreRef} cubre={cubre} setNn={setNn}/>
                    
                    <Supervisor ref={InputSupervisorRef} supervisor={supervisor} setSupervisor={setSupervisor}/>

                    <Observation ref={InputObservationsRef} observaciones={observaciones} setObservation={setObservation}/>

                    <div className="mt-10">
                        <Checkbox onChange={mostrar} checked={notification}>Notificar a Vigilancia</Checkbox>
                    </div>

                    <div className=" mt-12 animate-pulse ml-14">
                        <label htmlFor="" className="block text-black text-sm font-semibold mb-2"></label>
                        <HappyProvider>
                            <Button className="transition ease-in-out delay-150 bg-white hover:-translate-y-1 hover:scale-110 hover:bg-red-600 duration-300g w-32 rounded-lg border border-black font-bold text-black h-[35px]" onClick={send}>💾​Save</Button>
                        </HappyProvider>
                    </div>
                </div>
            </div> 
        </Slide>   
    </>
 }

 export default SupervisorForm