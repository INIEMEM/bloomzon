// import { Image } from 'antd'
import React, {useState} from 'react'
import { Image, Modal, Button, List, Input, Form } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineLineChart } from 'react-icons/ai';

const EliteMatrics = ({matric, title})=> 
  {
    return (<div className='border rounded-[8px] border-[0.7px] border-[#ddd] p-6'>
      <h1 className='font-semibold text-[12px]'>{matric}</h1>
      <p className='font-light text-neutral-400	text-[10px]'>{title}</p>
    </div>)
  }

const EliteDescription = ({desc}) => {
  return(<div className='border rounded-[8px] border-[0.7px] border-[#ddd] p-6 font-light text-neutral-400	text-[10px]'>
    {desc}
  </div>)
}
const EliteVideos = ({video}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [expandedEpisodes, setExpandedEpisodes] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'

  const navigate = useNavigate();

  const showModal = () => {
    setModalVisible(true);
  };
  const handleSeeMoreClick = (episodeId) => {
    setExpandedEpisodes((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }));
  };
  const handleCancel = () => {
    setModalVisible(false);
    setAnalyticsModalVisible(false);
    setPreviewModalVisible(false);
  };

  const showAnalyticsModal = () => {
    setModalVisible(false);
    setAnalyticsModalVisible(true);
  };

  const showPreviewModal = () => {
    setModalVisible(false);
    setPreviewModalVisible(true);
  };

  const goToVideoPage = () => {
    navigate(`/video/${video.id}`); // Navigate to video page
    setPreviewModalVisible(false);
  };

  const chartData = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Views',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#41CCC7',
        borderRadius: 10, 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Views Over 6 Months',
      },
    },
  };
  
  return (
    <div className='px-[10px] py-[6px] rounded-[8px] flex items-center gap-4 bg-white relative hover:border hover:border-[#ddd] hover:border-[0.7px]'>
      <Image
        width={100}
        height={90}
        src={video.thumbnail}
        className='rounded-[8px] w-[70px] h-[110px] object-cover'
      />
      <div className='flex-4'>
        <h3 className='text-[13px] font-medium'>{video.title}</h3>
        <p className='text-[11px] text-zinc-400 font-light'>{video.artistName ? (`${video.artistName} . ${video.duration}`) : video.date}</p>
        <p
          className={`px-4 py-2 text-[10px] flex items-center rounded-[8px] justify-center mt-[5px]  w-[60px] ${
            video.status ? 'bg-green-100 text-green-400 ' : 'bg-blue-100 text-blue-400 '
          }`}
        >
          {video.status ? 'Approved' : 'Pending'}
        </p>
      </div>
      <div className='flex-1 absolute top-4 right-3'>
        <i className='fa fa-ellipsis-h' aria-hidden='true' onClick={showModal} />
      </div>

      <Modal
        title=''
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={230}
      >
        <section className=''>
          <div onClick={showPreviewModal} className='flex items-center border-b-2 border-slate-100 py-2 cursor-pointer	'>
            <AiOutlineEye style={{ marginRight: '8px' }} /> 
            <p>Preview</p>
          </div>
          <div onClick={showAnalyticsModal} className='flex items-center py-2 cursor-pointer	'>
            <AiOutlineLineChart style={{ marginRight: '8px' }} /> 
            <p>View Analytics</p>
          </div>
        </section>
      </Modal>

      <Modal
        title='Video Analytics'
        visible={analyticsModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
       <Link to='#' className=''>
          <div className=''>
          <Image
          width={'100%'}
          height={200}
          src={video.thumbnail}
          className='rounded-[8px] mb-4 w-full object-cover'
        />
          </div>
       </Link>
        <p className='text-[#41CCC7] mt-[10px]'> {video.title}</p>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-[10px]">
        <EliteMatrics matric={`${video.views}`} title={'Total number of views'}/>
        
        <EliteMatrics matric={`${video.watchTime} Hours`} title={'Watch Time'}/>
        
        <EliteMatrics matric={`${video.completionRate}`} title={'Completion Rate'}/>
        
        <EliteMatrics matric={`${video.dropOffRate}`} title={'Drop-Off Rate'}/>
        </div>
        <Bar data={chartData} options={chartOptions} />
      </Modal>

      <Modal
        title='Video Preview'
        visible={previewModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Link to='#' className=''>
          <div className=''>
          <Image
          width={'100%'}
          height={200}
          src={video.thumbnail}
          className='rounded-[8px] mb-4 w-full object-cover'
        />
          </div>
        </Link>  
        <p className='text-[#41CCC7] mt-[10px]'> {video.title}</p>
        <EliteDescription desc={video.description}/>
        <Form layout='vertical' className={`grid ${video.episodes ? 'grid-cols-1' : 'grid-cols-2'}  gap-4`}>
           {video.categories && <Form.Item label='Category' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.categories}/>
            </Form.Item>}
           {video.genre && <Form.Item label='Genre' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.genre}/>
            </Form.Item>}
            {video.directors && <Form.Item label='Directors' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.directors}/>
            </Form.Item>}
            {video.audioLanguage && <Form.Item label='Audio Language' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.audioLanguage}/>
            </Form.Item>}
            {video.producers && <Form.Item label='Producers' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.producers}/>
            </Form.Item>}
           {video.studio && <Form.Item label='studio' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.studio}/>
            </Form.Item>}
            {video.artistName && <Form.Item label='Artist Name' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.artistName}/>
            </Form.Item>}
            {video.albulmName && <Form.Item label='Albumn Name' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.albulmName}/>
            </Form.Item>}
            {video.releaseDate && <Form.Item label='Release Date' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.releaseDate}/>
            </Form.Item>}
            {video.language && <Form.Item label='language' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.language}/>
            </Form.Item>}
            {video?.episodes && video?.episodes?.map((item)=>
            {
              const isExpanded = expandedEpisodes[item.id];
              return (<div className='grid grid-cols-1 gap-4' key={item.id}>
                <div className={`px-[10px] py-[6px] rounded-[8px] flex items-center gap-4 bg-white relative hover:border hover:border-[#ddd] hover:border-[0.7px] ${
                      isExpanded ? 'h-auto flex-col' : 'h-[130px] overflow-hidden'
                    }`}>
                <Image
                  width={`${isExpanded ? '100%' : 100}`}
                  height={`${isExpanded ? 150 : 90}`}
                  src={item.thumbnail}
                  className={`rounded-[8px] object-cover flex-1`}
                />
                <div className={`flex-4`}>
                  <h3 className='text-[13px] font-medium'>{item.title}</h3>
                  {isExpanded ? (<EliteDescription desc={item.description}/>) : <p className='text-[11px] text-zinc-400 font-light'>{`${item.description.slice(0,30)}...`}</p>}
                  {
                    !isExpanded && (<p
                      className={`px-4 py-2 text-[10px] flex items-center rounded-[8px] justify-center mt-[5px]  w-[60px] ${
                        item.status ? 'bg-green-100 text-green-400 ' : 'bg-blue-100 text-blue-400 '
                      }`}
                    >
                      {item.status ? 'Approved' : 'Pending'}
                    </p>)
                  }
                </div>
                <div className='flex-1 absolute top-4 right-3 text-[#ddd] text-[10px] text-decoration-line cursor-pointer'
                onClick={() => handleSeeMoreClick(item.id)}
                >
                  {isExpanded ? 'see less' : 'see more'}
                </div>
                {isExpanded && <p className='font-light text-[11px]'><span className='font-medium'>Genre: </span>{item?.genre}</p>}
                {isExpanded && <p className='font-light text-[11px]'><span className='font-medium'>Release Date: </span>{item?.releaseDate}</p>}
                {isExpanded && <p className='font-light text-[11px]'><span className='font-medium'>Duration: </span>{item?.duration}</p>}
                </div>
              </div>)
            })
          }
           {video.totalPages && <Form.Item label='Total Pages' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.totalPages}/>
            </Form.Item>}
            {video.dimentions && <Form.Item label='Dimentions' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.dimentions}/>
            </Form.Item>}
            {video.price && <Form.Item label='Price' >
              <Input className='text-neutral-400 font-light text-[11px]' value={video.price}/>
            </Form.Item>}
        </Form>

        {!video.status &&  <Button type='primary' className='bg-[#F67F00]'>Approve</Button>}
      </Modal>
    </div>

  )
}

export default EliteVideos