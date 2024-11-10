import React from 'react'
import Navbar from './navbar'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'



const add_user = (props) => {
  return (
    <div className='grid grid-cols-6 gap-y-5 mb-4 col-span-6'>
        <div className='md:col-span-3 col-span-6'>
            <span>+ First Name: </span>
            <input
                name="F_name"
                value={props.patientData.F_name}
                onChange={props.handleChange}
                disabled={edited}
                className='bg-slate-100 rounded-2xl px-2'
            />
        </div>
        <div className='md:col-span-3 col-span-6'>
            <span>+ Last Name: </span>
            <input
                name="L_name"
                value={patientData.L_name}
                onChange={handleChange}
                disabled={edited}
                className='bg-slate-100 rounded-2xl px-2'
            />
        </div>
        <div className='md:col-span-3 col-span-6'>
            <span>+ Gender: </span>
            <input
                name="Gender"
                value={patientData.Gender}
                onChange={handleChange}
                disabled={edited}
                className='bg-slate-100 rounded-2xl px-2'
            />
        </div>
    </div>
  )
}

export default add_user