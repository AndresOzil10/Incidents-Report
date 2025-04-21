import { useEffect, useState } from 'react'
import { Select } from 'antd'

const ListArea = ({ lista }) => { 
    const [data, setData] = useState([])
    const [selectedValue, setSelectedValue] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url_get = "http://10.144.13.5/wl-api/AreaList.php"
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
    }, []);

    const onChange = (value) => {
        setSelectedValue(value)
            lista(value)
    };
      
    const onSearch = (value) => {
        setSelectedValue(value)
            lista(value)
    };

    return (
        <div className="mb-1">
            <label htmlFor="" className="block text-black text-sm font-semibold">Area</label>
            <Select
                showSearch
                placeholder="Select a person"
                className="w-64 border border-black rounded-lg"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={data.map((jsonres) => ({
                    value: jsonres.Area,
                    label: jsonres.Area,
                }))}
            />
        </div>
    )
}

export default ListArea
