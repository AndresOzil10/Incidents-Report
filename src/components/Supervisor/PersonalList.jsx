import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Select } from 'antd'

const PersonalList = forwardRef((props, ref) => { 
    const [data, setData] = useState([])
    // const [selectedValue, setSelectedValue] = useState('')
    const [number, setNumber] = useState('Select Personal')

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
                //console.log(json); // Para verificar la estructura

                // Ajusta aquí según la estructura de tu API
                if (Array.isArray(json)) {
                    setData(json); // Si json es un arreglo
                } else if (json.data && Array.isArray(json.data)) {
                    setData(json.data); // Si la data está dentro de un objeto
                } else {
                    console.error('La respuesta no es un arreglo válido:', json)
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error)
            }
        };
        fetchData()
    }, [])

    useImperativeHandle(ref, () => ({
        limpiar() {
            setNumber('Select Personal') 
        }
    }))

    // const onChange = (value) => {
    //     setSelectedValue(value)
    //     if (typeof personal === 'function') {
    //         personal(value)
    //     }
    // };
      
    // const onSearch = (value) => {
    //     setSelectedValue(value)
    //     if (typeof personal === 'function') {
    //         personal(value)
    //     }
    // };

    return (
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">NN:</label>
            <Select
                showSearch
                // placeholder="Select a person"
                value={number}
                className="w-64 border border-white rounded-lg"
                optionFilterProp="label"
                onChange={(value) => {
                    setNumber(value)
                    props.setNumber(value)
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

export default PersonalList
