import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Select, InputNumber, Modal, Table, message, Upload, Row, Col, Image, Divider, Checkbox, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import Axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const WinnerProductManagement = () => {
    const [winnerProducts, setWinnerProducts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    // const [fileList, setFileList] = useState([]); 
    const [form, setForm] = useState({ // Initialize form data
        
        type: '',
        style: '',
        SizesManager: { L: 0, M: 0, S: 0, XL: 0, XXL: 0, XXXL: 0, XXXXL: 0, XXXXXL: 0 },
        FreeDeliver: null,
        condition: {
            new: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
            used: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
            minor: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
            moderate: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
        },
        BoughtTogether: [],
        FeaturesAndDetails: [],
        productionInformation: { brand: '', model: '' },
        videos: [],
        photos: [],
        reviews: [], // You might not need to edit reviews here
        Gallery: [],
        productColors: [],
        title: '',
        price: '',
        categoryId: null,
        sellerId: null,
        unitPrice: '',
        purchasePrice: '',
        shippingcost: '',
        tax: '',
        discount: '',
        totalQuantity: 0,
        shippingDays: 0,
        deliveryDays: 0,
        state: '',
        freeShipping: 0,
        warranty: '',
        inStock: '',
        sizeguide: 0,
        deliverytime: '',
        active: 1,
        soldCounter: 0,
        flatRate: 0,
        description: '',
    });

    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);


    useEffect(() => {
        fetchWinnerProducts();
    }, []);

    const fetchWinnerProducts = async () => {
        try {
            const response = await Axios.get('https://blosom-tv-server.onrender.com/WinnersProduct');
            setWinnerProducts(response.data.result);
        } catch (error) {
            console.error('Error fetching winner products:', error);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null); // Prepare for adding a new product
        setForm(getInitialFormData()); // Reset the form
        setIsModalVisible(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setForm(product); // Set form data to the product's data
        setIsModalVisible(true);
    };


    const handleDeleteProduct = async (id) => {
        try {
            await Axios.delete(`https://blosom-tv-server.onrender.com/WinnersProduct/${id}`);
            fetchWinnerProducts();
            message.success('Product deleted successfully.');
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('Error deleting product. Please try again.');
        }
    };

    // const handleModalOk = async () => {

    //     try {
    //         const formData = new FormData();
    //         for (const key in form) {
    //             if (key === 'photos' || key === 'videos' || key === 'Gallery' || key === 'productColors') {
    //                 form[key].forEach((item, index) => {
    //                     if (item.url) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][url]`, item.url);
    //                     }
    //                     if (item.type) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][type]`, item.type);
    //                     }

    //                     if (item.color) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][color]`, item.color);
    //                     }
    //                     if (item.price) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][price]`, item.price);
    //                     }
    //                     if (item.inStock) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][inStock]`, item.inStock);
    //                     }
    //                     if (item.imageUrl) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][imageUrl]`, item.imageUrl);
    //                     }
    //                     if (item.subPrice) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][subPrice]`, item.subPrice);
    //                     }
    //                     if (item.videoUrl) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][videoUrl]`, item.videoUrl);
    //                     }
    //                     if (item.colorName) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][colorName]`, item.colorName);
    //                     }
    //                     if (item.productId) {
    //                         formData.append(`<span class="math-inline">\{key\}\[</span>{index}][productId]`, item.productId);
    //                     }
    //                 });
    //             } else if (key === 'SizesManager' || key === 'condition') {
    //                 formData.append(key, JSON.stringify(form[key]));
    //             } else if (Array.isArray(form[key])) {
    //                 form[key].forEach(value => formData.append(key, value));
    //             } else {
    //                 formData.append(key, form[key]);
    //             }
    //         }

    //         if (fileList.length > 0) {
    //             fileList.forEach(file => {
    //                 formData.append('photos', file);
    //             });
    //         }

    //         const url = editingProduct ? `https://blosom-tv-server.onrender.com/WinnersProduct/${editingProduct.id}` : 'https://blosom-tv-server.onrender.com/WinnersProduct';

    //         const response = await Axios({
    //             method: editingProduct ? 'put' : 'post',
    //             url: url,
    //             data: formData,
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Failed to save product');
    //         }

    //         fetchWinnerProducts();
    //         message.success('Product saved successfully.');
    //         setIsModalVisible(false);
    //         setFileList([]);

    //     } catch (error) {
    //         console.error('Error saving product:', error);
    //         message.error(error.message);
    //     }
    // };

    const handleModalOk = async () => {
      try {
          const formData = new FormData();

          for (const key in form) {
            if (key === 'photos' || key === 'videos' || key === 'Gallery' || key === 'productColors') {
                form[key].forEach((item, index) => {
                    if (item.url && typeof item.url === 'string' && !item.url.startsWith('blob')) {
                        formData.append(`${key}[${index}][url]`, item.url);
                    } else if (item.url && typeof item.url !== 'string' && item.url.startsWith('blob')) {
                        formData.append(`${key}[${index}][url]`, item.originFileObj);
                    }
                    // ... (append other product color fields)
                });
            } else if (key === 'SizesManager' || key === 'condition' || key === 'productionInformation') {
                formData.append(key, JSON.stringify(form[key]));
            } else if (Array.isArray(form[key])) {
                form[key].forEach((value, index) => {
                    formData.append(`${key}[${index}]`, value);
                });
            } else if (typeof form[key] === 'boolean') {
                formData.append(key, form[key]);
            } else {
                formData.append(key, form[key]);
            }
        }

        if (fileList && fileList.length > 0) {
          fileList?.forEach(file => {
              if (file) {
                  formData.append('photos', file);
              }
          });
      }

        const url = editingProduct ? `https://blosom-tv-server.onrender.com/WinnersProduct/${editingProduct.id}` : 'https://blosom-tv-server.onrender.com/WinnersProduct';

        const response = await Axios({
            method: editingProduct ? 'put' : 'post',
            url: url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status !== 200) {
            const errorData = await response.data;
            throw new Error(errorData.message || 'Failed to save product');
        }

        fetchWinnerProducts();
        message.success('Product saved successfully.');
        setIsModalVisible(false);
        setFileList([]);
        setForm(getInitialFormData());

    } catch (error) {
        console.error('Error saving product:', error);
        message.error(error.message);
    }
};

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingProduct(null);
        setFileList([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSizesManagerChange = (size, value) => {
        setForm({
            ...form,
            SizesManager: { ...form.SizesManager, [size]: value },
        });
    };

    const handleConditionChange = (conditionType, field, value) => {
        setForm({
            ...form,
            condition: {
                ...form.condition,
                [conditionType]: { ...form.condition[conditionType], [field]: value },
            },
        });
    };

    const handleBoughtTogetherChange = (e) => {
        const { value } = e.target;
        setForm({ ...form, BoughtTogether: value ? value.split(',') : [] }); // Split into an array
    };

    const handleFeaturesAndDetailsChange = (e) => {
        const { value } = e.target;
        setForm({ ...form, FeaturesAndDetails: value ? value.split(',') : [] }); // Split into an array
    };

    const handleVideosChange = (e) => {
        const { value } = e.target;
        setForm({ ...form, videos: value ? value.split(',') : [] }); // Split into an array
    };

    const handlePhotosChange = ({ file }) => {
      // Directly update fileList. No need for conditional checks
      setFileList(file ? [file] : []); // If file is null, set to empty array
      const newPhotos = file ? [{
          url: file.url || URL.createObjectURL(file || file),
          type: file.type ? file.type.split('/')[0] : 'image',
      }] : []; // If file is null, set to empty array
      setForm({ ...form, photos: newPhotos });
  };

  const handleGalleryChange = ({ file }) => {
      setFileList(file ? [file] : []);
      const newGallery = file ? [{
          url: file.url || URL.createObjectURL(file || file),
          type: file.type ? file.type.split('/')[0] : 'image',
      }] : [];
      setForm({ ...form, Gallery: newGallery });
  };


  

  const getInitialFormData = () => ({ // Function to return initial form data
      
      type: '',
      style: '',
      SizesManager: { L: 0, M: 0, S: 0, XL: 0, XXL: 0, XXXL: 0, XXXXL: 0, XXXXXL: 0 },
      FreeDeliver: null,
      condition: {
          new: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
          used: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
          minor: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
          moderate: { price: 0, elitePrice: false, freeReturn: false, percentOff: 0, typicalPriceInLast90Days: 0 },
      },
      BoughtTogether: [],
      FeaturesAndDetails: [],
      productionInformation: { brand: '', model: '' },
      videos: [],
      photos: [],
      reviews: [],
      Gallery: [],
      productColors: [],
      title: '',
      price: '',
      categoryId: null,
      sellerId: null,
      unitPrice: '',
      purchasePrice: '',
      shippingcost: '',
      tax: '',
      discount: '',
      totalQuantity: 0,
      shippingDays: 0,
      deliveryDays: 0,
      state: '',
      freeShipping: 0,
      warranty: '',
      inStock: '',
      sizeguide: 0,
      deliverytime: '',
      active: 1,
      soldCounter: 0,
      flatRate: 0,
      description: '',
  });


  const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Category',
        dataIndex: 'type', // Or use category name if available
        key: 'type',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
            <Space size="middle">
                <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record)} />
                <Button icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.id)} danger />
            </Space>
        ),
    },
];
  return (
    <div style={{ padding: 20 }}>
    <h2>Winner Products Management</h2>
    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct} style={{ marginBottom: 16 }}>
        Add Product
    </Button>
    <Table dataSource={winnerProducts} columns={columns} rowKey="id" />

    <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1200}
    >
        <Form layout="vertical" initialValues={editingProduct || form}>
            <Row gutter={[16, 16]}>
                {/* <Col xs={24} sm={12}>
                    <Form.Item label="Winner ID" name="winnerId">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item label="Product ID" name="productId">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col> */}
                <Col xs={24} sm={12}>
                    <Form.Item label="Type" name="type">
                        <Select>
                            <Option value="fashion">Fashion</Option>
                            <Option value="electronics">Electronics</Option>
                            {/* Add more options */}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item label="Style" name="style">
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item label="Sizes Manager" name="SizesManager">
                        <Row gutter={[8, 8]}>
                            {Object.keys(form.SizesManager).map(size => (
                                <Col xs={6} sm={4} md={3} key={size}>
                                    <Form.Item name={['SizesManager', size]}>
                                        <InputNumber style={{ width: '100%' }} placeholder={size} />
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item label="Condition" name="condition">
                        {Object.keys(form.condition).map(conditionType => (
                            <div key={conditionType} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 16 }}>
                                <h3>{conditionType}</h3>
                                {Object.keys(form.condition[conditionType]).map(field => (
                                    <Form.Item key={field} name={['condition', conditionType, field]} label={field}>
                                        {field === 'elitePrice' || field === 'freeReturn' ? (
                                            <Checkbox />
                                        ) : (
                                            <InputNumber style={{ width: '100%' }} />
                                        )}
                                    </Form.Item>
                                ))}
                            </div>
                        ))}
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item label="Bought Together" name="BoughtTogether">
                        <Input.TextArea placeholder="Enter bought together items separated by commas" />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item label="Features and Details" name="FeaturesAndDetails">
                        <Input.TextArea placeholder="Enter features and details separated by commas" />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item label="Videos" name="videos">
                        <Input.TextArea placeholder="Enter video URLs separated by commas" />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item label="Photos" name="photos" >
                        <Upload
                            listType="image"
                            fileList={fileList}
                            onChange={handlePhotosChange}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Select Photos</Button>
                        </Upload>
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item label="Gallery" name="Gallery" >
                        <Upload
                            listType="image"
                            fileList={form.Gallery.map(item => ({
                                uid: item.url,
                                url: item.url,
                                status: 'done',
                            }))}
                            onChange={handleGalleryChange}
                            beforeUpload={() => false}
                        >
                                    <Button icon={<UploadOutlined />}>Select Gallery Images/Videos</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.List name="productColors">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                                <Form.Item
                                                    {...field}
                                                    label="Color Code"
                                                    name={[field.name, 'color']}
                                                    fieldKey={[field.fieldKey, 'color']}
                                                    rules={[{ required: true, message: 'Missing color code' }]}
                                                >
                                                    <Input placeholder="Color Code" style={{ width: '100px' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Price"
                                                    name={[field.name, 'price']}
                                                    fieldKey={[field.fieldKey, 'price']}
                                                    rules={[{ required: true, message: 'Missing price' }]}
                                                >
                                                    <InputNumber placeholder="Price" style={{ width: '100px' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="In Stock"
                                                    name={[field.name, 'inStock']}
                                                    fieldKey={[field.fieldKey, 'inStock']}
                                                    rules={[{ required: true, message: 'Missing inStock' }]}
                                                >
                                                    <Select placeholder="In Stock" style={{ width: '100px' }}>
                                                        <Option value="YES">YES</Option>
                                                        <Option value="NO">NO</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Image URL"
                                                    name={[field.name, 'imageUrl']}
                                                    fieldKey={[field.fieldKey, 'imageUrl']}
                                                >
                                                    <Input placeholder="Image URL" style={{ width: '150px' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Sub Price"
                                                    name={[field.name, 'subPrice']}
                                                    fieldKey={[field.fieldKey, 'subPrice']}
                                                >
                                                    <InputNumber placeholder="Sub Price" style={{ width: '100px' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Video URL"
                                                    name={[field.name, 'videoUrl']}
                                                    fieldKey={[field.fieldKey, 'videoUrl']}
                                                >
                                                    <Input placeholder="Video URL" style={{ width: '200px' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Color Name"
                                                    name={[field.name, 'colorName']}
                                                    fieldKey={[field.fieldKey, 'colorName']}
                                                >
                                                    <Input placeholder="Color Name" style={{ width: '100px' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Product ID"
                                                    name={[field.name, 'productId']}
                                                    fieldKey={[field.fieldKey, 'productId']}
                                                >
                                                    <Input placeholder="Product ID" style={{ width: '100px' }} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add Product Color
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>

                        {/*... other form items... */}

                        <Col xs={24}>
                            <Form.Item label="Free Deliver" name="FreeDeliver">
                                <Select>
                                    <Option value="YES">YES</Option>
                                    <Option value="NO">NO</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Category ID" name="categoryId">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Seller ID" name="sellerId">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Unit Price" name="unitPrice">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Purchase Price" name="purchasePrice">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Shipping Cost" name="shippingcost">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Tax" name="tax">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Discount" name="discount">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Total Quantity" name="totalQuantity">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Shipping Days" name="shippingDays">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Delivery Days" name="deliveryDays">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="State" name="state">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Free Shipping" name="freeShipping">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Warranty" name="warranty">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="In Stock" name="inStock">
                                <Select>
                                    <Option value="YES">YES</Option>
                                    <Option value="NO">NO</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Size Guide" name="sizeguide">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Delivery Time" name="deliverytime">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Active" name="active">
                                <Select>
                                    <Option value={1}>YES</Option>
                                    <Option value={0}>NO</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Sold Counter" name="soldCounter">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Flat Rate" name="flatRate">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label="Title" name="title">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Price" name="price">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label="Description" name="description">
                                <TextArea />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Brand" name={['productionInformation', 'brand']}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Model" name={['productionInformation', 'model']}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
  );
};

export default WinnerProductManagement;
