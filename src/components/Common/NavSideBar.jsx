import React, { useEffect, useRef, useState } from 'react';
import {
  CloseCircleTwoTone,
  EditTwoTone,
  EyeInvisibleOutlined,
  EyeTwoTone,
  HomeTwoTone,
  HourglassTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileTwoTone,
  PushpinTwoTone,
  SettingTwoTone,
  TabletTwoTone,
  HighlightTwoTone,
  LogoutOutlined,
  LockOutlined,
  UserOutlined,
  SecurityScanTwoTone,
  TeamOutlined,
  CheckCircleTwoTone,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Button, Input, Menu, Modal, Avatar, Badge, Tooltip, Divider, theme, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaUserAstronaut, FaUserShield, FaUserTie, FaBars, FaTimes } from "react-icons/fa";
import Swal from 'sweetalert2';
import { HappyProvider } from '@ant-design/happy-work-theme';

const { Text } = Typography;

const url_change = "http://localhost/wl-api/ChangePassword.php"

const changePassword = async (url_change, data) => {
  const resp = await fetch(url_change, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type' : 'application/json'
      }
  })
  const json = await resp.json()
  return json
}

// Función para obtener el icono de rol
const getRoleIcon = (identificador) => {
  switch(identificador) {
    case 2: return <FaUserShield className="text-purple-500" />;
    case 3: return <FaUserTie className="text-blue-500" />;
    case 4: return <SecurityScanTwoTone twoToneColor="#ff6b6b" />;
    case 5: return <UserOutlined className="text-green-500" />;
    case 6: return <TeamOutlined className="text-orange-500" />;
    case 9: return <TeamOutlined className="text-indigo-500" />;
    default: return <FaUserAstronaut className="text-gray-500" />;
  }
}

// Función para obtener el nombre del rol
const getRoleName = (identificador) => {
  switch(identificador) {
    case 2: return "Jefe";
    case 3: return "Supervisor";
    case 4: return "Especial";
    case 5: return "Staff";
    case 6: return "Manager";
    case 9: return "Manager";
    default: return "Usuario";
  }
}

const getRoleColor = (identificador) => {
  switch(identificador) {
    case 2: return "#667eea";
    case 3: return "#4facfe";
    case 4: return "#f093fb";
    case 5: return "#43e97b";
    case 6: return "#fa709a";
    case 9: return "#a8edea";
    default: return "#667eea";
  }
}

function getItem(label, key, icon, path, badge = null, tooltip = "") {
  return {
    key,
    icon: <Tooltip title={tooltip}>{icon}</Tooltip>,
    label: (
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        {badge && <Badge count={badge} size="small" />}
      </div>
    ),
    path
  };
}

const NavSideBar =({username, identificador, id_consulta, nomina }) => { 
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  const Supervisor = [
    getItem('Dashboard', '1', <HomeTwoTone twoToneColor="#667eea" />, '/home', null, "Ir al dashboard principal"),
    getItem('Reportes', '3', <TabletTwoTone twoToneColor="#f6ad55" />, 'report', null, "Ver reportes de incidencias"),
    getItem('Vacaciones', '6', <ProfileTwoTone twoToneColor="#68d391" />, 'vacations', null, "Gestión de vacaciones"),
    getItem('Horas BH', '7', <HourglassTwoTone twoToneColor="#f687b3" />, 'hours', null, "Horas bancarias"),
    getItem('Seguridad', '9', <SettingTwoTone twoToneColor="#4fd1c7" spin />, null, null, "Cambiar contraseña"),
    getItem('Cerrar Sesión', '10', <LogoutOutlined style={{ color: '#fc8181' }} />, null, null, "Salir del sistema"),
  ]

  const Staff = [
    getItem('Dashboard', '1', <HomeTwoTone twoToneColor="#667eea" />, '/home', null, "Ir al dashboard principal"),
    getItem('Reportes', '3', <TabletTwoTone twoToneColor="#f6ad55" />, 'report', null, "Ver reportes de incidencias"),
    getItem('Editar', '4', <EditTwoTone twoToneColor="#68d391" />, 'edit', null, "Editar solicitudes"),
    getItem('Seguridad', '9', <SettingTwoTone twoToneColor="#4fd1c7" spin />, null, null, "Cambiar contraseña"),
    getItem('Cerrar Sesión', '10', <LogoutOutlined style={{ color: '#fc8181' }} />, null, null, "Salir del sistema"),
  ]

  const Managers = [
    getItem('Dashboard', '1', <HomeTwoTone twoToneColor="#667eea" />, '/home', null),
    getItem('Reportes', '3', <TabletTwoTone twoToneColor="#f6ad55" />, 'report', null),
    getItem('Editar', '4', <EditTwoTone twoToneColor="#68d391" />, 'edit', null),
    getItem('Seguridad', '9', <SettingTwoTone twoToneColor="#4fd1c7" spin />, null, null),
    getItem('Aprobar', '5', <PushpinTwoTone twoToneColor="#f687b3" />, 'request', null),
    getItem('Cerrar Sesión', '10', <LogoutOutlined style={{ color: '#fc8181' }} />, null, null),
  ]

  const Shieff = [
    getItem('Dashboard', '1', <HomeTwoTone twoToneColor="#667eea" />, '/home', null, "Ir al dashboard principal"),
    getItem('Reportes', '3', <TabletTwoTone twoToneColor="#f6ad55" />, 'report', null, "Ver reportes de incidencias"),
    getItem('Editar', '4', <EditTwoTone twoToneColor="#68d391" />, 'edit', null, "Editar solicitudes"),
    getItem('Aprobar', '5', <PushpinTwoTone twoToneColor="#f687b3" />, 'request', null, "Aprobar/Denegar solicitudes"),
    getItem('Vacaciones', '6', <ProfileTwoTone twoToneColor="#68d391" />, 'vacations', null, "Gestión de vacaciones"),
    getItem('Horas BH', '7', <HourglassTwoTone twoToneColor="#f687b3" />, 'hours', null, "Horas bancarias"),
    getItem('Seguridad', '9', <SettingTwoTone twoToneColor="#4fd1c7" spin />, null, null, "Cambiar contraseña"),
    getItem('Cerrar Sesión', '10', <LogoutOutlined style={{ color: '#fc8181' }} />, null, null, "Salir del sistema"),
  ]

  const Special = [
    getItem('Dashboard', '1', <HomeTwoTone twoToneColor="#667eea" />, '/home', null, "Ir al dashboard principal"),
    getItem('Personal', '2', <HighlightTwoTone twoToneColor="#f6e05e" />, 'personal', null, "Incidencias personal"),
    getItem('Reportes', '3', <TabletTwoTone twoToneColor="#f6ad55" />, 'report', null, "Ver reportes de incidencias"),
    getItem('Editar', '4', <EditTwoTone twoToneColor="#68d391" />, 'edit', null, "Editar solicitudes"),
    getItem('Aprobar', '5', <PushpinTwoTone twoToneColor="#f687b3" />, 'request', null, "Aprobar/Denegar solicitudes"),
    getItem('Vacaciones', '6', <ProfileTwoTone twoToneColor="#68d391" />, 'vacations', null, "Gestión de vacaciones"),
    getItem('Horas BH', '7', <HourglassTwoTone twoToneColor="#f687b3" />, 'hours', null, "Horas bancarias"),
    getItem('Seguridad', '9', <SettingTwoTone twoToneColor="#4fd1c7" spin />, null, null, "Cambiar contraseña"),
    getItem('Cerrar Sesión', '10', <LogoutOutlined style={{ color: '#fc8181' }} />, null, null, "Salir del sistema"),
  ]

  const refOld = useRef(null)
  const refNew = useRef('')
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const navigate = useNavigate()

  const showModal = () => {
    setIsModalOpen(true)
  };

  const handleOk = async () => {
    const Old = refOld.current.input.value
    const New = refNew.current.input.value

    if(!Old || !New){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos',
        background: '#1e293b',
        color: 'white',
        confirmButtonColor: '#3b82f6',
        iconColor: '#ef4444'
      })
      return
    }

    const data = {
      "password": Old,
      "new": New,
      "username": username,
    }
    
    try {
      const respuesta = await changePassword(url_change, data)
      
      if(respuesta.error){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: respuesta.error,
          background: '#1e293b',
          color: 'white',
          confirmButtonColor: '#3b82f6',
          iconColor: '#ef4444'
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: respuesta.success,
          background: '#1e293b',
          color: 'white',
          confirmButtonColor: '#10b981',
          iconColor: '#10b981'
        })
        refOld.current.input.value = ""
        refNew.current.input.value = ""
        setIsModalOpen(false)
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        background: '#1e293b',
        color: 'white',
        confirmButtonColor: '#3b82f6',
        iconColor: '#ef4444'
      })
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  // Función para manejar el clic del menú
  const handleMenuClick = (key) => {
    setActiveKey(key)
    
    switch(key) {
      case '1':
        navigate('/home', { state: { username, identificador, id_consulta, nomina } })
        break
      case '2':
          navigate('personal', { state: { username, identificador, id_consulta, nomina } })
          break
      case '3':
        navigate('report', { state: { username, identificador, id_consulta, nomina } })
        break
      case '4':
        navigate('edit', { state: { username, identificador, id_consulta, nomina } })
        break
      case '5':
        navigate('request', { state: { username, identificador, id_consulta, nomina } })
        break
      case '6':
        navigate('vacations', { state: { username, identificador, id_consulta, nomina } })
        break
      case '7':
        navigate('hours', { state: { username, identificador, id_consulta, nomina } })
        break
      case '9':
        showModal()
        break
      case '10':
          navigate('/vite/', { replace: true })
        break
    }
  }

  // Obtener el menú según el identificador
  const getMenuItems = () => {
    switch(identificador) {
      case 3: return Supervisor
      case 5: return Staff
      case 6: return Managers
      case 9: return Managers
      case 2: return Shieff
      case 4: return Special
      default: return []
    }
  }

  return (
    <>
      {/* Sidebar Container */}
      <div 
        className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        style={{
          background: 'linear-gradient(180deg, #303030 0%, #000000 100%)',
          boxShadow: '5px 0 15px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Header Section - Reorganizado para evitar solapamiento */}
        <div className="flex-none">
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                {/* Avatar del usuario - Siempre visible */}
                <Avatar
                  size={collapsed ? 40 : 48}
                  style={{
                    background: getRoleColor(identificador),
                    border: '2px solid white',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  icon={getRoleIcon(identificador)}
                />
                
                {/* Botón de toggle POSICIONADO CORRECTAMENTE */}
                <Tooltip 
                  title={collapsed ? "Expandir menú" : "Colapsar menú"} 
                  placement="right"
                >
                  <Button
                    type="text"
                    onClick={toggleCollapsed}
                    className="ml-auto transition-all duration-300 hover:scale-110"
                    style={{
                      background: getRoleColor(identificador),
                      color: 'white',
                      border: 'none',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      marginLeft: collapsed ? '8px' : '16px',
                      flexShrink: 0
                    }}
                    icon={
                      collapsed ? 
                        <RightOutlined className="text-sm" /> : 
                        <LeftOutlined className="text-sm" />
                    }
                  />
                </Tooltip>
              </div>
              
              {/* Información del usuario - Solo visible cuando expandido */}
              {!collapsed && (
                <div className="flex-1 overflow-hidden ml-2">
                  <Text 
                    ellipsis 
                    className="text-white font-semibold text-base block"
                  >
                    {username}
                  </Text>
                  <Text 
                    ellipsis 
                    className="text-gray-400 text-xs block"
                    style={{ 
                      background: `linear-gradient(135deg, ${getRoleColor(identificador)} 0%, ${getRoleColor(identificador)}80 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {getRoleName(identificador)}
                  </Text>
                  <Text ellipsis className="text-gray-500 text-xs block ml-2">
                    Nómina: {nomina}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items - Sección scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[activeKey]}
            inlineCollapsed={collapsed}
            className="border-0 !bg-transparent"
            style={{ 
              background: 'transparent',
              borderRight: 'none'
            }}
            items={getMenuItems().map(item => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              className: 'transition-all duration-200',
              style: {
                margin: '4px 8px',
                borderRadius: '8px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: collapsed ? '12px' : '16px'
              }
            }))}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="flex-none">
            <Divider className="!border-gray-700 !my-2" />
            <div className="text-center p-2">
              <Text className="text-gray-500 text-xs">
                Sistema de Gestión
              </Text>
              <Text className="text-gray-600 text-xs block">
                v2.0.0
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Cambiar Contraseña */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <LockOutlined className="text-blue-500" />
            <span className="text-lg font-semibold">Cambiar Contraseña</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={false}
        okText="Cambiar Contraseña"
        cancelText="Cancelar"
        className="rounded-2xl"
        styles={{
          header: { borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' },
          body: { paddingTop: '20px' }
        }}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual *
            </label>
            <Input.Password
              placeholder="Ingrese su contraseña actual"
              ref={refOld}
              size="large"
              className="rounded-lg"
              prefix={<LockOutlined className="text-gray-400" />}
              iconRender={(visible) => 
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña *
            </label>
            <Input.Password
              placeholder="Ingrese la nueva contraseña"
              ref={refNew}
              size="large"
              className="rounded-lg"
              prefix={<LockOutlined className="text-gray-400" />}
              iconRender={(visible) => 
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </div>
          
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <CheckCircleTwoTone twoToneColor="#10b981" />
              Asegúrese de que la nueva contraseña sea segura
            </p>
          </div>
        </div>
      </Modal>

      {/* Overlay para móvil */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleCollapsed}
        />
      )}

      {/* Estilos personalizados */}
      <style>{`
        /* Scrollbar personalizado */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        /* Estilos del menú */
        .ant-menu-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .ant-menu-item:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        .ant-menu-item-selected {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%) !important;
          border-left: 3px solid #6366f1 !important;
        }
        
        .ant-menu-item-selected:hover {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%) !important;
        }
        
        /* Animaciones suaves */
        .ant-avatar {
          transition: transform 0.3s ease;
        }
        
        .ant-avatar:hover {
          transform: scale(1.1);
        }
        
        /* Modal */
        .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden;
        }
        
        .ant-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: none !important;
          box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.5) !important;
        }
        
        .ant-btn-primary:hover {
          box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.7) !important;
        }
      `}</style>
    </>
  )
}

export default NavSideBar