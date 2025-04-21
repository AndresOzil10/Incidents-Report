import React from 'react'
import { Table, Button, Input, Space, Tag, FloatButton, Modal, DatePicker, Tooltip, Flex} from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import {  AppstoreTwoTone, DownCircleTwoTone, HourglassTwoTone, ProfileTwoTone, QuestionCircleTwoTone, SearchOutlined} from '@ant-design/icons'
import VacationList from '../Supervisor/VacationList'
import BHList from '../Supervisor/BHList'
import AllIncidents from '../Common/AllIncidents'
import InputNN from '../Common/InputNN'
import ListArea from '../Common/ListArea'
import * as XLSX from 'xlsx';
import { HappyProvider } from '@ant-design/happy-work-theme'

const { RangePicker } = DatePicker;

const enviarData = async (url, data) => {
  const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type' : 'application/json'
      }
  })
  const json = await resp.json()

  return  json
}

const renderStatusIcon = (estatus) => {
  switch (estatus) {
    case 'Aceptada':
      return <Tag color="green">Aceptada</Tag>
    case 'Denegado':
      return <Tag color="red">Denegado</Tag>
    case 'Pendiente':
      return <Tag color="gold">Pendiente</Tag>
    default:
      return null
  }
}

const Excel = (value) => {
  const libro = XLSX.utils.book_new()
  const hoja = XLSX.utils.json_to_sheet(value)
  XLSX.utils.book_append_sheet(libro, hoja, 'Hoja1')
  XLSX.writeFile(libro, "Incidencias.xlsx")
}

const StaffIncidents = ({identificador, id_consulta, nomina, username}) => {
  // const url_download = "http://10.144.13.5/wl-api/download.php"
  const url_download = "http://10.144.13.5/wl-api/download.php"
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBHOpen, setIsBHOpen] = useState(false)
  const [isDowload, setIsDowload] = useState(false)
  const [dateRange, setDateRange] = useState(null)
  const [allIncident, setAllIncident] = useState('-')
  const [nn, setNN] = useState('-')
  const [listArea, setListArea] = useState('-')
  const [dataDowload, setDataDownload] = useState([])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const show = () => {
    setIsBHOpen(true)
  }

  const Ok = () => {
    setIsBHOpen(false);
  }

  const Cancel = () => {
    setIsBHOpen(false);
  }

  const muestra = () => {
    setIsDowload(true)
  }

  const Okey = async () => {
    const startDate = (dateRange[0]).format('YYYY/MM/DD')
    const endDate = (dateRange[1]).format('YYYY/MM/DD')
    //console.log(startDate, endDate, allIncident, nn, listArea)
    const data = {
      "fecha_ini": startDate,
      "fecha_fin": endDate,
      "incidencia": allIncident,
      "nn": nn,
      "area":  listArea,
    }
    console.log(data)
    const resp = await fetch(url_download, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json'
      }
    });
    const json = await resp.json()
    const dataDownload = json.data
    if (Array.isArray(json)) {
      setDataDownload(json)
    } else if (json.data && Array.isArray(json.data)) {
      setDataDownload(json.data)
    } else {
        console.error('La respuesta no es un arreglo válido:', json)
    }
    console.log(dataDownload.length)
    //setIsDowload(false);
    Excel(dataDownload)
  }

  const Cancelar = () => {
    setIsDowload(false);
  }

  const handleDateChange = (dates) => {
    setDateRange(dates)
  }

  const incident = (value) => {
    setAllIncident(value)
  }

  const numero = (value => {
    setNN(value)
  })

  const lista = (value => {
    setListArea(value)
  })

  //console.log(username)
   useEffect(() => {
    const fetchData = async () => {
        try {
            const data = {
              "nomina": nomina,
              "id_consulta": id_consulta
            }
            //console.log(data)
            const url_get = "http://10.144.13.5/wl-api/StaffConsult.php"
            //const url_get = "http://10.144.13.5/wl-api/StaffConsult.php"
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
        }
    };
    fetchData()
  }, [])

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
    hrs_inci: jsonres.hrs_inci,
    clave_inci: jsonres.clave_inci,
    clave_perm: jsonres.clave_perm,
    nn_cubre: jsonres.nn_cubre,
    nombre_cubre: jsonres.nombre_cubre,
    fecha_captura: jsonres.fecha_captura,
    tipo_inca: jsonres.tipo_inca,
    observacion: jsonres.observacion,
    estatus: renderStatusIcon(jsonres.estatus)
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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
        <HappyProvider>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
          </HappyProvider>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      //console.log('record:', record);
      //console.log('dataIndex:', dataIndex);
      const fieldValue = record[dataIndex];
      //console.log('fieldValue:', fieldValue);
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
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columns = [
    {
      title: 'id',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'N.Nomina',
      width: 100,
      dataIndex: 'nn',
      key: 'nn',
      fixed: 'left',
      sorter: true,
      ...getColumnSearchProps('nn'),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: '1',
      ...getColumnSearchProps('nombre'),
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: '2',
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_ini',
      key: '3',
      ...getColumnSearchProps('fecha_ini'),
    },
    {
      title: 'Fecha Final',
      dataIndex: 'fecha_final',
      key: '4',
      ...getColumnSearchProps('fecha_final'),
    },
    {
      title: 'Semana',
      dataIndex: 'semana',
      key: '5',
    },
    {
      title: 'Incidencia',
      dataIndex: 'incidencia',
      key: '6',
      ...getColumnSearchProps('incidencia'),
    },
    {
      title: 'Hrs/Dia Incidencia',
      dataIndex: 'hrs_inci',
      key: '7',
    },
    {
      title: 'Clave Incidencia',
      dataIndex: 'clave_inci',
      key: '8',
    },
    {
      title: 'Clave Permiso',
      dataIndex: 'clave_perm',
      key: '9',
    },
    {
      title: 'Fecha Captura',
      dataIndex: 'fecha_captura',
      key: '10',
    },
    {
      title: 'Tipo Incapacidad',
      dataIndex: 'tipo_inca',
      key: '11',
    },
    {
      title: 'Observaciones',
      dataIndex: 'observacion',
      key: '12',
    },
    {
      title: 'Estatus',
      dataIndex: 'estatus',
      fixed: 'right',
      width: 50,
      key: '13',
    },
    /*{
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>,
    },*/
  ]

  const text = <span>Llena los campos de acuerdo en la forma que se desee descargar las incidencias</span>

  return (
    <>
      <Table
      className='table-auto ml-[-100px]'
      pagination={true}
      columns={columns}
      dataSource={dataSource}
      scroll={{
        x: 'max-content',
      }}
      size='small'
      />
      
    {
      id_consulta == 9 ? (
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{
            insetInlineEnd: 94,
          }}
          icon={<AppstoreTwoTone />}
        >
          <FloatButton icon={<ProfileTwoTone />} tooltip={<div>Vacations</div>} onClick={showModal}/>
          <Modal title="Vacaciones" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000}>
              <VacationList id_consulta={id_consulta}/>
          </Modal>
          <FloatButton icon={<HourglassTwoTone />} tooltip={<div>BH</div>} onClick={show}/>
          <Modal title="Banco de Horas" open={isBHOpen} onOk={Ok} onCancel={Cancel} width={1000}>
              <BHList id_consulta={id_consulta}/>
          </Modal>
          <FloatButton icon={<DownCircleTwoTone />} tooltip={<div>Dowload Incidents</div>} onClick={muestra}/>
          <Modal title="Download Incidents" open={isDowload} onOk={Okey} onCancel={Cancelar} width={300}>
              <Flex
                justify="right"
                align="right"
                style={{
                  whiteSpace: 'nowrap',
                }}
                className='mb-1'
              > 
              <Tooltip placement="topRight" title={text}>
                <QuestionCircleTwoTone />
              </Tooltip>
            </Flex>
            <RangePicker onChange={handleDateChange}/>
            <AllIncidents incident={incident}/>
            <InputNN numero={numero} />
            <ListArea lista={lista} />
          </Modal>
        </FloatButton.Group>
      ) :
      null
    } 

    </>
    
    
  )
};
export default StaffIncidents