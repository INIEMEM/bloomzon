import React from 'react'
import { Link } from 'react-router-dom'
import './talentCategoryCard.css'
import { div } from 'framer-motion/client'

const TalentCategoryCard = ({link, title}) => {
  return (
    <Link to={link} className='kk flex flex-center'>
      <p>{title}</p>
      {/* <div className='absolute-top-circle light-green'></div>
      <div className='absolute-bottom-circle light-green'></div> */}
    </Link>
  )
}

export default TalentCategoryCard