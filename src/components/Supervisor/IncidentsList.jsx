import { forwardRef, useImperativeHandle, useState } from 'react';
import { FloatButton, Select } from 'antd';


const IncidentsList = forwardRef((props, ref) => { 
    const [incident, setIncident] = useState('Select Incident')
    // const onChange = (value) => {
    //     setSelectedValue(value)
    //     incidente(value)
    //   }

    useImperativeHandle(ref, () => ({
        limpiar() {
            setIncident('Select Incident') 
        }
    }))

    return <>
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Incidencia:</label>
            <Select
                showSearch
                value={incident}
                //placeholder="Select Incident"
                className="w-64 border border-white rounded-lg bg-white"
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
                    value: 'Tiempo Extra',
                    label: 'Tiempo Extra',
                },
                {
                    value: 'Cambio de Turno',
                    label: 'Cambio de Turno',
                },
                {
                    value: 'Retardo',
                    label: 'Retardo',
                },
                {
                    value: 'Falta',
                    label: 'Falta',
                },

                {
                    value: 'Descanso Laborado(Domingo)',
                    label: 'Descanso Laborado(Domingo)',
                },
                {
                    value: 'Horas Capacitacion',
                    label: 'Horas Capacitacion',
                },
                ]}
            />
        </div>
    </>
 })

 export default IncidentsList