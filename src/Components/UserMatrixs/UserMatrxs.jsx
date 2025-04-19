import React from 'react'
import './userMatrix.css'
import { Link } from 'react-router-dom'
const UserMatrxs = ({matrix, title, icon, border, onClick, link}) => {
  return (
    <div onClick={onClick} className={`matrix-box flex  flex-justify-between flex-align ${border && 'border-1-grey'} `}>
      <div>
        <p className='matrx-box-big-font'>{matrix?.toLocaleString()}</p>
        <Link to={link ? link: ''}><p className='matrx-box-smal-font'>{title}</p></Link>
      </div>
      <div>
        {icon && icon}
      </div>
    </div>
  )
}

export default UserMatrxs