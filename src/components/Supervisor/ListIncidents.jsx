import React from 'react'
import { 
  Table, Button, Input, Space, Tag, FloatButton, Modal, Flex, Tooltip, DatePicker,
  Card, Row, Col, Typography, Badge, Avatar, Divider, ConfigProvider, theme,
  Statistic, Progress, Alert
} from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { 
  CheckCircleTwoTone, CloseCircleTwoTone, DownCircleTwoTone, InfoCircleTwoTone, 
  QuestionCircleTwoTone, SearchOutlined, CalendarOutlined, TeamOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DownloadOutlined,
  UserOutlined, FilterOutlined, FileExcelOutlined, FileTextOutlined,
  ArrowUpOutlined, ArrowDownOutlined, EyeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import InputNN from '../Common/InputNN'
import AllIncidents from '../Common/AllIncidents'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Title, Text } = Typography
const { useToken } = theme

const renderStatusIcon = (estatus) => {
  const style = { 
    borderRadius: '4px', 
    fontWeight: 600, 
    padding: '2px 8px', 
    fontSize: '11px',
    margin: 0
  }
  
  switch (estatus) {
    case 'Aceptada':
      return (
        <Badge status="success" text={
          <Tag color="success" icon={<CheckCircleOutlined />} style={style}>
            Aceptada
          </Tag>
        } />
      )
    case 'Denegado':
      return (
        <Badge status="error" text={
          <Tag color="error" icon={<CloseCircleOutlined />} style={style}>
            Denegado
          </Tag>
        } />
      )
    case 'Pendiente':
      return (
        <Badge status="warning" text={
          <Tag color="warning" icon={<ClockCircleOutlined />} style={style}>
            Pendiente
          </Tag>
        } />
      )
    default:
      return null
  }
}

const Excel = (value) => {
  const libro = XLSX.utils.book_new()
  const hoja = XLSX.utils.json_to_sheet(value)
  XLSX.utils.book_append_sheet(libro, hoja, 'Incidencias')
  XLSX.writeFile(libro, `Incidencias_${dayjs().format('YYYY-MM-DD')}.xlsx`)
}

const ListIncidents = ({ identificador, id_consulta, nomina, username }) => {
  const { token } = useToken()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState(null)
  const [allIncident, setAllIncident] = useState('-')
  const [nn, setNN] = useState('-')
  const [isDownloadOpen, setIsDownloadOpen] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    aceptadas: 0,
    pendientes: 0,
    denegadas: 0
  })
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const searchInput = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = {
          "id_consulta": id_consulta,
          "user": username,
        }
        
        const url_get = "http://localhost/wl-api/PersonalConsult.php"
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
        
        const aceptadas = dataArray.filter(item => item.estatus === 'Aceptada').length
        const pendientes = dataArray.filter(item => item.estatus === 'Pendiente').length
        const denegadas = dataArray.filter(item => item.estatus === 'Denegado').length
        
        setStats({
          total: dataArray.length,
          aceptadas,
          pendientes,
          denegadas
        })
      } catch (error) {
        console.error('Error al obtener los datos:', error)
        Modal.error({
          title: 'Error de conexión',
          content: 'No se pudieron cargar los datos. Verifica tu conexión.',
          okText: 'Reintentar',
          onOk: () => window.location.reload()
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id_consulta, username])

  const handleDownload = async (type) => {
    if (!dateRange || dateRange.length !== 2) {
      Modal.warning({
        title: 'Fechas requeridas',
        content: 'Por favor selecciona un rango de fechas',
        okText: 'Entendido'
      })
      return
    }

    const startDate = dateRange[0].format('YYYY/MM/DD')
    const endDate = dateRange[1].format('YYYY/MM/DD')
    
    setExportLoading(true)
    try {
      let url, downloadData
      
      if (type === 'personal' || (identificador == 2 || identificador == 4)) {
        downloadData = {
          "id_consulta": id_consulta,
          "fecha_ini": startDate,
          "fecha_fin": endDate,
          "incidencia": allIncident,
          "nn": nn,
        }
        url = "http://localhost/wl-api/downloadP.php"
      } else {
        downloadData = {
          "username": username,
          "fecha_ini": startDate,
          "fecha_fin": endDate,
        }
        url = "http://localhost/wl-api/downloadS.php"
      }

      const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(downloadData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const json = await resp.json()
      let downloadDataArray = []
      
      if (Array.isArray(json)) {
        downloadDataArray = json
      } else if (json.data && Array.isArray(json.data)) {
        downloadDataArray = json.data
      }

      Excel(downloadDataArray)
      
      Modal.success({
        title: '✅ Descarga exitosa',
        content: `Se han exportado ${downloadDataArray.length} registros en formato Excel`,
        okText: 'Aceptar'
      })
      
      setIsDownloadOpen(false)
    } catch (error) {
      console.error('Error al descargar:', error)
      Modal.error({
        title: '❌ Error',
        content: 'Error al procesar la solicitud de descarga',
        okText: 'Entendido'
      })
    } finally {
      setExportLoading(false)
    }
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <Card 
        size="small" 
        style={{ 
          padding: '8px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        bodyStyle={{ padding: '0' }}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar en ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: '8px' }}
          prefix={<SearchOutlined style={{ color: token.colorPrimary }} />}
          size="small"
        />
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            type="link"
            size="small"
            onClick={() => clearFilters && handleReset(clearFilters)}
          >
            Limpiar
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            Buscar
          </Button>
        </Space>
      </Card>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ 
        color: filtered ? token.colorPrimary : '#8c8c8c',
        fontSize: '12px'
      }} />
    ),
    onFilter: (value, record) => {
      const fieldValue = record[dataIndex]
      return fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: token.colorWarningBg,
            padding: '0 2px',
            borderRadius: '2px'
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        <Text style={{ fontSize: '12px' }}>{text}</Text>
      ),
  })

  const dataSource = data.map((item) => ({
    key: item.id,
    ...item
  }))

  const columns = [
    {
      title: 'ID',
      width: 60,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
      ...getColumnSearchProps('id'),
      render: (text) => (
        <div style={{ 
          background: token.colorPrimaryBg,
          color: token.colorPrimary,
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: '11px',
          textAlign: 'center',
          display: 'inline-block',
          minWidth: '40px'
        }}>
          {text}
        </div>
      )
    },
    {
      title: 'N.Nomina',
      width: 90,
      dataIndex: 'nn',
      key: 'nn',
      fixed: 'left',
      sorter: (a, b) => a.nn - b.nn,
      ...getColumnSearchProps('nn'),
      render: (text) => (
        <Tag 
          color="blue" 
          style={{ 
            margin: 0,
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '11px'
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
      width: 130,
      ...getColumnSearchProps('nombre'),
      render: (text) => (
        <Space size="small" align="center">
          <Avatar 
            size="small" 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: token.colorPrimary,
              fontSize: '10px'
            }}
          />
          <Text style={{ fontSize: '12px' }}>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Área/Turno',
      key: 'area_turno',
      width: 100,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tag color="geekblue" style={{ margin: 0, fontSize: '11px' }}>
            {record.area}
          </Tag>
          <Text type="secondary" style={{ fontSize: '10px' }}>{record.turno}</Text>
        </Space>
      )
    },
    {
      title: 'Período',
      key: 'periodo',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space size="small">
            <CalendarOutlined style={{ fontSize: '11px', color: token.colorPrimary }} />
            <Text style={{ fontSize: '11px' }}>{record.fecha_ini}</Text>
          </Space>
          <Space size="small">
            <CalendarOutlined style={{ fontSize: '11px', color: token.colorPrimary }} />
            <Text style={{ fontSize: '11px' }}>{record.fecha_final}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'Semana',
      dataIndex: 'semana',
      key: 'semana',
      width: 70,
      render: (text) => (
        <Tag 
          color="purple" 
          style={{ 
            margin: 0,
            fontSize: '10px',
            fontWeight: 500
          }}
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Incidencia',
      dataIndex: 'incidencia',
      key: 'incidencia',
      width: 140,
      ...getColumnSearchProps('incidencia'),
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: '11px' }}>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Horas',
      dataIndex: 'hrs_inci',
      key: 'hrs_inci',
      width: 70,
      sorter: (a, b) => a.hrs_inci - b.hrs_inci,
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ 
            flex: 1,
            height: '4px',
            background: '#f0f0f0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div 
              style={{ 
                width: `${(text / 24) * 100}%`,
                height: '100%',
                background: token.colorPrimary,
                borderRadius: '2px'
              }} 
            />
          </div>
          <Text style={{ fontSize: '11px', fontWeight: 500, minWidth: '20px' }}>{text}h</Text>
        </div>
      )
    },
    {
      title: 'Clave',
      dataIndex: 'clave_inci',
      key: 'clave_inci',
      width: 70,
      render: (text) => (
        <Tag 
          color="orange" 
          style={{ 
            margin: 0,
            fontSize: '10px',
            fontWeight: 500
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
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text || 'Sin observaciones'}>
          <Text style={{ fontSize: '11px' }}>{text || '-'}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Estatus',
      dataIndex: 'estatus',
      key: 'estatus',
      fixed: 'right',
      width: 100,
      filters: [
        { text: 'Aceptada', value: 'Aceptada' },
        { text: 'Pendiente', value: 'Pendiente' },
        { text: 'Denegado', value: 'Denegado' }
      ],
      onFilter: (value, record) => record.estatus === value,
      render: renderStatusIcon
    }
  ]

  const downloadTooltipText = (
    <div>
      <Text strong>Filtros de descarga:</Text>
      <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
        <li>Selecciona un rango de fechas</li>
        <li>Filtra por tipo de incidencia</li>
        <li>Filtra por número de nómina</li>
      </ul>
    </div>
  )

  const canExportPersonal = identificador == 2 || identificador == 4
  const canExportSpecial = username === 'mx-ocalderon' || username === 'mx-pvelazquez'

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Table: {
            headerBg: '#fafafa',
            headerColor: '#262626',
            borderColor: '#f0f0f0',
            cellPaddingBlock: 8,
            cellPaddingInline: 12,
          },
        },
      }}
    >
      <div style={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
      }}>
        {/* Table Container */}
        <div style={{ 
          flex: 1,
          overflow: 'hidden',
          padding: '16px',
          paddingBottom: '0'
        }}>
          <Card
            style={{
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column'
            }}
            bodyStyle={{ 
              padding: 0,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Table header */}
            <div style={{ 
              padding: '12px 16px',
              background: '#fafafa',
              borderBottom: '1px solid #f0f0f0',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <FilterOutlined style={{ color: token.colorTextSecondary }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {dataSource.length} incidencias encontradas
                    </Text>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Página {currentPage} de {Math.ceil(dataSource.length / pageSize)}
                    </Text>
                    {(canExportPersonal || canExportSpecial) && (
                      <Button 
                        icon={<DownloadOutlined />}
                        onClick={() => setIsDownloadOpen(true)}
                        size="small"
                        type="primary"
                      >
                        Exportar
                      </Button>
                    )}
                  </Space>
                </Col>
              </Row>
            </div>

            {/* Table */}
            <div style={{ 
              flex: 1,
              overflow: 'hidden'
            }}>
              <Table
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                size="middle"
                scroll={{ x: 1300 }}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: dataSource.length, // Esto es crucial para que se muestre la paginación
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`,
                  pageSizeOptions: ['10', '20', '30', '50'],
                  onChange: (page, size) => {
                    setCurrentPage(page)
                    setPageSize(size || pageSize)
                  },
                  style: { 
                    margin: 0,
                    padding: '12px 16px',
                    borderTop: '1px solid #f0f0f0'
                  }
                }}
                style={{ 
                  height: '100%',
                  border: 'none'
                }}
                onRow={(record) => ({
                  onClick: () => {
                    Modal.info({
                      title: `Detalle Incidencia #${record.id}`,
                      width: 600,
                      content: (
                        <div style={{ marginTop: '16px' }}>
                          <Row gutter={[16, 8]}>
                            <Col span={12}>
                              <Text strong>Empleado: </Text>
                              <Text>{record.nombre} (NN: {record.nn})</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Área/Turno: </Text>
                              <Text>{record.area} • {record.turno}</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Período: </Text>
                              <Text>{record.fecha_ini} al {record.fecha_final}</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Semana: </Text>
                              <Text>{record.semana}</Text>
                            </Col>
                            <Col span={24}>
                              <Divider />
                              <Text strong>Incidencia: </Text>
                              <Text>{record.incidencia}</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Horas/Día: </Text>
                              <Text>{record.hrs_inci}h</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Clave: </Text>
                              <Tag>{record.clave_inci}</Tag>
                            </Col>
                            <Col span={12}>
                              <Text strong>Clave Permiso: </Text>
                              <Text>{record.clave_perm || '-'}</Text>
                            </Col>
                            <Col span={12}>
                              <Text strong>Fecha Pago: </Text>
                              <Text>{record.fecha_pago || '-'}</Text>
                            </Col>
                            {record.observacion && (
                              <Col span={24}>
                                <Text strong>Observaciones: </Text>
                                <Text>{record.observacion}</Text>
                              </Col>
                            )}
                          </Row>
                        </div>
                      ),
                      okText: 'Cerrar'
                    })
                  },
                  style: { 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.backgroundColor = token.colorPrimaryBg
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                })}
              />
            </div>
          </Card>
        </div>

        {/* Float Button para exportar */}
        {(canExportPersonal || canExportSpecial) && (
          <FloatButton
            type="primary"
            shape="circle"
            style={{ right: 40, bottom: 40 }}
            icon={<DownCircleTwoTone />}
            tooltip="Exportar Excel"
            onClick={() => setIsDownloadOpen(true)}
          />
        )}

        {/* Modal Descarga */}
        <Modal
          title={
            <Space>
              <FileExcelOutlined style={{ color: '#52c41a' }} />
              <Text strong style={{ fontSize: '16px' }}>Exportar Incidencias</Text>
            </Space>
          }
          open={isDownloadOpen}
          onOk={() => canExportPersonal ? handleDownload('personal') : handleDownload('special')}
          onCancel={() => setIsDownloadOpen(false)}
          width={400}
          okText="Descargar"
          cancelText="Cancelar"
          okButtonProps={{
            icon: exportLoading ? <ClockCircleOutlined spin /> : <DownloadOutlined />,
            type: 'primary',
            style: { background: '#52c41a' },
            loading: exportLoading
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card 
              size="small" 
              type="inner"
              style={{ background: token.colorPrimaryBg, border: 'none' }}
            >
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text strong style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <InfoCircleOutlined /> Instrucciones
                </Text>
                <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                  Selecciona los filtros deseados para exportar las incidencias a Excel
                </Text>
              </Space>
            </Card>
            
            <div>
              <Text strong style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                Rango de Fechas *
              </Text>
              <RangePicker 
                onChange={setDateRange}
                style={{ width: '100%' }}
                size="middle"
                placeholder={['Fecha inicio', 'Fecha fin']}
              />
            </div>
            
            {canExportPersonal && (
              <>
                <div>
                  <Text strong style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                    Tipo de Incidencia
                  </Text>
                  <AllIncidents incident={setAllIncident} />
                </div>
                
                <div>
                  <Text strong style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                    Número de Nómina
                  </Text>
                  <InputNN numero={setNN} />
                </div>
              </>
            )}
            
            {canExportSpecial && (
              <Alert
                message="Exportación especial"
                description="Se exportarán todas las incidencias del rango de fechas seleccionado"
                type="info"
                showIcon
                size="small"
              />
            )}
            
            {dateRange && (
              <Card 
                size="small" 
                style={{ 
                  background: token.colorSuccessBg,
                  borderColor: token.colorSuccessBorder
                }}
              >
                <Text type="success" style={{ fontSize: '12px' }}>
                  ✓ Se exportarán incidencias del {dateRange[0].format('DD/MM/YYYY')} al {dateRange[1].format('DD/MM/YYYY')}
                </Text>
              </Card>
            )}
          </Space>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default ListIncidents