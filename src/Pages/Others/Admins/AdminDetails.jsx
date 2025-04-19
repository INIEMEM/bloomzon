import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Spin, Row, Col, Table, Tag } from 'antd';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import moment from 'moment';

const AdminActivityDetails = () => {
    const { adminId } = useParams();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdminActivities();
    }, [adminId]);

    const fetchAdminActivities = async () => {
        setLoading(true);
        try {
            // Replace with your actual API call when ready
            // const response = await Axios.get(`YOUR_API_ENDPOINT_FOR_ADMIN_ACTIVITIES/${adminId}`);
            // setActivities(response.data);

            const dummyData = [
                { activity: 'Login', timestamp: '2023-10-26 10:00', type: 'authentication', admin: 'admin1', details: null },
                { activity: 'Create Product', timestamp: '2023-10-26 10:30', type: 'product', admin: 'admin1', details: { productName: 'Awesome Shirt' } },
                { activity: 'Edit Product', timestamp: '2023-10-26 11:00', type: 'product', admin: 'admin1', details: { productId: 123, newPrice: '$25' } },
                { activity: 'Logout', timestamp: '2023-10-26 12:00', type: 'authentication', admin: 'admin1', details: null },
                { activity: 'Approve Account', timestamp: '2023-10-27 09:15', type: 'user-management', admin: 'admin2', details: { userId: 456, userEmail: 'testuser@example.com' } },
                { activity: 'Approve Payout', timestamp: '2023-10-27 10:20', type: 'finance', admin: 'admin2', details: { payoutId: 789, amount: '$100' } },
                { activity: 'View Report', timestamp: '2023-10-27 11:00', type: 'report', admin: 'admin2', details: { reportName: 'Sales Report' } },
                { activity: 'Create User', timestamp: '2023-10-27 11:30', type: 'user', admin: 'admin2', details: { newUserEmail: 'newuser@example.com'} },
                { activity: 'Logout', timestamp: '2023-10-27 13:00', type: 'authentication', admin: 'admin2', details: null },
            ];

            setActivities(dummyData);

        } catch (error) {
            console.error(`Error fetching activities for admin ${adminId}:`, error);
        } finally {
            setLoading(false);
        }
    };


    const getActivityCountsByType = () => {
        const counts = {};
        activities.forEach(activity => {
            counts[activity.type] = (counts[activity.type] || 0) + 1;
        });
        return counts;
    };

    const activityCounts = getActivityCountsByType();

    const barChartData = {
        labels: Object.keys(activityCounts),
        datasets: [
            {
                label: 'Activity Count',
                data: Object.values(activityCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const lineChartData = {
        labels: activities.map(activity => activity.timestamp), // Use timestamps for x-axis
        datasets: [
            {
                label: 'Activity Over Time',
                data: activities.map((_, index) => index + 1), // Simple count for y-axis
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
            },
        ],
    };

    const columns = [
        { title: 'Activity', dataIndex: 'activity', key: 'activity' },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm'),
        },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag color="blue">{type}</Tag> },
        { title: 'Admin', dataIndex: 'admin', key: 'admin' },
        {
            title: 'Details',
            key: 'details',
            render: (details) => {
                if (!details || typeof details !== 'object') {
                    return '-'; // Display a dash if no details exist
                }
        
                return (
                    <ul>
                        {Object.entries(details).map(([key, value]) => (
                            <li key={key}><strong>{key}:</strong> {String(value)}</li>
                        ))}
                    </ul>
                );
            },
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Activity Details</h2>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Bar data={barChartData} />
                    )}
                </Col>
                {/* <Col xs={24} sm={12}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Line data={lineChartData} />
                    )}
                </Col> */}
            </Row>


            {loading ? (
                <Spin size="large" />
            ) : (
                <Table dataSource={activities} columns={columns} rowKey="id" className='admin-table'/>
            )}
        </div>
    );
};

export default AdminActivityDetails;