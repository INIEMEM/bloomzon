import React from 'react'
import './bigGraph.css'
import { useNavigate } from 'react-router-dom'
const BigGraphs = ({title, content, subTitle, links}) => {
  const navigagte = useNavigate()
  return (
    <div className='bigGraph-container'>
      <div className="flex flex-justify-between">
        <p className='bigGraph-container-title'>{title}</p>
        <p onClick={()=>navigagte(`${links}`)}>
          <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
        </p>
      </div>
      <div className='bigGraph-container-content'>{content}</div>
      <p className='bigGraph-container-subTitle'>{subTitle}</p>
    </div>
  )
}

export default BigGraphs