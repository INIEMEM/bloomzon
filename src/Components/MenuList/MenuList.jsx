/* eslint-disable react/prop-types */
import { Menu } from 'antd'
import {
  ApiOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  BellOutlined,
  BookOutlined,
  BuildOutlined,
  CarOutlined,
  ClusterOutlined,
  CommentOutlined,
  ControlOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FlagOutlined,
  GiftOutlined,
  GlobalOutlined,
  HomeOutlined,
  IdcardOutlined,
  InboxOutlined,
  MessageOutlined,
  NotificationOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  ReadOutlined,
  RocketOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  StarOutlined,
  TagOutlined,
  TeamOutlined,
  ToolOutlined,
  TrophyOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MainContext } from '../../Context/MainContext'
import { getDefaultAdminPath, hasAdminAccess, hasAdminPermission } from '../../api/getUser'
import '../../Components/components.css'
import logo from '../../Layouts/assets/bloomzon.png'

const MenuList = ({ toggle, onNavigate }) => {
  const { user } = useContext(MainContext)
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState([])

  const userRole = hasAdminAccess(user) ? 'super' : ''
  const hasScopedAdminAccess = hasAdminAccess(user)
  const canViewDashboard = hasAdminPermission(user, 'dashboard:view')
  const canViewAccess = hasAdminPermission(user, ['admins:view', 'admins:manage'])
  const canViewOrders = hasAdminPermission(user, ['orders:view', 'orders:manage'])
  const canViewUsers = hasAdminPermission(user, ['users:view', 'users:manage'])
  const canViewContent = hasAdminPermission(user, ['products:view', 'domains:view'])
  const canViewFinance = hasAdminPermission(user, ['finance:view', 'finance:manage'])
  const canViewReports = hasAdminPermission(user, ['reports:view', 'reports:export'])
  const canViewSubscriptions = hasAdminPermission(user, ['subscriptions:view', 'subscriptions:manage'])
  const canViewSettings = hasAdminPermission(user, ['settings:view', 'settings:manage'])
  const defaultAdminPath = getDefaultAdminPath(user)
  const canViewAnyAdminWorkspace =
    canViewDashboard ||
    canViewAccess ||
    canViewOrders ||
    canViewUsers ||
    canViewContent ||
    canViewFinance ||
    canViewReports ||
    canViewSubscriptions ||
    canViewSettings

  const handleOpenChange = (keys) => {
    setOpenKeys(keys)
  }

  const serviceMenuConfig = {
    'Groceries & Beverages': {
      icon: <ShoppingOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/groceries-beverages',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/groceries-beverages/analytics',
          icon: <BarChartOutlined />,
        },
        {
          title: 'Management',
          path: '../dashboard/sellers/services/groceries-beverages/management',
          icon: <ControlOutlined />,
        },
        {
          title: 'Special Offers',
          path: '../dashboard/sellers/offers/GroceriesBeverages',
          icon: <GiftOutlined />,
        },
      ],
    },
    'B-Elite': {
      icon: <StarOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/elite',
          icon: <SafetyCertificateOutlined />,
        },
        {
          title: 'Payment Options',
          path: '../dashboard/sellers/paymentOptions/BloomzonElite',
          icon: <CreditCardOutlined />,
        },
        {
          title: 'Create BloomZon Elite',
          path: '../dashboard/sellers/services/elite/videos',
          icon: <VideoCameraOutlined />,
        },
      ],
    },
    'B-Reels': {
      icon: <PlayCircleOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/reels',
          icon: <ProfileOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/reels/analytics',
          icon: <DashboardOutlined />,
        },
        {
          title: 'Orders',
          path: '../dashboard/sellers/services/reels/orders',
          icon: <ShoppingCartOutlined />,
        },
      ],
    },
    'B-Health care': {
      icon: <SafetyCertificateOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/health-care',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/health-care/analytics',
          icon: <BarChartOutlined />,
        },
        {
          title: 'Create BloomZon Elite',
          path: '../dashboard/sellers/services/elite/videos',
          icon: <StarOutlined />,
        },
      ],
    },
    'B-Food': {
      icon: <ShoppingCartOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/food',
          icon: <ShopOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/food/analytics',
          icon: <BarChartOutlined />,
        },
        {
          title: 'Create BloomZon Elite',
          path: '../dashboard/sellers/services/elite/videos',
          icon: <StarOutlined />,
        },
      ],
    },
    'B-Used Items': {
      icon: <BuildOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/used-items',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/used-items/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Automibile & Parts': {
      icon: <CarOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/automobile',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/automobile/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Real Estate': {
      icon: <ApartmentOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/real-estate',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/real-estate/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-TV': {
      icon: <VideoCameraOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/tv',
          icon: <ProfileOutlined />,
        },
        {
          title: 'Settings',
          path: '../dashboard/sellers/services/tv/settings',
          icon: <SettingOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/tv/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Products': {
      icon: <AppstoreOutlined />,
      items: [
        {
          title: 'Products',
          path: '../dashboard/products',
          icon: <TagOutlined />,
        },
      ],
    },
    'B-Live': {
      icon: <RocketOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/live',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/live/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Bidshow': {
      icon: <ScheduleOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/bidshow',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/bidshow/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Manufactures': {
      icon: <ToolOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/manufacturers',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/manufacturers/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Wholesellers': {
      icon: <DeploymentUnitOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/wholesellers',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/wholesellers/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Trueview': {
      icon: <FileSearchOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/trueview',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/trueview/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Logistics': {
      icon: <GlobalOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/logistics',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/logistics/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
    'B-Expo': {
      icon: <FlagOutlined />,
      items: [
        {
          title: 'All Sellers',
          path: '../dashboard/sellers/services/expo',
          icon: <TeamOutlined />,
        },
        {
          title: 'Analytics',
          path: '../dashboard/sellers/services/expo/analytics',
          icon: <BarChartOutlined />,
        },
      ],
    },
  }

  const legalMenuItems = [
    {
      key: 'legal-terms',
      label: 'Terms & Conditions',
      path: '../dashboard/legal/terms',
      icon: <FileProtectOutlined />,
    },
    {
      key: 'legal-privacy',
      label: 'Privacy Policy',
      path: '../dashboard/legal/privacy',
      icon: <SafetyCertificateOutlined />,
    },
    {
      key: 'legal-cookies',
      label: 'Cookie Policy',
      path: '../dashboard/legal/cookies',
      icon: <DatabaseOutlined />,
    },
    {
      key: 'legal-refunds',
      label: 'Refund & Return Policy',
      path: '../dashboard/legal/refunds',
      icon: <RollbackOutlined />,
    },
    {
      key: 'legal-country',
      label: 'Country Compliance',
      path: '../dashboard/legal/country',
      icon: <GlobalOutlined />,
    },
    {
      key: 'legal-notifications',
      label: 'Notification Policy',
      path: '../dashboard/legal/notifications',
      icon: <NotificationOutlined />,
    },
  ]

  const hiddenServiceMenuTitles = new Set(['B-Health care', 'B-Bidshow'])
  const visibleServiceEntries = Object.entries(serviceMenuConfig).filter(
    ([service]) => !hiddenServiceMenuTitles.has(service),
  )
  const bloomzonServices = visibleServiceEntries.map(([service]) => service)
  const visibleServiceMenuItems = visibleServiceEntries.map(([, config]) => config.items)

  const getSelectedMenuKey = (pathname) => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const routeEntries = [
      ['/dashboard/admin-system/overview', 'admin-system-overview'],
      ['/dashboard/admin-system/access', 'admin-system-access'],
      ['/dashboard/admin-system/orders', 'admin-system-orders'],
      ['/dashboard/admin-system/users', 'admin-system-users'],
      ['/dashboard/admin-system/content', 'admin-system-content'],
      ['/dashboard/admin-system/support', 'admin-system-support'],
      ['/dashboard/admin-system/marketing', 'admin-system-marketing'],
      ['/dashboard/admin-system/finance', 'admin-system-finance'],
      ['/dashboard/admin-system/settings', 'admin-system-settings'],
      ['/dashboard/operations/profitability', 'others-profitability'],
      ['/dashboard/operations/vendor-settlements', 'others-vendor-settlements'],
      ['/dashboard/reports/sales', 'reports-sales'],
      ['/dashboard/finance/commissions', 'finance-commissions'],
      ['/dashboard/finance/payouts', 'finance-payouts'],
      ['/dashboard/finance/refunds', 'finance-refunds'],
      ['/dashboard/finance/service-charge', 'finance-service-charge'],
      ['/dashboard/finance/vendor-settlements', 'finance-vendor-settlements'],
      ['/dashboard/finance/profitability', 'finance-profitability'],
      ['/dashboard/operations', 'operations'],
      ['/dashboard/others/admins/messages', 'support-inbox'],
      ['/dashboard/others/admins/activities', 'others-admins-activities'],
      ['/dashboard/others/admins/audit-logs', 'others-admins-audit-logs'],
      ['/dashboard/others/admins/roles', 'others-admins-roles'],
      ['/dashboard/others/admins/bussiness', 'buss'],
      ['/dashboard/others/admins/banner', 'banners'],
      ['/dashboard/others/admins', 'others-admins-all'],
      ['/dashboard/orders/products', 'admin-product-orders'],
      ['/dashboard/orders/food', 'admin-food-orders'],
      ['/dashboard/orders', 'admin-product-orders'],
      ['/dashboard/sellers/stores', 'seller-store-management'],
      ['/dashboard/sellers/paymentOptions', 'allVehicles'],
      ['/dashboard/sellers/withdrawals', 'users-withdrawals'],
      ['/dashboard/user/withdrawals', 'users-withdrawals'],
      ['/dashboard/sellers/region', 'vehicletypes'],
      ['/dashboard/sellers/shipping', 'vehicleCategories'],
      ['/dashboard/sellers/country', 'vehicleSubCategories'],
      ['/dashboard/sellers/business/type', 'BusinessTypes'],
      ['/dashboard/sellers/all', 'allsellers'],
      ['/dashboard/user/all', 'Shops'],
      ['/dashboard/products', 'b-prosa'],
      ['/dashboard/actions/profile', 'actions-profile'],
      ['/dashboard/actions/notifications', 'actions-notifications'],
      ['/dashboard/product-categories/create/categories', 'categcreate'],
      ['/dashboard/product-categories/categories', 'app-categories'],
      ['/dashboard/talent/create', 'cTalent'],
      ['/dashboard/talent/talentlist', 'talentslist'],
      ['/dashboard/talent/request', 'talentsrequest'],
      ['/dashboard/talent/contestants', 'talentscont'],
      ['/dashboard/talent/winner/products/create', 'talentswinnerzz'],
      ['/dashboard/talent/winner/products', 'talentswinner'],
      ['/dashboard/talent/winner/store', 'wStorebo'],
      ['/dashboard/talent/winner/latestStyles', 'latestS'],
      ['/dashboard/talent/settings', 'talentsForm'],
      ['/dashboard/talent/categories', 'talentsCats'],
      ['/dashboard/talent/live', 'talentsLive'],
      ['/dashboard/giftCards/users', 'giftu'],
      ['/dashboard/giftCards/brands', 'brands'],
      ['/dashboard/giftCards/category', 'catesGify'],
      ['/dashboard/giftCards', 'giftb'],
      ['/dashboard/legal/terms', 'legal-terms'],
      ['/dashboard/legal/privacy', 'legal-privacy'],
      ['/dashboard/legal/cookies', 'legal-cookies'],
      ['/dashboard/legal/refunds', 'legal-refunds'],
      ['/dashboard/legal/country', 'legal-country'],
      ['/dashboard/legal/notifications', 'legal-notifications'],
      ['/dashboard', 'home'],
    ]

    const serviceEntries = visibleServiceMenuItems.flatMap((items, serviceIndex) =>
      items.map((item, menuItemIndex) => [
        item.path.replace(/^\.\.\//, '/').replace(/\/+$/, ''),
        `service-${serviceIndex}-${menuItemIndex}`,
      ]),
    )

    if (/^\/dashboard\/sellers\/[^/]+$/.test(path)) {
      return 'allsellers'
    }

    const match = [...routeEntries, ...serviceEntries]
      .sort((left, right) => right[0].length - left[0].length)
      .find(([routePath]) => path === routePath || path.startsWith(`${routePath}/`))

    return match?.[1] || ''
  }

  const getRouteOpenKeys = (pathname) => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const nextOpenKeys = []

    if (path.includes('/sellers/')) nextOpenKeys.push('sellers')
    if (path.includes('/user/')) nextOpenKeys.push('vendor')
    if (path.includes('/admin-system/')) nextOpenKeys.push('bloomzon-admin')
    if (path.includes('/orders')) nextOpenKeys.push('orders-section')
    if (path.includes('/reports')) nextOpenKeys.push('reports')
    if (path.includes('/finance')) nextOpenKeys.push('finance')
    if (path.includes('/products')) nextOpenKeys.push('P-r')
    if (path.includes('/others/admins')) nextOpenKeys.push('others', 'others-admins-section')
    if (path.includes('/operations/profitability') || path.includes('/operations/vendor-settlements')) nextOpenKeys.push('others')
    if (path.includes('/product-categories')) nextOpenKeys.push('appsetting', 'others', 'category-section')
    if (
      path.includes('/sellers/region') ||
      path.includes('/sellers/shipping') ||
      path.includes('/sellers/country') ||
      path.includes('/sellers/business/type')
    ) {
      nextOpenKeys.push('appsetting')
    }
    if (path.includes('/talent/')) nextOpenKeys.push('talent-catch')
    if (path.includes('/giftCards')) nextOpenKeys.push('gift')
    if (path.includes('/legal')) nextOpenKeys.push('legal')

    visibleServiceMenuItems.forEach((items, serviceIndex) => {
      if (
        items.some((item) => {
          const routePath = item.path.replace(/^\.\.\//, '/').replace(/\/+$/, '')
          return path === routePath || path.startsWith(`${routePath}/`)
        })
      ) {
        nextOpenKeys.push('services-b', `${serviceIndex}services`)
      }
    })

    return Array.from(new Set(nextOpenKeys))
  }

  const selectedKey = getSelectedMenuKey(location.pathname)

  useEffect(() => {
    setOpenKeys((currentKeys) =>
      Array.from(new Set([...currentKeys, ...getRouteOpenKeys(location.pathname)])),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleItemClick = ({ key }) => {
    if (key !== 'logo') {
      onNavigate?.()
    }
  }

  return (
    <Menu
      theme='light'
      mode='inline'
      className='menu-bar flex flex-column'
      style={{ minHeight: '100vh', paddingTop: 20, overflowY: 'auto' }}
      selectedKeys={selectedKey ? [selectedKey] : []}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      onClick={handleItemClick}
    >
      <Menu.Item key='logo'>
        {toggle ? (
          <img
            src={logo}
            className='logo-image'
            style={{ width: 30, height: 30, objectFit: 'contain' }}
          />
        ) : (
          <h1 className='logo-image' style={{ color: '#F67F00', fontSize: 19 }}>
            Bloom<strong style={{ color: '#41CCC7' }}>zon</strong>
          </h1>
        )}
      </Menu.Item>
      {hasScopedAdminAccess ? (
        <Menu.Item key='home' icon={<HomeOutlined />}>
          <Link to={defaultAdminPath}>Dashboard</Link>
        </Menu.Item>
      ) : null}
      {canViewAnyAdminWorkspace ? (
      <Menu.SubMenu title='Bloomzon Admin' key='bloomzon-admin' icon={<DashboardOutlined />}>
        {canViewDashboard ? (
          <Menu.Item key='admin-system-overview' icon={<ReadOutlined />}>
            <Link to='../dashboard/admin-system/overview'>Overview</Link>
          </Menu.Item>
        ) : null}
        {canViewAccess ? (
          <Menu.Item key='admin-system-access' icon={<IdcardOutlined />}>
            <Link to='../dashboard/admin-system/access'>Access & Users</Link>
          </Menu.Item>
        ) : null}
        {canViewOrders ? (
          <Menu.Item key='admin-system-orders' icon={<ShoppingCartOutlined />}>
            <Link to='../dashboard/admin-system/orders'>Orders & Refunds</Link>
          </Menu.Item>
        ) : null}
        {canViewUsers ? (
          <Menu.Item key='admin-system-users' icon={<TeamOutlined />}>
            <Link to='../dashboard/admin-system/users'>Sellers & Buyers(KYC)</Link>
          </Menu.Item>
        ) : null}
        {canViewContent ? (
          <Menu.Item key='admin-system-content' icon={<AppstoreAddOutlined />}>
            <Link to='../dashboard/admin-system/content'>Content & Catalog</Link>
          </Menu.Item>
        ) : null}
        {canViewOrders || canViewUsers ? (
          <Menu.Item key='admin-system-support' icon={<BellOutlined />}>
            <Link to='../dashboard/admin-system/support'>Support & Alerts</Link>
          </Menu.Item>
        ) : null}
        {canViewReports ? (
          <Menu.Item key='admin-system-marketing' icon={<GiftOutlined />}>
            <Link to='../dashboard/admin-system/marketing'>Marketing</Link>
          </Menu.Item>
        ) : null}
        {canViewFinance ? (
          <Menu.Item key='admin-system-finance' icon={<DollarCircleOutlined />}>
            <Link to='../dashboard/admin-system/finance'>Finance</Link>
          </Menu.Item>
        ) : null}
        {canViewSettings ? (
          <Menu.Item key='admin-system-settings' icon={<SettingOutlined />}>
            <Link to='../dashboard/admin-system/settings'>Settings & Tools</Link>
          </Menu.Item>
        ) : null}
      </Menu.SubMenu>
      ) : null}
      {(userRole?.includes('vendor') || userRole?.includes('super')) && (
        <Menu.Item key='operations' icon={<ToolOutlined />}>
          <Link to='../dashboard/operations'>Operations</Link>
        </Menu.Item>
      )}
      {hasScopedAdminAccess && canViewOrders && (
        <Menu.Item key='support-inbox' icon={<CommentOutlined />}>
          <Link to='../dashboard/others/admins/messages'>Support Inbox</Link>
        </Menu.Item>
      )}
      {hasScopedAdminAccess && canViewOrders && (
        <Menu.SubMenu title='Orders' key='orders-section' icon={<ShoppingCartOutlined />}>
          <Menu.Item key='admin-product-orders' icon={<TagOutlined />}>
            <Link to='../dashboard/orders/products'>Product Orders</Link>
          </Menu.Item>
          <Menu.Item key='admin-food-orders' icon={<ShopOutlined />}>
            <Link to='../dashboard/orders/food'>Food Orders</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('vendor') || userRole?.includes('super')) && canViewReports && (
        <Menu.SubMenu title='Reports' key='reports' icon={<BarChartOutlined />}>
          <Menu.Item key='reports-sales' icon={<FileDoneOutlined />}>
            <Link to='../dashboard/reports/sales'>Sales Report</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('vendor') || userRole?.includes('super')) && canViewFinance && (
        <Menu.SubMenu title='Finance' key='finance' icon={<DollarCircleOutlined />}>
          <Menu.Item key='finance-commissions' icon={<ReadOutlined />}>
            <Link to='../dashboard/finance/commissions'>Commissions</Link>
          </Menu.Item>
          <Menu.Item key='finance-payouts' icon={<CreditCardOutlined />}>
            <Link to='../dashboard/finance/payouts'>Payouts</Link>
          </Menu.Item>
          <Menu.Item key='finance-refunds' icon={<RollbackOutlined />}>
            <Link to='../dashboard/finance/refunds'>Refunds</Link>
          </Menu.Item>
          <Menu.Item key='finance-service-charge' icon={<BankOutlined />}>
            <Link to='../dashboard/finance/service-charge'>Service Charge</Link>
          </Menu.Item>
          <Menu.Item key='finance-vendor-settlements' icon={<AuditOutlined />}>
            <Link to='../dashboard/finance/vendor-settlements'>Vendor Settlement</Link>
          </Menu.Item>
          <Menu.Item key='finance-profitability' icon={<DashboardOutlined />}>
            <Link to='../dashboard/finance/profitability'>Profitability</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {hasScopedAdminAccess && canViewUsers && (
        <Menu.SubMenu title='Seller' key='sellers' icon={<ShopOutlined />}>
          <Menu.Item key='allsellers' icon={<TeamOutlined />}>
            <Link to='../dashboard/sellers/all'>All Sellers</Link>
          </Menu.Item>
          <Menu.Item key='seller-store-management' icon={<InboxOutlined />}>
            <Link to='../dashboard/sellers/stores'>Store Management</Link>
          </Menu.Item>
          <Menu.Item key='allVehicles' icon={<CreditCardOutlined />}>
            <Link to='../dashboard/sellers/paymentOptions'>Payment Options</Link>
          </Menu.Item>
          <Menu.Item key='users-withdrawals' icon={<DollarCircleOutlined />}>
            <Link to='../dashboard/sellers/withdrawals'>Withdrawals</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='Inventory' key='inventory' icon={<InboxOutlined />}>
          <Menu.Item key='profile' icon={<ShopOutlined />}>
            <Link to='../dashboard/actions/profile'>Warehouse</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {hasScopedAdminAccess && canViewUsers && (
        <Menu.SubMenu title='All Users' key='vendor' icon={<TeamOutlined />}>
          <Menu.Item key='Shops' icon={<OrderedListOutlined />}>
            <Link to='../dashboard/user/all'>All Users</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('vendor') || userRole?.includes('super')) && (
        <Menu.SubMenu title='B-Products' key='P-r' icon={<AppstoreOutlined />}>
          <Menu.Item key='b-prosa' icon={<TagOutlined />}>
            <Link to='../dashboard/products'>Products</Link>
          </Menu.Item>
          <Menu.Item key='products-users' icon={<TeamOutlined />}>
            <Link to='../dashboard/user/all'>Users</Link>
          </Menu.Item>
          <Menu.Item key='products-sellers' icon={<ShopOutlined />}>
            <Link to='../dashboard/sellers/all'>Sellers</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('vendor') || userRole?.includes('super')) && (
        <Menu.SubMenu title='B-Elite' key='b-elite' icon={<StarOutlined />}>
          <Menu.Item key='bpro' icon={<ProfileOutlined />}>
            <Link to='../dashboard/user/all'>Users</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='My Actions' key='hospitality' icon={<ProfileOutlined />}>
          <Menu.Item key='actions-profile' icon={<IdcardOutlined />}>
            <Link to='../dashboard/actions/profile'>Profile</Link>
          </Menu.Item>
          <Menu.Item key='actions-notifications' icon={<BellOutlined />}>
            <Link to='../dashboard/actions/notifications'>Notifications</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='App Settings' key='appsetting' icon={<SettingOutlined />}>
          <Menu.Item key='buss' icon={<BookOutlined />}>
            <Link to='../dashboard/others/admins/bussiness'>Business</Link>
          </Menu.Item>
          <Menu.Item key='vehicletypes' icon={<GlobalOutlined />}>
            <Link to='../dashboard/sellers/region'>Regions</Link>
          </Menu.Item>
          <Menu.Item key='vehicleCategories' icon={<CarOutlined />}>
            <Link to='../dashboard/sellers/shipping'>Shippings</Link>
          </Menu.Item>
          <Menu.Item key='vehicleSubCategories' icon={<FlagOutlined />}>
            <Link to='../dashboard/sellers/country'>Country</Link>
          </Menu.Item>
          <Menu.Item key='BusinessTypes' icon={<ApartmentOutlined />}>
            <Link to='../dashboard/sellers/business/type'>Business Types</Link>
          </Menu.Item>
          <Menu.Item key='banners' icon={<FileSearchOutlined />}>
            <Link to='../dashboard/others/admins/banner'>Banner List</Link>
          </Menu.Item>
          <Menu.Item key='app-categories' icon={<TagOutlined />}>
            <Link to='../dashboard/product-categories/categories'>Categories</Link>
          </Menu.Item>
          <Menu.Item key='app-deal-settings' icon={<GiftOutlined />}>
            <Link to='../dashboard/others/admins/banner'>Deal Settings</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {hasScopedAdminAccess && canViewAccess && (
        <Menu.SubMenu title='Others' key='others' icon={<ClusterOutlined />}>
          <Menu.SubMenu title='Admins' key='others-admins-section' icon={<SafetyCertificateOutlined />}>
            <Menu.Item key='others-admins-all' icon={<OrderedListOutlined />}>
              <Link to='../dashboard/others/admins'>All</Link>
            </Menu.Item>
            <Menu.Item key='others-admins-messages' icon={<MessageOutlined />}>
              <Link to='../dashboard/others/admins/messages'>Messages</Link>
            </Menu.Item>
            <Menu.Item key='others-admins-activities' icon={<AuditOutlined />}>
              <Link to='../dashboard/others/admins/activities'>Admin Activities</Link>
            </Menu.Item>
            <Menu.Item key='others-admins-audit-logs' icon={<AuditOutlined />}>
              <Link to='../dashboard/others/admins/audit-logs'>Audit Logs</Link>
            </Menu.Item>
            <Menu.Item key='others-admins-roles' icon={<IdcardOutlined />}>
              <Link to='../dashboard/others/admins/roles'>Roles</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu title='Product Categories' key='category-section' icon={<AppstoreAddOutlined />}>
            <Menu.Item key='categ' icon={<TagOutlined />}>
              <Link to='../dashboard/product-categories/categories'>Categories</Link>
            </Menu.Item>
            <Menu.Item key='categcreate' icon={<AppstoreAddOutlined />}>
              <Link to='../dashboard/product-categories/create/categories'>Create Categories</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='Extras' key='extas' icon={<DeploymentUnitOutlined />}>
          <Menu.SubMenu title='Admins' key='extras-admins-section' icon={<ControlOutlined />}>
            <Menu.Item key='extras-admins-dropshipping' icon={<RocketOutlined />}>
              <Link to='../dashboard/others/admins'>Drop Shippings</Link>
            </Menu.Item>
            <Menu.Item key='extras-admins-request-item-quotes' icon={<MessageOutlined />}>
              <Link to='../dashboard/others/admins/messages'>Request Item Quotes</Link>
            </Menu.Item>
            <Menu.Item key='extras-admins-customizable-products' icon={<BuildOutlined />}>
              <Link to='../dashboard/others/admins/roles'>Customizable Products</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='Services' key='services-b' icon={<ApiOutlined />}>
          {bloomzonServices.map((service, index) => {
            const serviceConfig = serviceMenuConfig[service]
            const menuItems = serviceConfig.items

            return (
              <Menu.SubMenu
                title={service}
                key={`${index}services`}
                icon={serviceConfig.icon}
              >
                {menuItems.map((item, menuItemIndex) => (
                  <Menu.Item key={`service-${index}-${menuItemIndex}`} icon={item.icon}>
                    <Link to={item.path}>{item.title}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            )
          })}
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='Talent Catch' key='talent-catch' icon={<TrophyOutlined />}>
          <Menu.SubMenu title='Talent' key='talent' icon={<ProfileOutlined />}>
            <Menu.Item key='cTalent' icon={<PlayCircleOutlined />}>
              <Link to='../dashboard/talent/create'>Create Season</Link>
            </Menu.Item>
            <Menu.Item key='talentslist' icon={<OrderedListOutlined />}>
              <Link to='../dashboard/talent/talentlist'>Season List</Link>
            </Menu.Item>
            <Menu.Item key='talentsrequest' icon={<MessageOutlined />}>
              <Link to='../dashboard/talent/request/category'>Talents Request</Link>
            </Menu.Item>
            <Menu.Item key='talentscont' icon={<TeamOutlined />}>
              <Link to='../dashboard/talent/contestants/categories'>Contestant List</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu title='winnerProduct' key='winnerP' icon={<StarOutlined />}>
            <Menu.Item key='talentswinner' icon={<TagOutlined />}>
              <Link to='../dashboard/talent/winner/products'>Winner Products</Link>
            </Menu.Item>
            <Menu.Item key='talentswinnerzz' icon={<AppstoreAddOutlined />}>
              <Link to='../dashboard/talent/winner/products/create'>Create Winner Product</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu title='Store' key='Store' icon={<ShopOutlined />}>
            <Menu.Item key='wStorebo' icon={<InboxOutlined />}>
              <Link to='../dashboard/talent/winner/store'>Winner Store</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu title='Latest Style' key='latestStyle' icon={<ReadOutlined />}>
            <Menu.Item key='latestS' icon={<ProfileOutlined />}>
              <Link to='../dashboard/talent/winner/latestStyles'>Latest Styles</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key='talentsForm' icon={<ControlOutlined />}>
            <Link to='../dashboard/talent/settings'>Talent Form</Link>
          </Menu.Item>
          <Menu.Item key='talentsCats' icon={<TagOutlined />}>
            <Link to='../dashboard/talent/categories'>Talent Category</Link>
          </Menu.Item>
          <Menu.Item key='talentsLive' icon={<VideoCameraOutlined />}>
            <Link to='../dashboard/talent/live'>Live Streams</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='Registery' key='gift' icon={<GiftOutlined />}>
          <Menu.Item key='giftu' icon={<TeamOutlined />}>
            <Link to='../dashboard/giftCards/users'>Gift User</Link>
          </Menu.Item>
          <Menu.Item key='giftb' icon={<CreditCardOutlined />}>
            <Link to='../dashboard/giftCards'>Gift Cards</Link>
          </Menu.Item>
          <Menu.Item key='brands' icon={<TagOutlined />}>
            <Link to='../dashboard/giftCards/brands'>Brands</Link>
          </Menu.Item>
          <Menu.Item key='catesGify' icon={<AppstoreAddOutlined />}>
            <Link to='../dashboard/giftCards/category'>Gift Categories</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title='Legal' key='legal' icon={<FileProtectOutlined />}>
          {legalMenuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      )}
    </Menu>
  )
}

export default MenuList
