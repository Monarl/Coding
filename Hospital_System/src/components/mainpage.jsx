import React from 'react'
import { useNavigate } from 'react-router-dom'
import {useState, useEffect} from 'react'

const mainpage = () => {
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
        <div>mainpage</div>
    )
}

export default mainpage