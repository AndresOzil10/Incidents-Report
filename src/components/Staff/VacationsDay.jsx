import { Input } from "antd"
import { useEffect, useState } from "react";

const VacationsDay = ({nomina}) => {
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = {
                  "nomina": nomina,
                }
                const url_get = "http://10.144.13.5/wl-api/StaffVacations.php"
                // const url_get = "http://10.144.13.5/wl-api/StaffVacations.php"
                const resp = await fetch(url_get, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const json = await resp.json()
                //console.log(json)
                if (Array.isArray(json)) {
                    setData(json)
                } else if (json.data && Array.isArray(json.data)) {
                    setData(json.data)
                } else {
                    console.error('La respuesta no es un arreglo válido:', json)
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error)
            }
        };
        fetchData()
      }, [nomina])

      const dias = data.length > 0 ? data[0].dias : '';

    return<>
    <div className="mb-4">
        <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Dias Actuales:</label>
        <Input variant="filled" className="w-full px-3 py-2 rounded-lg h-8 bg-white" value={dias} readOnly/>

    </div>
    </>
 }

 export default VacationsDay