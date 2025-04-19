import React, { useState } from 'react';
import { Form, Input, Upload, Button, Select, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Option } = Select;

const VideoUploadFormElite = () => {
  const [form] = Form.useForm();
  const [directors, setDirectors] = useState(['']);
  const [starring, setStarring] = useState(['']);
  const [producers, setProducers] = useState(['']);
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);

  const handleDirectorChange = (value, index) => {
    const newDirectors = [...directors];
    newDirectors[index] = value;
    setDirectors(newDirectors);
  };

  const addDirector = () => {
    setDirectors([...directors, '']);
  };

  const handleStarringChange = (value, index) => {
    const newStarring = [...starring];
    newStarring[index] = value;
    setStarring(newStarring);
  };

  const addStarring = () => {
    setStarring([...starring, '']);
  };

  const handleProducerChange = (value, index) => {
    const newProducers = [...producers];
    newProducers[index] = value;
    setProducers(newProducers);
  };

  const addProducer = () => {
    setProducers([...producers, '']);
  };

  const handleVideoUpload = ({ file }) => {
    setVideoFile(file);
    return false; // Prevent default upload behavior
  };

  const handleSubtitleUpload = ({ file }) => {
    setSubtitleFile(file);
    return false;
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    directors.forEach((director, index) => formData.append(`directors[${index}]`, director));
    starring.forEach((star, index) => formData.append(`starring[${index}]`, star));
    formData.append('genres', values.genres);
    if (subtitleFile) {
      formData.append('subtitle', subtitleFile);
    }
    formData.append('audioLanguage', values.audioLanguage);
    producers.forEach((producer, index) => formData.append(`producers[${index}]`, producer));
    formData.append('studio', values.studio);

    // Send formData to your backend API using axios or fetch
    // Example:
    // axios.post('/api/upload-video', formData)
    //   .then(response => message.success('Video uploaded successfully'))
    //   .catch(error => message.error('Video upload failed'));
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
        <Form.Item label="Video" required>
          <Upload
            beforeUpload={handleVideoUpload}
            showUploadList={false}
            accept="video/*"
          >
            <Button icon={<UploadOutlined />}>Select Video File</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select>
            <Option value="Action">Action</Option>
            <Option value="Comedy">Comedy</Option>
            <Option value="Drama">Drama</Option>
            {/* Add more categories as needed */}
          </Select>
        </Form.Item>
        <Form.Item label="Directors">
          {directors.map((director, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
              <Input
                value={director}
                onChange={(e) => handleDirectorChange(e.target.value, index)}
                style={{ flex: 1, marginRight: '8px' }}
              />
              {index === directors.length - 1 && (
                <Button icon={<PlusOutlined />} onClick={addDirector} />
              )}
            </div>
          ))}
        </Form.Item>
        <Form.Item label="Starring">
          {starring.map((star, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
              <Input
                value={star}
                onChange={(e) => handleStarringChange(e.target.value, index)}
                style={{ flex: 1, marginRight: '8px' }}
              />
              {index === starring.length - 1 && (
                <Button icon={<PlusOutlined />} onClick={addStarring} />
              )}
            </div>
          ))}
        </Form.Item>
        <Form.Item label="Genre" name="genres" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Subtitle">
          <Upload
            beforeUpload={handleSubtitleUpload}
            showUploadList={false}
            accept=".srt, .vtt"
          >
            <Button icon={<UploadOutlined />}>Select Subtitle File</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Audio Language" name="audioLanguage" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Producers">
          {producers.map((producer, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
              <Input
                value={producer}
                onChange={(e) => handleProducerChange(e.target.value, index)}
                style={{ flex: 1, marginRight: '8px' }}
              />
              {index === producers.length - 1 && (
                <Button icon={<PlusOutlined />} onClick={addProducer} />
              )}
            </div>
          ))}
        </Form.Item>
        <Form.Item label="Studio" name="studio" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Upload Video
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default VideoUploadFormElite;