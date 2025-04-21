import { DatePicker } from "antd"
import { useState } from "react";
import { Fade } from "react-awesome-reveal";


  
const DateTxT = ({time}) => { 
  const [selectedDate, setSelectedDate] = useState(null)

    const onChange = (date) => {
      setSelectedDate(date)
      time(date)
    };
    return <>
    <Fade direction="left">
      <div className="mb-4">
          <label htmlFor="" className="block text-white text-sm font-semibold mb-2">Fecha Pago TXT:</label>
          <DatePicker onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white"/>
      </div>
    </Fade>
    
    </>
 }

 export default DateTxT