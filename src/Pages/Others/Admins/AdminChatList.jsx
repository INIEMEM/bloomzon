import React, { useState, useEffect } from 'react';
import { Table, message, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const ChatList = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            // Replace with your actual API call when ready
            // const response = await Axios.get('YOUR_API_ENDPOINT_FOR_ADMINS');
            // setAdmins(response.data);

            // Dummy Data for demonstration (replace with your API data)
            const dummyAdmins = [
                { id: 1, email: 'admin1@example.com', role: ['superadmin'] },
                { id: 2, email: 'admin2@example.com', role: ['editor', 'moderator'] },
                { id: 3, email: 'admin3@example.com', role: ['moderator'] },
                { id: 4, email: 'admin4@example.com', role: ['editor'] },
                { id: 5, email: 'admin5@example.com', role: ['superadmin', 'editor'] },
            ];
            setAdmins(dummyAdmins);

        } catch (error) {
            console.error('Error fetching admins:', error);
            message.error('Error fetching admins.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = (admin) => {
        navigate(`/dashboard/others/admins/messages/${admin.id}`);
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role', // Display roles in the table
            dataIndex: 'role',
            key: 'role',
            render: (roles) => ( // Render roles as a comma-separated list
                <span>{roles.join(', ')}</span>
            ),

        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{background: 'var(--primary-color)'}} type="primary" onClick={() => handleStartChat(record)}>
                        Start Chat
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{padding:20}}>
            <h2>Admins</h2>
            <Table className='admin-table' dataSource={admins} columns={columns} rowKey="id" loading={loading} />
        </div>
    );
};

export default ChatList;