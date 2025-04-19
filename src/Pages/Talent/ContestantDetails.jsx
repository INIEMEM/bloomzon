import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Image, Descriptions, Button, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

// Placeholder data (replace with your actual data fetching)
const dummyData = [
  {
      serial: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      date: '2024-08-01',
      address: '123 Main St, Anytown',
      nationality: 'American',
      facebook: 'https://www.facebook.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      instagram: 'https://www.instagram.com/johndoe',
      videoLink: new File(["video content"], "john_doe_video.mp4", { type: 'video/mp4' }), // Dummy video file object
      approved: false, // Add approval status
  },
  {
      serial: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      date: '2024-07-28',
      address: '456 Oak Ave, Anytown',
      nationality: 'Canadian',
      facebook: 'https://www.facebook.com/janesmith',
      twitter: 'https://twitter.com/janesmith',
      instagram: 'https://www.instagram.com/janesmith',
      videoLink: new File(["video content"], "jane_smith_video.mov", { type: 'video/mov' }), // Dummy video file object
      approved: true, // Add approval status
  },
  {
      serial: 3,
      name: 'Peter Jones',
      email: 'peter.jones@example.com',
      phone: '555-123-4567',
      date: '2024-07-25',
      address: '789 Pine Ln, Anytown',
      nationality: 'British',
      facebook: 'https://www.facebook.com/peterjones',
      twitter: 'https://twitter.com/peterjones',
      instagram: 'https://www.instagram.com/peterjones',
      videoLink: new File(["video content"], "peter_jones_video.avi", { type: 'video/avi' }), // Dummy video file object
      approved: null, // Add approval status (null means pending)
  },
  {
      serial: 4,
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '111-222-3333',
      date: '2024-08-05',
      address: '101 Elm St, Anytown',
      nationality: 'Australian',
      facebook: 'https://www.facebook.com/alicejohnson',
      twitter: 'https://twitter.com/alicejohnson',
      instagram: 'https://www.instagram.com/alicejohnson',
      videoLink: new File(["video content"], "alice_johnson_video.mp4", { type: 'video/mp4' }), // Dummy video file object
      approved: false,
  },
      {
      serial: 5,
      name: 'Bob Williams',
      email: 'bob.w@example.com',
      phone: '444-555-6666',
      date: '2024-07-20',
      address: '222 Maple Dr, Anytown',
      nationality: 'South African',
      facebook: 'https://www.facebook.com/bobwilliams',
      twitter: 'https://twitter.com/bobwilliams',
      instagram: 'https://www.instagram.com/bobwilliams',
      videoLink: new File(["video content"], "bob_williams_video.mov", { type: 'video/mov' }), // Dummy video file object
      approved: true,
  },
  // Add more dummy contestants as needed
];


const ContestantDetails = () => {
  const { requestContestantId } = useParams();
    const navigate = useNavigate();
    const [contestant, setContestant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      // Fetch contestant details based on serial (replace with your API call)
      const fetchContestant = async () => {
          try {
              // Simulate API call delay
              await new Promise(resolve => setTimeout(resolve, 500)); // Adjust delay as needed

              const foundContestant = dummyData.find(c => c.serial === parseInt(requestContestantId, 10));

              if (!foundContestant) {
                  throw new Error('Contestant not found.');
              }

              setContestant(foundContestant);
          } catch (err) {
              setError(err);
              console.error("Error fetching contestant:", err);
          } finally {
              setLoading(false);
          }
      };

      fetchContestant();
  }, [requestContestantId]);

  const handleApprove = async () => {
      try {
          // Replace with your actual API call to update approval status
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

          message.success('Contestant approved!');
          navigate('/contestants'); // Redirect back to the contestants list
      } catch (err) {
          message.error('Error approving contestant.');
          console.error("Error approving contestant:", err);
      }
  };

  const handleDecline = async () => {
      try {
          // Replace with your actual API call to update decline status
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

          message.info('Contestant declined.');
          navigate('/contestants'); // Redirect back to the contestants list
      } catch (err) {
          message.error('Error declining contestant.');
          console.error("Error declining contestant:", err);
      }
  };

  if (loading) {
      return <div>Loading contestant details...</div>;
  }

  if (error) {
      return <div>Error: {error.message}</div>;
  }

  if (!contestant) {
      return <div>Contestant not found.</div>
  }

  return (
      <div style={{ padding: 20 }}>
        <h1>{contestant.name} Details</h1>
          <Card title={contestant.name}>
              <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                      {/* Display video if available */}
                      {contestant.videoLink && (
                          <video width="100%" controls>
                              <source src={URL.createObjectURL(contestant.videoLink)} type={contestant.videoLink.type} /> {/* Display video from file object */}
                              Your browser does not support the video tag.
                          </video>
                      )}
                  </Col>
                  <Col xs={24} sm={12} md={16}>
                      <Descriptions>
                          <Descriptions.Item label="Serial">{contestant.serial}</Descriptions.Item>
                          <Descriptions.Item label="Email">{contestant.email}</Descriptions.Item>
                          <Descriptions.Item label="Phone">{contestant.phone}</Descriptions.Item>
                          <Descriptions.Item label="Date">{new Date(contestant.date).toLocaleDateString()}</Descriptions.Item>
                          <Descriptions.Item label="Address">{contestant.address}</Descriptions.Item>
                          <Descriptions.Item label="Nationality">{contestant.nationality}</Descriptions.Item>
                          <Descriptions.Item label="Facebook"><a href={contestant.facebook}>FaceBook</a></Descriptions.Item>
                          <Descriptions.Item label="Twitter"><a href={contestant.twitter}>{'Twitter'}</a></Descriptions.Item>
                          <Descriptions.Item label="Instagram">
                            <a href={contestant.instagram}>
                            Instagram
                            </a>
                            </Descriptions.Item>
                      </Descriptions>
                      <div style={{ marginTop: 20 }}>
                          <Button type="primary"  icon={<CheckCircleOutlined />} onClick={handleApprove} style={{ marginRight: 16, background: 'var(--primary-color)' }}>
                              Approve
                          </Button>
                          <Button type="primary" danger icon={<CloseCircleOutlined />} onClick={handleDecline}>
                              Decline
                          </Button>
                      </div>
                  </Col>
              </Row>
          </Card>
      </div>
  );
}

export default ContestantDetails