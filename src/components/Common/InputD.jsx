import { Input } from 'antd'
import { useEffect } from 'react'

const InputD = ({rango, handleDaysCalculated, incidente}) => {
    //console.log(incidente)

    const dias = (rango) => {
        const dateIni = rango[0].toDate(); // Convierte a objeto Date
        const dateFin = rango[1].toDate();

        const diferenciaEnMilisegundos = dateFin - dateIni;

        const diferenciaEnDias = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24) + 1);

        return diferenciaEnDias;
        
    }

    useEffect(() => {
        if (rango && handleDaysCalculated) {
            const result = dias(rango);
            handleDaysCalculated(result);
            //console.log(result)
        }
    }, [rango, handleDaysCalculated]);

    return <>
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Dia(s) Incidencia:</label>
            <Input placeholder="Filled" variant="filled" className="w-full px-3 py-2 rounded-lg h-8 bg-white" value ={ !rango ? "0" : dias(rango)}/>

        </div>
    </>
 }

 export default InputD