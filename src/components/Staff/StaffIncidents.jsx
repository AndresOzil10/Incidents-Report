import React from 'react'
import { 
  Table, Button, Input, Space, Tag, FloatButton, Modal, DatePicker, Tooltip, Flex,
  Card, Row, Col, Typography, theme, Badge, Avatar, Divider, ConfigProvider
} from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { 
  AppstoreTwoTone, DownCircleTwoTone, HourglassTwoTone, ProfileTwoTone, 
  SearchOutlined, CalendarOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileExcelOutlined,
  UserOutlined, DownloadOutlined, InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import VacationList from '../Supervisor/VacationList'
import BHList from '../Supervisor/BHList'
import AllIncidents from '../Common/AllIncidents'
import InputNN from '../Common/InputNN'
import ListArea from '../Common/ListArea'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Title, Text } = Typography
const { useToken } = theme

const Excel = (value) => {
  const libro = XLSX.utils.book_new()
  const hoja = XLSX.utils.json_to_sheet(value)
  XLSX.utils.book_append_sheet(libro, hoja, 'Incidencias')
  XLSX.writeFile(libro, `Incidencias_${dayjs().format('YYYY-MM-DD')}.xlsx`)
}

const StaffIncidents = ({ identificador, id_consulta, nomina, username }) => {
  const { token } = useToken()
  const url_download = "http://localhost/wl-api/download.php"
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBHOpen, setIsBHOpen] = useState(false)
  const [isDownloadOpen, setIsDownloadOpen] = useState(false)
  const [dateRange, setDateRange] = useState(null)
  const [allIncident, setAllIncident] = useState('-')
  const [nn, setNN] = useState('-')
  const [listArea, setListArea] = useState('-')
  const [stats, setStats] = useState({
    total: 0,
    aceptadas: 0,
    pendientes: 0,
    denegadas: 0
  })
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5) // Reducido a 5 registros
  const searchInput = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = {
          "nomina": nomina,
          "id_consulta": id_consulta
        }
        const url_get = "http://localhost/wl-api/StaffConsult.php"
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
  }, [nomina, id_consulta])

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
          <Badge 
            status="success" 
            text={
              <Tag 
                color="success" 
                icon={<CheckCircleOutlined />} 
                style={style}
              >
                Aceptada
              </Tag>
            } 
          />
        )
      case 'Denegado':
        return (
          <Badge 
            status="error" 
            text={
              <Tag 
                color="error" 
                icon={<CloseCircleOutlined />} 
                style={style}
              >
                Denegado
              </Tag>
            } 
          />
        )
      case 'Pendiente':
        return (
          <Badge 
            status="warning" 
            text={
              <Tag 
                color="warning" 
                icon={<ClockCircleOutlined />} 
                style={style}
              >
                Pendiente
              </Tag>
            } 
          />
        )
      default:
        return null
    }
  }

  const columns = [
    {
      title: 'ID',
      width: 60,
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      ...getColumnSearchProps('id'),
      render: (text) => (
        <Badge 
          count={text} 
          style={{ 
            backgroundColor: token.colorPrimary,
            fontSize: '10px',
            boxShadow: 'none'
          }} 
        />
      )
    },
    {
      title: 'N.Nomina',
      width: 80,
      dataIndex: 'nn',
      key: 'nn',
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
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 120,
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
      title: 'Área',
      dataIndex: 'area',
      key: 'area',
      width: 80,
      filters: [...new Set(data.map(item => item.area))].map(area => ({
        text: area,
        value: area,
      })),
      onFilter: (value, record) => record.area === value,
      render: (text) => (
        <Tag 
          color="geekblue" 
          style={{ 
            margin: 0,
            fontSize: '11px'
          }}
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Inicio',
      dataIndex: 'fecha_ini',
      key: 'fecha_ini',
      width: 85,
      ...getColumnSearchProps('fecha_ini'),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CalendarOutlined style={{ fontSize: '10px', color: token.colorPrimary }} />
          <Text style={{ fontSize: '11px' }}>{text}</Text>
        </div>
      )
    },
    {
      title: 'Fin',
      dataIndex: 'fecha_final',
      key: 'fecha_final',
      width: 85,
      ...getColumnSearchProps('fecha_final'),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CalendarOutlined style={{ fontSize: '10px', color: token.colorPrimary }} />
          <Text style={{ fontSize: '11px' }}>{text}</Text>
        </div>
      )
    },
    {
      title: 'Incidencia',
      dataIndex: 'incidencia',
      key: 'incidencia',
      width: 150,
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
        <div style={{ 
          background: token.colorPrimaryBg,
          borderRadius: '4px',
          padding: '2px 6px',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '11px', fontWeight: 500 }}>{text}h</Text>
        </div>
      )
    },
    {
      title: 'Estatus',
      dataIndex: 'estatus',
      key: 'estatus',
      width: 90,
      filters: [
        { text: 'Aceptada', value: 'Aceptada' },
        { text: 'Pendiente', value: 'Pendiente' },
        { text: 'Denegado', value: 'Denegado' }
      ],
      onFilter: (value, record) => record.estatus === value,
      render: renderStatusIcon
    }
  ]

  const dataSource = data.map((item) => ({
    key: item.id,
    ...item
  }))

  const handleDownload = async () => {
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
    
    const downloadData = {
      "fecha_ini": startDate,
      "fecha_fin": endDate,
      "incidencia": allIncident,
      "nn": nn,
      "area": listArea,
    }

    try {
      const resp = await fetch(url_download, {
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
    }
  }

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
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
      }}>
        {/* Stats cards compactas - Sin título */}
        <div style={{ 
          padding: '12px 16px 0 16px',
          background: 'transparent'
        }}>
          <Row gutter={[8, 8]} style={{ margin: 0 }}>
            <Col span={6}>
              <Card size="small" style={{ 
                background: '#f0f9ff', 
                border: 'none',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)'
              }}>
                <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
                  <FileTextOutlined style={{ color: token.colorPrimary }} />
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}>Total</Text>
                    <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
                      {stats.total}
                    </Title>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ 
                background: '#f6ffed', 
                border: 'none',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)'
              }}>
                <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}>Aceptadas</Text>
                    <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                      {stats.aceptadas}
                    </Title>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ 
                background: '#fffbe6', 
                border: 'none',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)'
              }}>
                <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
                  <ClockCircleOutlined style={{ color: '#faad14' }} />
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}>Pendientes</Text>
                    <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                      {stats.pendientes}
                    </Title>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ 
                background: '#fff2f0', 
                border: 'none',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)'
              }}>
                <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}>Denegadas</Text>
                    <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                      {stats.denegadas}
                    </Title>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Table Container */}
        <div style={{ 
          flex: 1,
          overflow: 'hidden',
          padding: '12px 16px'
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
            {/* Table header compacto */}
            <div style={{ 
              padding: '8px 16px',
              background: '#fafafa',
              borderBottom: '1px solid #f0f0f0',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {dataSource.length} registros encontrados
                </Text>
              </Space>
              <Space>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  Página {currentPage} de {Math.ceil(dataSource.length / pageSize)}
                </Text>
              </Space>
            </div>

            {/* Table optimizada sin scroll horizontal */}
            <div style={{ 
              flex: 1,
              overflow: 'auto'
            }}>
              <Table
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                size="small"
                scroll={{ x: '100%' }}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: dataSource.length,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {range[0]}-{range[1]} de {total}
                    </Text>
                  ),
                  pageSizeOptions: ['5', '10', '20', '30'], // 5 como primera opción
                  onChange: (page, size) => {
                    setCurrentPage(page)
                    setPageSize(size)
                  },
                  style: { 
                    margin: 0,
                    padding: '12px 16px',
                    borderTop: '1px solid #f0f0f0',
                    position: 'sticky',
                    bottom: 0,
                    background: '#fff'
                  }
                }}
                style={{ 
                  height: '100%',
                  border: 'none',
                  minWidth: '100%'
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

        {/* Botones flotantes para supervisor */}
        {id_consulta == 9 && (
          <FloatButton.Group
            trigger="hover"
            type="primary"
            shape="circle"
            style={{ right: 24, bottom: 24 }}
            icon={<AppstoreTwoTone twoToneColor={token.colorPrimary} />}
          >
            <FloatButton 
              icon={<ProfileTwoTone twoToneColor="#52c41a" />} 
              tooltip={<div style={{ fontSize: '12px' }}>Vacaciones</div>} 
              onClick={() => setIsModalOpen(true)}
            />
            
            <FloatButton 
              icon={<HourglassTwoTone twoToneColor="#faad14" />} 
              tooltip={<div style={{ fontSize: '12px' }}>Banco de Horas</div>} 
              onClick={() => setIsBHOpen(true)}
            />
            
            <FloatButton 
              icon={<DownCircleTwoTone />} 
              tooltip="Exportar Excel"
              onClick={() => setIsDownloadOpen(true)}
            />
          </FloatButton.Group>
        )}

        {/* Modal Vacaciones */}
        <Modal
          title={
            <Space>
              <ProfileTwoTone twoToneColor="#52c41a" />
              <Text strong style={{ fontSize: '16px' }}>Gestión de Vacaciones</Text>
            </Space>
          }
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          width={1000}
          footer={null}
        >
          <VacationList id_consulta={id_consulta} />
        </Modal>

        {/* Modal Banco de Horas */}
        <Modal
          title={
            <Space>
              <HourglassTwoTone twoToneColor="#faad14" />
              <Text strong style={{ fontSize: '16px' }}>Banco de Horas</Text>
            </Space>
          }
          open={isBHOpen}
          onOk={() => setIsBHOpen(false)}
          onCancel={() => setIsBHOpen(false)}
          width={1000}
          footer={null}
        >
          <BHList id_consulta={id_consulta} />
        </Modal>

        {/* Modal Descarga */}
        <Modal
          title={
            <Space>
              <FileExcelOutlined style={{ color: '#52c41a' }} />
              <Text strong style={{ fontSize: '16px' }}>Exportar Incidencias</Text>
            </Space>
          }
          open={isDownloadOpen}
          onOk={handleDownload}
          onCancel={() => setIsDownloadOpen(false)}
          width={400}
          okText="Descargar"
          cancelText="Cancelar"
          okButtonProps={{
            icon: <DownloadOutlined />,
            type: 'primary',
            style: { background: '#52c41a' }
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
            
            <div>
              <Text strong style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                Área
              </Text>
              <ListArea lista={setListArea} />
            </div>
            
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

export default StaffIncidents