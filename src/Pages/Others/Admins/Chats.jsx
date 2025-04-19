import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button, message, Spin } from 'antd';
import Axios from 'axios';

  const Chat = () => {
    const { message } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [message]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            // Replace with your actual API call when ready
            // const response = await Axios.get(`YOUR_API_ENDPOINT_FOR_MESSAGES/${adminId}`);
            // setMessages(response.data);

            // Dummy Data for demonstration (replace with your API data)
            const dummyMessages = [
                { id: 1, senderId: '1', message: 'Hello!', timestamp: '2023-10-27 10:00' },
                { id: 2, senderId: adminId, message: 'Hi there!', timestamp: '2023-10-27 10:01' },
                { id: 3, senderId: '1', message: 'How are you?', timestamp: '2023-10-27 10:02' },
                { id: 4, senderId: adminId, message: 'I am fine, thank you.', timestamp: '2023-10-27 10:03' },
                { id: 5, senderId: '1', message: 'Great!', timestamp: '2023-10-27 10:04' },
                // ... more dummy messages
            ];
            setMessages(dummyMessages);

        } catch (error) {
            console.error('Error fetching messages:', error);
            message.error('Error fetching messages.');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            // Replace with your actual API call when ready
            // const response = await Axios.post('YOUR_API_ENDPOINT_FOR_SEND_MESSAGE', {
            //     recipientId: adminId,
            //     message: newMessage,
            // });

            // Dummy data update for demonstration
            const newMessageObj = {
                id: messages.length + 1, // Simplified ID generation
                senderId: '1', // Replace with your actual sender ID (e.g., from authentication)
                message: newMessage,
                timestamp: new Date().toISOString(), // Or a suitable timestamp format
            };

            setMessages([...messages, newMessageObj]);
            setNewMessage('');

        } catch (error) {
            console.error('Error sending message:', error);
            message.error('Error sending message.');
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{padding:20}}>
            <h2>Chat with Admin {message}</h2>
            <div className="message-container" style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {loading ? <Spin /> : messages.map((msg) => (
                    <div key={msg.id} style={{ marginBottom: '10px', textAlign: msg.senderId === '1' ? 'right' : 'left' }}> {/* Use '1' for dummy sender ID */}
                        <div style={{ backgroundColor: msg.senderId === '1' ? '#e0f2f7' : '#fff', padding: '8px', borderRadius: '5px' }}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, marginRight: '10px' }}
                />
                <Button style={{background: 'var(--primary-color)'}} type="primary" onClick={sendMessage}>Send</Button>
            </div>
        </div>
    );
};


export default Chat