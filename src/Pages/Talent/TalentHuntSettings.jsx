import React, { useState, useEffect } from 'react';
import { Upload, message, Button, Form, Select, InputNumber, Modal, Card, Row, Col, Image, Divider } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const TalentHuntSettings = () => {
    const [fileList, setFileList] = useState([]); // Store multiple flyers
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formPrices, setFormPrices] = useState({}); // Store prices for all categories
    const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
    const [priceModalCategory, setPriceModalCategory] = useState(null);
    const [priceModalValue, setPriceModalValue] = useState(0);
    const [flyers, setFlyers] = useState([ // Dummy flyer data
        {
            id: 1,
            category: 'Singing',
            imageUrl: 'https://img.freepik.com/free-vector/online-shopping-landing-page_33099-1725.jpg?t=st=1738748050~exp=1738751650~hmac=24946b7ec800704dc919dd50d5bc6f53b4782ac8c7b9a43232e8ed470696ffd2&w=1480', // Replace with dummy image URLs
            isActive: true,
        },
        {
            id: 2,
            category: 'Dancing',
            imageUrl: 'https://img.freepik.com/premium-photo/excited-afro-woman-holding-laptop-credit-card_1324152-6594.jpg?w=1480', // Replace with dummy image URLs
            isActive: false,
        },
        {
            id: 3,
            category: 'Acting',
            imageUrl: 'https://img.freepik.com/premium-vector/shopping-cart-icons-that-represent-online-shopping-applications-floating-smartphone-screen-there-s-smiley-icon-floating-itvector-3d-isolated-orange-background-adverting_425581-66.jpg?w=1060', // Replace with dummy image URLs
            isActive: true,
        },
                {
            id: 4,
            category: 'Comedy',
            imageUrl: 'https://img.freepik.com/free-vector/online-shopping-isometric-concept-illustration_88138-435.jpg?t=st=1738748152~exp=1738751752~hmac=8a541f80a51f619bac4879472ecfc275e1dbbe15748b6fb48ec01c4e1013c28c&w=1480', // Replace with dummy image URLs
            isActive: false,
        },
                {
            id: 5,
            category: 'Other',
            imageUrl: 'https://img.freepik.com/premium-photo/online-shopping-concept-smartphone-shopping-chart-paper-bags-clouds-background_540327-1.jpg?w=1800', // Replace with dummy image URLs
            isActive: true,
        },
        // ... more dummy flyers
    ]);

    const [categories, setCategories] = useState([
        'Singing',
        'Dancing',
        'Acting',
        'Comedy',
        'Other',
    ]);
    // const [flyers, setFlyers] = useState([]); // Store all flyers

    useEffect(() => {
        // Fetch flyers and prices on mount (replace with your API calls)
        fetchFlyers();
        fetchPrices();
    }, []);

    const fetchFlyers = async () => {
        try {
            const response = await fetch('/api/talent-hunt/flyers'); // Replace with your API endpoint
            const data = await response.json();
            // setFlyers(data);
        } catch (error) {
            console.error('Error fetching flyers:', error);
        }
    };

    const fetchPrices = async () => {
        try {
            const response = await fetch('/api/talent-hunt/prices'); // Replace with your API endpoint
            const data = await response.json();
            setFormPrices(data);
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    const handleUploadChange = ({ fileList }, category) => {
        // Update the fileList for the specific category
        setFileList(prevFileList => ({
            ...prevFileList,
            [category]: fileList,
        }));
    };

    const handleCategorySelect = (value) => {
        setSelectedCategory(value);
    };

    const handleEditPrice = (category) => {
        setPriceModalCategory(category);
        setPriceModalValue(formPrices[category] || 0);
        setIsPriceModalVisible(true);
    };

    const handlePriceModalOk = async () => {
        try {
            await fetch('/api/talent-hunt/prices', { // Replace with your API endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: priceModalCategory, price: priceModalValue }),
            });
            fetchPrices(); // Re-fetch prices to update the state
            message.success('Price updated successfully.');
        } catch (error) {
            console.error('Error updating price:', error);
            message.error('Error updating price. Please try again.');
        } finally {
            setIsPriceModalVisible(false);
        }
    };

    const handlePriceModalCancel = () => {
        setIsPriceModalVisible(false);
    };

    const handleDeactivateFlyer = async (flyerId) => {
        try {
            await fetch(`/api/talent-hunt/flyers/${flyerId}`, { method: 'DELETE' }); // Replace with your API endpoint
            fetchFlyers(); // Re-fetch flyers
            message.success('Flyer deactivated successfully.');
        } catch (error) {
            console.error('Error deactivating flyer:', error);
            message.error('Error deactivating flyer. Please try again.');
        }
    };

    const handleActivateFlyer = async (flyerId) => {
        try {
            const response = await fetch(`/api/talent-hunt/flyers/${flyerId}`, { method: 'PUT' }); // Replace with your API endpoint
            const data = await response.json();
            fetchFlyers(); // Re-fetch flyers
            message.success('Flyer activated successfully.');
        } catch (error) {
            console.error('Error activating flyer:', error);
            message.error('Error activating flyer. Please try again.');
        }
    }

    const handleFlyerUpload = async (category) => {
        const formData = new FormData();
        if (fileList[category]) {
            fileList[category].forEach(file => {
                formData.append('flyer', file); // 'flyer' should match your backend's expected field name
            });
        }
        formData.append('category', category); // Associate flyer with the category

        try {
            const response = await fetch('/api/talent-hunt/flyers', { // Replace with your API endpoint
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            fetchFlyers();
            message.success('Flyer uploaded successfully.');
        } catch (error) {
            console.error('Error uploading flyer:', error);
            message.error('Error uploading flyer. Please try again.');
        }
    };



    return (
        <div style={{ padding: 20 }}>
            <h2>Talent Hunt Settings</h2>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24}>
                    <h3>Upload Flyer</h3>
                    <Form>
                        <Form.Item label="Category">
                            <Select value={selectedCategory} onChange={handleCategorySelect}>
                                {categories.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Flyer Image">
                            <Upload
                                beforeUpload={() => false}
                                fileList={fileList[selectedCategory] || []} // Use fileList for the selected category
                                onChange={(fileList) => handleUploadChange(fileList, selectedCategory)}
                                maxCount={1}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>Upload Flyer</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => handleFlyerUpload(selectedCategory)} disabled={!selectedCategory}>
                                Upload
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>

                <Col xs={24} sm={24}>
                    <h3>Flyers</h3>
                    <Row gutter={[16, 16]}>
                        {flyers.map(flyer => (
                            <Col xs={24} sm={12} md={8} key={flyer.id}>
                                <Card
                                    cover={<Image src={flyer.imageUrl} alt="Flyer" />} // Display flyer image
                                    actions={[
                                        <Button
                                            type={flyer.isActive ? 'danger' : 'primary'}
                                            icon={flyer.isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                                            onClick={() => flyer.isActive ? handleDeactivateFlyer(flyer.id) : handleActivateFlyer(flyer.id)}
                                        >
                                            {flyer.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>,
                                    ]}
                                >
                                    <p>Category: {flyer.category}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            <Divider/>

            <h3>Edit Prices</h3>
            <Row gutter={[16, 16]}>
                {categories.map(category => (
                    <Col xs={24} sm={12} md={8} key={category}>
                        <Card title={category}>
                            <p>Price: {formPrices[category] || 0}</p>
                            <Button icon={<EditOutlined />} onClick={() => handleEditPrice(category)}>
                                Edit Price
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title="Edit Price"
                visible={isPriceModalVisible}
                onOk={handlePriceModalOk}
                onCancel={handlePriceModalCancel}
            >
                <Form>
                    <Form.Item label="Category">
                        <Select value={priceModalCategory} disabled>
                            <Option value={priceModalCategory}>{priceModalCategory}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Price">
                        <InputNumber
                            value={priceModalValue}
                            onChange={setPriceModalValue}
                            style={{ width: '100%' }}
                        />
                     </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TalentHuntSettings;
