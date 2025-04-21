import { Input } from "antd"
import { forwardRef, useImperativeHandle, useState } from "react";

const Supervisor = forwardRef((props, ref) => { 
    const [superv, setSupervisor] = useState('')
    // const handleChange = (event) => {
    //     const value = event.target.value;
    //     //console.log(value)
    //     supervisor(value); // Pasar el valor del input al padre
    // }
    useImperativeHandle(ref, () => ({
        limpiar() {
            setSupervisor('') 
        }
    }))

    return <>
    <div className="mb-4">
        <label htmlFor="" className="block text-white text-sm font-semibold mb-2">NN Supervisor:</label>
        <Input value={superv} placeholder="NN Supervisor" variant="filled" className="w-full px-3 py-2 rounded-lg h-8 bg-white" onChange={(event) => {
        const value = event.target.value
        setSupervisor(value)
        props.setSupervisor(value)
    }}/>
    </div>
    </>
 })

 export default Supervisor