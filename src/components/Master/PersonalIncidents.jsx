import React from 'react'
import { Table, Button, Input, Space, Tag} from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { SearchOutlined} from '@ant-design/icons'
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
      return null
  }
};

const PersonalIncidents = ({identificador, id_consulta, nomina, username}) => {
  const [data, setData] = useState([])

  //console.log(id_consulta)
   useEffect(() => {
    const fetchData = async () => {
        try {
            const data = {
              "username": username,
            }
            const url_get = "http://10.144.13.5/wl-api/PCShieff.php"
            //const url_get = "http://10.144.13.5/wl-api/PCShieff.php"
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
    fecha_ini: jsonres.fecha_ini,
    fecha_final: jsonres.fecha_final,
    semana: jsonres.semana,
    incidencia: jsonres.incidencia,
    hrs_inci: jsonres.hrs_inci,
    clave_perm: jsonres.clave_perm,
    fecha_pago: jsonres.fecha_pago,
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
      title: 'Clave Permiso',
      dataIndex: 'clave_perm',
      key: '9',
    },
    {
      title: 'Fecha Pago',
      dataIndex: 'fecha_pago',
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

  return (
    <Table
      className='table-auto ml-[-100px] '
      pagination={true}
      columns={columns}
      dataSource={dataSource}
      scroll={{
        x: 'max-content',
      }}
      size='small'
    />
  );
};
export default PersonalIncidents;