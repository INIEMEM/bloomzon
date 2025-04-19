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
  // const bloomzonServices = ["BloomZon Product", "Groceries & Beverages", "Foods & Restaurants", "Bloomzon Healthcare","Used item","Automobile & Parts", "Real Estate", "Bloomzon Reels", "Bloomzon TV", "Bloomzon Live", "Manufacturer", "TrueView", "Logistics Services" , "Bloomzon Elite"];

  const serviceMenuConfig = {
    "BloomZon Product": [
      { title: "All Sellers", path: "../dashboard/sellers/all/BloomZonProduct" },
      { title: "Payment Options", path: "../dashboard/sellers/paymentOptions/BloomZonProduct" },
      // ... other menu items for BloomZon Product
    ],
    "Groceries & Beverages": [
      { title: "All Sellers", path: "../dashboard/sellers/services/groceries-beverages" },
      { title: "Special Offers", path: "../dashboard/sellers/offers/GroceriesBeverages" }, // Example
      // ... other menu items for Groceries & Beverages
    ],
    "Bloomzon Elite": [
      { title: "All Sellers", path: "../dashboard/sellers/services/elite" },
      { title: "Payment Options", path: "../dashboard/sellers/paymentOptions/BloomzonElite" },
      { title: "Create BloomZon Elite", path: "../dashboard/sellers/services/elite/videos" },
    ],
    
    // ... configurations for ALL other services
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
      {(userRole?.includes('hospitality') || userRole?.includes('super')) &&
        (<Menu.SubMenu title = "My Actions"  key="hospitality" icon = {<BankOutlined/>} >
          <Menu.Item key="Hotel">
            <Link to='../dashboard/actions/referals'>Referals</Link>
          </Menu.Item>
          <Menu.Item key="House">
          <Link to='../dashboard/actions/transaction'>Transactions</Link>
          </Menu.Item>
          <Menu.Item key="profile">
          <Link to='../dashboard/actions/profile'> Profile</Link>
          </Menu.Item>
          <Menu.Item key="notifications">
          <Link to='../dashboard/actions/notifications'>Notifications</Link>
          </Menu.Item>
          <Menu.Item key="pays">
          <Link to='../dashboard/actions/paymentoptions'>Payment Options</Link>
          </Menu.Item>
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
           <Link to='../dashboard/others/admins/createbanner'>Create Banner</Link>
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
            <Menu.Item key="logistics">
              <Link to='../dashboard/others/admins/logistics'>Logistics Service</Link>
              </Menu.Item>
          
          
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
     
    </Menu>
  )
}

export default MenuList