import React, { useState } from 'react';
import { Tabs, Card, Button, Space, Tag, Modal } from 'antd';
import { motion } from 'framer-motion';

const { TabPane } = Tabs;

const StatusMatrixCard = ({ title, count }) => {
  return (
    <div className="border-[0.7px] border-[#ddd] rounded-md p-5 flex justify-center flex-col gap-2 items-center">
      <h3 className="text-[#41CCC7] text-[14px] font-semibold">{title}</h3>
      <p className="text-lg font-bold">{count}</p>
    </div>
  );
};

const ManageGReturns = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORDER-001',
      image: 'https://via.placeholder.com/80',
      title: 'Awesome Gadget X',
      price: 49.99,
      date: '2025-04-12',
      status: 'pending',
      shipToName: 'John Doe',
      shipToAddress: '123 Main St, Anytown',
      shipBy: '2025-04-15',
      deliverBy: '2025-04-18',
      shippingService: 'Standard',
      orderItems: [
        { itemId: 'ITEM-001-1', status: 'pending', quantity: 1, unitPrice: 49.99 },
      ],
      taxTotal: 2.50,
    },
    {
      id: 'ORDER-002',
      image: 'https://via.placeholder.com/80',
      title: 'Stylish T-Shirt',
      price: 25.00,
      date: '2025-04-11',
      status: 'processing',
      shipToName: 'Jane Smith',
      shipToAddress: '456 Oak Ave, Somecity',
      shipBy: '2025-04-14',
      deliverBy: '2025-04-17',
      shippingService: 'Premium',
      orderItems: [
        { itemId: 'ITEM-002-1', status: 'processing', quantity: 2, unitPrice: 25.00 },
      ],
      taxTotal: 3.75,
    },
    {
      id: 'ORDER-003',
      image: 'https://via.placeholder.com/80',
      title: 'Comfortable Shoes',
      price: 79.95,
      date: '2025-04-10',
      status: 'cancelled',
      shipToName: 'Peter Jones',
      shipToAddress: '789 Pine Ln, Otherville',
      shipBy: '2025-04-13',
      deliverBy: '2025-04-16',
      shippingService: 'Standard',
      orderItems: [
        { itemId: 'ITEM-003-1', status: 'cancelled', quantity: 1, unitPrice: 79.95 },
      ],
      taxTotal: 6.00,
    },
    {
      id: 'ORDER-004',
      image: 'https://via.placeholder.com/80',
      title: 'Smart Watch Pro',
      price: 129.00,
      date: '2025-04-09',
      status: 'delivered',
      shipToName: 'Alice Brown',
      shipToAddress: '101 Elm Rd, Elsewhere',
      shipBy: '2025-04-12',
      deliverBy: '2025-04-15',
      shippingService: 'Premium',
      orderItems: [
        { itemId: 'ITEM-004-1', status: 'delivered', quantity: 1, unitPrice: 129.00 },
      ],
      taxTotal: 9.50,
    },
    {
      id: 'ORDER-005',
      image: 'https://via.placeholder.com/80',
      title: 'Ergonomic Keyboard',
      price: 59.00,
      date: '2025-04-08',
      status: 'pending',
      shipToName: 'Samuel Lee',
      shipToAddress: '222 Oak St, Anytown',
      shipBy: '2025-04-16',
      deliverBy: '2025-04-19',
      shippingService: 'Standard',
      orderItems: [
        { itemId: 'ITEM-005-1', status: 'pending', quantity: 1, unitPrice: 59.00 },
      ],
      taxTotal: 4.25,
    },
  ]);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const newOrders = orders.filter(order => order.status === 'pending'); // Assuming 'pending' are new orders

  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const showOrderDetails = (order) => {
    setSelectedOrderDetails(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrderDetails(null);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="yellow">{status.toUpperCase()}</Tag>;
      case 'processing':
        return <Tag color="blue">{status.toUpperCase()}</Tag>;
      case 'cancelled':
        return <Tag color="red">{status.toUpperCase()}</Tag>;
      case 'delivered':
        return <Tag color="green">{status.toUpperCase()}</Tag>;
      default:
        return <Tag>{status.toUpperCase()}</Tag>;
    }
  };

  return (
    <motion.div
      className="p-[20px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="text-[2rem] font-bold mb-4">Manage Refunds</h1>

      {/* Status Matrix */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatusMatrixCard title="Pending" count={pendingOrders.length} />
        <StatusMatrixCard title="Processing" count={processingOrders.length} />
        <StatusMatrixCard title="Cancelled" count={cancelledOrders.length} />
        <StatusMatrixCard title="Delivered" count={deliveredOrders.length} />
      </div> */}

      {/* Order Tabs */}
      <Tabs defaultActiveKey="new">
        {/* <TabPane tab="New Orders" key="new">
          {newOrders.map(order => (
            <Card key={order.id} className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={order.image} alt={order.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{order.title}</h3>
                    <p className="text-gray-600">Price: ${order.price.toFixed(2)}</p>
                    <p className="text-gray-600">Order ID: {order.id}</p>
                    <p className="text-gray-600">Date: {order.date}</p>
                  </div>
                </div>
                <div>
                  {getStatusTag(order.status)}
                  <Button className="ml-2" onClick={() => showOrderDetails(order)}>View Details</Button>
                </div>
              </div>
            </Card>
          ))}
          {newOrders.length === 0 && <p>No new orders.</p>}
        </TabPane> */}
        <TabPane tab="Pending" key="pending">
          {pendingOrders.map(order => (
            <Card key={order.id} className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={order.image} alt={order.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{order.title}</h3>
                    <p className="text-gray-600">Price: ${order.price.toFixed(2)}</p>
                    <p className="text-gray-600">Order ID: {order.id}</p>
                    <p className="text-gray-600">Date: {order.date}</p>
                  </div>
                </div>
                <div>
                  {getStatusTag(order.status)}
                  <Button className="ml-2" onClick={() => showOrderDetails(order)}>View Details</Button>
                </div>
              </div>
            </Card>
          ))}
          {pendingOrders.length === 0 && <p>No pending orders.</p>}
        </TabPane>
        <TabPane tab="All Refunds" key="all">
          {orders.map(order => (
            <Card key={order.id} className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={order.image} alt={order.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{order.title}</h3>
                    <p className="text-gray-600">Price: ${order.price.toFixed(2)}</p>
                    <p className="text-gray-600">Order ID: {order.id}</p>
                    <p className="text-gray-600">Date: {order.date}</p>
                  </div>
                </div>
                <div>
                  {getStatusTag(order.status)}
                  <Button className="ml-2" onClick={() => showOrderDetails(order)}>View Details</Button>
                </div>
              </div>
            </Card>
          ))}
          {orders.length === 0 && <p>No orders found.</p>}
        </TabPane>
        <TabPane tab="Completed" key="processed">
          {[...processingOrders, ...deliveredOrders].map(order => (
            <Card key={order.id} className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={order.image} alt={order.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{order.title}</h3>
                    <p className="text-gray-600">Price: ${order.price.toFixed(2)}</p>
                    <p className="text-gray-600">Order ID: {order.id}</p>
                    <p className="text-gray-600">Date: {order.date}</p>
                  </div>
                </div>
                <div>
                  {getStatusTag(order.status)}
                  <Button className="ml-2" onClick={() => showOrderDetails(order)}>View Details</Button>
                </div>
              </div>
            </Card>
          ))}
          {[...processingOrders, ...deliveredOrders].length === 0 && <p>No processed orders.</p>}
        </TabPane>
      </Tabs>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <Modal
          title={`Order Details - ${selectedOrderDetails.id}`}
          visible={true}
          onCancel={closeOrderDetails}
          footer={[
            <Button key="back" onClick={closeOrderDetails}>
              Close
            </Button>,
          ]}
          width={800}
        >
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><strong>Order ID:</strong> {selectedOrderDetails.id}</div>
            <div><strong>Ship By:</strong> {selectedOrderDetails.shipBy}</div>
            <div><strong>Deliver By:</strong> {selectedOrderDetails.deliverBy}</div>
            <div><strong>Shipping Service:</strong> {selectedOrderDetails.shippingService}</div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Ship To</h3>
          <div className="mb-4">
            <p><strong>Name:</strong> {selectedOrderDetails.shipToName}</p>
            <p><strong>Address:</strong> {selectedOrderDetails.shipToAddress}</p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Order Details</h3>
          <ul>
            {selectedOrderDetails.orderItems.map(item => (
              <li key={item.itemId} className="mb-2">
                <strong>Order Item ID:</strong> {item.itemId},
                <strong>Status:</strong> {getStatusTag(item.status)},
                <strong>Quantity:</strong> {item.quantity},
                <strong>Unit Price:</strong> ${item.unitPrice.toFixed(2)}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-4">Order Total</h3>
          <div className="flex justify-end flex-col items-end gap-2">
            <p><strong>Item Total:</strong> ${selectedOrderDetails.orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2)}</p>
            <p><strong>Tax Total:</strong> ${selectedOrderDetails.taxTotal.toFixed(2)}</p>
            <p className="text-xl font-bold"><strong>Grand Total:</strong> ${(selectedOrderDetails.orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) + selectedOrderDetails.taxTotal).toFixed(2)}</p>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default ManageGReturns;