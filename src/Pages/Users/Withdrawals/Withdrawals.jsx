import React, { useState, useEffect, useContext } from 'react';
import { Table, Modal, Button, notification, Input } from 'antd';
import { motion } from 'framer-motion';
import Axios from 'axios';
import { MainContext } from '../../../Context/Context';
import { useNavigate } from 'react-router-dom';
const WithdrawalsPage = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pin, setPin] = useState('')
    const { baseUrl, token } = useContext(MainContext);
    const navigate = useNavigate()
    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                method: 'get',
                url: `${baseUrl}api/v1/transaction/withdraw`,
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            setWithdrawals(response.data.data.withdrawals);
            setFilteredWithdrawals(response.data.data.withdrawals);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to fetch withdrawals.',
            });
            if(error?.response?.statusText == "Unauthorized"){
                console.log('just testing')
                navigate('../../')
              }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const approveWithdrawal = async (withdrawalId, trxHash, amount) => {
        setLoading(true);
        try {
            await Axios({
                method: 'post',
                url: `${baseUrl}api/v1/transaction/withdraw`,
                headers: {
                    Authorization: "Bearer " + token,
                },
                data: {
                    // withdrawalId,
                    // status: 'completed',
                    // trxHash,
                    pin,
                    amount
                },
            });
            notification.success({
                message: 'Success',
                description: 'Withdrawal approved successfully.',
            });
            fetchWithdrawals();
            setModalVisible(false);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to approve withdrawal.',
            });

            console.error('the approve error', error)
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = withdrawals.filter((withdrawal) =>
            withdrawal.reference.toLowerCase().includes(value.toLowerCase()) ||
            withdrawal.status.toLowerCase().includes(value.toLowerCase()) ||
            withdrawal.User.firstname.toLowerCase().includes(value.toLowerCase()) ||
            withdrawal.User.lastname.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredWithdrawals(filtered);
    };

    const columns = [
        {
            title: 'S/N',
            key: 'sn',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Reference',
            dataIndex: 'reference',
            key: 'reference',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Transaction Hash',
            dataIndex: 'trxHash',
            key: 'trxHash',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => {
                        setSelectedWithdrawal(record);
                        setModalVisible(true);
                    }}
                    style={{background: '#F67F00'}}
                >
                    Approve
                </Button>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: 20 }}
        >
            <h1>Withdrawals</h1>
            <Input
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 20, width: '300px' }}
            />
            <Table
                dataSource={filteredWithdrawals}
                columns={columns}
                rowKey="id"
                loading={loading}
                className="admin-table"
            />
            <Modal
                title="Approve Withdrawal"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {selectedWithdrawal && (
                    <div>
                        <p><strong>Reference:</strong> {selectedWithdrawal.reference}</p>
                        <p><strong>Amount:</strong> {selectedWithdrawal.amount}</p>
                        <Input.Password value={pin} placeholder='type pin' onChange={(e)=>setPin(e.target.value)} style={{margin: "10px 0"}}/>
                        <Button
                            type="primary"
                            onClick={() => approveWithdrawal(selectedWithdrawal.id, selectedWithdrawal.trxHash, selectedWithdrawal.amount)}
                            loading={loading}
                            style={{background: '#F67F00'}}

                        >
                            Approve
                        </Button>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};

export default WithdrawalsPage;
