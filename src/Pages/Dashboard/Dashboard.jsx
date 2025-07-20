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
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Dashboard = () => {
  const carouselItems = [
    {
      title: 'All Users',
      subtitle: 'These are all the matrixes for the different users',
      stats: [
        { matrix: '5,600', title: 'All users' },
        { matrix: '3,473', title: 'New users' },
        { matrix: '3,473', title: 'Active users' },
        { matrix: '600', title: 'Banned users' },
        { matrix: '25', title: 'Suspended users' },
      ],
      class: 'dashboard-header-image1'
    },

    {
      title: 'All Sellers',
      subtitle: 'These are all the matrixes for the different sellers',
      stats: [
        { matrix: '5,600', title: 'All users' },
        { matrix: '3,473', title: 'New users' },
        { matrix: '3,473', title: 'Active users' },
        { matrix: '600', title: 'Banned users' },
        { matrix: '25', title: 'Suspended users' },
      ],
      class: 'dashboard-header-image2'
    },
    {
      title: 'All Consumers',
      subtitle: 'These are all the matrixes for the different users',
      stats: [
        { matrix: '5,600', title: 'All users' },
        { matrix: '3,473', title: 'New users' },
        { matrix: '3,473', title: 'Active users' },
        { matrix: '600', title: 'Banned users' },
        { matrix: '25', title: 'Suspended users' },
      ],
      class: 'dashboard-header-image3'
    },
    
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000, 
    speed: 1000,         
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div style={{padding: 20}}>
      <div className='flex flex-justify-between'>
        <h1 style={{fontSize: '2rem', color: '#323232'}}>DashBoard</h1>
        <Button style={{background: 'var(--primary-color)', color: 'white', border: 'none'}}>Create Admin</Button>
      </div>
      <Slider {...settings}>
      {carouselItems.map((item, index) => (
        <div key={index} className={`dashboard-header-image ${item.class}`}>
          <div className="flex" style={{ justifyContent: 'end' }}>
            <div className="dashboard-header-dimmer">
              <p className="dashboard-header-dimmer-title ">{item.title}</p>
              <p className="dashboard-header-dimmer-sub-title ">{item.subtitle}</p>
              <div
                className="flex"
                style={{
                  gap: 20,
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
              >
                {item.stats.map((stat, i) => (
                  <UserMatrxs key={i} matrix={stat.matrix} title={stat.title} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
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