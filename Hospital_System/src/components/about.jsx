import React from 'react'
import Navbar from './navbar'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const about = (props) => {
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
    <div>
      <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn}/>
      <p>This is about page</p>
    </div>
  )
}

export default about