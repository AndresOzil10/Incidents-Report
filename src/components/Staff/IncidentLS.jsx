import { useImperativeHandle, forwardRef, useState } from 'react';
import { FloatButton, Select } from 'antd';


const IncidentLS = forwardRef((props, ref) => { 
    // const [selectedValue, setSelectedValue] = useState('')
    const [incident, setIncident] = useState('-')
    // const onChange = (value) => {
    //     setSelectedValue(value)
    //     incidente(value)
    // }

    //console.log(incident)

    useImperativeHandle(ref, () => ({
        limpiar() {
            setIncident('-') 
        }
    }))

    return <>
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Incidencia:</label>
            <Select
                showSearch
                value={incident}
                //placeholder="Select Incident"
                className="w-64 border border-white rounded-lg text-black"
                optionFilterProp="label"
                onChange={(value) => {
                    setIncident(value)
                    props.setIncident(value)
                }}
                options={[
                {
                    value: 'Permiso s/goce',
                    label: 'Permiso s/goce',
                },
                {
                    value: 'Vacaciones',
                    label: 'Vacaciones',
                },
                {
                    value: 'Viaje de Trabajo',
                    label: 'Viaje de Trabajo',
                },
                {
                    value: 'Incapacidad',
                    label: 'Incapacidad',
                },
                {
                    value: 'Tiempo x Tiempo',
                    label: 'Tiempo x Tiempo',
                },
                {
                    value: 'Prestacion Social',
                    label: 'Prestacion Social',
                },
                {
                    value: 'Home Office',
                    label: 'Home Office',
                },
                ]}
            />
        </div>
    </>
 })

 export default IncidentLS