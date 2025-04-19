import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Image, Tag, Rate, Collapse, List, Avatar, Skeleton, Statistic, Modal, } from 'antd';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import moment from 'moment';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Panel } = Collapse;

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categorySales, setCategorySales] = useState({});
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://blosom-tv-server.onrender.com/WinnersProduct');
            const salesData = response.data.result;
            const productData = response.data.result;
            setProducts(productData);
          // Process sales data for the last 6 months
          const sixMonthsAgo = moment().subtract(6, 'months');
          const filteredSales = salesData.filter(sale => moment(sale.date).isAfter(sixMonthsAgo));

          const salesByCategory = {};
          console.log(filteredSales)
        
          filteredSales.forEach(sale => {
            const product = productData.find(p => p.productId === sale.productId); // Use productData here
            if (product) {
                const category = product.type;
                salesByCategory[category] = (salesByCategory[category] || 0) + sale.price;
            }

          });
          setCategorySales(salesByCategory);

          console.log('the category sales', categorySales)
         


            // Calculate category counts
            const categoryCounts = {};
            productData.forEach(product => {
                const category = product.type;
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
            setCategories(Object.entries(categoryCounts));

        } catch (err) {
            setError(err);
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://blosom-tv-server.onrender.com/orders'); // Adjust endpoint
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchProducts();
    fetchOrders();
}, []);

const chartData = {
  labels: Object.keys(categorySales),
  datasets: [
      {
          label: 'Sales (Last 6 Months)',
          data: Object.values(categorySales),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // Customize bar color
      },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
      legend: {
          position: 'top',
      },
      title: {
          display: true,
          text: 'Category Sales (Last 6 Months)'
      }
  },
  scales: {
      x: {
          title: {
              display: true,
              text: 'Product Category'
          }
      },
      y: {
          title: {
              display: true,
              text: 'Sales Amount'
          }
      }
  }
};

const openModal = (product) => {
  setSelectedProduct(product);
  setIsModalVisible(true);
};

const closeModal = () => {
  setIsModalVisible(false);
  setSelectedProduct(null);
};


const handleCategoryClick = (category) => {
  setSelectedCategory(category);
};
const filteredProducts = selectedCategory
? products.filter(product => product.type === selectedCategory)
: products;
  

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error.message}</div>; 
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const getProductSalesData = (productId) => {
    const sixMonthsAgo = moment().subtract(6, 'months');
    const filteredOrders = orders.filter(order => 
      order.productId === productId && moment(order.date).isAfter(sixMonthsAgo)
    );

    return {
      totalRevenue: filteredOrders.reduce((sum, order) => sum + order.price, 0),
      totalOrders: filteredOrders.length,
      customers: filteredOrders.map(order => order.customer)
    };
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ padding: '20px' }}
    >
      <h1>Winner Products</h1>
      
      <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
                {categories.map(([category, count]) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={category}>
                        <Card
                            onClick={() => handleCategoryClick(category)}
                            style={{ cursor: 'pointer' }} // Make card clickable
                        >
                            <Statistic title={category} value={count} />
                        </Card>
                    </Col>
                ))}
                <Col xs={24} sm={12} md={8} lg={6} key={'all'}>
                        <Card
                            onClick={() => handleCategoryClick(null)}
                            style={{ cursor: 'pointer' }} // Make card clickable
                        >
                            <Statistic title={'All'} value={products.length} />
                        </Card>
                    </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={24} md={12} lg={12}> {/* Adjust span as needed */}
                    <Card title="Sales Chart">
                        <Bar options={chartOptions} data={chartData} />
                    </Card>
                </Col>
            </Row>


            <Row gutter={[20, 20]}>
                {filteredProducts.map((product) => ( // Use filteredProducts here
                    <Col xs={4} sm={4} md={4} lg={12} key={product.id}>
                        <motion.div variants={item}>
                            {/* ... (product card content - same as before) */}
                            <Card
                                cover={product?.photos && product?.photos?.length > 0 ? (
                                    <Image src={product?.photos[0]} alt={product.title} />
                                ) : (
                                    <Skeleton.Image active />
                                )}
                                title={product.title}
                                onClick={() => openModal(product)}
                            >
                                <Card.Meta
                                    description={
                                        <div>
                                            <p>Price: {product.price}</p>
                                            <p>Category: {product.type}</p>
                                            <p>Brand: {product.productionInformation?.brand}</p>
                                            <p>Model: {product.productionInformation?.model}</p>
                                            <Rate value={product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length} />
                                        </div>
                                    }
                                />
                                <div style={{ marginTop: '10px' }}>
                                    <Collapse>
                                        <Panel header="Details" key="1">
                                            <List
                                                dataSource={Object.entries(product).filter(([key]) => !['photos', 'reviews', 'productColors', 'Gallery', 'SizesManager', 'condition', 'BoughtTogether', 'FeaturesAndDetails', 'productionInformation', 'videos'].includes(key))}
                                                renderItem={([key, value]) => (
                                                    <List.Item>
                                                        {key}: {Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : value}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>

                                        <Panel header="Sizes" key="2">
                                            <List
                                                dataSource={Object.entries(product.SizesManager)}
                                                renderItem={([size, quantity]) => (
                                                    <List.Item>
                                                        {size}: {quantity}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>

                                        <Panel header="Conditions" key="3">
                                            <List
                                                dataSource={Object.entries(product.condition)}
                                                renderItem={([condition, details]) => (
                                                    <List.Item>
                                                        {condition}: {Object.entries(details).map(([key, value]) => <p>{key}: {value}</p>)}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                        <Panel header="Bought Together" key="4">
                                            <List
                                                dataSource={product.BoughtTogether}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        {item}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                        <Panel header="Features and Details" key="5">
                                            <List
                                                dataSource={product.FeaturesAndDetails}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        {item}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                        <Panel header="Videos" key="6">
                                            <List
                                                dataSource={product.videos}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        {item}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                        <Panel header="Product Colors" key="7">
                                            <List
                                                dataSource={product.productColors}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        <Image width={50} src={item.imageUrl} />
                                                        {Object.entries(item).map(([key, value]) => <p>{key}: {value}</p>)}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                        <Panel header="Gallery" key="8">
                                            <List
                                                dataSource={product.Gallery}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        {item.type === 'video' ? <p>Video: {item.url}</p> : <Image width={200} src={item.url} />}
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                        <Panel header="Reviews" key="9">
                                            <List
                                                dataSource={product.reviews}
                                                renderItem={(review) => (
                                                    <List.Item>
                                                        <Avatar src={review.person.avatar} /> {review.person.name} - {review.text} ({review.rating})
                                                    </List.Item>
                                                )}
                                            />
                                        </Panel>
                                    </Collapse>
                                </div>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <Modal
        title={selectedProduct?.title}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={700}
      >
        {selectedProduct && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Total Revenue (Last 6 Months)" value={`$${getProductSalesData(selectedProduct.id).totalRevenue}`} />
              </Col>
              <Col span={12}>
                <Statistic title="Total Orders" value={getProductSalesData(selectedProduct.id).totalOrders} />
              </Col>
            </Row>

            <h3 style={{ marginTop: '20px' }}>Order History</h3>
            <List
              itemLayout="horizontal"
              dataSource={getProductSalesData(selectedProduct.id).customers}
              renderItem={customer => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={customer.avatar} />}
                    title={customer.name}
                    description={`Email: ${customer.email}`}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default ProductDisplay;