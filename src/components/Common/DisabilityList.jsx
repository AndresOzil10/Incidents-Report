import { Select } from "antd"
import { useState } from "react"
import { Fade } from "react-awesome-reveal"

const DisabilityList = ({disability}) => { 
    const [selectedValue, setSelectedValue] = useState('')

    const onChange = (value) => {
        setSelectedValue(value)
        disability(value)
    }
    return <>
    <Fade direction="left">
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Clave Permiso S/goce:</label>
            <Select
                placeholder="Select Disability"
                className="w-64 border border-white rounded-lg"
                optionFilterProp="label"
                onChange={onChange}
                options={[
                {
                    value: '1.Interna',
                    label: '1.Interna',
                },
                {
                    value: '2.Imss',
                    label: '2.Imss',
                },
                ]}
            />
        </div>
    </Fade>
    </>
 }

 export default DisabilityList