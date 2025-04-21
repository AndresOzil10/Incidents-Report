import { Select } from "antd"
import { useState } from "react"
import { Fade } from "react-awesome-reveal"

const UnpaidList = ({unpaid}) => { 
    const [selectedValue, setSelectedValue] = useState('')

    const onChange = (value) => {
        setSelectedValue(value)
        unpaid(value)
    }
    return <>
    <Fade direction="left">
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Clave Permiso S/goce:</label>
            <Select
                placeholder="Select Incident"
                className="w-64 border border-white rounded-lg"
                optionFilterProp="label"
                onChange={onChange}
                options={[
                {
                    value: '1.Personal',
                    label: '1.Personal',
                },
                {
                    value: '2.Enfermedad General',
                    label: '2.Enfermedad General',
                },
                {
                    value: '3.Paro Tecnico',
                    label: '3.Paro Tecnico',
                },
                ]}
            />
        </div>
    </Fade>
    </>
 }

 export default UnpaidList