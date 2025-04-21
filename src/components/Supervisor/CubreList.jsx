import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { FloatButton, Select } from 'antd'


const CubreList = forwardRef((props, ref) => { 
    const [data, setData] = useState([])
    const [nn, setNn] = useState('Select Personal')

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const url_get = "http://10.144.13.5/wl-api/PersonalList.php"
                const url_get = "http://10.144.13.5/wl-api/PersonalList.php"
                const resp = await fetch(url_get, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const json = await resp.json()
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
        }
        fetchData()
    }, [])

    // const onChange = (value) => {
    //     setSelectedValue(value)
    //     if (typeof cubre === 'function') {
    //         cubre(value)
    //     }
    // }
      
    // const onSearch = (value) => {
    //     setSelectedValue(value)
    //     if (typeof cubre === 'function') {
    //         cubre(value);
    //     }
    // }

    useImperativeHandle(ref, () => ({
        limpiar() {
            setNn('Select Personal') 
        }
    }))

    return (
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">NN Cubre:</label>
            <Select
                showSearch
                //placeholder="Select a person"
                value={nn}
                className="w-64 border border-white rounded-lg bg-white"
                optionFilterProp="label"
                onChange={(value) => {
                    setNn(value)
                    props.setNn(value)
                }}
                // onSearch={onSearch}
                options={data.map((jsonres) => ({
                    value: jsonres.Nomina, // Asegúrate de que 'NN' es la propiedad correcta
                    label: `${jsonres.Nomina} ${jsonres.ApellidoP} ${jsonres.ApellidoM} ${jsonres.Nombre}`, // Ajusta según la
                }))}
            />
        </div>
    )
 })

 export default CubreList