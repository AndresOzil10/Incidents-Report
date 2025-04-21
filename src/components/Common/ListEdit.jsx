import React from 'react'
import { Table, Input, Space, Typography, Popconfirm, Form, Select} from 'antd'
import { useEffect, useState, useRef } from 'react'

const incidentOptions = [
  { label: 'Permiso sin goce', value: 'Permiso sin goce' },
  { label: 'Home Office', value: 'Home Office' },
  { label: 'Vacaciones', value: 'Vacaciones' },
  { label: 'Viaje de Trabajo', value: 'Viaje de Trabajo' },
  { label: 'Tiempo x Tiempo', value: 'Tiempo x Tiempo' },
  { label: 'Incapacidad', value: 'Incapacidad' },
  { label: 'Prestacion Social', value: 'Prestacion Social'}
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
    let inputNode;

  // Cambia el inputNode para la columna 'incidencia'
  if (dataIndex === 'incidencia') {
    inputNode = (
      <Select options={incidentOptions} />
    );
  } else {
    inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const ListEdit = ({ username, nomina}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [editingKey, setEditingKey] = useState('')
    const isEditing = (record) => record.key === editingKey

    const edit = (record) => {
        form.setFieldsValue({
          name: '',
          age: '',
          address: '',
          ...record,
        });
        setEditingKey(record.key)
      }
    
      const cancel = () => {
        setEditingKey('')
      }

  //console.log(id_consulta)


    const fetchData = async () => {
        try {
            const data = {
              "nomina": nomina,
            }
            //const url_get = "http://10.144.13.5/wl-api/ListEdit.php"
            const url_get = "http://10.144.13.5/wl-api/ListEdit.php"
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
    }
  
    useEffect(() => {
        fetchData();
    }, [nomina]);

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
    observacion: jsonres.observacion
  }))

  const save = async (key) => {
    try {
        const row = await form.validateFields()
        const newrow = {...row, key}
        //const newData = [...data]
        //const url_get = "http://10.144.13.5/wl-api/UpdateIncident.php"
        const url_get = "http://10.144.13.5/wl-api/UpdateIncident.php"
        const resp = await fetch(url_get, {
            method: 'POST',
            body: JSON.stringify(newrow),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(newrow)
        const json = await resp.json()
        if (json.success) { 
            fetchData()
            setEditingKey('');
            //setData(json.data);
            //window.location.reload();
        } else {
            console.error('Error al guardar los datos:', json.message)
        }
        
    } catch (errInfo) {
       console.log('Validate Failed:', errInfo)
     }
  }

  const columns = [
    {
        title: 'Id',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        sorter: true,
        editable: false,
      },
    {
      title: 'N.Nomina',
      width: 100,
      dataIndex: 'nn',
      key: 'nn',
      fixed: 'left',
      sorter: true,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: '1',
    },
    
    {
        title: 'Area',
        dataIndex: 'area',
        key: '2',
      },
      {
        title: 'Fecha Inicial',
        dataIndex: 'fecha_ini',
        key: '3',
        editable: true,
      },
      {
        title: 'Fecha Final',
        dataIndex: 'fecha_final',
        key: '4',
        editable: true,
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
        editable: true,
      },
      {
        title: 'Hrs/Dia(s) Incidencia',
        dataIndex: 'hrs_inci',
        key: '7',
        editable: true,
      },
      {
        title: 'Clave Incidencia',
        dataIndex: 'clave_inci',
        key: '8',
        editable: true,
      },
      {
        title: 'Clave Permiso',
        dataIndex: 'clave_perm',
        key: '9',
        editable: true,
      },
      {
        title: 'Fecha Pago',
        dataIndex: 'fecha_pago',
        key: '10',
        editable: true,
      },
      {
        title: 'Tipo Incapacidad',
        dataIndex: 'tipo_inca',
        key: '11',
        editable: true,
      },
      {
        title: 'Observacion',
        dataIndex: 'observacion',
        key: '12',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.id)}
                style={{
                  marginInlineEnd: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          );
        },
      },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
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
    };
  });

  return (
    <Form form={form} component={false}>
        <Table
        components={{
            body: {
            cell: EditableCell,
            },
        }}
        className='table-auto ml-[-35px] '
        pagination={true}
        columns={mergedColumns}
        dataSource={dataSource}
        scroll={{
            x: 'max-content',
        }}
        size='small'
        />
    </Form>
  )
 }

 export default ListEdit