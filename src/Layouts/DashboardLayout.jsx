import React, {useState, useContext} from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Layout, Button, theme, Input } from 'antd'
import MenuList from '../Components/MenuList/MenuList'
import { MainContext } from '../Context/Context'
import logo from './assets/bloomzon.png'
import { MailOutlined, PoweroffOutlined, MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, BellFilled } from '@ant-design/icons'
const {Header, Sider, Content} = Layout
const { Search } = Input;
const DashboardLayout = () => {
  const [toggle, setToggle] = useState(false);
  const { currentUser, isUndreadMessages } = useContext(MainContext);
  const {token: {colorBgContainer}} = theme.useToken()
  
  return (
    <Layout style={{position:'relative'}}>

        <Sider collapsed= {toggle}  className='sideBar' style={{background: 'white', height: '100vh', overflowY: 'auto', position: 'fixed'}}>
          
          <MenuList toggle = {toggle}/>
        </Sider>
        <Layout style={{marginLeft: `${!toggle ? 190 : 80}px`}}>
          <Header style={{padding: '0 20px', background: colorBgContainer}} className='flex flex-justify-between flex-align sider-header'>
          <div className='flex flex-justify-between' style={{gap:20}}>
            <Button type='text' icon ={toggle ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            onClick={()=> setToggle(!toggle)}
            ></Button>
            <Search placeholder="Search anything"  enterButton />
          </div>
            
          <div className="flex flex-align" style={{gap:10}}>
            <span><BellFilled style={{fontSize: 20, color: '#333'}}/></span>
            <div className="flex flex-align" style={{gap:10}}>
              <div className='profile-image' style={{fontSize: '2rem', color: '#333'}}><i class="fa fa-user-circle" aria-hidden="true"></i></div>
              <div className='flex flex-column'>
                <h4 style={{color: '#333'}}>Iniemem</h4>
                <span style={{marginTop:-45, color: 'var(--primary-color)', fontSize: '0.8rem'}}>Super</span>
              </div>
            </div>
          </div>
          </Header>
          <Content >
              <Outlet/>
          </Content>
        </Layout>
        
           
       
    </Layout>
  )
}

export default DashboardLayout