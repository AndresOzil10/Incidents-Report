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
  HighlightTwoTone
} from '@ant-design/icons';
import { Button, Input, Menu, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaUserAstronaut } from "react-icons/fa";
import Swal from 'sweetalert2';
import { HappyProvider } from '@ant-design/happy-work-theme';

//const url_change = "http://10.144.13.5/wl-api/ChangePassword.php"
const url_change = "http://10.144.13.5/wl-api/ChangePassword.php"


const changePassword = async (url_change, data) => {
  const resp = await fetch(url_change, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type' : 'application/json'
      }
  })
  //console.log(resp)
  const json = await resp.json()
  //console.log(json)

  return  json
}


function getItem(label, key, icon, path) {
    return {
      key,
      icon,
      label: path ? <Link to={path}>{label}</Link> : label,
    };
  }
  
 

const NavSideBar =({username, identificador, id_consulta, nomina }) => { 

  //console.log(username)

  const Supervisor = [
    getItem(username,  '7', <FaUserAstronaut />),
    getItem('Home', '1', <HomeTwoTone  twoToneColor="#0194be"/> ),
    getItem('Incidents Reports', '2', <TabletTwoTone twoToneColor="#0194be"/> ),
    getItem('Vacations', '3', <ProfileTwoTone twoToneColor="#0194be"/>),
    getItem('BH', '4', <HourglassTwoTone twoToneColor="#0194be" />),
    getItem('Change Password', '5', <SettingTwoTone  twoToneColor="#0194be" spin />),
    getItem('LogOut',  '6', <CloseCircleTwoTone twoToneColor="#0194be"/>),

  ]

  const Staff = [
    getItem(username,  '6', <FaUserAstronaut />),
    getItem('Home', '1', <HomeTwoTone  twoToneColor="#0194be"/> ),
    getItem('Incidents Reports', '2', <TabletTwoTone twoToneColor="#0194be"/> ),
    getItem('Editar Solicitud', '3', <EditTwoTone twoToneColor="#0194be"/>),
    getItem('Change Password', '4', <SettingTwoTone twoToneColor="#0194be" spin/>),
    getItem('LogOut',  '5', <CloseCircleTwoTone twoToneColor="#0194be"/>),

  ]

  const Managers = [
    getItem(username,  '6', <FaUserAstronaut />),
    getItem('Home', '1', <HomeTwoTone  twoToneColor="#0194be"/>),
    getItem('Incidents Reports', '2', <TabletTwoTone twoToneColor="#0194be"/> ),
    getItem('Editar Solicitud', '3', <EditTwoTone twoToneColor="#0194be"/>),
    getItem('Change Password', '4', <SettingTwoTone twoToneColor="#0194be" spin/>),
    getItem('Approve/Deny/Edit Requests', '5', <PushpinTwoTone/> ),
    getItem('LogOut',  '7', <CloseCircleTwoTone twoToneColor="#0194be"/>),

  ]

  const Shieff = [
    getItem(username,  '6', <FaUserAstronaut />),
    getItem('Home', '1', <HomeTwoTone  twoToneColor="#0194be"/>),
    getItem('Incidents Reports', '2', <TabletTwoTone twoToneColor="#0194be"/> ),
    getItem('Editar Solicitud', '3', <EditTwoTone twoToneColor="#0194be"/>),
    getItem('Approve/Deny/Edit Requests', '5', <PushpinTwoTone/> ),
    getItem('Vacations', '7', <ProfileTwoTone twoToneColor="#0194be"/>),
    getItem('BH', '8', <HourglassTwoTone twoToneColor="#0194be" />),
    getItem('Change Password', '4', <SettingTwoTone twoToneColor="#0194be" spin/>),
    getItem('LogOut',  '9', <CloseCircleTwoTone twoToneColor="#0194be"/>),

  ]

  const Special = [
    getItem(username,  '6', <FaUserAstronaut />),
    getItem('Home', '1', <HomeTwoTone  twoToneColor="#0194be"/>),
    getItem('Incidencias Personal', '2', <HighlightTwoTone  twoToneColor="#0194be"/> ),
    getItem('Incidents Reports', '3', <TabletTwoTone twoToneColor="#0194be"/> ),
    getItem('Editar Solicitud', '4', <EditTwoTone twoToneColor="#0194be"/>),
    getItem('Approve/Deny/Edit Requests', '5', <PushpinTwoTone/> ),
    getItem('Vacations', '7', <ProfileTwoTone twoToneColor="#0194be"/>),
    getItem('BH', '8', <HourglassTwoTone twoToneColor="#0194be" />),
    getItem('Change Password', '9', <SettingTwoTone twoToneColor="#0194be" spin/>),
    getItem('LogOut',  '10', <CloseCircleTwoTone twoToneColor="#0194be"/>),

  ]

  //console.log(identificador)
  const refOld = useRef(null)
  const refNew = useRef('')
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true)
  };

  const handleOk = async () => {

    const Old =refOld.current.input.value
    const New = refNew.current.input.value

    if(!Old || !New){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verifique que los Campos esten completos',
      });
    } else{
      //console.log('aaaaaaa')
      const data = {
        "password": Old,
        "new": New,
        "username": username,
      }
      const respuesta = await changePassword(url_change, data)
    //console.log(respuesta)
      if(respuesta.error){
          //window.alert(respuesta.error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: respuesta.error,
          });
      } else{
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: respuesta.success,
        })
        refOld.current.input.value = "";
        refNew.current.input.value = "";
      }
    }
      //window.alert(respuesta.success);
      //setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }
  

  const personalMenuClick = (key) => {

    switch(key){
      case '1':
        navigate('/home', { state: { username, identificador, id_consulta, nomina } })
        return
      case '2':
        navigate('report', { state: { username, identificador, id_consulta, nomina } })
        return
      case '3':
        navigate('vacations', { state: { username, identificador, id_consulta, nomina } })
        return
      case '4':
        navigate('hours', { state: { username, identificador, id_consulta, nomina } })
        return
      case '5':
        showModal()
        return;
      case '6':
        navigate('/vite/', { replace: true })
      //case '3':
        //navigate('/test', { state: { username, idmenu } })
    }
  }

  const staffMenuClick = (key) => {

    switch(key){
      case '1':
        navigate('/home', { state: { username, identificador, id_consulta, nomina } })
        return
      case '2':
        navigate('report', { state: { username, identificador, id_consulta, nomina } })
        return
      case '3':
        navigate('edit', { state: { username, identificador, id_consulta, nomina } })
        return
      case '4':
        showModal()
        return;
      case '5':
          navigate('/vite/', { replace: true })
    }
  }

  const managerMenu = (key) => {

    switch(key){
      case '1':
        navigate('/home', { state: { username, identificador, id_consulta, nomina } })
        return
      case '2':
        navigate('report', { state: { username, identificador, id_consulta, nomina } })
        return
      case '3':
        navigate('edit', { state: { username, identificador, id_consulta, nomina } })
        return
      case '4':
        showModal()
        return;
      case '5':
        navigate('request', { state: { username, identificador, id_consulta, nomina } })
        return
      case '7':
          navigate('/vite/', { replace: true })
    }
  }

  const shieffMenu = (key) => {

    switch(key){
      case '1':
        navigate('/home', { state: { username, identificador, id_consulta, nomina } })
        return
      case '2':
        navigate('report', { state: { username, identificador, id_consulta, nomina } })
        return
      case '3':
        navigate('edit', { state: { username, identificador, id_consulta, nomina } })
        return
      case '4':
        showModal()
        return;
      case '5':
        navigate('request', { state: { username, identificador, id_consulta, nomina } })
        return
      case '7':
        navigate('vacations', { state: { username, identificador, id_consulta, nomina } })
        return
      case '8':
        navigate('hours', { state: { username, identificador, id_consulta, nomina } })
        return
      case '9':
          navigate('/vite/', { replace: true })
    }
  }

  const specialMenu = (key) => {

    switch(key){
      case '1':
        navigate('/home', { state: { username, identificador, id_consulta, nomina } })
        return
      case '2':
        navigate('personal', { state: { username, identificador, id_consulta, nomina } })
        return
      case '3':
        navigate('report', { state: { username, identificador, id_consulta, nomina } })
        return
      case '9':
        showModal()
        return
      case '4':
        navigate('edit', { state: { username, identificador, id_consulta, nomina } })
        return
      case '5':
        navigate('request', { state: { username, identificador, id_consulta, nomina } })
        return
      case '7':
        navigate('vacations', { state: { username, identificador, id_consulta, nomina } })
        return
      case '8':
        navigate('hours', { state: { username, identificador, id_consulta, nomina } })
        return
      case '10':
          navigate('/vite/', { replace: true })
    }
  }

  return (
    <div style={{ width: 256 }}>
      <HappyProvider>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      </HappyProvider>
      <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={
          identificador == 3 ? Supervisor.map(item => ({ 
            ...item, 
            onClick: () => personalMenuClick(item.key), 
          })) : 
          identificador == 5 ? Staff.map(item => ({ 
            ...item, 
            onClick: () => staffMenuClick(item.key), 
          })) : 
          identificador == 6 || identificador == 9 ? Managers.map(item => ({ 
            ...item, 
            onClick: () => managerMenu(item.key), 
          })) : 
          identificador == 2 ? Shieff.map(item => ({ 
            ...item, 
            onClick: () => shieffMenu(item.key), 
          })) :
          identificador == 4 ? Special.map(item => ({ 
            ...item, 
            onClick: () => specialMenu(item.key), 
          })) :
          null }
        />
        <Modal 
          title="Change Password" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
        >
          
          <label htmlFor="">Password:</label>
          <Input.Password
            placeholder="Password"
            ref={refOld}
            className = "border border-red-600 w-full rounded-full py-2 px-4 my-2 bg-transparent"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          <label htmlFor="">New Password:</label>
          <Input.Password
            placeholder="New Password"
            ref={refNew}
            className = "border border-red-600 w-full rounded-full py-2 px-4 my-2 bg-transparent"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          
        </Modal>
      </div>
  )
}

 export default NavSideBar