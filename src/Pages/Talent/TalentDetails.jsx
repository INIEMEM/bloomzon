import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Image, Descriptions, Button, message, Avatar, List, Divider, Input,  Tooltip, Tabs } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LikeOutlined, DislikeOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const dummyContestants = [
    // ... (your existing dummy data)
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
      videoLink: new File(["video content"], "john_doe_video.mp4", { type: 'video/mp4' }),
      approved: false,
      profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg" // Example profile picture URL
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
      videoLink: new File(["video content"], "jane_smith_video.mov", { type: 'video/mov' }),
      approved: true,
      profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg"
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
      videoLink: new File(["video content"], "peter_jones_video.avi", { type: 'video/avi' }),
      approved: null,
      profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg"
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
      videoLink: new File(["video content"], "alice_johnson_video.mp4", { type: 'video/mp4' }),
      approved: false,
      profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg"
  },
];

const dummyPosts = [
    {
        id: 1,
        contestantSerial: 1, // Link to contestant
        content: {
            type: 'image',
            src: 'https://img.freepik.com/free-photo/nature-animals_1122-1999.jpg?t=st=1738704784~exp=1738708384~hmac=b2c7c493e416277689722759e27196abb70ed77dd1f505b1c571063d7be6165c&w=1480', // Example image URL
            caption: 'Beautiful day!',
        },
        likes: [1, 3], // User IDs who liked
        comments: [
            { userId: 2, text: 'Nice pic!' },
            { userId: 1, text: 'Thanks!' },
        ],
    },
    {
        id: 2,
        contestantSerial: 1,
        content: {
            type: 'video',
            src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', // Example video URL
        },
        likes: [2],
        comments: [],
    },
    // ... more dummy posts
];

const dummyVotes = [
    { contestantSerial: 1, voterId: 2 }, // User 2 voted for contestant 1
    { contestantSerial: 1, voterId: 3 },
    // ... more dummy votes
];

const dummyFollowers = [
    { contestantSerial: 1, followerId: 2 },
    { contestantSerial: 1, followerId: 4 },
    // ... more dummy followers
];

const dummyActivity = [
    { contestantSerial: 1, timestamp: '2024-08-08T10:30:00Z', message: 'Application submitted.' },
    { contestantSerial: 1, timestamp: '2024-08-09T14:15:00Z', message: 'Application approved by Admin John.' },
    { contestantSerial: 1, timestamp: '2024-08-10T11:00:00Z', message: 'Post created: "Beautiful day!"' },
    { contestantSerial: 1, timestamp: '2024-08-11T09:45:00Z', message: 'Profile updated.' },
    // ... more dummy activity
];
const TalentDetails = () => {
    const { contestantId } = useParams();
    const navigate = useNavigate();
    const [contestant, setContestant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [votes, setVotes] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [activity, setActivity] = useState([]); 
    const [activeTab, setActiveTab] = useState('details');
    useEffect(() => {
      const fetchContestantData = async () => {
          try {
              // ... (your contestant fetching logic)
              const foundContestant = dummyContestants.find(c => c.serial === parseInt(contestantId, 10));
              if (!foundContestant) {
                  throw new Error('Contestant not found.');
              }
              setContestant(foundContestant);

              // Fetch posts, votes, and followers
              const contestantPosts = dummyPosts.filter(p => p.contestantSerial === foundContestant.serial);
              setPosts(contestantPosts);

              const contestantVotes = dummyVotes.filter(v => v.contestantSerial === foundContestant.serial);
              setVotes(contestantVotes);

              const contestantFollowers = dummyFollowers.filter(f => f.contestantSerial === foundContestant.serial);
              setFollowers(contestantFollowers);
              const contestantActivity = dummyActivity.filter(a => a.contestantSerial === foundContestant.serial);
                setActivity(contestantActivity);

          } catch (err) {
              setError(err);
          } finally {
              setLoading(false);
          }
      };

      fetchContestantData();
  }, [contestantId]);
  const handleBan = () => { /* ... */ };
  const handleUnban = () => { /* ... */ };
  const handleSuspend = () => { /* ... */ };
  const handleDeactivate = () => { /* ... */ };
  const Post = ({ post }) => {
    const [liked, setLiked] = useState(post.likes.includes(1)); // Check if current user liked
    const [commentText, setCommentText] = useState(''); // State for new comment text
    const [comments, setComments] = useState(post.comments); // State for comments (copy from props)

    const handleLike = () => {
        setLiked(!liked);
        // Update likes in the database (replace with your API call)
    };

    const handleAddComment = () => {
        if (commentText.trim() !== '') {
            const newComment = { userId: 1, text: commentText.trim() }; // Replace 1 with actual user ID
            setComments([...comments, newComment]); // Update comments locally
            setCommentText('');  // Clear input field

            // Send the new comment to the server (replace with your API call)
        }
    };

    return (
        <Card style={{ marginBottom: 16 }}>
            {post.content.type === 'image' ? (
                <Image src={post.content.src} alt={post.content.caption} />
            ) : (
                <video width="100%" controls src={post.content.src} />
            )}
            <div style={{ marginTop: 8 }}>
                <p>{post.content.caption}</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={liked ? "Unlike" : "Like"}>
                        <Button
                            type={liked ? "primary" : "default"}
                            icon={<LikeOutlined />}
                            onClick={handleLike}
                            style={{ marginRight: 8 }}
                        >
                            {post.likes.length + (liked ? 1 : 0)} {/* Update like count */}
                        </Button>
                    </Tooltip>

                    {/* Comments */}
                    <List
                        dataSource={comments}
                        itemLayout="horizontal" // Important for avatar alignment
                        renderItem={(comment) => (
                            <List.Item>
                                <List.Item.Meta
                                  // Or use a user's avatar URL
                                    title={<a>User {comment.userId}</a>} // Replace with actual user names
                                    description={<p>{comment.text}</p>}
                                />
                            </List.Item>
                        )}
                    />

                    {/* Add Comment Input */}
                    {/* <div style={{ marginTop: 8 }}>
                        <Input.TextArea
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onPressEnter={handleAddComment} // Add comment on Enter key
                        />
                        <Button type="primary" onClick={handleAddComment} style={{ marginTop: 8 }}>
                            Add Comment
                        </Button>
                    </div> */}

                </div>
            </div>
        </Card>
    );
};
if (loading) {
  return <div>Loading contestant details...</div>;
}

if (error) {
  return <div>Error: {error.message}</div>;
}

if (!contestant) {
  return <div>Contestant not found.</div>;
}


const handleTabChange = (key) => {
    setActiveTab(key);
};

  return (
    <div style={{ padding: 20 }}>
    <Card title={contestant.name}>
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={24}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}> {/* Center avatar */}
                    <Avatar size={150} src={contestant.profilePicture} /> {/* Larger avatar */}
                </div>

                <Descriptions title="Contestant Info"> {/* Title for Descriptions */}
                    <Descriptions.Item label="Serial">{contestant.serial}</Descriptions.Item>
                    <Descriptions.Item label="Email">{contestant.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{contestant.phone}</Descriptions.Item>
                    <Descriptions.Item label="Date">{contestant.date ? moment(contestant.date).format('MMMM Do YYYY') : ''}</Descriptions.Item>
                    <Descriptions.Item label="Address">{contestant.address}</Descriptions.Item>
                    <Descriptions.Item label="Nationality">{contestant.nationality}</Descriptions.Item>
                    <Descriptions.Item label="Facebook"><a href={contestant.facebook} target="_blank" rel="noopener noreferrer">{contestant.facebook}</a></Descriptions.Item>
                    <Descriptions.Item label="Twitter"><a href={contestant.twitter} target="_blank" rel="noopener noreferrer">{contestant.twitter}</a></Descriptions.Item>
                    <Descriptions.Item label="Instagram"><a href={contestant.instagram} target="_blank" rel="noopener noreferrer">{contestant.instagram}</a></Descriptions.Item>
                </Descriptions>

                <Divider /> {/* Separator */}

                <List
                    header={<div>Voters ({votes.length})</div>} // Include count
                    dataSource={votes}
                    renderItem={(vote) => <List.Item>User {vote.voterId}</List.Item>}
                />

                <List
                    header={<div>Followers ({followers.length})</div>} // Include count
                    dataSource={followers}
                    renderItem={(follower) => <List.Item>User {follower.followerId}</List.Item>}
                />
            </Col>

            <Col xs={24} sm={12} md={24}>
                <div style={{ marginBottom: 16 }}> {/* Button container */}
                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => {}} style={{ marginRight: 16 }}>Approve</Button>
                    <Button type="danger" icon={<CloseCircleOutlined />} onClick={() => {}} style={{ marginRight: 16 }}>Decline</Button>
                    <Button onClick={handleDeactivate} style={{ marginRight: 16 }}>Deactivate</Button>
                    <Button onClick={handleBan} style={{ marginRight: 16 }}>Ban</Button>
                    <Button onClick={handleUnban} style={{ marginRight: 16 }}>Unban</Button>
                    <Button onClick={handleSuspend}>Suspend</Button>
                </div>

                <Tabs activeKey={activeTab} onChange={handleTabChange}> {/* Tabs */}
                    <Tabs.TabPane tab="Posts" key="posts">
                        {posts.map(post => <Post key={post.id} post={post} />)}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Activity" key="activity">
                        {/* Add activity content here */}
                        <List
                                    dataSource={activity}
                                    renderItem={item => (
                                        <List.Item>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}> {/* Align message and timestamp */}
                                                <div>{item.message}</div>
                                                <div style={{ fontSize: 'smaller', color: 'gray' }}>{moment(item.timestamp).format('MMMM Do YYYY, h:mm A')}</div>
                                            </div>
                                            </List.Item>
                                        )}
                                        
                                />
                    </Tabs.TabPane>
                </Tabs>
            </Col>
        </Row>
    </Card>
</div>
  )
}

export default TalentDetails