import React, { useState } from "react";
import { Upload, Input, Button, Form, message, Progress, Select, Modal, DatePicker, InputNumber, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
const { Dragger } = Upload;
const { TextArea } = Input;

const api = axios.create({
  baseURL: window.location.pathname.includes("localhost")
    ? "http://localhost:8000"
    : "https://blosom-tv-server.onrender.com",
});

const CreateTalent = () => {
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [videos, setVideos] = useState({ videos: [], watchParty: [], trailers: [] });
  const [tags, setTags] = useState([]);
  const [presentationVideo, setPresentationVideo] = useState({})
  const [details, setDetails] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const uploadToCloudinary = async (file, onProgress, type) => 
    {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`${type == 'image' ? 'UploadImage': '/UploadVideo'}`, formData, {
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / (event.total || 1));
        onProgress(percent);
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url;
  };
  
  const getUploadProps = (category) => ({
    name: "file",
    multiple: true,
    accept: "video/*",
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < 50;
      if (!isValidSize) {
        message.error(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const url = await uploadToCloudinary(file, setProgress);
        setVideos((prev) => ({
          ...prev,
          [category]: [...prev[category], { url, title: file.name, id: Date.now(), thumbnail: "" }],
        }));
        onSuccess("Upload successful");
        message.success(`${file.name} uploaded successfully`);
        setProgress(0);
      } catch (error) {
        onError(error);
        message.error(`${file.name} upload failed`);
        setProgress(0);
      }
    },
  });

  const uploadPresentationVideo = ()=>({
    name: "file",
    multiple: true,
    accept: "video/*",
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < 50;
      if (!isValidSize) {
        message.error(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const url = await uploadToCloudinary(file, setProgress);
        setPresentationVideo({
          id: Date.now(), url, title: file.name, thumbnail: ''
        });
        onSuccess("Upload successful");
        message.success(`${file.name} uploaded successfully`);
        setProgress(0);
      } catch (error) {
        onError(error);
        message.error(`${file.name} upload failed`);
        setProgress(0);
      }
    },

  })
  const handleThumbnailUpload = async (file, videoId, category) => {
    try {
      const url = await uploadToCloudinary(file, setThumbnailProgress, 'image');
      // setVideos((prev) => ({
      //   ...prev,
      //   videos: prev.videos.map((video) =>
      //     video.id === currentVideoId ? { ...video, thumbnail: url } : video
      //   ),
      // }));
      setVideos((prev) => ({
        ...prev,
        [category]: prev[category].map((video) =>
          video.id === videoId ? { ...video, thumbnail: url } : video
        ),
      }));

      // console.log('video thumb update', videos[category], url)
      setThumbnailProgress(0);
      message.success("Thumbnail uploaded successfully");
      setIsModalOpen(false);
      console.log()
    } catch (error) {
      message.error("Thumbnail upload failed");
      setThumbnailProgress(0);
    }
    
    

  };
  const handlePresentationThumbnailUpload = async (file) => {
    try {
      const url = await uploadToCloudinary(file, setThumbnailProgress, 'image');
     
      setPresentationVideo({
          ...presentationVideo,
          thumbnail: url 
      });

      // console.log('video thumb update', videos[category], url)
      setThumbnailProgress(0);
      message.success("Thumbnail uploaded successfully");
      setIsModalOpen(false);
      console.log()
    } catch (error) {
      message.error("Thumbnail upload failed");
      setThumbnailProgress(0);
    }
    
    

  };

  const handleSubmit = async (values) => {
    const formattedDate = values.date.format("YYYY-MM-DD");
    const payload = {
      heading: values.heading,

      date: formattedDate,
      description: values.description,
      details,
      minYearOld: values.minYearOld,
      // likes: values.likes,
      // notForMe: values.notForMe,
      tags: tags.map((tag) => ({ name: tag })),
      videos: videos.videos,
      trailers: videos.trailers,
      WatchParty: videos.watchParty,
    presentation: presentationVideo

    };
    try {
      await api.post("/CreateSession", payload);
      message.success("Talent created successfully");
      console.log('the submitted data >>>', payload);
    } catch (error) {
      message.error("Failed to create talent");
      console.error('create error >>', error);
    }
  };

  const handleDeleteVideo = (id, category) => {
    setVideos((prev)=> ({
      ...prev,
     [category]: prev[category].filter(vid => vid.id !== id)
    }))
    message.success("Video deleted successfully");
  };

  const handleFieldChange = (id, field, value) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id ? { ...video, [field]: value } : video
      )
    );
  };

  // const handleThumbnailUpload = async (file, videoId) => {
   
  // };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: 20 }}
    >
      <h1>Create Season</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Heading" name="heading" rules={[{ required: true }]}>
          <Input placeholder="Enter heading" />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Min Year Old" name="minYearOld" rules={[{ required: true }]}>
          <InputNumber placeholder="10" defaultValue={0} style={{ width: '100%' }} />
        </Form.Item>
        
        {/* Rich Text Editor for Details */}
        <Form.Item label="Details" required>
          <ReactQuill
            theme="snow"
            value={details}
            onChange={setDetails}
            placeholder="Enter detailed description with formatting..."
          />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        
        <Form.Item label="Tags">
          <Select
            mode="tags"
            placeholder="Add tags"
            onChange={setTags}
            value={tags}
          />
        </Form.Item>
        <Form.Item label="Categories">
          <Select
              defaultValue="Music"
              // style={{ }}
              onChange={''}
              options={[
                { value: 'music', label: 'Music' },
                { value: 'dance', label: 'Dance' },
                { value: 'drama', label: 'Drama' },
                { value: 'Tailoring', label: 'Tailoring'},
              ]}
            />
        </Form.Item>
        
        {/* Upload Sections */}
        {/* {["videos", "watchParty", "trailers"].map((category) => (
          <div key={category} style={{ marginBottom: 30, padding: 20, background: "#f5f5f5", borderRadius: 10 }}>
            <h3>Upload {category.charAt(0).toUpperCase() + category.slice(1)} Videos</h3>
            <Dragger {...getUploadProps(category)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Drag & drop files here, or click to select files</p>
              <p className="ant-upload-hint">Only video files are supported. Maximum file size: 50MB.</p>
            </Dragger>
            {progress > 0 && <Progress percent={progress} />}
          </div>
        ))} */}
         <div
          
            style={{
              marginBottom: 30,
              padding: 20,
              background: "#f5f5f5",
              borderRadius: 10,
            }}
          >
            <h3>Upload Presentation Videos</h3>
            <Dragger {...uploadPresentationVideo()}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Drag & drop files here, or click to select files
              </p>
              <p className="ant-upload-hint">
                Only video files are supported. Maximum file size: 50MB.
              </p>
            </Dragger>
            {progress > 0 && <Progress percent={progress} />}

            {/* Video Preview Section */}
            <div style={{ marginTop: 20 }}>
             {presentationVideo.url && ( <div
                    
                    style={{
                      marginBottom: 20,
                      padding: 10,
                      background: "#fff",
                      borderRadius: 5,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      height:320,
                      position: 'relative'
                    }}
                  >
                    
                    <Input
                      value={presentationVideo.title}
                      onChange={(e) =>
                        setPresentationVideo({
                          ...presentationVideo,
                          title: e.target.value
                        })
                      }
                      style={{
                        
                      }}
                    />
                      <div className="flex" style={{gap:20}}>
                        <video
                            src={presentationVideo.url}
                            controls
                            style={{
                              width: "100%",
                              flex: "1",
                              borderRadius: 5,
                              marginTop: 10,
                              height:200,
                              objectFit:'cover'
                            }}
                          />
                          <img src={presentationVideo.thumbnail} alt="No thumbnail" style={{flex:1, border: '0.8px solid #ddd', borderRadius: 8,marginTop: 10,objectFit:'cover', width: '100%', height:200}} />
                      </div>
                        <div>
                          <Button type="defa" onClick={()=> setIsModalOpen(true)}>
                            Add Thumbnail
                          </Button>
                          <Button
                            type="danger"
                            style={{ marginTop: 10 }}
                            onClick={() => handleDeleteVideo(presentationVideo.id)}
                          >
                            Delete Video
                          </Button>
                        </div>
                        <Modal
                        title="Upload Thumbnail"
                        visible={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        footer={null}
                      >
                        <Upload
                          accept="image/*"
                          customRequest={({ file }) => handlePresentationThumbnailUpload(file)}
                          showUploadList={false}
                        >
                          <Button>Upload Thumbnail</Button>
                        </Upload>
                        {thumbnailProgress > 0 && <Progress percent={thumbnailProgress} />}
                      </Modal>
                  </div>)}
            </div>            
          </div>
        {["videos", "watchParty", "trailers"].map((category) => (
          <div
            key={category}
            style={{
              marginBottom: 30,
              padding: 20,
              background: "#f5f5f5",
              borderRadius: 10,
            }}
          >
            <h3>Upload {category.charAt(0).toUpperCase() + category.slice(1)} Videos</h3>
            <Dragger {...getUploadProps(category)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Drag & drop files here, or click to select files
              </p>
              <p className="ant-upload-hint">
                Only video files are supported. Maximum file size: 50MB.
              </p>
            </Dragger>
            {progress > 0 && <Progress percent={progress} />}

            {/* Video Preview Section */}
            <div style={{ marginTop: 20 }}>
              {videos[category].map((video, index) => (
                <div
                  key={video.id}
                  style={{
                    marginBottom: 20,
                    padding: 10,
                    background: "#fff",
                    borderRadius: 5,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    height:320,
                    position: 'relative'
                  }}
                >
                  <p style={{}}>{index + 1}.</p>
                  <Input
                    value={video.title}
                    onChange={(e) =>
                      setVideos((prev) => ({
                        ...prev,
                        [category]: prev[category].map((vid) =>
                          vid.id === video.id ? { ...vid, title: e.target.value } : vid
                        ),
                      }))
                    }
                    style={{
                      
                    }}
                  />
                 <div className="flex" style={{gap:20}}>
                 <video
                    src={video.url}
                    controls
                    style={{
                      width: "100%",
                      flex: "1",
                      borderRadius: 5,
                      marginTop: 10,
                      height:200,
                      objectFit:'cover'
                    }}
                  />
                  <img src={video.thumbnail} alt="No thumbnail" style={{flex:1, border: '0.8px solid #ddd', borderRadius: 8,marginTop: 10,objectFit:'cover', width: '100%', height:200}} />
                 </div>
                  <div>
                    <Button type="defa" onClick={()=> setIsModalOpen(true)}>
                      Add Thumbnail
                    </Button>
                    <Button
                      type="danger"
                      style={{ marginTop: 10 }}
                      onClick={() => handleDeleteVideo(video.id, category)}
                    >
                      Delete Video
                    </Button>
                  </div>
                  <Modal
                  title="Upload Thumbnail"
                  visible={isModalOpen}
                  onCancel={() => setIsModalOpen(false)}
                  footer={null}
                >
                  <Upload
                    accept="image/*"
                    customRequest={({ file }) => handleThumbnailUpload(file, video.id, category)}
                    showUploadList={false}
                  >
                    <Button>Upload Thumbnail</Button>
                  </Upload>
                  {thumbnailProgress > 0 && <Progress percent={thumbnailProgress} />}
                </Modal>
                </div>
              ))}
            </div>
            
          </div>
        ))}
        <Button type="primary" htmlType="submit" style={{width: '100%', background: 'var(--primary-color)'}}>
          Create Talent
        </Button>
      </Form>

     
    </motion.div>
  );
};

export default CreateTalent;
