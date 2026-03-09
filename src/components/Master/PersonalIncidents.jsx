import React from 'react'
import { Table, Button, Input, Space, Tag, Card, Typography, Badge, Tooltip } from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { SearchOutlined, FilterOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons'
import { HappyProvider } from '@ant-design/happy-work-theme'

const { Text } = Typography

const renderStatusIcon = (estatus) => {
  switch (estatus) {
    case 'Aceptada':
      return <Badge status="success" text={<Tag color="green" style={{ borderRadius: '20px', padding: '2px 12px' }}>Aceptada</Tag>} />
    case 'Denegado':
      return <Badge status="error" text={<Tag color="red" style={{ borderRadius: '20px', padding: '2px 12px' }}>Denegado</Tag>} />
    case 'Pendiente':
      return <Badge status="warning" text={<Tag color="gold" style={{ borderRadius: '20px', padding: '2px 12px' }}>Pendiente</Tag>} />
    default:
      return null
  }
};

const PersonalIncidents = ({identificador, id_consulta, nomina, username}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = {
          "username": username,
        }
        const url_get = "http://localhost/wl-api/PCShieff.php"
        const resp = await fetch(url_get, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const json = await resp.json()
        if (Array.isArray(json)) {
          setData(json)
        } else if (json.data && Array.isArray(json.data)) {
          setData(json.data)
        } else {
          console.error('La respuesta no es un arreglo válido:', json)
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      } finally {
        setLoading(false)
      }
    };
    fetchData()
  }, [username])

  const dataSource = data.map((jsonres, index) => ({
    key: jsonres.id || index,
    id: jsonres.id,
    nn: jsonres.nn,
    nombre: jsonres.nombre,
    area: jsonres.area,
    fecha_ini: jsonres.fecha_ini,
    fecha_final: jsonres.fecha_final,
    semana: jsonres.semana,
    incidencia: jsonres.incidencia,
    hrs_inci: jsonres.hrs_inci,
    clave_perm: jsonres.clave_perm,
    fecha_pago: jsonres.fecha_pago,
    tipo_inca: jsonres.tipo_inca,
    observacion: jsonres.observacion,
    estatus: jsonres.estatus,
    estatusTag: renderStatusIcon(jsonres.estatus)
  }))

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  }

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: '12px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          minWidth: '220px',
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1f2937' }}>
          Buscar por {title || dataIndex}
        </Text>
        <Input
          ref={searchInput}
          placeholder={`Ingrese texto...`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: '12px',
            borderRadius: '8px',
          }}
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          allowClear
        />
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <HappyProvider>
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  flex: 1,
                  borderRadius: '6px',
                  background: '#4f46e5',
                }}
              >
                Buscar
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                icon={<ReloadOutlined />}
                style={{
                  borderRadius: '6px',
                }}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => close()}
                style={{
                  borderRadius: '6px',
                }}
              />
            </Space>
          </HappyProvider>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? '#4f46e5' : '#9ca3af',
          fontSize: '14px',
        }}
      />
    ),
    onFilter: (value, record) => {
      const fieldValue = record[dataIndex];
      return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#fef3c7',
            padding: '2px 0',
            fontWeight: '500',
            borderRadius: '4px',
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        <span style={{ color: '#1f2937' }}>{text}</span>
      ),
  })

  const columns = [
    {
      title: <Text strong style={{ color: '#4b5563' }}>ID</Text>,
      width: 100,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      ...getColumnSearchProps('id', 'ID'),
      render: (text) => <Tag color="blue" style={{ borderRadius: '12px' }}>{text}</Tag>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>N° Nómina</Text>,
      width: 130,
      dataIndex: 'nn',
      key: 'nn',
      fixed: 'left',
      sorter: (a, b) => a.nn - b.nn,
      ...getColumnSearchProps('nn', 'N° Nómina'),
      render: (text) => <Text copyable={{ text: text }} style={{ fontWeight: '500' }}>{text}</Text>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Nombre</Text>,
      width: 200,
      dataIndex: 'nombre',
      key: '1',
      ...getColumnSearchProps('nombre', 'Nombre'),
      render: (text) => <Text style={{ fontWeight: '500' }}>{text}</Text>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Área</Text>,
      width: 150,
      dataIndex: 'area',
      key: '2',
      ...getColumnSearchProps('area', 'Área'),
      render: (text) => <Tag color="purple" style={{ borderRadius: '12px' }}>{text}</Tag>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Fecha Inicio</Text>,
      width: 130,
      dataIndex: 'fecha_ini',
      key: '3',
      ...getColumnSearchProps('fecha_ini', 'Fecha Inicio'),
      render: (text) => <Badge status="processing" text={text} />,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Fecha Final</Text>,
      width: 130,
      dataIndex: 'fecha_final',
      key: '4',
      ...getColumnSearchProps('fecha_final', 'Fecha Final'),
      render: (text) => <Badge status="default" text={text} />,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Semana</Text>,
      width: 120,
      dataIndex: 'semana',
      key: '5',
      render: (text) => <Tag color="cyan" style={{ borderRadius: '12px' }}>Semana {text}</Tag>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Incidencia</Text>,
      width: 150,
      dataIndex: 'incidencia',
      key: '6',
      ...getColumnSearchProps('incidencia', 'Incidencia'),
      render: (text) => (
        <Tooltip title="Tipo de incidencia">
          <Tag color="orange" style={{ borderRadius: '12px' }}>{text}</Tag>
        </Tooltip>
      ),
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Horas/Día</Text>,
      width: 120,
      dataIndex: 'hrs_inci',
      key: '7',
      render: (text) => <Text strong style={{ color: '#059669' }}>{text} h</Text>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Clave Permiso</Text>,
      width: 140,
      dataIndex: 'clave_perm',
      key: '9',
      render: (text) => <Tag color="geekblue" style={{ borderRadius: '12px' }}>{text || 'N/A'}</Tag>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Fecha Pago</Text>,
      width: 130,
      dataIndex: 'fecha_pago',
      key: '10',
      render: (text) => <Badge status="success" text={text || 'No asignada'} />,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Tipo Incapacidad</Text>,
      width: 150,
      dataIndex: 'tipo_inca',
      key: '11',
      render: (text) => <Tag color="volcano" style={{ borderRadius: '12px' }}>{text || 'N/A'}</Tag>,
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Observaciones</Text>,
      width: 250,
      dataIndex: 'observacion',
      key: '12',
      ...getColumnSearchProps('observacion', 'Observaciones'),
      render: (text) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: '230px', color: '#6b7280' }}>
            {text || 'Sin observaciones'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: <Text strong style={{ color: '#4b5563' }}>Estatus</Text>,
      dataIndex: 'estatusTag',
      fixed: 'right',
      width: 140,
      key: '13',
      filters: [
        { text: 'Aceptada', value: 'Aceptada' },
        { text: 'Denegado', value: 'Denegado' },
        { text: 'Pendiente', value: 'Pendiente' },
      ],
      onFilter: (value, record) => record.estatus === value,
    },
  ]

  return (
    <Card
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        background: '#ffffff',
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Text strong style={{ fontSize: '18px', color: '#111827' }}>
          Incidencias Personales
        </Text>
      </div>
      
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={{
          x: 'max-content',
          y: 'calc(100vh - 300px)',
        }}
        size="middle"
        pagination={{
          defaultPageSize: 9,
          pageSize: 9,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showQuickJumper: true,
          position: ['bottomRight'],
          style: { marginTop: '16px' },
        }}
        rowClassName={(record) => {
          if (record.estatus === 'Pendiente') return 'row-pending'
          if (record.estatus === 'Aceptada') return 'row-accepted'
          if (record.estatus === 'Denegado') return 'row-denied'
          return ''
        }}
        sticky={{
          offsetHeader: 0,
        }}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      />

      <style jsx>{`
        :global(.ant-table-thead > tr > th) {
          background: #f9fafb !important;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb !important;
        }
        
        :global(.ant-table-tbody > tr:hover > td) {
          background: #f3f4f6 !important;
        }
        
        :global(.row-pending) {
          background: #fffbeb !important;
        }
        
        :global(.row-accepted) {
          background: #f0fdf4 !important;
        }
        
        :global(.row-denied) {
          background: #fef2f2 !important;
        }
        
        :global(.ant-table-cell) {
          transition: all 0.2s !important;
        }
        
        :global(.ant-badge-status-text) {
          font-size: 13px;
        }
        
        :global(.ant-tag) {
          transition: all 0.2s;
        }
        
        :global(.ant-tag:hover) {
          transform: scale(1.05);
          cursor: default;
        }
        
        :global(.ant-table-filter-trigger) {
          color: #9ca3af;
        }
        
        :global(.ant-table-filter-trigger.active) {
          color: #4f46e5;
        }
      `}</style>
    </Card>
  );
};

export default PersonalIncidents;