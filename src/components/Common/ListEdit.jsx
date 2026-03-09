import React from 'react'
import { 
  Table, Input, Space, Typography, Form, Select, 
  Button, Tag, Avatar, Tooltip, ConfigProvider, DatePicker, 
  theme, Empty, Progress
} from 'antd'
import { useEffect, useState } from 'react'
import { 
  EditOutlined, SaveOutlined, CloseOutlined, 
  UserOutlined, CalendarOutlined, ClockCircleOutlined,
  CheckCircleOutlined, InfoCircleOutlined
} from '@ant-design/icons'

const { Text } = Typography
const { useToken } = theme

const incidentOptions = [
  { label: 'Permiso sin goce', value: 'Permiso sin goce', color: '#fea998', icon: '🚶' },
  { label: 'Home Office', value: 'Home Office', color: '#fefc98', icon: '🏠' },
  { label: 'Vacaciones', value: 'Vacaciones', color: '#6eea00', icon: '🌴' },
  { label: 'Viaje de Trabajo', value: 'Viaje de Trabajo', color: '#406ecb', icon: '✈️' },
  { label: 'Tiempo x Tiempo', value: 'Tiempo x Tiempo', color: '#6e0192', icon: '⏱️' },
  { label: 'Incapacidad', value: 'Incapacidad', color: '#ffaff6', icon: '🏥' },
  { label: 'Prestacion Social', value: 'Prestacion Social', color: '#ff85c0', icon: '🎁' }
];

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
  
  const getInputNode = () => {
    switch (dataIndex) {
      case 'incidencia':
        return (
          <Select 
            options={incidentOptions}
            className="w-full"
            size="middle"
            placeholder="Seleccionar incidencia"
            showSearch
            optionFilterProp="label"
          />
        )
      case 'fecha_ini':
      case 'fecha_final':
      case 'fecha_pago':
        return (
          <DatePicker 
            format="YYYY-MM-DD"
            className="w-full"
            size="middle"
            placeholder="Seleccionar fecha"
            suffixIcon={<CalendarOutlined className="text-purple-600" />}
          />
        )
      case 'hrs_inci':
        return (
          <Input 
            type="number"
            min="0"
            max="24"
            step="0.5"
            size="middle"
            className="text-center"
            placeholder="Horas"
            prefix={<ClockCircleOutlined className="text-purple-600" />}
          />
        )
      case 'observacion':
        return (
          <Input.TextArea 
            rows={3}
            size="middle"
            placeholder="Ingrese observaciones detalladas..."
            className="resize-y"
          />
        )
      default:
        return <Input size="middle" />
    }
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          className="m-0"
          rules={[
            {
              required: dataIndex === 'incidencia' || dataIndex === 'hrs_inci',
              message: `Por favor ingrese ${title}`,
            },
          ]}
        >
          {getInputNode()}
        </Form.Item>
      ) : (
        <div className="py-1.5 min-h-[40px] flex items-center">
          {children}
        </div>
      )}
    </td>
  )
}

const ListEdit = ({ username, nomina }) => {
  const { token } = useToken()
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState('')
  
  const isEditing = (record) => record.key === editingKey

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
        "nomina": nomina,
      }
      const url_get = "http://localhost/wl-api/ListEdit.php"
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
      
    } catch (error) {
      console.error('Error al obtener los datos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [nomina])

  const dataSource = data.map((jsonres) => ({
    key: jsonres.id,
    id: jsonres.id,
    nn: jsonres.nn, 
    nombre: jsonres.nombre,
    area: jsonres.area,
    fecha_ini: jsonres.fecha_ini,
    fecha_final: jsonres.fecha_final,
    semana: jsonres.semana,
    incidencia: jsonres.incidencia,
    hrs_inci: jsonres.hrs_inci,
    clave_inci: jsonres.clave_inci,
    clave_perm: jsonres.clave_perm,
    fecha_pago: jsonres.fecha_pago,
    tipo_inca: jsonres.tipo_inca,
    observacion: jsonres.observacion,
    estatus: jsonres.estatus
  }))

  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const newrow = { ...row, key }
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

  const renderStatus = (estatus) => {
    const statusConfig = {
      'Aceptada': { 
        color: 'text-green-700', 
        bg: 'bg-green-50', 
        border: 'border-green-200',
        icon: <CheckCircleOutlined className="text-green-600" />,
        label: 'Aceptada'
      },
      'Pendiente': { 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200',
        icon: <ClockCircleOutlined className="text-yellow-600" />,
        label: 'Pendiente'
      },
      'Rechazada': { 
        color: 'text-red-700', 
        bg: 'bg-red-50', 
        border: 'border-red-200',
        icon: <CloseCircleOutlined className="text-red-600" />,
        label: 'Rechazada'
      }
    };

    const config = statusConfig[estatus] || statusConfig['Pendiente'];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
        {config.icon}
        {config.label}
      </span>
    )
  }

  const columns = [
    {
      title: '#',
      width: 50,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
      render: (text, record, index) => (
        <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-semibold">
          {index + 1}
        </div>
      )
    },
    {
      title: 'NÓMINA',
      width: 80,
      dataIndex: 'nn',
      key: 'nn',
      sorter: (a, b) => a.nn - b.nn,
      render: (text) => (
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold">{text}</span>
        </div>
      )
    },
    {
      title: 'EMPLEADO',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 150,
      render: (text, record) => (
        <div className="leading-tight">
          <span className="text-xs font-medium">{text}</span>
          <br />
          <span className="inline-block bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0.5 rounded mt-0.5">
            {record.area}
          </span>
        </div>
      )
    },
    {
      title: 'PERÍODO',
      key: 'periodo',
      width: 130,
      render: (_, record) => (
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <CalendarOutlined className="text-purple-600 text-[10px]" />
              <span className="text-[11px]">Inicio: {record.fecha_ini}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarOutlined className="text-green-600 text-[10px]" />
              <span className="text-[11px]">Fin: {record.fecha_final}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'INCIDENCIA',
      dataIndex: 'incidencia',
      key: 'incidencia',
      width: 140,
      editable: true,
      render: (text) => {
        const option = incidentOptions.find(opt => opt.value === text)
        return (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-none"
            style={{ backgroundColor: option?.color || '#f0f0f0' }}
          >
            <span>{option?.icon || '📋'}</span>
            <span className="truncate max-w-[100px]">{text}</span>
          </span>
        )
      }
    },
    {
      title: 'HORAS',
      dataIndex: 'hrs_inci',
      key: 'hrs_inci',
      width: 70,
      editable: true,
      render: (text) => (
        <Progress
          type="circle"
          percent={parseFloat(text) * 4.17}
          format={() => `${text}h`}
          size={40}
          strokeColor="#722ed1"
          strokeWidth={8}
        />
      )
    },
    {
      title: 'CLAVE',
      dataIndex: 'clave_inci',
      key: 'clave_inci',
      width: 70,
      editable: true,
      render: (text) => (
        <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
          {text}
        </span>
      )
    },
    {
      title: 'OBSERVACIONES',
      dataIndex: 'observacion',
      key: 'observacion',
      width: 120,
      editable: true,
      render: (text) => (
        <Tooltip title={text || 'Sin observaciones'} placement="topLeft">
          <div className={`max-w-[120px] truncate text-xs p-1 rounded ${text ? 'bg-gray-100' : ''} ${text ? 'text-gray-700' : 'text-gray-400'}`}>
            {text || '-'}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'ACCIONES',
      key: 'operation',
      fixed: 'right',
      width: 75,
      render: (_, record) => {
        const editable = isEditing(record)
        const canEdit = record.estatus === 'Pendiente'
        
        return editable ? (
          <div className="flex gap-1">
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onClick={() => save(record.id)}
              className="bg-green-600 hover:bg-green-700 border-green-600 h-7 rounded-md text-xs"
            >
              Guardar
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={cancel}
              className="h-7 rounded-md"
            />
          </div>
        ) : (
          <Tooltip title={canEdit ? 'Editar incidencia' : 'No se puede editar'}>
            <Button
              type={canEdit ? 'primary' : 'default'}
              size="small"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={!canEdit || editingKey !== ''}
              className={`h-7 rounded-md text-xs ${canEdit ? 'bg-purple-600 hover:bg-purple-700' : 'opacity-50'}`}
            >
              Editar
            </Button>
          </Tooltip>
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

  // Estilos personalizados que no se pueden lograr con Tailwind
  const customStyles = `
    .editable-row {
      background: linear-gradient(90deg, #fff7e6 0%, #fff 100%);
      transition: all 0.3s;
    }
    .editable-row:hover {
      background: linear-gradient(90deg, #ffe7ba 0%, #fff 100%) !important;
      transform: translateX(4px);
    }
    .ant-table-tbody > tr > td {
      transition: all 0.2s;
    }
    .ant-table-tbody > tr:hover > td {
      background: linear-gradient(90deg, #f0f5ff 0%, #fff 100%) !important;
    }
  `;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#722ed1',
          borderRadius: 8,
        },
      }}
    >
      <style>{customStyles}</style>
      
      <div className="bg-white">
        <Form form={form} component={false}>
          <Table
            loading={loading}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={dataSource}
            size="middle"
            scroll={{ x: 1500, y: 'calc(100vh - 120px)' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">
                    {range[0]}-{range[1]} de {total} registros
                  </span>
                </div>
              ),
              pageSizeOptions: ['10', '20', '30', '50'],
              className: "m-0 p-4 border-t border-gray-100"
            }}
            rowClassName={(record) => 
              record.estatus === 'Pendiente' ? 'editable-row' : ''
            }
            locale={{
              emptyText: (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No hay incidencias registradas"
                />
              )
            }}
          />
        </Form>
      </div>
    </ConfigProvider>
  )
}

export default ListEdit