import { Menu } from 'antd'
import { HomeOutlined, CarOutlined, ShoppingOutlined, BankOutlined, UserOutlined,UsergroupAddOutlined  } from '@ant-design/icons'
import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MainContext } from '../../Context/Context'
import '../../Components/components.css'
import logo from '../../Layouts/assets/bloomzon.png';
const MenuList = ({toggle}) => {
  const {currentUser} =  useContext(MainContext);
  const [userRole, setUserRole] = useState('super');
  const [adminType, setAdminType] = useState('driver');
  const [selectedKey, setSelectedKey] = useState('home');
  // const [services, setServices] = useState(null);
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  }; 
 
  const keys =  ['home', 'driver', 'vendor', 'hospitality','rentals' ];
 

  const serviceMenuConfig = {
    // "BloomZon Product": [
    //   { title: "All Sellers", path: "../dashboard/sellers/all/BloomZonProduct" },
    //   { title: "Payment Options", path: "../dashboard/sellers/paymentOptions/BloomZonProduct" },
     
    // ],
    "Groceries & Beverages": [
      { title: "All Sellers", path: "../dashboard/sellers/services/groceries-beverages" },
      { title: "Analytics", path: "../dashboard/sellers/services/groceries-beverages/analytics" },
      { title: "Management", path: "../dashboard/sellers/services/groceries-beverages/management" },
      { title: "Special Offers", path: "../dashboard/sellers/offers/GroceriesBeverages" }, 
     
    ],
    "B-Elite": [
      { title: "All Sellers", path: "../dashboard/sellers/services/elite" },
      { title: "Payment Options", path: "../dashboard/sellers/paymentOptions/BloomzonElite" },
      { title: "Create BloomZon Elite", path: "../dashboard/sellers/services/elite/videos" },
    ],
    "B-Reels": [
      { title: "All Sellers", path: "../dashboard/sellers/services/reels" },
      { title: "Analytics", path: "../dashboard/sellers/services/reels/analytics" },
      { title: "Create BloomZon Elite", path: "../dashboard/sellers/services/elite/videos" },
    ],
    "B-Health care": [
      { title: "All Sellers", path: "../dashboard/sellers/services/health-care" },
      { title: "Analytics", path: "../dashboard/sellers/services/health-care/analytics" },
      { title: "Create BloomZon Elite", path: "../dashboard/sellers/services/elite/videos" },
    ],
    "B-Food": [
      { title: "All Sellers", path: "../dashboard/sellers/services/food" },
      { title: "Analytics", path: "../dashboard/sellers/services/food/analytics" },
      { title: "Create BloomZon Elite", path: "../dashboard/sellers/services/elite/videos" },
    ],
    "B-Used Items": [
      { title: "All Sellers", path: "../dashboard/sellers/services/used-items" },
      { title: "Analytics", path: "../dashboard/sellers/services/used-items/analytics" },
     
    ],
    "B-Automibile & Parts": [
      { title: "All Sellers", path: "../dashboard/sellers/services/automobile" },
      { title: "Analytics", path: "../dashboard/sellers/services/automobile/analytics" },
     
    ],
    "B-Real Estate": [
      { title: "All Sellers", path: "../dashboard/sellers/services/real-estate" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-TV": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Products": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Live": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Bidshow": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Manufactures": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Wholesellers": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Trueview": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Logistics": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
    "B-Expo": [
      { title: "All Sellers", path: "../dashboard/sellers/services/tv" },
      { title: "Analytics", path: "../dashboard/sellers/services/real-estate/analytics" },
     
    ],
  };

  const bloomzonServices = Object.keys(serviceMenuConfig); // Get the services from the config

 
  return (
    <Menu theme='light' mode='inline' className='menu-bar flex flex-column' style={{minHeight: '100vh', paddingTop:20, overflowY: 'auto'}} selectedKeys={[selectedKey]} onClick={handleMenuClick} 
    >
      <Menu.Item key='logo'>
        {toggle ? (<img src={logo} className='logo-image' style={{width:30, height:30, objectFit:'contain'}}/>) : (<h1 className='logo-image' style={{color: '#F67F00', fontSize: 19}}>Bloom<strong style={{color: '#41CCC7'}}>zon</strong> </h1>)}
      </Menu.Item>
      <Menu.Item key="home" icon = {<HomeOutlined/>}>
        <Link to='/dashboard'>Dashboard</Link>
      </Menu.Item>
      {(userRole?.includes('driver') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "Seller" key="sellers" icon = {<CarOutlined/>}>
          <Menu.Item key="allsellers">
             <Link to="../dashboard/sellers/all">All Sellers</Link>
           </Menu.Item> 
          <Menu.Item key="allVehicles">
             <Link to='../dashboard/sellers/paymentOptions'>Payment Options</Link>
           </Menu.Item> 
            
           
       </Menu.SubMenu>)
      }
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "Inventory"  key="inventory" icon = {<BankOutlined/>} >
          {/* <Menu.Item key="Hotel">
            <Link to='../dashboard/actions/referals'>Referals</Link>
          </Menu.Item> */}
          {/* <Menu.Item key="House">
          <Link to='../dashboard/actions/transaction'>Transactions</Link>
          </Menu.Item> */}
          <Menu.Item key="profile">
          <Link to='../dashboard/actions/profile'> WareHouse</Link>
          </Menu.Item>
          {/* <Menu.Item key="notifications">
          <Link to='../dashboard/actions/notifications'>Notifications</Link>
          </Menu.Item> */}
          {/* <Menu.Item key="pays">
          <Link to='../dashboard/actions/paymentoptions'>Payment Options</Link>
          </Menu.Item> */}
        </Menu.SubMenu>)
      }
      {(userRole?.includes('vendor') || userRole?.includes('super')) && (
        (<Menu.SubMenu title="Users" key="vendor" icon={<ShoppingOutlined />}>
          <Menu.Item key='Shops' >
            <Link to='../dashboard/user/all'>users</Link>
          </Menu.Item>
          {/* <Menu.Item key="vendorList">Vendor List</Menu.Item> */}
          <Menu.Item key="orders">
            <Link to='../dashboard/user/withdrawals'>Withdrawals</Link>
          </Menu.Item>
          {/* <Menu.Item key="delivery">
            <Link to="vendor/delivery/prices">
              Delivery Prices
            </Link>
          </Menu.Item> */}
          <Menu.Item key="pickup">
            <Link to='vendor/servicecharge'>
            Service Charges
              </Link>  
          </Menu.Item>
        </Menu.SubMenu>)
      )}
      {(userRole?.includes('vendor') || userRole?.includes('super')) && (
        (<Menu.SubMenu title="B-Products" key="P-r" icon={<ShoppingOutlined />}>
          <Menu.Item key='b-prosa' >
            <Link to='../dashboard/user/all'>Products</Link>
          </Menu.Item>
          {/* <Menu.Item key="vendorList">Vendor List</Menu.Item> */}
          <Menu.Item key="sales">
            <Link to='../dashboard/user/withdrawals'>Sales</Link>
          </Menu.Item>
          <Menu.Item key="orders">
            <Link to='../dashboard/user/withdrawals'>Orders</Link>
          </Menu.Item>
          <Menu.Item key="b-mees">
            <Link to='../dashboard/user/withdrawals'>Messages</Link>
          </Menu.Item>
          <Menu.Item key="b-p-users">
            <Link to='../dashboard/user/withdrawals'>Users</Link>
          </Menu.Item>
          <Menu.SubMenu key="b-p-sellrs">
            <Menu.Item key="b-p-seller">      
              <Link to='../dashboard/user/withdrawals'>Sellers</Link>
            </Menu.Item>
            <Menu.Item key="b-p-stores">
            <Link to='../dashboard/user/withdrawals'>Stores</Link>
          </Menu.Item>
          </Menu.SubMenu>
          {/* <Menu.Item key="delivery">
            <Link to="vendor/delivery/prices">
              Delivery Prices
            </Link>
          </Menu.Item> */}
          <Menu.Item key="pickup">
            <Link to='vendor/servicecharge'>
            Service Charges
              </Link>  
          </Menu.Item>
        </Menu.SubMenu>)
      )}
      {(userRole?.includes('vendor') || userRole?.includes('super')) && (
        (<Menu.SubMenu title="B-Elite" key="b-elite" icon={<ShoppingOutlined />}>
          <Menu.Item key='bpro' >
            <Link to='../dashboard/user/all'>users</Link>
          </Menu.Item>
          {/* <Menu.Item key="vendorList">Vendor List</Menu.Item> */}
          <Menu.Item key="orders">
            <Link to='../dashboard/user/withdrawals'>Withdrawals</Link>
          </Menu.Item>
          {/* <Menu.Item key="delivery">
            <Link to="vendor/delivery/prices">
              Delivery Prices
            </Link>
          </Menu.Item> */}
          <Menu.Item key="pickup">
            <Link to='vendor/servicecharge'>
            Service Charges
              </Link>  
          </Menu.Item>
        </Menu.SubMenu>)
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "My Actions"  key="hospitality" icon = {<BankOutlined/>} >
          {/* <Menu.Item key="Hotel">
            <Link to='../dashboard/actions/referals'>Referals</Link>
          </Menu.Item> */}
          {/* <Menu.Item key="House">
          <Link to='../dashboard/actions/transaction'>Transactions</Link>
          </Menu.Item> */}
          <Menu.Item key="profile">
          <Link to='../dashboard/actions/profile'> Profile</Link>
          </Menu.Item>
          <Menu.Item key="notifications">
          <Link to='../dashboard/actions/notifications'>Notifications</Link>
          </Menu.Item>
          {/* <Menu.Item key="pays">
          <Link to='../dashboard/actions/paymentoptions'>Payment Options</Link>
          </Menu.Item> */}
        </Menu.SubMenu>)
      }
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "App Settings"  key="appsetting" icon = {<BankOutlined/>} >
            <Menu.Item key="buss">
              <Link to='../dashboard/others/admins/bussiness'>Business</Link>
            </Menu.Item>
            <Menu.Item key="vehicletypes">
             <Link to='../dashboard/sellers/region'>Regions</Link>
           </Menu.Item> 
           <Menu.Item key="vehicleCategories">
             <Link to='../dashboard/sellers/shipping'>Shippings</Link>
           </Menu.Item> 
           <Menu.Item key="vehicleSubCategories">
           <Link to='../dashboard/sellers/country'>Country</Link>
           </Menu.Item> 
           <Menu.Item key="BusinessTypes">
           <Link to='../dashboard/sellers/business/type'>Business Types</Link>
           </Menu.Item>
           <Menu.Item key="banners">
           <Link to='../dashboard/others/admins/banner'>Banner List</Link>
           </Menu.Item>
           
           <Menu.Item key="createbanner">
           <Link to='../dashboard/others/admins/createbanner'>Categories</Link>
           </Menu.Item>
           <Menu.Item key="createbanner">
           <Link to='../dashboard/others/admins/createbanner'>Deal Settings</Link>
           </Menu.Item>
        </Menu.SubMenu>)
      }
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "Others"  key="others" icon = {<BankOutlined/>} >
            <Menu.SubMenu title="Admins" key='Talents-section' >
              <Menu.Item key="allad">
                <Link to='../dashboard/others/admins'>All</Link>
              </Menu.Item>
              <Menu.Item key="admes">
              <Link to='../dashboard/others/admins/messages'>Messages</Link>
              </Menu.Item>
              <Menu.Item key="createbanner">
           <Link to='../dashboard/others/admins/createbanner'>Admin Activities</Link>
           </Menu.Item>
              <Menu.Item key="adroles">
              <Link to='../dashboard/others/admins/roles'>Roles</Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Product Categories" key='category-section'>
              <Menu.Item key="categ">
              <Link to='../dashboard/product-categories/categories'>Categories</Link>
              </Menu.Item>
              <Menu.Item key="categcreate">
              <Link to='../dashboard/product-categories/create/categories'>Create Categores</Link>
              </Menu.Item>
            </Menu.SubMenu>
            {/* <Menu.Item key="logistics">
              <Link to='../dashboard/others/admins/logistics'>Logistics Service</Link>
              </Menu.Item> */}
          
          
        </Menu.SubMenu>)
      }
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "Extras"  key="extas" icon = {<BankOutlined/>} >
            <Menu.SubMenu title="Admins" key='Talents-section' >
              <Menu.Item key="allad">
                <Link to='../dashboard/others/admins'>Drop shippings</Link>
              </Menu.Item>
              <Menu.Item key="admes">
              <Link to='../dashboard/others/admins/messages'>Request Item Quotes</Link>
              </Menu.Item>
              <Menu.Item key="adroles">
              <Link to='../dashboard/others/admins/roles'>Customizable Products</Link>
              </Menu.Item>
            </Menu.SubMenu>
            
            {/* <Menu.Item key="logistics">
              <Link to='../dashboard/others/admins/logistics'>Logistics Service</Link>
              </Menu.Item> */}
          
          
        </Menu.SubMenu>)
      }
       {(userRole?.includes('hospitality') || userRole?.includes('super')) && (
        <Menu.SubMenu title="Services" key="services-b" icon={<BankOutlined />}>
          {bloomzonServices.map((service, index) => {
            const menuItems = serviceMenuConfig[service]; // Get menu items for this service

            return (
              <Menu.SubMenu title={service} key={`${index}services`}>
                {menuItems.map((item, menuItemIndex) => (
                  <Menu.Item key={`${index}-${menuItemIndex}`}> {/* Unique key */}
                    <Link to={item.path}>{item.title}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          })}
        </Menu.SubMenu>
      )}
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "Talent Catch"  key="talent-catch" icon = {<BankOutlined/>} >
            <Menu.SubMenu title='Talent' key='talent'>

              <Menu.Item key="cTalent">
                <Link to='../dashboard/talent/create'>Create Season</Link>
              </Menu.Item>
              <Menu.Item key="talentslist">
              <Link to='../dashboard/talent/talentlist'>Season List</Link>
              </Menu.Item>  
              <Menu.Item key="talentsrequest">
              <Link to='../dashboard/talent/request/category'>Talents Request</Link>
              </Menu.Item>  
              <Menu.Item key="talentscont">
              <Link to='../dashboard/talent/contestants/categories'>Contestant List</Link>
              </Menu.Item> 
            </Menu.SubMenu>
            <Menu.SubMenu title='winnerProduct' key='winnerP'>
              <Menu.Item key="talentswinner">
              <Link to='../dashboard/talent/winner/products'>Winner Products</Link>
              </Menu.Item> 
              <Menu.Item key="talentswinnerzz">create
              <Link to='../dashboard/talent/winner/products/'>Create winner Product</Link>
              </Menu.Item> 
            </Menu.SubMenu>
            <Menu.SubMenu title='Store' key='Store'>
              <Menu.Item key='wStorebo'>
                <Link to='../dashboard/talent/winner/store'> winner Store</Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title='Latest Style' key='latestStyle'>
                <Menu.Item key='latestS'>
                  <Link to='../dashboard/talent/winner/latestStyles'>Latest Styles</Link>
                </Menu.Item>
            </Menu.SubMenu>
              <Menu.Item key="talentsForm">
                <Link to='../dashboard/talent/settings'>Talent Form</Link>
              </Menu.Item>
              <Menu.Item key="talentsCats">
                <Link to='../dashboard/talent/categories'>Talent Category </Link>
              </Menu.Item>
              <Menu.Item key="talentsLive">
                <Link to='../dashboard/talent/live'>Live Streams </Link>
              </Menu.Item>        
        </Menu.SubMenu>)
      }
       {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = " Registery"  key="gift" icon = {<BankOutlined/>} >
          <Menu.Item key="giftu">
              <Link to='../dashboard/giftCards/users'>Gift User</Link>
            </Menu.Item>
            <Menu.Item key="giftb">
              <Link to='../dashboard/giftCards'>Gift Cards</Link>
            </Menu.Item>
            <Menu.Item key="brands">
              <Link to='../dashboard/giftCards/brands'>Brands</Link>
            </Menu.Item>
            <Menu.Item key="catesGify">
              <Link to='../dashboard/giftCards/category'>Gift Categories</Link>
            </Menu.Item>

            
        </Menu.SubMenu>)
      }
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "Legal"  key="legal" icon = {<BankOutlined/>} >
          {/* <Menu.Item key="Hotel">
            <Link to='../dashboard/actions/referals'>Referals</Link>
          </Menu.Item> */}
          {/* <Menu.Item key="House">
          <Link to='../dashboard/actions/transaction'>Transactions</Link>
          </Menu.Item> */}
          <Menu.Item key="profile">
          <Link to='../dashboard/actions/profile'> Country</Link>
          </Menu.Item>
          <Menu.Item key="notifications">
          <Link to='../dashboard/actions/notifications'>Notifications</Link>
          </Menu.Item>
          {/* <Menu.Item key="pays">
          <Link to='../dashboard/actions/paymentoptions'>Payment Options</Link>
          </Menu.Item> */}
        </Menu.SubMenu>)
      }
    </Menu>
  )
}

export default MenuList