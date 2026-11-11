import { useContext, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Button, theme, Input, Drawer, Grid } from 'antd'
import MenuList from '../Components/MenuList/MenuList'
import { MainContext } from '../Context/MainContext'
import { extractUserRoles } from '../api/getUser'
import { MenuFoldOutlined, MenuUnfoldOutlined, BellFilled, MessageFilled } from '@ant-design/icons'
const {Header, Sider, Content} = Layout
const { Search } = Input;
const { useBreakpoint } = Grid;
const DESKTOP_SIDER_WIDTH = 248;
const DESKTOP_COLLAPSED_WIDTH = 88;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useContext(MainContext);
  const screens = useBreakpoint();
  const isDesktop = screens.lg;
  const {token: {colorBgContainer}} = theme.useToken()
  const displayName =
    user?.name ||
    [user?.firstname || user?.first_name, user?.lastname || user?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim() ||
    user?.email ||
    'Admin User';
  const displayRole =
    user?.role ||
    extractUserRoles(user)[0] ||
    'Authenticated User';

  const handleMenuToggle = () => {
    if (isDesktop) {
      setDesktopCollapsed((current) => !current);
      return;
    }

    setMobileMenuOpen(true);
  };

  const contentOffset = isDesktop
    ? desktopCollapsed
      ? DESKTOP_COLLAPSED_WIDTH
      : DESKTOP_SIDER_WIDTH
    : 0;
  
  return (
    <Layout className='dashboard-shell' style={{position:'relative'}}>
      {isDesktop ? (
        <Sider
          width={DESKTOP_SIDER_WIDTH}
          collapsedWidth={DESKTOP_COLLAPSED_WIDTH}
          collapsed={desktopCollapsed}
          className='dashboard-sider'
          style={{
            background: 'white',
            height: '100vh',
            overflowY: 'auto',
            position: 'fixed',
            inset: '0 auto 0 0',
          }}
        >
          <MenuList toggle={desktopCollapsed} />
        </Sider>
      ) : (
        <Drawer
          placement='left'
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          closable={false}
          width={288}
          styles={{ body: { padding: 0 } }}
        >
          <MenuList toggle={false} onNavigate={() => setMobileMenuOpen(false)} />
        </Drawer>
      )}
      <Layout className='dashboard-main' style={{marginLeft: contentOffset}}>
        <Header
          style={{padding: isDesktop ? '0 20px' : '12px 16px', background: colorBgContainer}}
          className='dashboard-header'
        >
          <div className='dashboard-header__left'>
            <Button
              type='text'
              icon={
                isDesktop
                  ? desktopCollapsed
                    ? <MenuUnfoldOutlined/>
                    : <MenuFoldOutlined/>
                  : <MenuUnfoldOutlined/>
              }
              onClick={handleMenuToggle}
            />
            <Search
              className='dashboard-search'
              placeholder="Search anything"
              enterButton
            />
          </div>
          <div className="dashboard-header__right">
            <span 
              className='dashboard-header__icon'
              onClick={() => navigate('/dashboard/others/admins/messages')}
              style={{ cursor: 'pointer' }}
            >
              <MessageFilled style={{fontSize: 20, color: '#333'}}/>
            </span>
            <span 
              className='dashboard-header__icon'
              onClick={() => navigate('/dashboard/actions/notifications')}
              style={{ cursor: 'pointer' }}
            >
              <BellFilled style={{fontSize: 20, color: '#333'}}/>
            </span>
            <div 
              className="dashboard-user"
              onClick={() => navigate('/dashboard/actions/profile')}
              style={{ cursor: 'pointer' }}
            >
              <div className='profile-image dashboard-user__avatar' style={{fontSize: '2rem', color: '#333'}}>
                <i className="fa fa-user-circle" aria-hidden="true"></i>
              </div>
              <div className='dashboard-user__meta'>
                <h4 style={{color: '#333'}}>{displayName}</h4>
                <span className='dashboard-user__role'>{displayRole}</span>
              </div>
            </div>
          </div>
        </Header>
        <Content className='dashboard-content'>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout
