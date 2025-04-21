import { Input } from "antd"

const InputNN = ({numero}) => { 
    const handleChange = (event) => {
        const value = event.target.value;
        //console.log(value)
        numero(value); // Pasar el valor del input al padre
    };
    return<>
    <div className="mb-1 mt-2">
        <label htmlFor="" className="block text-black text-sm font-semibold">NN:</label>
        <Input placeholder="Numero de Nomina" variant="filled" className="w-full px-3 py-2 rounded-lg h-8 bg-white border-black" onChange={handleChange}/>

    </div>
    </>
 }

 export default InputNN