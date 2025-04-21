import { Input } from 'antd'
import { useEffect } from 'react'

const InputH = ({ incidente, handleInputChange}) => {
    //console.log(incidente)


    const handleChange = (event) => {
        const value = event.target.value;
        //console.log(value)
        handleInputChange(value); // Pasar el valor del input al padre
    };


    return <>
        <div className="mb-4">
            
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Hrs Incidencia:</label>
            <Input placeholder="Hrs Incidencia" variant="filled" className="w-full bg-white  px-3 py-2 rounded-lg h-8" onChange={handleChange}/>

        </div>
    </>
 }

 export default InputH