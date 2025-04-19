import React, { useState } from 'react';
import EliteVideos from '../../../../Components/EliteVideos/EliteVideos';
import UserMatrxs from '../../../../Components/UserMatrixs/UserMatrxs';
import { BloomzonHealthCare } from '../../../../Icons/icon';

const EliteDetails = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'

  const videos = [
    {
      id: 1,
      title: 'The Secret Life of the Cruise',
      date: 'December 11, 2024',
      status: true,
      thumbnail:
        'https://img.freepik.com/free-photo/military-fighting-with-plane_23-2151001950.jpg?t=st=1742638758~exp=1742642358~hmac=3daac0ac7e2683d1ffe7046e1a19a5cee9c454a1c470547abd701d4c629c9b31&w=2000',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      categories: 'Tech, Fashion, Inovations',
      genre: 'Romance, Education',
      directors: 'Iniemem David, John Doe',
      audioLanguage: 'English , french',
      producers: 'Iniemem David, John Doe',
      studio: 'Paris'
    },
    {
      id: 2,
      title: 'Top Gun View Analytics',
      date: 'January 5, 2025',
      status: false,
      thumbnail:
        'https://img.freepik.com/free-photo/view-3d-cinema-film-reel_23-2151069470.jpg?t=st=1742713448~exp=1742717048~hmac=664e069552925db5e5332f85bd88b322a0721538316f5d3e2d58a23458b270d9&w=1380',
      views: 5678,
      watchTime: '3 hours',
      completionRate: '90%',
      dropOffRate: '5%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      categories: 'Tech, Fashion, musicals',
      genre: 'Comedy, Education, Musicals ',
      directors: 'Iniemem David, John Doe',
      audioLanguage: 'English , french',
      producers: 'Iniemem David, John Doe',
      studio: 'Paris'
    },
    {
      id: 3,
      title: 'Mission Impossible III',
      date: 'February 20, 2025',
      status: true,
      thumbnail:
        'https://img.freepik.com/free-photo/world-collapse-doomsday-scene-digital-painting_456031-63.jpg?t=st=1742713495~exp=1742717095~hmac=2114b7fc971c6e25dd3f424f17e868f52eff8df66ac830109e815c8d3f4ae329&w=1480',
      views: 9012,
      watchTime: '4 hours',
      completionRate: '75%',
      dropOffRate: '15%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      categories: 'Tech, Fashion,',
      genre: 'Action, sitCom, Musicals',
      directors: 'Iniemem David, John Doe',
      audioLanguage: 'English , french',
      producers: 'Iniemem David, John Doe',
      studio: 'Paris'
    },
  ];

  const music = [
    {
      id: 1,
      title: 'Unavailable',
      // date: 'December 11, 2024',
      status: false,
      thumbnail:
        'https://img.freepik.com/free-psd/black-lives-matter-square-flyer_23-2148590943.jpg?t=st=1742713584~exp=1742717184~hmac=f6320a1a9830ccde5eaa2c0ec96b7474d11ae2e188e9e5ceb40ff0046d051ec5&w=1380',
      artistName: 'Davido and Breezy',
      albulmName: 'Timeless',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      duration: '07:45:30',
      genre: 'Romance, Education',
      releaseDate: '12th August, 2025',
      language: 'French, english'
   
    },
    {
      id: 1,
      title: 'Excess Love',
      // date: 'December 11, 2024',
      status: true,
      thumbnail:
        'https://img.freepik.com/free-psd/square-flyer-template-maximalist-business_23-2148524497.jpg?t=st=1742713622~exp=1742717222~hmac=19573cdc124f4b722a682bc90b627155f90c4c4e6611e80fe32d0a5cff92cb36&w=1380',
      artistName: 'Mercy Chinwo',
      albulmName: 'Gods love',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      duration: '07:45:30',
      genre: 'Gospel, Afro',
      releaseDate: '12th August, 2025',
       language: 'French, english'
    },
    {
      id: 3,
      title: 'NO woman No Cry',
      // date: 'December 11, 2024',
      status: true,
      thumbnail:
        'https://img.freepik.com/free-psd/saturday-party-social-media-template_505751-2936.jpg?t=st=1742713662~exp=1742717262~hmac=d8e097a122add742a97d87e35bc18f7590dbbd281294cc2c670a33c3f29ac675&w=1380',
      artistName: 'Tems Ft Bob Marley',
      albulmName: 'Afica Unite',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      duration: '07:45:30',
      genre: 'Afro, Regge',
      releaseDate: '12th August, 2025',
      language: 'French, english'
      
    },
  ];

  const podcast = [
    {
      id: 1,
      title: 'Naija Bants',
      status: true,
      thumbnail:
        'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      categories: 'Tech, Fashion, Inovations',
      // genre: 'Romance, Education',
      episodes: [
        {
          id: 1,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: false
        },
        {
          id: 2,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: true
        },
        {
          id: 3,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: false
        }
      ]
      
    },
    {
      id: 2,
      title: 'Honest Bunch',
      // date: 'December 11, 2024',

      status: true,
      thumbnail:
        'https://img.freepik.com/free-psd/music-concept-square-flyer-template_23-2148707327.jpg?t=st=1742716467~exp=1742720067~hmac=c4f43520e18ed8ad2b28fe4b3e399cd6a98d56a6c3efb9752fd78d3096040754&w=1380',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      categories: 'Tech, Fashion, Inovations',
      // genre: 'Romance, Education',
      episodes: [
        {
          id: 1,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: true
        },
        {
          id: 2,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027'
        },
        {
          id: 3,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: true
        }
      ]
      
    },
    {
      id: 3,
      title: 'Girl Talk',
      // date: 'December 11, 2024',

      status: false,
      thumbnail:
        'https://img.freepik.com/free-psd/podcast-live-session-template_23-2151958990.jpg?t=st=1742716496~exp=1742720096~hmac=8594bf1ffed2b20ce2c491cdaa252227142a7d1881e088e68ee58319d76dbf8b&w=1480',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      categories: 'Tech, Fashion, Inovations',
      // genre: 'Romance, Education',
      episodes: [
        {
          id: 1,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: false
        },
        {
          id: 2,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: false
        },
        {
          id: 3,
          title: 'Problems in Nigeria',
          description: ' lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae',
          thumbnail: 'https://img.freepik.com/free-psd/podcast-template-design_23-2151539207.jpg?t=st=1742716036~exp=1742719636~hmac=cb47604d61419856f5a5b5f16e9d872f01333be23acc17a6faf4a9ce269feaef&w=1800',
          guestName: 'Iniemem David',
          genre: 'Politics',
          duration: '08:11:40',
          releaseDate: '12th of August, 2027',
          status: true
        }
      ]
      
    },
  ];

  const books = 
  [
    {
      id: 1,
      title: 'The Secret Life of the Cruise',
      date: 'December 11, 2024',
      status: false,
      thumbnail:
        'https://img.freepik.com/free-vector/bike-guy-wattpad-book-cover_23-2149452163.jpg?t=st=1742717184~exp=1742720784~hmac=3e4829de5384e7c6587156eb0e60cbabfba1e74df43db025ec4876e635ddd478&w=1380',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      price: 1200,
      genre: 'Romance, Education',
      totalPages: '200',
      dimentions: '12 Inches',
      publisherName: 'Iniemem David, John Doe',
      // studio: 'Paris'
    },
    {
      id: 2,
      title: 'The Secret Life of the Cruise',
      date: 'December 11, 2024',
      status: true,
      thumbnail:
        'https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?t=st=1742717129~exp=1742720729~hmac=daf6b7939cad39a39b0b15c14f64b3284addaa19728a2b3d3da6b6d9572f1774&w=1380',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      price: 1200,
      genre: 'Romance, Education',
      totalPages: '200',
      dimentions: '12 Inches',
      publisherName: 'Iniemem David, John Doe',
      // studio: 'Paris'
    },
    {
      id: 3,
      title: 'The Secret Life of the Cruise',
      date: 'December 11, 2024',
      status: false,
      thumbnail:
        'https://img.freepik.com/free-psd/gradient-world-book-day-template_23-2149290740.jpg?t=st=1742717241~exp=1742720841~hmac=c0197686bb17db2aa9dd33d4457463e579c88913bcfffbed87324094eb711bae&w=1380',
      views: 1234,
      watchTime: '2 hours',
      completionRate: '80%',
      dropOffRate: '10%',
      description: '  lum?Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque dolore necessitatibus nesciunt eaque eius quod amet quo dolor ut beatae, maiores deserunt illum cupiditate asperiores unde. Fugiat esse aut il',
      price: 1200,
      genre: 'Romance, Education',
      totalPages: '200',
      dimentions: '12 Inches',
      publisherName: 'Iniemem David, John Doe',
      // studio: 'Paris'
    },
  ]
  

  return (
   <div className='p-[20px] min-h-screen'>
      <h1 className='font-bold text-[23px]'>Iniemem's Elite Collection</h1>
      <div className="grid-cols-4 grid gap-4">
          <UserMatrxs matrix="5,600" title="Music (2)" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix="5,600" title="Podcast" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix="5,600" title="Videos" icon={<BloomzonHealthCare />} />
          <UserMatrxs matrix="5,600" title="Books (18)" icon={<BloomzonHealthCare />} />
      </div>
      <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="px-2 py-1 border border-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      <h1 className='text-[16px] font-semibold mt-[20px]'>Iniemem's Videos</h1>
       <div className=' grid grid-cols-3 gap-4'>
        {videos.filter((video) => {
      if (filter === 'approved') {
        return video.status === true; // Show only approved videos
      }
      if (filter === 'pending') {
        return video.status === false; // Show only pending videos
      }
      return true; // Show all if 'all' is selected
    })
    .map((video) => (
          <EliteVideos key={video.id} video={video} />
        ))}
      </div>
      <h1 className='text-[16px] font-semibold mt-[15px]'>Iniemem's Music</h1>
      {/* Music here */}
      <div className=' grid grid-cols-3 gap-4'>
        {music.filter((video) => {
      if (filter === 'approved') {
        return video.status === true; // Show only approved videos
      }
      if (filter === 'pending') {
        return video.status === false; // Show only pending videos
      }
      return true; // Show all if 'all' is selected
    })
    .map((video) => (
          <EliteVideos key={video.id} video={video} />
        ))}
      </div>
      {/* podcast here */}
      <h1 className='text-[16px] font-semibold mt-[15px]'>Iniemem's Podcast</h1>
      
      <div className=' grid grid-cols-3 gap-4'>
        {podcast.filter((video) => {
      if (filter === 'approved') {
        return video.status === true; // Show only approved videos
      }
      if (filter === 'pending') {
        return video.status === false; // Show only pending videos
      }
      return true; // Show all if 'all' is selected
    })
    .map((video) => (
          <EliteVideos key={video.id} video={video} />
        ))}
      </div>
     
      <h1 className='text-[16px] font-semibold mt-[15px]'>Iniemem's Books</h1>
      
      <div className=' grid grid-cols-3 gap-4'>
        {books.filter((video) => {
      if (filter === 'approved') {
        return video.status === true; // Show only approved videos
      }
      if (filter === 'pending') {
        return video.status === false; // Show only pending videos
      }
      return true; // Show all if 'all' is selected
    })
    .map((video) => (
          <EliteVideos key={video.id} video={video} />
        ))}
      </div>
   </div>
  );
}

export default EliteDetails