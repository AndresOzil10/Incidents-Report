import { Input } from "antd"
import { forwardRef, useImperativeHandle, useState } from "react"

const Observation = forwardRef((props, ref) => { 
    const [observation, setObservation] = useState('')
    // const handleChange = (event) => {
    //     const value = event.target.value;
    //     //console.log(value)
    //     observaciones(value); // Pasar el valor del input al padre
    // };

    useImperativeHandle(ref, () => ({
        limpiar() {
            setObservation('') 
        }
    }))

    return<>
    <div className="mb-4">
        <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Observaciones:</label>
        <Input value={observation} placeholder="Observations" variant="filled" className="w-full px-3 py-2 rounded-lg h-8 bg-white" onChange={(event) => {
        const value = event.target.value
        //console.log(value)
        setObservation(value)
        props.setObservation(value)
    }}/>

    </div>
    </>
 })

 export default Observation