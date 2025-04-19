import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Card, List, Typography, Button, Form, Input, Modal, Image, message,Upload } from "antd";
import { motion } from "framer-motion";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import "./talent.css";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const TalentList = () => {
  const [talents, setTalents] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // State for loading
  const [editingTalent, setEditingTalent] = useState(null); // Talent being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [totals, setTotals] = useState({
    totalSessions: 0,
    totalVideos: 0,
    totalTrailers: 0,
    totalWatchParties: 0,
  });
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [editingWatchPartyIndex, setEditingWatchPartyIndex] = useState(null);
  const [editingThrilerIndex, setEditingThrilerIndex] = useState(null);
  // Fetch data
  const fetchTalent = async () => {
    try {
      const response = await Axios({
        url: `https://blosom-tv-server.onrender.com/Sessions`,
        method: "post",
      });
      // console.log("Fetched Data:", response.data);

      const data = response.data.result;

      // Calculate totals
      const totalSessions = data.length;
      const totalVideos = data.reduce((acc, item) => acc + (item.videos?.length || 0), 0);
      const totalTrailers = data.reduce((acc, item) => acc + (item.trailers?.length || 0), 0);
      const totalWatchParties = data.reduce((acc, item) => acc + (item.WatchParty?.length || 0), 0);
      setTotals({ totalSessions, totalVideos, totalTrailers, totalWatchParties });
      setTalents(data);

      console.log('telent list', talents)
    } catch (error) {
      console.error("Error fetching talents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete session
  const deleteSession = async (id) => {
    try {
      await Axios.delete(`https://blosom-tv-server.onrender.com/Session/${id}`);
      setTalents((prev) => prev.filter((item) => item.id !== id));
      message.success('Session deleted');

      fetchTalent()
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const tryFetch = async () => {
    try {
      const response = await Axios({
        url: 'https://api-bloomzon-com.onrender.com/getAllCategory',
        method: 'post',

      });
      console.log('the new response >>>', response.data)
    } catch (error) {
      console.error('the error message for this', error)
    }
  }
  
  const handleEdit = (talent) => {
    setEditingTalent(talent);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await Axios.post(
        `https://blosom-tv-server.onrender.com/UpdateSession/${editingTalent.id}`,
        editingTalent
      );
      console.log("Saved successfully:", response.data);

      // Update the local state
      setTalents((prev) =>
        prev.map((talent) => (talent.id === editingTalent.id ? editingTalent : talent))
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving talent:", error);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditingTalent((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoChange = (section, index, field, value) => {
    setEditingTalent((prev) => {
      // const updatedSection = prev[section];  
     
      const updatedSection = [...prev[section]];  
      
      updatedSection[index] = { ...updatedSection[index], [field]: value };
      return { ...prev, [section]: updatedSection };
    });
  };
  useEffect(() => {
    fetchTalent();
    tryFetch()
  }, []);

  const api = axios.create({
    baseURL: window.location.pathname.includes("localhost")
      ? "http://localhost:8000"
      : "https://blosom-tv-server.onrender.com",
  });
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
  if (loading) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "20px" }}
    >
      <h1>Sessions List</h1>
      <div className="flex" style={{ gap: 15, marginBottom: 15 }}>
        <UserMatrxs title="Total Sessions" matrix={totals.totalSessions} />
        <UserMatrxs title="Total Videos" matrix={totals.totalVideos} />
        <UserMatrxs title="Total Trailer" matrix={totals.totalTrailers} />
        <UserMatrxs title="Total Watch Party" matrix={totals.totalWatchParties} />
      </div>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={talents}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              title={item.heading}
              extra={
                <div>
                  <Button
                    type="link"
                    onClick={() => { handleEdit(item)}}
                  >
                    Edit
                  </Button>
                  <Button type="link" danger onClick={() => deleteSession(item.id)}>
                    Delete
                  </Button>
                </div>
              }
            >
              {/* Display non-video fields in a form-like structure */}
              <Form layout="vertical">
                <Form.Item label="Date">
                  <Input value={item.date} readOnly />
                </Form.Item>
                <Form.Item label="Min Age">
                  <Input value={item.minYearOld} readOnly />
                </Form.Item>
                <Form.Item label="Details">
                  <div
                    className="custom-textarea"
                    dangerouslySetInnerHTML={{ __html: item.details }}
                  />
                </Form.Item>
              </Form>

              {/* Presentation Section */}
              {item?.presentation && (
                <div style={{ marginTop: "20px" }}>
                  <h3 level={4}>Presentaion Videos</h3>
                  <a href={item?.presentation.url} target="_blank" rel="noreferrer">
                      {item?.presentation.thumbnail ? (
                        <img
                          src={item?.presentation.thumbnail}
                          alt={item?.presentation.title}
                          style={{ width: "100%", height: 250, objectFit: "cover" }}
                        />
                      ) : (
                        <img className="custom-image-talent" alt={item?.presentation?.title}/>
                      )}
                    </a>
                </div>
              )}


              {/* Videos Section */}
              {item.videos?.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3 level={4}>Videos</h3>
                  <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={item.videos}
                    renderItem={(video) => (
                      <List.Item>
                        <a href={video.url} target="_blank" rel="noreferrer">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              style={{ width: "100%", height: 250, objectFit: "cover" }}
                            />
                          ) : (
                            <img className="custom-image-talent" alt={video?.title}/>
                          )}
                        </a>
                      </List.Item>
                    )}
                  />
                </div>
              )}

              {/* WatchParty Section */}
              {item.WatchParty?.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3 level={4}>WatchParty</h3>
                  <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={item.WatchParty}
                    renderItem={(video) => (
                      <List.Item>
                        <a href={video.url} target="_blank" rel="noreferrer">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              style={{ width: "100%", height: 250, objectFit: "cover" }}
                            />
                          ) : (
                            <img className="custom-image-talent" alt={video?.title}/>
                          )}
                        </a>
                      </List.Item>
                    )}
                  />
                </div>
              )}

              {/* Trailers Section */}
              {item.trailers?.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3 level={4}>Trailers</h3>
                  <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={item.trailers}
                    renderItem={(video) => (
                      <List.Item>
                        <a href={video.url} target="_blank" rel="noreferrer">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              style={{ width: "100%", height: 250, objectFit: "cover" }}
                            />
                          ) : (
                            <img className="custom-image-talent" alt={video?.title}/>
                          )}
                        </a>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Card>
          </List.Item>
        )}  
      />
      <Modal
        title="Edit Talent"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        width={800}
      >
        {editingTalent && (
          <Form layout="vertical">
            <Form.Item label="Heading">
              <Input
                value={editingTalent.heading}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Description">
              <TextArea
                rows={4}
                value={editingTalent.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Presentation">
            <div key={editingTalent.presentation.id} style={{ marginBottom: "10px" }}>
                    <Input
                      addonBefore="Title"
                      value={editingTalent.presentation.title}
                      onChange={(e) =>
                        handleVideoChange("presentation", index, "title", e.target.value)
                      }
                    />
                    {/* <Input
                      addonBefore="URL"
                      value={video.url}
                      onChange={(e) =>
                        handleVideoChange("WatchParty", index, "url", e.target.value)
                      }
                      style={{ marginTop: "10px" }}
                    /> */}

                    <div className="flex flex-justify-end" style={{}}><Button type="link" 
                    >{/*this is the button */}Edit</Button></div>
                    <div className="flex flex-justify-between" style={{gap: 10}}>
                    <video
                        src={editingTalent.presentation.url}
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
                          <img src={editingTalent.presentation.thumbnail} alt="No thumbnail" style={{flex:1, border: '0.8px solid #ddd', borderRadius: 8,marginTop: 10,objectFit:'cover', width: '100%', height:200}} />
                    </div>
                    {editingWatchPartyIndex  && (
                      <div className="flex flex-justify-between" style={{gap: 10, alignItems:'center', marginTop: 10}}>

                      <Dragger
                      customRequest={async ({ file, onProgress, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          onProgress,
                          "video"
                        );
                        handleVideoChange("presentation",  "url", url);
                        message.success("Video uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading video:", error);
                        message.error("Video upload failed.");
                        onError(error);
                      }
                      }}
                      accept="video/*"
                      showUploadList={false}
                      >
                      <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                      Drag & drop a new video, or click to upload
                      </p>
                      </Dragger>

                      <Upload
                      customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          () => {},
                          "image"
                        );
                        handleVideoChange("presentation",  "thumbnail", url);
                        message.success("Thumbnail uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading thumbnail:", error);
                        message.error("Thumbnail upload failed.");
                        onError(error);
                      }
                      }}
                      accept="image/*"
                      showUploadList={false}
                      >
                      <Button>Upload Thumbnail</Button>
                      </Upload>

                      </div>)}
                  </div>
            </Form.Item>

            <Form.Item label="Videos">
              <List
                dataSource={editingTalent.videos}
                renderItem={(video, index) => (
                  <div key={video.id} style={{ marginBottom: "10px" }}>
                    <Input
                      addonBefore="Title"
                      value={video.title}
                      onChange={(e) =>
                        handleVideoChange("videos", index, "title", e.target.value)
                      }
                    />
                    <div className="flex flex-justify-end" style={{}}><Button type="link" onClick={() => setEditingVideoIndex((prev) => (prev === index ? null : index))}
                    >{/*this is the button */}Edit</Button></div>
                    <div className="flex flex-justify-between" style={{gap: 10}}>
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
                    {editingVideoIndex === index && (
                      <div className="flex flex-justify-between" style={{gap: 10, alignItems:'center', marginTop: 10}}>

                      <Dragger
                      customRequest={async ({ file, onProgress, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          onProgress,
                          "video"
                        );
                        handleVideoChange("videos", index, "url", url);
                        message.success("Video uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading video:", error);
                        message.error("Video upload failed.");
                        onError(error);
                      }
                      }}
                      accept="video/*"
                      showUploadList={false}
                      >
                      <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                      Drag & drop a new video, or click to upload
                      </p>
                      </Dragger>

                      <Upload
                      customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          () => {},
                          "image"
                        );
                        handleVideoChange("videos", index, "thumbnail", url);
                        message.success("Thumbnail uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading thumbnail:", error);
                        message.error("Thumbnail upload failed.");
                        onError(error);
                      }
                      }}
                      accept="image/*"
                      showUploadList={false}
                      >
                      <Button>Upload Thumbnail</Button>
                      </Upload>

                      </div>)}
                    
                    {/* <Input
                      addonBefore="URL"
                      value={video.url}
                      onChange={(e) =>
                        handleVideoChange("videos", index, "url", e.target.value)
                      }
                      style={{ marginTop: "10px" }}
                    /> */}
                  </div>
                )}
              />
            </Form.Item>

            <Form.Item label="WatchParty">
              <List
                dataSource={editingTalent.WatchParty}
                renderItem={(video, index) => (
                  <div key={video.id} style={{ marginBottom: "10px" }}>
                    <Input
                      addonBefore="Title"
                      value={video.title}
                      onChange={(e) =>
                        handleVideoChange("WatchParty", index, "title", e.target.value)
                      }
                    />
                    {/* <Input
                      addonBefore="URL"
                      value={video.url}
                      onChange={(e) =>
                        handleVideoChange("WatchParty", index, "url", e.target.value)
                      }
                      style={{ marginTop: "10px" }}
                    /> */}

                    <div className="flex flex-justify-end" style={{}}><Button type="link" onClick={() => setEditingWatchPartyIndex((prev) => (prev === index ? null : index))}
                    >{/*this is the button */}Edit</Button></div>
                    <div className="flex flex-justify-between" style={{gap: 10}}>
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
                    {editingWatchPartyIndex === index && (
                      <div className="flex flex-justify-between" style={{gap: 10, alignItems:'center', marginTop: 10}}>

                      <Dragger
                      customRequest={async ({ file, onProgress, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          onProgress,
                          "video"
                        );
                        handleVideoChange("WatchParty", index, "url", url);
                        message.success("Video uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading video:", error);
                        message.error("Video upload failed.");
                        onError(error);
                      }
                      }}
                      accept="video/*"
                      showUploadList={false}
                      >
                      <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                      Drag & drop a new video, or click to upload
                      </p>
                      </Dragger>

                      <Upload
                      customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          () => {},
                          "image"
                        );
                        handleVideoChange("WatchParty", index, "thumbnail", url);
                        message.success("Thumbnail uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading thumbnail:", error);
                        message.error("Thumbnail upload failed.");
                        onError(error);
                      }
                      }}
                      accept="image/*"
                      showUploadList={false}
                      >
                      <Button>Upload Thumbnail</Button>
                      </Upload>

                      </div>)}
                  </div>
                )}
              />
            </Form.Item>
            <Form.Item label="Trailers">
              <List
                dataSource={editingTalent.trailers}
                renderItem={(video, index) => (
                  <div key={video.id} style={{ marginBottom: "10px" }}>
                    <Input
                      addonBefore="Title"
                      value={video.title}
                      onChange={(e) =>
                        handleVideoChange("WatchParty", index, "title", e.target.value)
                      }
                    />
                    {/* <Input
                      addonBefore="URL"
                      value={video.url}
                      onChange={(e) =>
                        handleVideoChange("WatchParty", index, "url", e.target.value)
                      }
                      style={{ marginTop: "10px" }}
                    /> */}

                    <div className="flex flex-justify-end" style={{}}><Button type="link" onClick={() => setEditingThrilerIndex((prev) => (prev === index ? null : index))}
                    >{/*this is the button */}Edit</Button></div>
                    <div className="flex flex-justify-between" style={{gap: 10}}>
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
                    {editingThrilerIndex === index && (
                      <div className="flex flex-justify-between" style={{gap: 10, alignItems:'center', marginTop: 10}}>

                      <Dragger
                      customRequest={async ({ file, onProgress, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          onProgress,
                          "video"
                        );
                        handleVideoChange("trailers", index, "url", url);
                        message.success("Video uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading video:", error);
                        message.error("Video upload failed.");
                        onError(error);
                      }
                      }}
                      accept="video/*"
                      showUploadList={false}
                      >
                      <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                      Drag & drop a new video, or click to upload
                      </p>
                      </Dragger>

                      <Upload
                      customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        const url = await uploadToCloudinary(
                          file,
                          () => {},
                          "image"
                        );
                        handleVideoChange("trailers", index, "thumbnail", url);
                        message.success("Thumbnail uploaded successfully!");
                        onSuccess();
                      } catch (error) {
                        console.error("Error uploading thumbnail:", error);
                        message.error("Thumbnail upload failed.");
                        onError(error);
                      }
                      }}
                      accept="image/*"
                      showUploadList={false}
                      >
                      <Button>Upload Thumbnail</Button>
                      </Upload>

                      </div>)}
                  </div>
                )}
              />
            </Form.Item>

            {/* Repeat similar sections for "presentation" and "trailers" */}
          </Form>
        )}
      </Modal>

    </motion.div>
  );
};

export default TalentList;
