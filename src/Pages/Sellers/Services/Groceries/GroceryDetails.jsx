import React from 'react';
import { Statistic, Rate, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PlusOutlined,
  ShoppingCartOutlined,
  UndoOutlined,
  BoxPlotOutlined,
  CreditCardOutlined,
  MessageOutlined,
} from '@ant-design/icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InfoCard = ({ title, matrix }) => {
  return (
    <div className="border-[0.7px] border-[#ddd] rounded-md p-5 flex justify-center flex-col gap-4">
      <h3 className="text-[#41CCC7] text-[12px]">{title}</h3>
      <p className="text-lg font-semibold">{matrix}</p>
    </div>
  );
};

const ClickableCard = ({ icon, title, link }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      className="border-[0.7px] border-[#ddd] rounded-md p-5 flex justify-center flex-col items-center gap-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="text-[#41CCC7] text-2xl">{icon}</div>
      <h3 className="text-center text-[15px] font-semibold">{title}</h3>
    </div>
  );
};

const GroceryDetails = () => {
  const {groceryId} = useParams()
  // Dummy data for the top 7 cards
  const cardData = [
    { title: 'Total Orders', matrix: '1' },
    { title: 'Total Sales', matrix: '$1,627' },
    { title: 'Total Unit', matrix: '43' },
    { title: 'Current Balance', matrix: '$810' },
    { title: 'Next Payment', matrix: '15 July, 2024' },
    { title: 'Customer Feedback', matrix: <Rate disabled defaultValue={4} /> },
    { title: 'Seller Feedback', matrix: '213 reviews' },
  ];

  // Dummy data for the bar chart (last 6 months sales for the user)
  const userSalesData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Sales (NGN)',
        data: [800, 1200, 950, 1500, 1100, 1800], // Example user sales data
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
    ],
  };

  const userSalesOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend for single dataset
      },
      title: {
        display: true,
        text: 'Your Sales Performance (Last 6 Months)',
      },
    },
  };

  return (
    <motion.div
      className="p-[20px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-[2rem] font-bold mb-4">Grocery Seller Details</h1>

      {/* Top 7 Cards Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cardData.map((item, index) => (
          <InfoCard key={index} title={item.title} matrix={item.matrix} />
        ))}
        {/* Ensure there are 4 items in the first row, so add an empty div if needed */}
     
        {/* Render the remaining cards in the second row */}
        {/* {cardData.map((item, index) => (
          <InfoCard key={index + 4} title={item.title} matrix={item.matrix} />
        ))} */}
      </div>

      {/* Bar Chart and Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart and Statistics */}
        <div>
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Statistic title="Last 30 Days" value={450.75} prefix="$" />
            <Statistic
              title="Previous 30 Days"
              value={18}
              suffix="%"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Statistic
              title="Last Year"
              value={40}
              suffix="%"
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </div>
          {/* Bar Chart */}
          <div className="border-[0.7px] border-[#ddd] rounded-md p-5">
            <Bar data={userSalesData} options={userSalesOptions} />
          </div>
        </div>

        {/* Clickable Cards */}
        <div className="grid grid-cols-2 gap-4">
          <ClickableCard icon={<PlusOutlined />} title="Add Products" link={`/dashboard/sellers/services/groceries-beverages/${groceryId}/add-product`} />
          <ClickableCard icon={<ShoppingCartOutlined />} title="Manage Orders" link={`/dashboard/sellers/services/groceries-beverages/${groceryId}/manage-orders`} />
          <ClickableCard icon={<UndoOutlined />} title="Manage Returns" link={`/dashboard/sellers/services/groceries-beverages/${groceryId}/manage-returns`} />
          <ClickableCard icon={<BoxPlotOutlined />} title="Manage Inventory"  link={`/dashboard/sellers/services/groceries-beverages/${groceryId}/manage-inventory`}/>
          <ClickableCard icon={<CreditCardOutlined />} title="Payments" link={`/dashboard/sellers/services/groceries-beverages/${groceryId}/payments`} />
          <ClickableCard icon={<MessageOutlined />} title="Communications" link="/communications" />
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryDetails;