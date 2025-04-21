import { DatePicker } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'

const Datepicker = forwardRef((props, ref) => {
    const { RangePicker } = DatePicker
    const { rango } = props;
    const [selectedDates, setSelectedDates] = useState([])
    
    const handleDateChange = (dates) => {
        setSelectedDates(dates)
        rango(dates)
    }

    const limpiar = () => {
        setSelectedDates([]);
      }
    
    useImperativeHandle(ref, () => ({
        limpiar,
    }))
    
    return <>
        <div className="mb-4" ref={ref}>
            <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Fecha Inicial -- Fecha Final:</label>
            <RangePicker value={selectedDates} onChange={handleDateChange} className="text-black w-[254px]"/>
        </div>
    </>
 })

 export default Datepicker