import React from 'react';
import { Card, Space } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const PaymentGroceryPage = () => {
  // Dummy data for wallet balance
  const walletBalance = {
    totalBalanceText: 'Total Balance',
    amount: '$310',
    nextPaymentText: 'The Next payment is on',
    nextPaymentDate: '08/12/2024',
  };

  // Dummy data for recent payouts
  const recentPayouts = [
    { amount: '$210', initiatedDate: 'Aug 04, 2024', paymentType: 'Weekly payment' },
    { amount: '$155', initiatedDate: 'Jul 28, 2024', paymentType: 'Weekly payment' },
    { amount: '$85', initiatedDate: 'Jul 21, 2024', paymentType: 'Ad-hoc payment' },
    { amount: '$280', initiatedDate: 'Jul 14, 2024', paymentType: 'Weekly payment' },
    // Add more payout data as needed
  ];

  return (
    <motion.div
      className="p-[20px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-[2rem] font-bold mb-6">Payment Details</h1>

      {/* Wallet Balance Section */}
      <div
        className="w-[550px] rounded-md h-[100px] bg-[#F67F00]/20 p-4 flex flex-col justify-between mb-8"
      >
        <p className="text-gray-700 text-sm">{walletBalance.totalBalanceText}</p>
        <p className="text-lg font-semibold text-[#F67F00]">{walletBalance.amount}</p>
        <p className="text-gray-700 text-xs">
          {walletBalance.nextPaymentText} {walletBalance.nextPaymentDate}
        </p>
      </div>

      {/* Recent Payouts Section */}
      <h2 className="text-xl font-semibold mb-4">Recent Payouts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentPayouts.map((payout, index) => (
          <Card key={index} className="shadow-md">
            <p className="text-lg font-semibold">{payout.amount}</p>
            <p className="text-gray-600 text-sm">Initiated: {payout.initiatedDate}</p>
            <Space>
              <GiftOutlined className="text-lg" />
              <p className="text-gray-700 text-sm">{payout.paymentType}</p>
            </Space>
          </Card>
        ))}
        {recentPayouts.length === 0 && <p>No recent payouts to display.</p>}
      </div>
    </motion.div>
  );
};

export default PaymentGroceryPage;