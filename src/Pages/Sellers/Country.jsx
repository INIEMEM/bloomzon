import React, { useState, useEffect, useContext } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    message,
} from 'antd';
import { MainContext } from '../../Context/Context';
import { motion } from 'framer-motion';
import axios from 'axios';

const CountryManagement = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { baseUrl, token } = useContext(MainContext);
    const [form] = Form.useForm();

    const API = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`
        },
    });

    const getCountries = () => API.get('/api/v1/country');
    const getCountryDetails = (countryId) =>
        API.get(`/api/v1/country/one?countryId=${countryId}`);
    const createCountry = (countryData) =>
        API.post('/api/v1/country/register', countryData);
    const updateCountry = (countryData) =>
        API.put('/api/v1/country/update', countryData);
    const deleteCountry = (countryId) =>
        API.delete('/api/v1/country/remove', { countryId });

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await getCountries();
            const data = response.data.data.map((country, index) => ({
                ...country,
                sNo: index + 1,
                createdAtFormatted: new Date(country.createdAt).toLocaleDateString(),
            }));
            setCountries(data);
            setFilteredCountries(data); // Initialize filtered countries
        } catch (error) {
            message.error('Error fetching countries');
            if(error?.response?.statusText == "Unauthorized"){
                navigate('../../')
              }
        }
    };

    const handleViewDetails = async (countryId) => {
        try {
            const response = await getCountryDetails(countryId);
            setSelectedCountry(response.data.data);
            form.setFieldsValue(response.data.data); // Pre-fill modal form
            setIsModalOpen(true);
        } catch (error) {
            message.error('Error fetching country details');
        }
    };

    const handleFormSubmit = async () => {
        const formData = form.getFieldsValue();
        console.log(selectedCountry)
        try {
            if (selectedCountry) {
                await updateCountry({ ...formData, countryId: selectedCountry.id, RegionId: selectedCountry.RegionId, flag:selectedCountry.flag, emblem: selectedCountry.emblem, orthographic: selectedCountry.orthographic, status: selectedCountry.status });
                message.success('Country updated successfully');
            } else {
                await createCountry({...formData, RegionId: 'Please put the values here '});
                message.success('Country added successfully');
            }
            fetchCountries();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Error saving country data');
            console.error(error)
        }
    };

    const handleDeleteCountry = async (countryId) => {
        try {
            await deleteCountry(countryId);
            message.success('Country deleted successfully');
            fetchCountries();
        } catch (error) {
            message.error('Error deleting country');
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = countries.filter(
            (country) =>
                country.name.toLowerCase().includes(query) ||
                country.abbreviation.toLowerCase().includes(query) ||
                country.capital.toLowerCase().includes(query)
        );
        setFilteredCountries(filtered);
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
            title: 'Abbreviation',
            dataIndex: 'abbreviation',
            key: 'abbreviation',
        },
        {
            title: 'Capital',
            dataIndex: 'capital',
            key: 'capital',
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
                        onClick={() => handleDeleteCountry(record.id)}
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
            <h1>Country Management</h1>
            <Input
                placeholder="Search by name, abbreviation, or capital"
                value={searchQuery}
                onChange={handleSearch}
                style={{ marginBottom: 20, width: '100%' }}
            />
            <Button
                type="primary"
                style={{ marginBottom: 20, background:'var(--primary-color)' }}
                onClick={() => setIsModalOpen(true)}
                
            >
                Add Country
            </Button>
            <Table
                columns={columns}
                dataSource={filteredCountries}
                rowKey={(record) => record.id}
                className='admin-table'
            />

            <Modal
                title={selectedCountry ? 'Edit Country' : 'Add Country'}
                visible={isModalOpen}
                onOk={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
                okText={selectedCountry ? 'Update' : 'Create'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: '',
                        abbreviation: '',
                        capital: '',
                        phone: '',
                        currency: '',
                        population: 0,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the country name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="abbreviation"
                        label="Abbreviation"
                        rules={[{ required: true, message: 'Please enter the abbreviation' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="capital"
                        label="Capital"
                        rules={[{ required: true, message: 'Please enter the capital' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Code">
                        <Input />
                    </Form.Item>
                    <Form.Item name="currency" label="Currency">
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Input />
                    </Form.Item>
                    <Form.Item name="population" label="Population">
                        <Input style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </motion.div>
    );
};

export default CountryManagement;
