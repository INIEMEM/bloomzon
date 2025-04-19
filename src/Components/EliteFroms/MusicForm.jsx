import React, { useState } from 'react';
import { Form, Input, Upload, Button, Select, DatePicker, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Option } = Select;

const MusicUploadForm = () => {
  const [form] = Form.useForm();
  const [mp3File, setMp3File] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const handleMp3Upload = ({ file }) => {
    setMp3File(file);
    return false; // Prevent default upload behavior
  };

  const handleCoverImageUpload = ({ file }) => {
    setCoverImageFile(file);
    return false;
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('mp3', mp3File);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('artistName', values.artistName);
    formData.append('albumName', values.albumName);
    formData.append('genre', values.genre);
    formData.append('language', values.language);
    formData.append('coverImage', coverImageFile);
    formData.append('duration', values.duration);
    formData.append('releaseDate', values.releaseDate.format('YYYY-MM-DD')); // Format the date

    // Send formData to your backend API using axios or fetch
    // Example:
    // axios.post('/api/upload-music', formData)
    //   .then(response => message.success('Music uploaded successfully'))
    //   .catch(error => message.error('Music upload failed'));
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
        <Form.Item label="MP3 Track" required>
          <Upload
            beforeUpload={handleMp3Upload}
            showUploadList={false}
            accept=".mp3"
          >
            <Button icon={<UploadOutlined />}>Select MP3 File</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Artist Name" name="artistName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Album Name" name="albumName">
          <Input />
        </Form.Item>
        <Form.Item label="Genre" name="genre" rules={[{ required: true }]}>
          <Select>
            <Option value="Pop">Pop</Option>
            <Option value="Rock">Rock</Option>
            <Option value="Hip-Hop">Hip-Hop</Option>
            {/* Add more genres as needed */}
          </Select>
        </Form.Item>
        <Form.Item label="Language" name="language" rules={[{ required: true }]}>
          <Input />
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
        <Form.Item label="Duration (seconds)" name="duration" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Release Date" name="releaseDate" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Upload Music
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default MusicUploadForm;