import React, { useState } from 'react';
import { Table, Input, Space, Button, Modal, Form, Input as AntInput, DatePicker, Select, Upload, message } from 'antd';
import { PlusCircleFilled, UploadOutlined , SearchOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // Import useNavigate

const dummyData = [
  {
    serial: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    date: '2024-07-26',
  },
  {
    serial: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    date: '2024-07-25',
  },
  {
    serial: 3,
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '555-123-4567',
    date: '2024-07-27',
  },
    {
    serial: 4,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '111-222-3333',
    date: '2024-07-28',
  },
  // ... more dummy data
];


const TalentRequest = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newContestant, setNewContestant] = useState({});
  const [dataSource, setDataSource] = useState(dummyData);
  const [videoFile, setVideoFile] = useState(null); 
  const {requestTalent} = useParams();
  const location = useLocation();
  const isRequest = location.pathname.includes('request')
  
  const [idCardFile, setIdCardFile] = useState(null);
    const [passportPhotoFile, setPassportPhotoFile] = useState(null);

    const handleIdCardUpload = ({ fileList }) => {
        const currentFile = fileList[fileList.length - 1];
        setIdCardFile(currentFile);
    };

    const handlePassportPhotoUpload = ({ fileList }) => {
        const currentFile = fileList[fileList.length - 1];
        setPassportPhotoFile(currentFile);
    };

  const handleVideoUpload = ({ fileList }) => {
    // Get the latest file from the list (only one video allowed here)
    const currentFile = fileList[fileList.length - 1];
    setVideoFile(currentFile);
};
  const columns = [
    {
      title: 'Serial',
      dataIndex: 'serial',
      key: 'serial',
       sorter: (a, b) => a.serial - b.serial,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
       sorter: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <Input
          placeholder={`Search ${'Name'}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          suffix={<SearchOutlined />}
          onBlur={() => confirm()}
        />
      ),
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
      
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    isRequest ? null : { // Conditionally add the column
      title: 'Votes',
      dataIndex: 'votes',
      key: 'votes',
  },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
       sorter: (a, b) => new Date(b.date) - new Date(a.date), // Sort by latest date first
      render: (date) => new Date(date).toLocaleDateString(), // Format the date
    },
    
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button style={{  background: 'var(--primary-color)' }} type="primary" onClick={() => {
            const path = isRequest 
            ? `/dashboard/talent/request/${requestTalent}/${record.serial}` 
            : `/dashboard/talent/contestants/${requestTalent}/${record.serial}`;
            
           navigate(path);
          }}>View</Button> {/* Navigate on click */}
        </Space>
      ),
    },
  ].filter(Boolean);
  const showModal = () => {
    setIsModalVisible(true);
};

const handleOk = () => {
  if (!videoFile) {
    message.error('Please upload a 2-minute video.'); // Notify user
    return; // Don't proceed if no video is uploaded
}
    // Add the new contestant to the data source
    const newContestantWithSerial = {
        ...newContestant,
        serial: dataSource.length + 1, // Generate serial number
        date: moment(newContestant.date).format('YYYY-MM-DD'), // Format date
        videoLink: videoFile,
        idCard: idCardFile,
        passportPhoto: passportPhotoFile,
    };
    const formData = new FormData();
    formData.append('video', videoFile); 
    formData.append('idCard', idCardFile);
    formData.append('passportPhoto', passportPhotoFile);
    setDataSource([...dataSource, newContestantWithSerial]);
    setNewContestant({}); // Clear the form
    setIdCardFile(null);
    setPassportPhotoFile(null);
    setIsModalVisible(false);
};

const handleCancel = () => {
    setIsModalVisible(false);
    setNewContestant({}); // Clear the form
};

const handleInputChange = (e) => {
    setNewContestant({ ...newContestant, [e.target.name]: e.target.value });
};

const handleDateChange = (date, dateString) => {
    setNewContestant({ ...newContestant, date: date });
};

const handleSelectChange = (value) => {
    setNewContestant({ ...newContestant, nationality: value });
};



  const filteredData = dummyData.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phone.includes(search)
    );
  });

  return (
    <div style={{padding:20, minHeight: '95vh'}}>
      {isRequest ? <h1>Contestant Request</h1> : <h1>Contestant List</h1>}
      <div className="flex flex-justify-between" style={{gap:10}}>

        <Input.Search
          placeholder="Search contestants"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
       {isRequest &&  <Button type="primary" icon={<PlusCircleFilled />} onClick={showModal} style={{ marginBottom: 16, background: 'var(--primary-color)' }}>
            Add Contestant
        </Button>}
      </div>
      <Table columns={columns} dataSource={filteredData} className='admin-table'/>

      <Modal
                title="Add New Contestant"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item label="Name">
                        <AntInput name="name" value={newContestant.name} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <AntInput type="email" name="email" value={newContestant.email} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Phone">
                        <AntInput name="phone" value={newContestant.phone} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Date">
                        <DatePicker name="date" value={newContestant.date} onChange={handleDateChange} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Address">
                        <AntInput.TextArea name="address" value={newContestant.address} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Nationality">
                        <Select name="nationality" value={newContestant.nationality} onChange={handleSelectChange} style={{ width: '100%' }}>
                            <Option value="Nigerian">Nigerian</Option>
                            <Option value="Ghanaian">Ghanaian</Option>
                            {/* Add more nationalities */}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Social Media Links">
                        <AntInput name="facebook" placeholder="Facebook" value={newContestant.facebook} onChange={handleInputChange} style={{ marginBottom: 8 }} />
                        <AntInput name="twitter" placeholder="Twitter" value={newContestant.twitter} onChange={handleInputChange} style={{ marginBottom: 8 }} />
                        <AntInput name="instagram" placeholder="Instagram" value={newContestant.instagram} onChange={handleInputChange} />
                    </Form.Item>
                    <Form.Item label="Means of ID">
                    <Upload
                        beforeUpload={() => false}
                        fileList={idCardFile ? [idCardFile] : []}
                        onChange={handleIdCardUpload}
                        maxCount={1}
                        accept="image/*" // Accept only image files
                    >
                        <Button icon={<UploadOutlined />}>Upload ID</Button>
                    </Upload>
                    {idCardFile && <Image width={200} src={URL.createObjectURL(idCardFile)} />} {/* Preview */}
                </Form.Item>

                <Form.Item label="Passport Photograph">
                    <Upload
                        beforeUpload={() => false}
                        fileList={passportPhotoFile ? [passportPhotoFile] : []}
                        onChange={handlePassportPhotoUpload}
                        maxCount={1}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                    </Upload>
                    {passportPhotoFile && <Image width={200} src={URL.createObjectURL(passportPhotoFile)} />} {/* Preview */}
                </Form.Item>

                    <Form.Item label="2-Minute Video Link">
                    <Upload
                            beforeUpload={() => false} // Prevent immediate upload
                            fileList={videoFile ? [videoFile] : []} // Display the uploaded file
                            onChange={handleVideoUpload}
                            maxCount={1} // Limit to one file
                            accept=".mp4, .mov, .avi" // Specify accepted file types
                        >
                            <Button icon={<UploadOutlined />}>Upload Video</Button>
                        </Upload>
                        {videoFile && (
                            <p style={{ marginTop: 8 }}>{videoFile.name}</p> // Display file name
                        )}
                    </Form.Item>
                </Form>
            </Modal>
    </div>
  );
};

export default TalentRequest