import { Input } from "antd";
import { useEffect, useState } from "react";

const NNStaff = ({nomina}) => {
    console.log(nomina)
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = {
                  "nomina": nomina,
                }
                const url_get = "http://10.144.13.5/wl-api/StaffNumber.php"
                // const url_get = "http://10.144.13.5/wl-api/StaffNumber.php"
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

      const info = data.length > 0 ? nomina+ ' ' + data[0].ApellidoP+' '+data[0].ApellidoM+' '+data[0].Nombre : '';

    return<>
    <div className="mb-4">
        <label htmlFor="" className="block text-white text-sm font-semibold mb-2">NN:</label>
        <Input variant="filled" className="w-full px-3 py-2 rounded-lg h-8 bg-white" value={info} readOnly/>

    </div>
    </>
 }

 export  default NNStaff
