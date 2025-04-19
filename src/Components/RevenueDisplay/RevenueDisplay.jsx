import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import React from 'react'

const RevenueDisplay = ({revenue, profit, loss}) => {
  return (
    <div className={`matrix-box flex  flex-justify-between flex-align  border-1-grey`}>
      <div>
        <p className='matrx-box-big-font'>Total Revenue: {revenue}</p>
        <p className='matrx-box-smal-font flex' style={{gap: 15, marginTop:0}}>
          <p>Total Profit: {profit} <ArrowUpOutlined style={{ fontSize: 14, color: '#41CCC7' }} /></p>
          <p>Total loss: {loss} <ArrowDownOutlined style={{ fontSize: 14, color: '#F42121' }} /></p>
        </p>
      </div>
    </div>
  )
}

export default RevenueDisplay