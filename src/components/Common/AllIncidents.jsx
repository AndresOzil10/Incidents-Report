import { useState } from 'react';
import { FloatButton, Select } from 'antd';


const AllIncidents = ({incident}) => { 
    const [selectedValue, setSelectedValue] = useState('')
    const onChange = (value) => {
        setSelectedValue(value)
        incident(value)
      }

    return <>
        <div className="mb-1 mt-2">
            <label htmlFor="" className="block text-black text-sm font-semibold">Incidencia:</label>
            <Select
                showSearch
                placeholder="Select Incident"
                className="w-64 border border-black rounded-lg text-black"
                optionFilterProp="label"
                onChange={onChange}
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
                {
                    value: 'Tiempo Extra',
                    label: 'Tiempo Extra',
                },
                {
                    value: 'Cambio de Turno',
                    label: 'Cambio de Turno',
                },
                ]}
            />
        </div>
    </>
 }

 export default AllIncidents