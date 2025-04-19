import React, { useState } from 'react';
import { Form, Input, Upload, Button, Select, DatePicker, message, Card, Space } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Option } = Select;

const PodcastUploadForm = () => {
  const [form] = Form.useForm();
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [episodes, setEpisodes] = useState([{ title: '', description: '', audioFile: null, thumbnailFile: null, guestName: '', genre: '', duration: '', releaseDate: null }]);

  const handleCoverImageUpload = ({ file }) => {
    setCoverImageFile(file);
    return false;
  };

  const handleEpisodeAudioUpload = (file, index) => {
    const newEpisodes = [...episodes];
    newEpisodes[index].audioFile = file;
    setEpisodes(newEpisodes);
    return false;
  };

  const handleEpisodeThumbnailUpload = (file, index) => {
    const newEpisodes = [...episodes];
    newEpisodes[index].thumbnailFile = file;
    setEpisodes(newEpisodes);
    return false;
  };

  const handleEpisodeChange = (value, index, field) => {
    const newEpisodes = [...episodes];
    newEpisodes[index][field] = value;
    setEpisodes(newEpisodes);
  };

  const addEpisode = () => {
    setEpisodes([...episodes, { title: '', description: '', audioFile: null, thumbnailFile: null, guestName: '', genre: '', duration: '', releaseDate: null }]);
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('coverImage', coverImageFile);
    formData.append('hostName', values.hostName);
    formData.append('language', values.language);
    formData.append('category', values.category);

    episodes.forEach((episode, index) => {
      formData.append(`episodes[${index}][title]`, episode.title);
      formData.append(`episodes[${index}][description]`, episode.description);
      formData.append(`episodes[${index}][audioFile]`, episode.audioFile);
      formData.append(`episodes[${index}][thumbnailFile]`, episode.thumbnailFile);
      formData.append(`episodes[${index}][guestName]`, episode.guestName);
      formData.append(`episodes[${index}][genre]`, episode.genre);
      formData.append(`episodes[${index}][duration]`, episode.duration);
      formData.append(`episodes[${index}][releaseDate]`, episode.releaseDate ? episode.releaseDate.format('YYYY-MM-DD') : null);
    });

    // Send formData to your backend API using axios or fetch
    // Example:
    // axios.post('/api/upload-podcast', formData)
    //   .then(response => message.success('Podcast uploaded successfully'))
    //   .catch(error => message.error('Podcast upload failed'));
    console.log('Form data:', formData);
    message.success('Form data captured, implement API call.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-[20px]"
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Cover Image" required>
          <Upload
            beforeUpload={handleCoverImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Cover Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Host Name" name="hostName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Language" name="language" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select>
            <Option value="Comedy">Comedy</Option>
            <Option value="Education">Education</Option>
            <Option value="News">News</Option>
            {/* Add more categories as needed */}
          </Select>
        </Form.Item>

        <Space direction="vertical" style={{ width: '100%' }}>
          {episodes.map((episode, index) => (
            <Card title={`Episode ${index + 1}`} key={index}>
              <Form.Item label="Episode Title" required>
                <Input value={episode.title} onChange={(e) => handleEpisodeChange(e.target.value, index, 'title')} />
              </Form.Item>
              <Form.Item label="Episode Description" required>
                <Input.TextArea value={episode.description} onChange={(e) => handleEpisodeChange(e.target.value, index, 'description')} />
              </Form.Item>
              <Form.Item label="Audio File" required>
                <Upload
                  beforeUpload={(file) => handleEpisodeAudioUpload(file, index)}
                  showUploadList={false}
                  accept=".mp3"
                >
                  <Button icon={<UploadOutlined />}>Select Audio File</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Thumbnail File" required>
                <Upload
                  beforeUpload={(file) => handleEpisodeThumbnailUpload(file, index)}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Select Thumbnail File</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Guest Name">
                <Input value={episode.guestName} onChange={(e) => handleEpisodeChange(e.target.value, index, 'guestName')} />
              </Form.Item>
              <Form.Item label="Genre">
                <Input value={episode.genre} onChange={(e) => handleEpisodeChange(e.target.value, index, 'genre')} />
              </Form.Item>
              <Form.Item label="Duration (seconds)">
                <Input type="number" value={episode.duration} onChange={(e) => handleEpisodeChange(e.target.value, index, 'duration')} />
              </Form.Item>
              <Form.Item label="Release Date">
                <DatePicker style={{ width: '100%' }} value={episode.releaseDate} onChange={(date) => handleEpisodeChange(date, index, 'releaseDate')} />
              </Form.Item>
            </Card>
          ))}
          <Button icon={<PlusOutlined />} onClick={addEpisode}>Add Episode</Button>
        </Space>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Upload Podcast
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default PodcastUploadForm;