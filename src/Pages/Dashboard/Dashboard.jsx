import React from 'react'
import logo from './assets/back.png'
import UserMatrxs from '../../Components/UserMatrixs/UserMatrxs'
import './dashboard.css'
import BigGraphs from '../../Components/BigGraphs/BigGraphs'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { sellerChartData, sellerChartOptions } from '../../Graphs/graphs'
import { AutomobileRepairs, BloomzonHealthCare, BloomzonLive, BloomzonProductIcon, BloomzonReel, BloomzonTv, ElliteIcon, FoodRestaurant, GroceriesIcon, LogisticsIcon, ManufacturerIcon, RealEstate, TrueView, UsedItem } from '../../Icons/icon'
import { Button } from 'antd'

const Dashboard = () => {
   
  return (
    <div style={{padding: 20}}>
      <div className='flex flex-justify-between'>
        <h1 style={{fontSize: '2rem', color: '#323232'}}>DashBoard</h1>
        <Button style={{background: 'var(--primary-color)', color: 'white', border: 'none'}}>Create Admin</Button>
      </div>
      <div className="dashboard-header-image">
        <div className='flex' style={{justifyContent:'end'}}>
         {/* <img src={logo} alt="" height={270}  style={{objectFit: 'cover', width: '50%'}}/> */}
         <div className="dashboard-header-dimmer">
            <p className='dashboard-header-dimmer-title'>All Users</p>
            <p className='dashboard-header-dimmer-sub-title'>These are all the matrixes for the different users</p>
            <div className='flex' style={{gap:20, position:'absolute', bottom:20, left: 20, right: 20}}>
              <UserMatrxs matrix= '5,600' title='All users'/>
              <UserMatrxs matrix= '3,473' title='New users'/>
              <UserMatrxs matrix= '3,473' title='Active users'/>
              <UserMatrxs matrix= '600' title='Banned users'/>
              <UserMatrxs matrix= '25' title='Suspended users'/>
            </div>
         </div>
        </div>
      </div>
      <div className="flex flex-justify-between " style={{gap:20, marginTop:20}}>
        <UserMatrxs matrix= '5,600' title='All Sellers' icon={<LogisticsIcon/>}/>
        <UserMatrxs matrix= '5,600' title='All Users' icon={<BloomzonProductIcon/>}/>
      </div>
      
      <div className='flex' style={{gap:20, marginTop: 20}}>
        <BigGraphs title='Seller Business' content={<Bar data={sellerChartData} options={sellerChartOptions} />} subTitle = 'The total Number of seller are 20' links={`../dashboard/sellers/business/seller`}/>
        <BigGraphs title='Manufacturer Business' content={<Bar data={sellerChartData} options={sellerChartOptions} />} subTitle = 'The total Number of Manufactures are 20' links={`../dashboard/sellers/business/manufacturers`}/>
        <BigGraphs title='Wholesaler Business' content={<Bar data={sellerChartData} options={sellerChartOptions}/>} subTitle = 'The total Number of wholesalers are 20' links={`../dashboard/sellers/business/wholesalers`}/>
      </div>
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 20, 
          marginTop: 20
        }}>
        <UserMatrxs matrix= '5,600' title='Bloomzon Product' icon={<BloomzonProductIcon/>}/>
        <UserMatrxs matrix= '5,600' title='Groceries & Breverages' icon={<GroceriesIcon/>}/>
        <UserMatrxs matrix= '5,600' title='Foods & Restaurants' icon={<FoodRestaurant/>}/>
        <UserMatrxs matrix= '5,600' title='Bloomzon Healthcare' icon={<BloomzonHealthCare/>
        }/>
        <UserMatrxs matrix= '5,600' title='Used Item' icon={<UsedItem/>
        }/>
        <UserMatrxs matrix= '5,600' title='Automobile & Parts ' icon={<AutomobileRepairs/>
        }/>
        <UserMatrxs matrix= '5,600' title='Real Estate' icon={<RealEstate/>
        }/>
        <UserMatrxs matrix= '5,600' title='Bloomzon Reel' icon={<BloomzonReel/>
        }/>
        <UserMatrxs matrix= '5,600' title='Bloomzon TV' icon={<BloomzonTv/>
        }/>
        <UserMatrxs matrix= '5,600' title='Bloomzon Live' icon={<BloomzonLive/>
        }/>
        <UserMatrxs matrix= '5,600' title='Manufacturer' icon={<ManufacturerIcon/>
        }/>
        <UserMatrxs matrix= '5,600' title='TrueView' icon={<TrueView/>
        }/>
        <UserMatrxs matrix= '5,600' title='Logistics Services' icon={<LogisticsIcon/>
        }/>
        <UserMatrxs matrix= '5,600' title='Bloomzon Elite' icon={<ElliteIcon/>
        }/>
      </div>
    </div>
  )
}

export default Dashboard