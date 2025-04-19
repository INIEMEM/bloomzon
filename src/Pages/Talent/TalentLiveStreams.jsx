import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Descriptions, Button, message, Avatar, List, Divider, Input, Tooltip, Tabs, DatePicker, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LikeOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

// Dummy Data (Replace with your actual data fetching)
const dummyLiveStreams = [
    {
        id: 1,
        season: 'Season 1', // Assuming you have seasons
        contestant: { name: 'John Doe', profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg" },
        startTime: '2024-08-20T10:00:00Z',
        endTime: null, // Null if stream is ongoing
        comments: [
            { user: 'Fan1', text: 'Go John!' },
            { user: 'Fan2', text: 'Amazing performance!' },
        ],
        bannerImage: 'https://img.freepik.com/free-psd/cyber-monday-square-flyer-template_23-2148323777.jpg?t=st=1738763109~exp=1738766709~hmac=1e6392a3a56e6657308ecb4470a452d84de46816be3cfe10edd5a6eacafb34c6&w=1060'
    },
    {
        id: 2,
        season: 'Season 1',
        contestant: { name: 'Jane Smith', profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg" },
        startTime: '2024-08-20T11:30:00Z',
        endTime: '2024-08-20T12:00:00Z',
        comments: [
            { user: 'Fan3', text: 'Great job, Jane!' },
        ],
    },
    {
        id: 3,
        season: 'Season 1',
        contestant: { name: 'Peter Jones', profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg" },
        startTime: '2024-08-20T13:00:00Z',
        endTime: null,
        comments: [],
        bannerImage: 'https://img.freepik.com/free-psd/cyber-monday-vertical-print-template_23-2149100865.jpg?t=st=1738763260~exp=1738766860~hmac=b4f967d1c31a80bc0788a95f3f5d13bd7e64fce1bbd9c892552c7b87320ef44c&w=1060'
    },
    {
        id: 4,
        season: 'Season 1',
        contestant: { name: 'Alice Johnson', profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg" },
        startTime: '2024-08-19T09:00:00Z',
        endTime: '2024-08-19T10:00:00Z',
        comments: [
            { user: 'Fan4', text: 'I love this song!' },
        ],
    },
    {
        id: 5,
        season: 'Season 1',
        contestant: { name: 'Bob Williams', profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg" },
        startTime: '2024-08-18T14:00:00Z',
        endTime: '2024-08-18T15:00:00Z',
        comments: [
            { user: 'Fan5', text: 'Awesome!' },
        ],
    },
    {
        id: 6,
        season: 'Season 1',
        contestant: { name: 'Eva Garcia', profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqIqGOWkCWS.jpg" },
        startTime: '2024-08-17T11:00:00Z',
        endTime: null,
        comments: [
            { user: 'Fan6', text: 'She is the best!' },
        ],
        bannerImage: 'https://img.freepik.com/free-psd/cyber-monday-vertical-print-template_23-2149100865.jpg?t=st=1738763260~exp=1738766860~hmac=b4f967d1c31a80bc0788a95f3f5d13bd7e64fce1bbd9c892552c7b87320ef44c&w=1060'
    },

];

const LiveStreams = () => {
    const [liveStreams, setLiveStreams] = useState(dummyLiveStreams);
    const [ongoingStreams, setOngoingStreams] = useState([]);
    const [pastStreams, setPastStreams] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [filteredStreams, setFilteredStreams] = useState([]);
    const navigate = useNavigate(); 
    useEffect(() => {
        filterLiveStreams();
    }, [liveStreams, dateRange]);

    useEffect(() => {
        const ongoing = liveStreams.filter(stream => stream.endTime === null);
        const past = liveStreams.filter(stream => stream.endTime !== null).slice(0, 3); // Last 3 past streams

        setOngoingStreams(ongoing);
        setPastStreams(past);
        filterLiveStreams();
    }, [liveStreams]);

    const handleDateRangeChange = (dates, dateStrings) => {
        setDateRange(dates);
    };

    const filterLiveStreams = () => {
        if (dateRange === null) {
            setFilteredStreams(liveStreams);
            return;
        }

        const filtered = liveStreams.filter(stream => {
            const startTime = moment(stream.startTime);
            return startTime.isSameOrAfter(dateRange[0]) && startTime.isSameOrBefore(dateRange[1]);
        });
        setFilteredStreams(filtered);
    };

    const LiveStreamCard = ({ stream }) => {
        const [comments, setComments] = useState(stream.comments);
        const [newComment, setNewComment] = useState('');

        const handleAddComment = () => {
            if (newComment.trim() !== '') {
                const comment = { user: 'Admin', text: newComment.trim() };
                setComments([...comments, comment]);
                setNewComment('');

                // In a real app, you'd send the comment to the server
            }
        };
        const handleCardClick = (stream) => {
          if (stream.endTime === null) {
              // Ongoing stream - navigate to watch page
              navigate(`/watch/${stream.id}`); // Replace with your desired route
          } else {
              // Past stream - navigate to replay page
              navigate(`/replay/${stream.id}`); // Replace with your desired route
          }
      };

        return (
          <Card
          title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size={30} src={stream.contestant.profilePicture} style={{ marginRight: 8 }} />
                  {stream.contestant.name}
              </div>
          }
          style={{ marginBottom: 16, cursor: 'pointer' }} // Add cursor pointer
          onClick={() => handleCardClick(stream)} // Add onClick handler
          cover={ // Add cover image for ongoing streams
              stream.endTime === null && stream.bannerImage ? ( // Check if it's an ongoing stream
                  <Image src={stream.bannerImage} alt="Live Banner" height={200} style={{objectFit:'cover'}} /> // Replace with your banner field
              ) : null
          }
      >
          <p>Start Time: {moment(stream.startTime).format('MMMM Do YYYY, h:mm A')}</p>
          {stream.endTime && <p>End Time: {moment(stream.endTime).format('MMMM Do YYYY, h:mm A')}</p>}
          <Divider />
          <List
              dataSource={comments}
              renderItem={comment => (
                  <List.Item>
                      <List.Item.Meta
                          title={comment.user}
                          description={comment.text}
                      />
                  </List.Item>
              )}
          />
          <Input.TextArea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onPressEnter={handleAddComment}
              placeholder="Add comment"
              style={{ marginTop: 8 }}
          />
          <Button type="primary" onClick={handleAddComment} style={{ marginTop: 8 }}>
              Post
          </Button>
      </Card>
        );
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Live Streams</h2>

            <div style={{ marginBottom: 16 }}>
                <DatePicker.RangePicker onChange={handleDateRangeChange} />
            </div>

            <h3>Ongoing Streams</h3>
            {ongoingStreams.map(stream => (
                <LiveStreamCard key={stream.id} stream={stream} />
            ))}

            <Divider />

            <h3>Last 3 Past Streams</h3>
            {pastStreams.map(stream => (
                <LiveStreamCard key={stream.id} stream={stream} />
            ))}

            <Divider />

            <h3>Filtered Streams</h3>
            {filteredStreams.length > 0 ? (
                filteredStreams.map(stream => <LiveStreamCard key={stream.id} stream={stream} />)
            ) : (
                <p>No streams found for the selected date range.</p>
            )}
        </div>
    );
};

export default LiveStreams;