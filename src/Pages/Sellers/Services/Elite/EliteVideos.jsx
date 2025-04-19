import React, { useState } from 'react';
import { Modal } from 'antd';
import { motion } from 'framer-motion';
import UserMatrxs from '../../../../Components/UserMatrixs/UserMatrxs';
import { BloomzonHealthCare } from '../../../../Icons/icon';
import VideoUploadFormElite from '../../../../Components/EliteFroms/VideoForm';
import MusicUploadForm from '../../../../Components/EliteFroms/MusicForm';
import PodcastUploadForm from '../../../../Components/EliteFroms/PodcastForm';

const EliteVideos = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const showModalWithMessage = (message) => {
    setModalContent(message);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px' }}
      className="min-h-screen"
    >
      <div className="grid grid-cols-4 gap-4">
        <div onClick={() => showModalWithMessage('music')}>
          <UserMatrxs matrix="5,600" title="Music (2)" icon={<BloomzonHealthCare />} />
        </div>
        <div onClick={() => showModalWithMessage('podcast')}>
          <UserMatrxs matrix="5,600" title="Podcast" icon={<BloomzonHealthCare />} />
        </div>
        <div onClick={() => showModalWithMessage('videos')}>
          <UserMatrxs matrix="5,600" title="Videos" icon={<BloomzonHealthCare />} />
        </div>
        <div onClick={() => showModalWithMessage('Hey, this is Books')}>
          <UserMatrxs matrix="5,600" title="Books (18)" icon={<BloomzonHealthCare />} />
        </div>
      </div>

      <Modal
        title="Service Information"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modalContent === 'music' && <MusicUploadForm/>}
        {modalContent === 'videos' && <VideoUploadFormElite/>}
        {modalContent === 'podcast' && <PodcastUploadForm/>}
      </Modal>
    </motion.div>
  );
};

export default EliteVideos;