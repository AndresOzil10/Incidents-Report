import { forwardRef, useImperativeHandle, useState } from 'react';
import { FloatButton, Select } from 'antd';

const TurnList = forwardRef((props, ref) => { 
    const [turn, setTurn] = useState('Select Turn')
    // const onChange = (value) => {
    //     setSelectedValue(value)
    //     turno(value)
    //   }
      
    //   const onSearch = (value) => {
    //     //console.log(selectedValue)
    //     setSelectedValue(value)
    //     turno(value)
    //   }

    //   const Press = () => {
    //     console.log(`${selectedValue}`)
    //   }

    useImperativeHandle(ref, () => ({
        limpiar() {
            setTurn('Select Turn') 
        }
    }))

    return <>
        <div className="mb-4">
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Turno:</label>
            <Select
                showSearch
                value={turn}
                // placeholder="Select Turn"
                className="w-64 border border-white rounded-lg"
                optionFilterProp="label"
                onChange={(value) => {
                    setTurn(value)
                    props.setTurn(value)
                }}
                // onSearch={onSearch}
                options={[
                {
                    value: '6:00-14:00',
                    label: '6:00-14:00',
                },
                {
                    value: '14:00-21:30',
                    label: '14:00-21:30',
                },
                {
                    value: '21:30-06:00',
                    label: '21:30-06:00',
                },
                {
                    value: '08:00-16:00',
                    label: '08:00-16:00',
                },
                {
                    value: '08:00-18:00',
                    label: '08:00-18:00',
                },
                {
                    value: '4to',
                    label: '4to',
                },
                ]}
            />
        </div>
    </>
 })

 export default TurnList