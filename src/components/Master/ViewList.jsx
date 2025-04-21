import React from 'react'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import { Table, Input, Space, Typography, Popconfirm, Form, Tag, FloatButton, Modal, Badge, Card, ColorPicker } from 'antd'
import { useEffect, useState, useRef } from 'react'
import {  CalendarTwoTone} from '@ant-design/icons'
import dayjs from 'dayjs'
import { Select } from 'antd';

const incidentOptionsChieff = [
  { label: 'Permiso sin goce', value: 'Permiso sin goce' },
  { label: 'Prestacion Social', value: 'Prestacion Social' },
  { label: 'Vacaciones', value: 'Vacaciones' },
  { label: 'Viaje de Trabajo', value: 'Viaje de Trabajo' },
  { label: 'Tiempo x Tiempo', value: 'Tiempo x Tiempo' },
  { label: 'Incapacidad', value: 'Incapacidad' },
  { label: 'Tiempo Extra', value: 'Tiempo Extra' },
  { label: 'Cambio de Turno', value: 'Cambio de Turno'},
  { label: 'Retardo', value: 'Retardo'},
  { label: 'Falta', value: 'Falta'},
  { label: 'Descanso Laborado(Domingo)', value: 'Descanso Laborado(Domingo)'},
  { label: 'Horas Capacitacion', value: 'Horas Capacitacion'},
]

const incidentOptions = [
  { label: 'Permiso sin goce', value: 'Permiso sin goce' },
  { label: 'Home Office', value: 'Home Office' },
  { label: 'Vacaciones', value: 'Vacaciones' },
  { label: 'Viaje de Trabajo', value: 'Viaje de Trabajo' },
  { label: 'Tiempo x Tiempo', value: 'Tiempo x Tiempo' },
  { label: 'Incapacidad', value: 'Incapacidad' },
  { label: 'Olvido de Tarjeta', value: 'Olvido de Tarjeta' },
]



const ViewList = ({username, id_consulta, identificador, nomina}) => {

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode;

  if (dataIndex === 'incidencia') {
    inputNode = (
      identificador == 4 || identificador == 2 ? <Select options={incidentOptionsChieff} /> : <Select options={incidentOptions}  />
    )
  } else {
    inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

  const localizer = dayjsLocalizer(dayjs) 
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [calendar, setCalendar] = useState([])
    const [editingKey, setEditingKey] = useState('')
    const isEditing = (record) => record.key === editingKey
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const showModal = () => {
      setIsModalOpen(true);
    }

    const handleCancel = () => {
      setIsModalOpen(false);
    }

    const handleOk = () => {
      setIsModalOpen(false);
    }

    const edit = (record) => {
        form.setFieldsValue({
          name: '',
          age: '',
          address: '',
          ...record,
        });
        setEditingKey(record.key)
      }
    
      const cancel = () => {
        setEditingKey('')
      }

  //console.log(username)


    const fetchData = async () => {
        try {
            const data = {
              "username": username,
              "identificador": identificador
            }
            const url_get = "http://10.144.13.5/wl-api/ApEdDeShieff.php"
            //const url_get = "http://10.144.13.5/wl-api/ApEdDeShieff.php"
            const resp = await fetch(url_get, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await resp.json()
            //console.log(json.data)
            if (Array.isArray(json)) {
                setData(json.data);
            } else if (json.data && Array.isArray(json.data)) {
                setData(json.data);
            } else {
                console.error('La respuesta no es un arreglo válido:', json)
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error)
        }
    }

    const calendarData = async () => {
      try {
          const data = {
            "username": username,
          }
          const url_get = "http://10.144.13.5/wl-api/CalendarData.php"
          //const url_get = "http://10.144.13.5/wl-api/CalendarData.php"
          const resp = await fetch(url_get, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          const json = await resp.json()
          //console.log(json)
          if (Array.isArray(json)) {
              setCalendar(json);
          } else if (json.data && Array.isArray(json.data)) {
              setCalendar(json.data);
          } else {
              console.error('La respuesta no es un arreglo válido:', json)
          }
      } catch (error) {
          console.error('Error al obtener los datos:', error)
      }
  }
  
    useEffect(() => {
        fetchData()
        calendarData()
    }, [username])

  //console.log(data)
  const dataSource = data.map((jsonres) => ({
    key: jsonres.id,
    id: jsonres.id,
    nn: jsonres.nn, 
    nombre: jsonres.nombre,
    area: jsonres.area,
    turno: jsonres.turno,
    fecha_ini: jsonres.fecha_ini,
    fecha_final: jsonres.fecha_final,
    semana: jsonres.semana,
    incidencia: jsonres.incidencia,
    clave_inci: jsonres.clave_inci,
    hrs_inci: jsonres.hrs_inci,
    clave_perm: jsonres.clave_perm,
    fecha_pago: jsonres.fecha_pago,
    tipo_inca: jsonres.tipo_inca,
    observacion: jsonres.observacion
  }))

  const save = async (key) => {
    try {
        const row = await form.validateFields()
        const newrow = {...row, key}
        //const newData = [...data]
        // const url_get = "http://10.144.13.5/wl-api/UpdateIncident.php"
        const url_get = "http://10.144.13.5/wl-api/UpdateIncident.php"
        const resp = await fetch(url_get, {
            method: 'POST',
            body: JSON.stringify(newrow),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await resp.json()
        if (json.success) { 
            fetchData()
            setEditingKey('');
            //setData(json.data);
            //window.location.reload();
        } else {
            console.error('Error al guardar los datos:', json.message)
        }
        
    } catch (errInfo) {
       console.log('Validate Failed:', errInfo)
    }
  }

  const acept = async (key) => {
    //console.log(key)
    try {
      const data = {
        "id": key,
        "username": username
      }
      //const url_get = "http://10.144.13.5/wl-api/AceptRequest.php"
      const url_get = "http://10.144.13.5/wl-api/AceptRequest.php"
        const resp = await fetch(url_get, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await resp.json()
        if (json.success) { 
            fetchData()
            //setEditingKey('');
            //setData(json.data);
            //window.location.reload();
        } else {
            console.error('Error al guardar los datos:', json.message)
        }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const denied = async (key) => {
    //console.log(key)
    try {
      const data = {
        "id": key,
        "username": username
      }
      //const url_get = "http://10.144.13.5/wl-api/DeniedRequest.php"
      const url_get = "http://10.144.13.5/wl-api/DeniedRequest.php"
        const resp = await fetch(url_get, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await resp.json()
        if (json.success) { 
            fetchData()
            //setEditingKey('');
            //setData(json.data);
            //window.location.reload();
        } else {
            //console.error('Error al guardar los datos:', json.message)
            fetchData()

        }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
        title: 'Id',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        sorter: true,
        editable: false,
      },
    {
      title: 'N.Nomina',
      width: 100,
      dataIndex: 'nn',
      key: 'nn',
      fixed: 'left',
      sorter: true,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: '1',
    },
    
    {
        title: 'Area',
        dataIndex: 'area',
        key: '2',
      },
      {
        title: 'Turno',
        dataIndex: 'turno',
        key: '3',
        editable: false,
      },
      {
        title: 'Fecha Inicial',
        dataIndex: 'fecha_ini',
        key: '4',
        editable: true,
      },
      {
        title: 'Fecha Final',
        dataIndex: 'fecha_final',
        key: '5',
        editable: true,
      },
      {
        title: 'Semana',
        dataIndex: 'semana',
        key: '6',
      },
      {
        title: 'Incidencia',
        dataIndex: 'incidencia',
        key: '7',
        editable: true,
      },
      {
        title: 'Clave Incidencia',
        dataIndex: 'clave_inci',
        key: '8',
        editable: true,
      },
      {
        title: 'Hrs/Dia(s) Incidencia',
        dataIndex: 'hrs_inci',
        key: '9',
        editable: true,
      },
      {
        title: 'Clave Permiso',
        dataIndex: 'clave_perm',
        key: '10',
        editable: true,
      },
      {
        title: 'Fecha Pago',
        dataIndex: 'fecha_pago',
        key: '11',
        editable: true,
      },
      {
        title: 'Tipo Incapacidad',
        dataIndex: 'tipo_inca',
        key: '12',
        editable: true,
      },
      {
        title: 'Observacion',
        dataIndex: 'observacion',
        key: '13',
        editable: true,
      },
      {
        title: 'Edit',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.id)}
                style={{
                  marginInlineEnd: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          );
        },
      },
      {
        title: 'Acept',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, record) =>
          dataSource.length >= 1 ? (
            <Popconfirm title="Sure to Acept?" onConfirm={() => acept(record.id)}>
              <Tag color="green">Acept</Tag>
            </Popconfirm>
          ) : null,
      },
      {
        title: 'Denied',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, record) =>
          dataSource.length >= 1 ? (
            <Popconfirm title="Sure to Denied?" onConfirm={() => denied(record.id)}>
              <Tag color="red">Denied</Tag>
            </Popconfirm>
          ) : null,
      },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const getColorByIncidentType = (tipo) => {
    switch(tipo) {
      case 'Permiso sin goce':
        return '#fea998'
      case 'Home Office':
        return '#fefc98'
      case 'Vacaciones':
        return '#6eea00'
      case 'Viaje de Trabajo':
        return '#406ecb'
      case 'Tiempo x Tiempo':
        return '#6e0192'
      case 'Incapacidad':
        return '#ffaff6'
        case 'Olvido de Tarjeta':
          return '#c2c2c2' 
      default:
        return 'red' 
    }
  }

  const getdateModify = (fecha) => {
    const hr = "00:00:00"
    const arrayFecha = fecha.concat(' ', hr)
    //const dia = parseInt(arrayFecha[2], 10) + 1
    //const newDateIni = arrayFecha[0] + '-' + arrayFecha[1] + '-' + dia
    //console.log(fecha)
    //console.log(new Date(arrayFecha))
    return new Date(arrayFecha)
  }

  const getdatefiModify = (fecha) => {
    const hr = "23:59:59"
    const arrayFecha = fecha.concat(' ', hr)
    //const dia = parseInt(arrayFecha[2], 10) + 1
    //const newDateIni = arrayFecha[0] + '-' + arrayFecha[1] + '-' + dia
    //console.log(fecha)
    //console.log(new Date(arrayFecha))
    return new Date(arrayFecha)
  }

  const eventStyleGetter = (event) => {
    let backgroundColor = event.color; // Obtiene el color del evento
    let style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    }
  }

  return (
    <>
      <FloatButton onClick={showModal}  shape='square' icon={<CalendarTwoTone />} />
      <Modal title="Calendary" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={2000}>
        <div className='w-auto flex'>
          <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          events={calendar.map(event => ({
            title: event.nombre, 
            start: getdateModify(event.fecha_ini), 
            end: getdatefiModify(event.fecha_final), 
            color: getColorByIncidentType(event.incidencia)
          }))}
          style={{ height: 1200, width: 1500 }}
          eventPropGetter={eventStyleGetter}
          />
          <Card className='ml-6 w-[400px] h-[250px] border-double border-4 border-red-600'>
            <h3 className='text-center font-bold mb-2'>Tabla de colores Incidencia</h3>
            <p><ColorPicker defaultValue="#fea998"  disabled size='small' showText={(color) => <span>Permiso sin Goce</span>}/></p>
            <p><ColorPicker defaultValue="#fefc98" disabled size='small' showText={(color) => <span>Home Office</span>}/></p>
            <p><ColorPicker defaultValue="#6eea00" disabled size='small' showText={(color) => <span>Vacaciones</span>}/></p>
            <p><ColorPicker defaultValue="#406ecb" disabled size='small' showText={(color) => <span>Viaje de Trabajo</span>}/></p>
            <p><ColorPicker defaultValue="#6e0192" disabled size='small' showText={(color) => <span>Tiempo por Tiempo</span>}/></p>
            <p><ColorPicker defaultValue="#ffaff6" disabled size='small' showText={(color) => <span>Incapacidad</span>}/></p>
            <p><ColorPicker defaultValue="#c2c2c2" disabled size='small' showText={(color) => <span>Olvido de Tarjeta</span>}/></p>
          </Card>
        </div>
      </Modal>

        <Form form={form} component={false}>
            <Table
            components={{
                body: {
                cell: EditableCell,
                },
            }}
            className='table-auto ml-[-100px]'
            pagination={true}
            columns={mergedColumns}
            dataSource={dataSource}
            scroll={{
                x: 'max-content',
            }}
            size='small'
            />
        </Form>
        
    </>
    
  )

 }

export default ViewList