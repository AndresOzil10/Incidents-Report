import React from 'react'
import { Table, Button, Input, Space} from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { SearchOutlined} from '@ant-design/icons'
import { HappyProvider } from '@ant-design/happy-work-theme'

const VacationList = ({identificador, id_consulta, nomina}) => {
  const [data, setData] = useState([])

  //console.log(id_consulta)

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = {
              "id_consulta": id_consulta,
            }
            const url_get = "http://10.144.13.5/wl-api/VcPConsult.php"
            //const url_get = "http://10.144.13.5/wl-api/VcPConsult.php"
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
    key: jsonres.nomina,
    nn: jsonres.nomina, 
    nombre: jsonres.Nombre+" "+jsonres.ApellidoP+"  "+jsonres.ApellidoM,
    //area: jsonres.area,
    dias: jsonres.dias,
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
      title: 'Saldo Actual',
      dataIndex: 'dias',
      key: '3',
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
      className='table-auto '
      pagination={true}
      columns={columns}
      dataSource={dataSource}
      scroll={{
        x: 'max-content',
      }}
      size='small'
    />
  )
}
export default VacationList;