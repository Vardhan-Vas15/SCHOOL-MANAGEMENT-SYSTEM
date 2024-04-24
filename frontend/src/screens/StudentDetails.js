import React, { useState, useEffect } from 'react'
import Classes from '../screens/classData'
import axios from 'axios'
import ClassItems from '../components/ClassItems'
const StudentDetails = () => {
  console.log(Classes)
  const searchSubmit = (e) => {
    e.preventDefault()
    console.log('clicked')
    
  }
  return (
    <div className='container2'>
      <div className='outer'>
        {}
        <h3>Browse By Class</h3>
        <div className='classes'>
          {Classes.map((classinfo) => (
            <ClassItems
              key={classinfo._id}
              target={`/student_details/details/${classinfo.classname}`}
              
              classid={classinfo.classname}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudentDetails
