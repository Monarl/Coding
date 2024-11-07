import React from 'react'
import Navbar from './navbar'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const doctors = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        const now = new Date()
    
        if (!user || !user.token) {
          props.setLoggedIn(false)
          navigate('/')
          return;
        }
    
        if (now.getTime() > user.expiry) {
          localStorage.removeItem('user')
          props.setLoggedIn(false)
          navigate('/')
          return;
        }
      }, [navigate, props]);

    return (
    <div>doctors</div>
  )
}

export default doctors