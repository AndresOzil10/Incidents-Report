import React from 'react'
import { Table, Button, Input, Space, Tag, Tooltip } from 'antd'
import Highlighter from 'react-highlight-words'
import { useEffect, useState, useRef } from 'react'
import { SearchOutlined, UserOutlined, IdcardOutlined, CalendarOutlined, ReloadOutlined } from '@ant-design/icons'
import { HappyProvider } from '@ant-design/happy-work-theme'

const VacationList = ({identificador, id_consulta, nomina}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        try {
            const data = {
              "id_consulta": id_consulta,
            }
            const url_get = "http://localhost/wl-api/VcPConsult.php"
            const resp = await fetch(url_get, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await resp.json()
            
            if (Array.isArray(json)) {
                setData(json);
            } else if (json.data && Array.isArray(json.data)) {
                setData(json.data);
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
  }, [])
  
  const dataSource = data.map((jsonres, index) => ({
    key: jsonres.nomina || index,
    nn: jsonres.nomina, 
    nombre: `${jsonres.Nombre || ''} ${jsonres.ApellidoP || ''} ${jsonres.ApellidoM || ''}`.trim(),
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
  
  const getColumnSearchProps = (dataIndex, columnName) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        className="p-3 bg-slate-50 rounded-lg shadow-lg border border-slate-200"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar por ${columnName}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          prefix={<SearchOutlined className="text-slate-400" />}
          className="mb-3 block rounded-md border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <Space wrap size="small">
          <HappyProvider>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="middle"
              className="bg-blue-500 hover:bg-blue-600 border-blue-500 shadow-sm shadow-blue-200 transition-all"
            >
              Buscar
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="middle"
              icon={<ReloadOutlined />}
              className="hover:bg-slate-100 transition-all"
            >
              Reset
            </Button>
            <Button
              type="link"
              size="middle"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              Filtrar
            </Button>
            <Button
              type="link"
              size="middle"
              onClick={() => close()}
              className="text-slate-500 hover:text-slate-700"
            >
              Cerrar
            </Button>
          </HappyProvider>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        className={`text-base transition-colors ${
          filtered ? 'text-blue-500' : 'text-slate-400'
        }`}
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
            backgroundColor: '#fef08a',
            padding: '2px 4px',
            borderRadius: '4px',
            fontWeight: 500,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        <span className="text-slate-700">{text}</span>
      ),
  })

  const columns = [
    {
      title: (
        <Space size={4} className="text-slate-700">
          <IdcardOutlined className="text-blue-500" />
          <span className="font-semibold">N. Nómina</span>
        </Space>
      ),
      width: 120,
      dataIndex: 'nn',
      key: 'nn',
      fixed: 'left',
      sorter: (a, b) => a.nn - b.nn,
      ...getColumnSearchProps('nn', 'N. Nómina'),
      render: (text) => (
        <Tag color="blue" className="font-medium px-2 py-1 rounded-md">
          {text}
        </Tag>
      ),
    },
    {
      title: (
        <Space size={4} className="text-slate-700">
          <UserOutlined className="text-emerald-500" />
          <span className="font-semibold">Nombre Completo</span>
        </Space>
      ),
      dataIndex: 'nombre',
      key: 'nombre',
      width: 300,
      ...getColumnSearchProps('nombre', 'Nombre'),
      render: (text) => (
        <Tooltip title={`Empleado: ${text}`} placement="topLeft">
          <span className="text-slate-600 font-normal cursor-help hover:text-blue-600 transition-colors">
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: (
        <Space size={4} className="text-slate-700">
          <CalendarOutlined className="text-amber-500" />
          <span className="font-semibold">Saldo Actual (días)</span>
        </Space>
      ),
      dataIndex: 'dias',
      key: 'dias',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.dias - b.dias,
      render: (text) => {
        const colorClass = text > 15 
          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
          : text > 8 
            ? 'bg-amber-100 text-amber-700 border-amber-200' 
            : 'bg-rose-100 text-rose-700 border-rose-200';
        
        return (
          <Tag className={`${colorClass} font-semibold px-3 py-1 rounded-full border`}>
            {text} días
          </Tag>
        );
      },
    },
  ]

  // Estilos personalizados para la tabla de Ant Design con Tailwind
  const tableClassName = `
    [&_.ant-table-thead_.ant-table-cell]:bg-gradient-to-b 
    [&_.ant-table-thead_.ant-table-cell]:from-slate-50 
    [&_.ant-table-thead_.ant-table-cell]:to-slate-100 
    [&_.ant-table-thead_.ant-table-cell]:text-slate-700 
    [&_.ant-table-thead_.ant-table-cell]:font-semibold 
    [&_.ant-table-thead_.ant-table-cell]:border-b-2 
    [&_.ant-table-thead_.ant-table-cell]:border-slate-200
    [&_.ant-table-tbody_.ant-table-row:hover_td]:bg-blue-50 
    [&_.ant-table-tbody_.ant-table-row:hover_td]:transition-colors
    [&_.ant-table-tbody_tr:nth-child(even)_td]:bg-slate-50/50
    [&_.ant-table-cell]:transition-colors
    [&_.ant-table-cell]:duration-200
    [&_.ant-pagination]:mt-4
    [&_.ant-pagination-item-active]:border-blue-500
    [&_.ant-pagination-item-active_a]:text-blue-500
    [&_.ant-pagination-item]:hover:border-blue-400
    [&_.ant-pagination-item]:hover:text-blue-500
    [&_.ant-select-selector]:hover:border-blue-400
    [&_.ant-select-selector]:focus-within:border-blue-500
    [&_.ant-select-selector]:focus-within:ring-2
    [&_.ant-select-selector]:focus-within:ring-blue-200
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full" />
            <h3 className="text-lg font-semibold text-slate-800 m-0">
              Listado de Vacaciones
            </h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <Table
          className={tableClassName}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-slate-600">
                {range[0]}-{range[1]} de {total} registros
              </span>
            ),
            defaultPageSize: 10,
            pageSizeOptions: ['5', '10', '20', '50'],
            position: ['bottomCenter'],
            className: "custom-pagination",
          }}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{
            x: 800,
            y: 'calc(100vh - 320px)',
          }}
          size="middle"
          bordered={false}
          rowClassName="hover:bg-blue-50/50 transition-colors"
        />
      </div>

      {/* Loading overlay custom styles */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-600">Cargando datos...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default VacationList