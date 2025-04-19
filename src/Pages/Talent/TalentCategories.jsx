import React, { useState, useEffect } from 'react'
import TalentCategoryCard from '../../Components/TalentCategory /TalentCategoryCard'
import UserMatrxs from '../../Components/UserMatrixs/UserMatrxs'
import { useLocation } from 'react-router-dom';
import  Axios  from 'axios';
const TalentCategories = () => {
  const location = useLocation();
  const isRequest = location.pathname.includes('request')
  const isContestant = location.pathname.includes('contestants')
  const isLive = location.pathname.includes('live')
  
 const [sessionList, setSessionList] = useState([]);
  const [talentCategories, setTalentCategories] = useState([
    {
      title: 'Music',
      contestants: 120,
      id:0
    },
    {
      title: 'Dance',
      contestants: 45,
      id:1
    },
    {
      title: 'Drama',
      contestants: 23,
      id:2
    },
    
  ])
  
  const fetchTalent = async () => {
    try {
      const response = await Axios({
        url: `https://blosom-tv-server.onrender.com/Sessions`,
        method: "post",
      });
      // console.log("Fetched Data:", response.data);

      const data = response.data.result;
      setSessionList(data);
    }
    catch(error){
      console.error('the session ', error)
    }
    }

    useEffect(()=>{
      fetchTalent()
    },[])
  return (
    <div style={{padding: 20, minHeight: '100vh'}}>
      <h1>Session List</h1>
      <p>To view applications, please select the corresponding season.</p>
      <div className="flex" style={{gap:20, flexWrap: 'wrap', marginTop: 10}}>

      {/* <TalentCategoryCard title={'Music'} link={'/dashboard/talent/request/music'}/> */}
      {sessionList?.map(category => {
                    let link = ""; // Initialize an empty link
                    if (isRequest) {
                        link = `/dashboard/talent/request/${category.id}`;
                    } else if (isContestant) {
                        link = `/dashboard/talent/contestants/${category.id}`;
                    } else if (isLive) {
                        link = `/dashboard/talent/live/${category.id}`;
                    }
                    return <UserMatrxs key={category.id} title={category.heading} matrix={category?.contestants} link={link} />; // Add a key prop!
                })}
      
      </div>
    </div>
  )
}

export default TalentCategories