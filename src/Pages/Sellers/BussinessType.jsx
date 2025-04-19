import React, { useState, useEffect, useContext } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
} from 'antd';
import { MainContext } from '../../Context/Context';
import { motion } from 'framer-motion';
import axios from 'axios';

const BusinessTypeManagement = () => {
    const [businessTypes, setBusinessTypes] = useState([]);
    const [filteredBusinessTypes, setFilteredBusinessTypes] = useState([]);
    const [selectedBusinessType, setSelectedBusinessType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { baseUrl, token } = useContext(MainContext);
    const [form] = Form.useForm();

    const API = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
    });

    const fetchBusinessTypes = () => API.get('/api/v1/businesstype');
    const fetchBusinessTypeDetails = (businessTypeId) =>
        API.get(`/api/v1/businesstype/one?businessTypeId=${businessTypeId}`);
    const createBusinessType = (businessTypeData) =>
        API.post('/api/v1/businesstype/register', businessTypeData);
    const updateBusinessType = (businessTypeData) =>
        API.put('/api/v1/businesstype/update', businessTypeData);
    const deleteBusinessType = (businessTypeId) =>
        API.delete('/api/v1/businesstype/remove',  {
          data: { businessTypeId },
      });

    useEffect(() => {
        loadBusinessTypes();
    }, []);

    const loadBusinessTypes = async () => {
        try {
            const response = await fetchBusinessTypes();
            const data = response.data.data.map((type, index) => ({
                ...type,
                sNo: index + 1,
                createdAtFormatted: new Date(type.createdAt).toLocaleDateString(),
            }));
            setBusinessTypes(data);
            setFilteredBusinessTypes(data); // Initialize filtered data
        } catch (error) {
            message.error('Error fetching business types');
            if(error?.response?.statusText == "Unauthorized"){
                navigate('../../')
              }
        }
    };

    const handleViewDetails = async (businessTypeId) => {
        try {
            const response = await fetchBusinessTypeDetails(businessTypeId);
            const details = response.data.data;
            setSelectedBusinessType(details);
            form.setFieldsValue({ name: details.name }); // Pre-fill form
            setIsModalOpen(true);
        } catch (error) {
            message.error('Error fetching business type details');

        }
    };

    const handleFormSubmit = async () => {
        const formData = form.getFieldsValue();
        try {
            if (selectedBusinessType) {
                await updateBusinessType({
                    businessTypeId: selectedBusinessType.id,
                    ...formData,
                });
                message.success('Business type updated successfully');
            } else {
                await createBusinessType(formData);
                message.success('Business type created successfully');
            }
            loadBusinessTypes();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Error saving business type');
        }
    };

    const handleDeleteBusinessType = async (businessTypeId, record) => {
       console.log(record)
        try {
            await deleteBusinessType(businessTypeId);
            message.success('Business type deleted successfully');
            loadBusinessTypes();
        } catch (error) {
            message.error('Error deleting business type');
            console.log(error)
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = businessTypes.filter((type) =>
            type.name.toLowerCase().includes(query)
        );
        setFilteredBusinessTypes(filtered);
    };

    const columns = [
        {
            title: 'S/N',
            dataIndex: 'sNo',
            key: 'sNo',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date Created',
            dataIndex: 'createdAtFormatted',
            key: 'createdAtFormatted',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        onClick={() => handleViewDetails(record.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteBusinessType(record.id, record)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            style={{padding:20}}
        >
            <h1>Business Type Management</h1>
            <Input
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearch}
                style={{ marginBottom: 20, width: '100%' }}
            />
            <Button
                type="primary"
                style={{ marginBottom: 20, background: 'var(--primary-color)' }}
                onClick={() => {
                    setSelectedBusinessType(null); // Reset selection
                    form.resetFields();
                    setIsModalOpen(true);
                }}
            >
                Add Business Type
            </Button>
            <Table
                columns={columns}
                dataSource={filteredBusinessTypes}
                rowKey={(record) => record.id}
                className='admin-table'
            />

            <Modal
                title={
                    selectedBusinessType
                        ? 'Edit Business Type'
                        : 'Add Business Type'
                }
                visible={isModalOpen}
                onOk={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
                okText={selectedBusinessType ? 'Update' : 'Create'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: '',
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: 'Please enter the name' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </motion.div>
    );
};

export default BusinessTypeManagement;
