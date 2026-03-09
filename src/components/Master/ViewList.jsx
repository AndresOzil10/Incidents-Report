import React from 'react'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import { 
  Table, Input, Space, Typography, Popconfirm, Form, Tag, FloatButton, Modal, 
  Badge, Card, Select, Button, Tooltip, Avatar, Statistic, Row, Col,
  ConfigProvider, theme, Divider, Alert, Collapse, Timeline
} from 'antd'
import { useEffect, useState, useRef } from 'react'
import { 
  CalendarTwoTone, EditOutlined, SaveOutlined, CloseOutlined,
  CheckCircleOutlined, CloseCircleOutlined, 
  UserOutlined, IdcardOutlined, TeamOutlined, FieldTimeOutlined,
  ReloadOutlined, CalendarOutlined, BarChartOutlined,
  LeftOutlined, RightOutlined, FullscreenOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import locale from 'antd/es/date-picker/locale/es_ES'

const { Title, Text } = Typography
const { useToken } = theme
const { Option } = Select
const { Panel } = Collapse

const incidentOptionsChieff = [
  { label: 'Permiso sin goce', value: 'Permiso sin goce', color: '#fea998' },
  { label: 'Prestacion Social', value: 'Prestacion Social', color: '#ff85c0' },
  { label: 'Vacaciones', value: 'Vacaciones', color: '#6eea00' },
  { label: 'Viaje de Trabajo', value: 'Viaje de Trabajo', color: '#406ecb' },
  { label: 'Tiempo x Tiempo', value: 'Tiempo x Tiempo', color: '#6e0192' },
  { label: 'Incapacidad', value: 'Incapacidad', color: '#ffaff6' },
  { label: 'Tiempo Extra', value: 'Tiempo Extra', color: '#fa8c16' },
  { label: 'Cambio de Turno', value: 'Cambio de Turno', color: '#722ed1' },
  { label: 'Retardo', value: 'Retardo', color: '#fadb14' },
  { label: 'Falta', value: 'Falta', color: '#ff4d4f' },
  { label: 'Descanso Laborado(Domingo)', value: 'Descanso Laborado(Domingo)', color: '#13c2c2' },
  { label: 'Horas Capacitacion', value: 'Horas Capacitacion', color: '#52c41a' },
]

const incidentOptions = [
  { label: 'Permiso sin goce', value: 'Permiso sin goce', color: '#fea998' },
  { label: 'Home Office', value: 'Home Office', color: '#fefc98' },
  { label: 'Vacaciones', value: 'Vacaciones', color: '#6eea00' },
  { label: 'Viaje de Trabajo', value: 'Viaje de Trabajo', color: '#406ecb' },
  { label: 'Tiempo x Tiempo', value: 'Tiempo x Tiempo', color: '#6e0192' },
  { label: 'Incapacidad', value: 'Incapacidad', color: '#ffaff6' },
  { label: 'Olvido de Tarjeta', value: 'Olvido de Tarjeta', color: '#c2c2c2' },
]

const ViewList = ({username, id_consulta, identificador, nomina}) => {
  const { token } = useToken()
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [calendar, setCalendar] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [calendarView, setCalendarView] = useState('month')
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aceptadas: 0,
    denegadas: 0,
    empleadosUnicos: 0
  })

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
    const { token } = useToken()
    
    let inputNode

    if (dataIndex === 'incidencia') {
      inputNode = (
        <Select 
          options={identificador == 4 || identificador == 2 ? incidentOptionsChieff : incidentOptions}
          style={{ width: '100%' }}
          size="middle"
          placeholder="Seleccionar incidencia"
          showSearch
          optionFilterProp="label"
          dropdownStyle={{ borderRadius: '8px' }}
        />
      )
    } else if (dataIndex === 'fecha_ini' || dataIndex === 'fecha_final' || dataIndex === 'fecha_pago') {
      inputNode = (
        <DatePicker 
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          size="middle"
          placeholder="Seleccionar fecha"
        />
      )
    } else if (dataIndex === 'hrs_inci') {
      inputNode = (
        <Input 
          type="number"
          min="0"
          max="24"
          step="0.5"
          size="middle"
          style={{ textAlign: 'center' }}
          placeholder="Horas"
        />
      )
    } else if (dataIndex === 'observacion') {
      inputNode = (
        <Input.TextArea 
          rows={2}
          size="middle"
          placeholder="Ingrese observaciones"
        />
      )
    } else {
      inputNode = <Input size="middle" placeholder={`Ingrese ${title}`} />
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: dataIndex === 'incidencia',
                message: `Por favor ingrese ${title}`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          <div style={{ 
            padding: '4px 0',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {children}
          </div>
        )}
      </td>
    )
  }

  const isEditing = (record) => record.key === editingKey
  
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = {
        "username": username,
        "identificador": identificador
      }
      const url_get = "http://localhost/wl-api/ApEdDeShieff.php"
      const resp = await fetch(url_get, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json = await resp.json()
      
      let dataArray = []
      if (Array.isArray(json)) {
        dataArray = json
      } else if (json.data && Array.isArray(json.data)) {
        dataArray = json.data
      }

      setData(dataArray)
      
      // Calcular estadísticas
      const empleadosUnicos = new Set(dataArray.map(item => item.nn))
      const pendientes = dataArray.filter(item => item.estatus === 'Pendiente').length
      const aceptadas = dataArray.filter(item => item.estatus === 'Aceptada').length
      const denegadas = dataArray.filter(item => item.estatus === 'Denegado').length
      
      setStats({
        total: dataArray.length,
        pendientes,
        aceptadas,
        denegadas,
        empleadosUnicos: empleadosUnicos.size
      })
      
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const calendarData = async () => {
    setCalendarLoading(true)
    try {
      const data = {
        "username": username,
      }
      const url_get = "http://localhost/wl-api/CalendarData.php"
      const resp = await fetch(url_get, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json = await resp.json()
      
      if (Array.isArray(json)) {
        setCalendar(json)
      } else if (json.data && Array.isArray(json.data)) {
        setCalendar(json.data)
      }
      
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    } finally {
      setCalendarLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
    calendarData()
  }, [username])

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
    observacion: jsonres.observacion,
    estatus: jsonres.estatus
  }))

  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const newrow = {...row, key}
      const url_get = "http://localhost/wl-api/UpdateIncident.php"
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
        setEditingKey('')
      } else {
        console.error('Error al guardar los datos:', json.message)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const acept = async (key) => {
    try {
      const data = {
        "id": key,
        "username": username
      }
      const url_get = "http://localhost/wl-api/AceptRequest.php"
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
      }
    } catch (errInfo) {
      console.log('Error:', errInfo)
    }
  }

  const denied = async (key) => {
    try {
      const data = {
        "id": key,
        "username": username
      }
      const url_get = "http://localhost/wl-api/DeniedRequest.php"
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
      }
    } catch (errInfo) {
      console.log('Error:', errInfo)
    }
  }

  const columns = [
    {
      title: <Space><IdcardOutlined style={{ fontSize: '12px' }} />ID</Space>,
      width: 60,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: true,
      render: (text) => (
        <Badge 
          count={text}
          style={{ 
            backgroundColor: token.colorPrimary,
            fontSize: '10px',
            fontWeight: 600,
            boxShadow: 'none'
          }}
          overflowCount={9999}
        />
      )
    },
    {
      title: <Space><TeamOutlined style={{ fontSize: '12px' }} />Nómina</Space>,
      width: 90,
      dataIndex: 'nn',
      key: 'nn',
      fixed: 'left',
      sorter: true,
      render: (text) => (
        <Tag 
          color="blue" 
          style={{ 
            borderRadius: '12px',
            fontWeight: 600,
            padding: '2px 8px'
          }}
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Empleado',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 150,
      render: (text, record) => (
        <Space size="small" align="center">
          <Avatar 
            size="small" 
            icon={<UserOutlined />}
            style={{ backgroundColor: token.colorPrimary }}
          />
          <div style={{ lineHeight: '1.3' }}>
            <Text style={{ fontSize: '12px', fontWeight: 500 }}>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '10px' }}>{record.area} • {record.turno}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Período',
      key: 'periodo',
      width: 130,
      render: (_, record) => (
        <div style={{ 
          background: '#f5f5f5',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '11px' }}>
            <CalendarOutlined style={{ marginRight: '4px', color: token.colorPrimary }} />
            {record.fecha_ini} → {record.fecha_final}
          </div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
            Semana {record.semana}
          </div>
        </div>
      )
    },
    {
      title: 'Incidencia',
      dataIndex: 'incidencia',
      key: 'incidencia',
      width: 140,
      editable: true,
      render: (text) => {
        const option = [...incidentOptionsChieff, ...incidentOptions].find(opt => opt.value === text)
        return (
          <Tag 
            color={option?.color || 'default'}
            style={{ 
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 500
            }}
          >
            {text}
          </Tag>
        )
      }
    },
    {
      title: <Space><FieldTimeOutlined style={{ fontSize: '12px' }} />Horas</Space>,
      dataIndex: 'hrs_inci',
      key: 'hrs_inci',
      width: 70,
      editable: true,
      render: (text) => (
        <div style={{ 
          background: token.colorPrimaryBg,
          borderRadius: '20px',
          padding: '2px 8px',
          textAlign: 'center',
          display: 'inline-block',
          minWidth: '50px'
        }}>
          <Text style={{ fontSize: '12px', fontWeight: 600 }}>{text}h</Text>
        </div>
      )
    },
    {
      title: 'Clave',
      dataIndex: 'clave_inci',
      key: 'clave_inci',
      width: 70,
      editable: true,
      render: (text) => (
        <Tag 
          color="orange" 
          style={{ 
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Observaciones',
      dataIndex: 'observacion',
      key: 'observacion',
      width: 120,
      editable: true,
      render: (text) => (
        <Tooltip title={text || 'Sin observaciones'} placement="topLeft">
          <div style={{ 
            maxWidth: '120px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '11px',
            color: text ? token.colorText : '#999'
          }}>
            {text || <Text type="secondary">-</Text>}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 75,
      render: (_, record) => {
        const editable = isEditing(record)
        
        return editable ? (
          <Space>
            <Tooltip title="Guardar">
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                onClick={() => save(record.id)}
                style={{ background: token.colorSuccess, borderColor: token.colorSuccess }}
              />
            </Tooltip>
            <Tooltip title="Cancelar">
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={cancel}
              />
            </Tooltip>
          </Space>
        ) : (
          <Space>
            <Tooltip title="Editar">
              <Button
                type="default"  // Cambiado a default
                size="small"
                icon={<EditOutlined />}
                onClick={() => edit(record)}
                disabled={editingKey !== ''}
                style={{ background: '#000000', borderColor: '#000000', color: '#ffffff' }}
              />
            </Tooltip>
            <Tooltip title="Aceptar solicitud">
              <Popconfirm 
                title="¿Aceptar solicitud?" 
                onConfirm={() => acept(record.id)}
                okText="Sí"
                cancelText="No"
              >
                <Button 
                  type="default"  // Cambiado a default
                  size="small" 
                  icon={<CheckCircleOutlined />}
                  style={{ background: '#107521', borderColor: '#52c41a', color: '#ffffff' }}
                />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Rechazar solicitud">
              <Popconfirm 
                title="¿Rechazar solicitud?" 
                onConfirm={() => denied(record.id)}
                okText="Sí"
                cancelText="No"
              >
                <Button 
                  type="default"  // Cambiado a default
                  size="small" 
                  icon={<CloseCircleOutlined />}
                  style={{ background: '#ff4d4f', borderColor: '#ff4d4f', color: '#ffffff' }}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        )
      }
    }
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
    const option = [...incidentOptionsChieff, ...incidentOptions].find(opt => opt.value === tipo)
    return option?.color || '#ff4d4f'
  }

  const getdateModify = (fecha) => {
    return new Date(fecha + 'T00:00:00')
  }

  const getdatefiModify = (fecha) => {
    return new Date(fecha + 'T23:59:59')
  }

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.9,
        color: '#000',
        border: 'none',
        display: 'block',
        padding: '2px 4px',
        fontWeight: 500,
        fontSize: '11px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }
    }
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
  }

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      let newDate = new Date(toolbar.date)
      if (toolbar.view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (toolbar.view === 'week') {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() - 1)
      }
      toolbar.onNavigate('prev', newDate)
      setCalendarDate(newDate)
    }

    const goToNext = () => {
      let newDate = new Date(toolbar.date)
      if (toolbar.view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (toolbar.view === 'week') {
        newDate.setDate(newDate.getDate() + 7)
      } else {
        newDate.setDate(newDate.getDate() + 1)
      }
      toolbar.onNavigate('next', newDate)
      setCalendarDate(newDate)
    }

    const goToToday = () => {
      const now = new Date()
      toolbar.onNavigate('current', now)
      setCalendarDate(now)
    }

    const viewNames = [
      { view: 'month', label: 'Mes' },
      { view: 'week', label: 'Semana' },
      { view: 'day', label: 'Día' }
    ]

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px',
        background: '#f8fafc',
        borderRadius: '8px'
      }}>
        <Space>
          <Button.Group>
            <Button icon={<LeftOutlined />} onClick={goToBack} size="small" />
            <Button onClick={goToToday} size="small">Hoy</Button>
            <Button icon={<RightOutlined />} onClick={goToNext} size="small" />
          </Button.Group>
          <Text strong style={{ marginLeft: 10 }}>
            {dayjs(toolbar.date).format('MMMM YYYY')}
          </Text>
        </Space>
        
        <Space>
          {viewNames.map(view => (
            <Button
              key={view.view}
              type={toolbar.view === view.view ? 'primary' : 'default'}
              onClick={() => toolbar.onView(view.view)}
              size="small"
            >
              {view.label}
            </Button>
          ))}
        </Space>
      </div>
    )
  }

  // Agrupar eventos por mes para el timeline
  const getEventsByMonth = () => {
    const eventsByMonth = {}
    calendar.forEach(event => {
      const month = dayjs(event.fecha_ini).format('MMMM YYYY')
      if (!eventsByMonth[month]) {
        eventsByMonth[month] = []
      }
      eventsByMonth[month].push(event)
    })
    return eventsByMonth
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
        components: {
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#1e293b',
            borderColor: '#e2e8f0',
            cellPaddingBlock: 6,
            cellPaddingInline: 10,
          },
        },
      }}
    >
      <div style={{ 
        
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        padding: '16px'
      }}>

        {/* Tabla de incidencias - Altura optimizada */}
        <Card
          style={{
            flex: 1,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: 'calc(100vh - 220px)' // Altura fija considerando estadísticas y padding
          }}
          bodyStyle={{ 
            padding: 0,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {/* Table header */}
          <div style={{ 
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Space>
              <div style={{ 
                width: 4, 
                height: 20, 
                background: 'white',
                borderRadius: 4
              }} />
              <Title level={5} style={{ margin: 0, color: 'white', fontSize: '14px' }}>
                Gestión de Incidencias
              </Title>
            </Space>
            <Space>
              <Button 
                icon={<CalendarTwoTone />}
                onClick={showModal}
                tooltip="Ver calendario de incidencias"
                
              />
            </Space>
          </div>

          {/* Table - con altura automática dentro del card */}
          <div style={{ 
            flex: 1,
            overflow: 'auto',
            background: '#ffffff',
            height: 'calc(100% - 52px)' // Restar altura del header
          }}>
            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                loading={loading}
                columns={mergedColumns}
                dataSource={dataSource}
                scroll={{ x: 1600, y: 'calc(100vh - 340px)' }} // Altura ajustada
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {range[0]}-{range[1]} de {total} registros
                    </Text>
                  ),
                  pageSizeOptions: ['5', '10', '15', '20'],
                  size: 'small',
                  style: { 
                    margin: 0,
                    padding: '8px 16px',
                    borderTop: '1px solid #f0f0f0'
                  }
                }}
                size="small"
                rowClassName={(record) => 
                  record.estatus === 'Pendiente' ? 'editable-row' : ''
                }
              />
            </Form>
          </div>
        </Card>

        {/* Modal del calendario - Mejorado visualmente */}
        <Modal
          title={
            <Space>
              <CalendarTwoTone />
              <span style={{ fontSize: '16px', fontWeight: 500 }}>Calendario de Incidencias</span>
            </Space>
          }
          open={isModalOpen}
          onCancel={handleCancel}
          width={1400}
          footer={null}
          styles={{ body: { padding: '20px' } }} // Cambio aquí: bodyStyle -> styles.body
        >
          <Row gutter={[20, 20]}>
            <Col span={18}>
              <Card 
                bordered={false}
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  overflow: 'hidden'
                }}
              >
                <Calendar
                  localizer={dayjsLocalizer(dayjs)}
                  startAccessor="start"
                  endAccessor="end"
                  events={calendar.map(event => ({
                    title: `${event.nombre} - ${event.incidencia}`,
                    start: getdateModify(event.fecha_ini),
                    end: getdatefiModify(event.fecha_final),
                    color: getColorByIncidentType(event.incidencia),
                    original: event
                  }))}
                  style={{ height: 600 }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  popup
                  selectable
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  components={{
                    toolbar: CustomToolbar
                  }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Card 
                  title={
                    <Space>
                      <div style={{ width: 3, height: 16, background: token.colorPrimary, borderRadius: 2 }} />
                      <span style={{ fontSize: '14px' }}>Leyenda de colores</span>
                    </Space>
                  }
                  size="small"
                  style={{ borderRadius: '12px' }}
                >
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px'
                  }}>
                    {(identificador == 4 || identificador == 2 ? incidentOptionsChieff : incidentOptions).map(option => (
                      <Tooltip key={option.value} title={option.label}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          cursor: 'pointer'
                        }}>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            background: option.color,
                            borderRadius: '4px',
                            border: '1px solid rgba(0,0,0,0.1)'
                          }} />
                          <span style={{ 
                            fontSize: '9.2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '70px'
                          }}>
                            {option.label}
                          </span>
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </Card>

                {selectedEvent && (
                  <Card 
                    title={
                      <Space>
                        <InfoCircleOutlined style={{ color: token.colorPrimary }} />
                        <span style={{ fontSize: '13px' }}>Detalle del evento</span>
                      </Space>
                    }
                    size="small"
                    style={{ borderRadius: '12px' }}
                  >
                    <Timeline
                      items={[
                        {
                          color: 'green',
                          children: (
                            <div>
                              <Text type="secondary" style={{ fontSize: '11px' }}>Empleado</Text>
                              <div><Text strong style={{ fontSize: '13px' }}>{selectedEvent.original?.nombre}</Text></div>
                            </div>
                          )
                        },
                        {
                          color: 'blue',
                          children: (
                            <div>
                              <Text type="secondary" style={{ fontSize: '11px' }}>Incidencia</Text>
                              <div>
                                <Tag color={selectedEvent.color} style={{ fontSize: '11px' }}>
                                  {selectedEvent.original?.incidencia}
                                </Tag>
                              </div>
                            </div>
                          )
                        },
                        {
                          color: 'orange',
                          children: (
                            <div>
                              <Text type="secondary" style={{ fontSize: '11px' }}>Período</Text>
                              <div style={{ fontSize: '12px' }}>
                                {dayjs(selectedEvent.start).format('DD/MM/YYYY')} - {dayjs(selectedEvent.end).format('DD/MM/YYYY')}
                              </div>
                            </div>
                          )
                        },
                        {
                          color: 'purple',
                          children: (
                            <div>
                              <Text type="secondary" style={{ fontSize: '11px' }}>Horas</Text>
                              <div><Text strong>{selectedEvent.original?.hrs_inci}h</Text></div>
                            </div>
                          )
                        }
                      ]}
                    />
                  </Card>
                )}

                <Alert
                  message="Información"
                  description={`${calendar.length} eventos registrados en el calendario`}
                  type="info"
                  showIcon
                  size="small"
                  style={{ borderRadius: '8px' }}
                />
              </Space>
            </Col>
          </Row>
        </Modal>

        <style jsx>{`
          .editable-row {
            background-color: #fff7e6;
            transition: all 0.3s;
          }
          .editable-row:hover {
            background-color: #ffe7ba !important;
          }
          .ant-table-tbody > tr:hover > td {
            background-color: #f0f5ff !important;
          }
          .rbc-calendar {
            font-family: inherit;
          }
          .rbc-event {
            transition: transform 0.2s;
          }
          .rbc-event:hover {
            transform: scale(1.02);
            z-index: 1000;
          }
        `}</style>
      </div>
    </ConfigProvider>
  )
}

export default ViewList