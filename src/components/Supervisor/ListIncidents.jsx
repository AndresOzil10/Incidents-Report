import React from 'react'
import { Table, Button, Input, Space, Tag, FloatButton, Modal, Flex, Tooltip, DatePicker} from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { CheckCircleTwoTone, CloseCircleTwoTone,  DownCircleTwoTone,  InfoCircleTwoTone, QuestionCircleTwoTone, SearchOutlined} from '@ant-design/icons'
import InputNN from '../Common/InputNN'
import AllIncidents from '../Common/AllIncidents'
const { RangePicker } = DatePicker;
import * as XLSX from 'xlsx';
import { HappyProvider } from '@ant-design/happy-work-theme'

const renderStatusIcon = (estatus) => {
  switch (estatus) {
    case 'Aceptada':
      return <Tag color="green">Aceptada</Tag>
    case 'Denegado':
      return <Tag color="red">Denegado</Tag>
    case 'Pendiente':
      return <Tag color="gold">Pendiente</Tag>
    default:
      return null;
  }
}

const Excel = (value) => {
  const libro = XLSX.utils.book_new()
  const hoja = XLSX.utils.json_to_sheet(value)
  XLSX.utils.book_append_sheet(libro, hoja, 'Hoja1')
  XLSX.writeFile(libro, "Incidencias.xlsx")
}

const ListIncidents = ({identificador, id_consulta, nomina, username}) => {
  const [data, setData] = useState([])
  const [dateRange, setDateRange] = useState(null)
  const [allIncident, setAllIncident] = useState('-')
  const [nn, setNN] = useState('-')
  const [dataDowload, setDataDownload] = useState([])
  const [isDowload, setIsDowload] = useState(false)

  //console.log(id_consulta)

  const handleDateChange = (dates) => {
    setDateRange(dates)
  }

  const Okey = async () => {
    const startDate = (dateRange[0]).format('YYYY/MM/DD')
    const endDate = (dateRange[1]).format('YYYY/MM/DD')
    //console.log(startDate, endDate, allIncident, nn, listArea)
    const data = {
      "id_consulta": id_consulta,
      "fecha_ini": startDate,
      "fecha_fin": endDate,
      "incidencia": allIncident,
      "nn": nn,
    }
    const resp = await fetch("http://10.144.13.5/wl-api/downloadP.php", {
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
    //console.log(dataDownload.length)
    //setIsDowload(false);
    Excel(dataDownload)
  }

  const Okas = async () => {
    const startDate = (dateRange[0]).format('YYYY/MM/DD')
    const endDate = (dateRange[1]).format('YYYY/MM/DD')
    //console.log(startDate, endDate, allIncident, nn, listArea)
    const data = {
      "username": username,
      "fecha_ini": startDate,
      "fecha_fin": endDate,
    }
    const resp = await fetch("http://10.144.13.5/wl-api/downloadS.php", {
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
    //console.log(dataDownload.length)
    //setIsDowload(false);
    Excel(dataDownload)
  }

  const Cancelar = () => {
    setIsDowload(false);
  }


  const incident = (value) => {
    setAllIncident(value)
  }

  const numero = (value => {
    setNN(value)
  })


  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = {
              "id_consulta": id_consulta,
              "user": username,
            }
            console.log(data)
            const url_get = "http://10.144.13.5/wl-api/PersonalConsult.php"
            //const url_get = "http://10.144.13.5/wl-api/PersonalConsult.php"
            const resp = await fetch(url_get, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await resp.json()
            //console.log(json)
            if (Array.isArray(json)) {
                setData(json);
            } else if (json.data && Array.isArray(json.data)) {
                setData(json.data);
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
    fecha_pago: jsonres.fecha_pago,
    tipo_inca: jsonres.tipo_inca,
    observacion: jsonres.observacion,
    estatus: renderStatusIcon(jsonres.estatus)
  }))

  const muestra = () => {
    setIsDowload(true)
  }

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
      title: 'Turno',
      dataIndex: 'turno',
      key: '3',
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_ini',
      key: '4',
      ...getColumnSearchProps('fecha_ini'),
    },
    {
      title: 'Fecha Final',
      dataIndex: 'fecha_final',
      key: '5',
      ...getColumnSearchProps('fecha_final'),
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
      ...getColumnSearchProps('incidencia'),
    },
    {
      title: 'Hrs/Dia Incidencia',
      dataIndex: 'hrs_inci',
      key: '8',
    },
    {
      title: 'Clave Incidencia',
      dataIndex: 'clave_inci',
      key: '9',
    },
    {
      title: 'Clave Permiso',
      dataIndex: 'clave_perm',
      key: '10',
    },
    {
      title: 'Nomina Cubre',
      dataIndex: 'nn_cubre',
      key: '11',
    },
    {
      title: 'Nombre Cubre',
      dataIndex: 'nombre_cubre',
      key: '12',
    },
    {
      title: 'Fecha Pago',
      dataIndex: 'fecha_pago',
      key: '13',
    },
    {
      title: 'Tipo Incapacidad',
      dataIndex: 'tipo_inca',
      key: '14',
    },
    {
      title: 'Observaciones',
      dataIndex: 'observacion',
      key: '15',
    },
    {
      title: 'Estatus',
      dataIndex: 'estatus',
      fixed: 'right',
      width: 100,
      key: '16',
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
        identificador == 2 || identificador == 4 ? ( 
          <>
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
            </Modal> 
          </>
        ): username == 'mx-ocalderon' || username == 'mx-pvelazquez' ? (
          <>
          <FloatButton icon={<DownCircleTwoTone />} tooltip={<div>Dowload Incidents</div>} onClick={muestra}/>
            <Modal title="Download Incidents" open={isDowload} onOk={Okas} onCancel={Cancelar} width={300}>
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
            </Modal> 
          </>
        ): null
      }
      
    </>
      
  );
};
export default ListIncidents;

