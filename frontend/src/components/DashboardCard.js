import React from 'react'
import './DashboardCard.css'
import Counter from './Counter'
import { Link } from 'react-router-dom'
const DashboardCard = ({ takeme, title, number, image }) => {
  return (
    <Link to={takeme} className='linker'>
      <div className='card1'>
        <h1>{title}</h1>
        <div className='p'>
          <Counter upperlimit={number} />
        </div>
      </div>
    </Link>
  )
}

export default DashboardCard
