import { Select } from "antd"
import { useState } from "react"
import { Fade } from "react-awesome-reveal"

const IncidentExtraTime = ({timeExtra}) => { 

    const [selectedValue, setSelectedValue] = useState('')

    const onChange = (value) => {
        setSelectedValue(value)
        timeExtra(value)
    }


    return <>
    <Fade direction="left">
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Clave Incidencia x Tiempo Extra:</label>
            <Select
                placeholder="Select Incident"
                className="w-64 border border-white rounded-lg bg-white"
                optionFilterProp="label"
                onChange={onChange}
                options={[
                {
                    value: '1.Vacaciones',
                    label: '1.Vacaciones',
                },
                {
                    value: '2.Incapacidad',
                    label: '2.Incapacidad',
                },
                {
                    value: '3.Maternidad/Paternidad/Matrimonio Civil/Defuncion',
                    label: '3.Maternidad/Paternidad/Matrimonio Civil/Defuncion',
                },
                {
                    value: '4.Falta',
                    label: '4.Falta',
                },
                {
                    value: '5.Permisos',
                    label: '5.Permisos',
                },
                {
                    value: '6.Vacantes',
                    label: '6.Vacantes',
                },
                {
                    value: '7.Entrenamiento en Piso',
                    label: '7.Entrenamiento en Piso',
                },
                {
                    value: '8.Capacitación teórica',
                    label: '8.Capacitación teórica',
                },
                {
                    value: '9.Inventario',
                    label: '9.Inventario',
                },
                {
                    value: '10.Requerimientos de producción',
                    label: '10.Requerimientos de producción',
                },
                {
                    value: '11.Trabajos de fin de semana por temas de retraso de contenedores, requerimientos en pedidos',
                    label: '11.Trabajos de fin de semana por temas de retraso de contenedores, requerimientos en pedidos',
                },
                {
                    value: '12.Inspección de Materiales/Cuarentena/Retrabajos',
                    label: '12.Inspección de Materiales/Cuarentena/Retrabajos',
                },
                {
                    value: '13.Apoyo en PHEV/No pase de retornos/Conector de agua/Cierre de cogis/Moldes inyección',
                    label: '13.Apoyo en PHEV/No pase de retornos/Conector de agua/Cierre de cogis/Moldes inyección',
                },
                {
                    value: '14.Nuevos Proyectos',
                    label: '14.Nuevos Proyectos',
                },
                {
                    value: '15.Mantenimientos',
                    label: '15.Mantenimientos',
                },
                {
                    value: '16.OF.7',
                    label: '16.OF.7',
                },
                {
                    value: '17.Restricción Medica',
                    label: '17.Restricción Medica',
                },
                {
                    value: '18.3QF/3Q0 Canister Issue',
                    label: '18.3QF/3Q0 Canister Issue',
                },
                ]}
            />
        </div>
    </Fade>
    </>
 }

 export default IncidentExtraTime