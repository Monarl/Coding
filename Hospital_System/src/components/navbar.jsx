import React from 'react'
import { useNavigate } from 'react-router-dom'

const navbar = (props) => {
    const navigate = useNavigate();
  return (
    <div className='flex justify-between items-center px-0 w-screen bg-cyan-600 overflow-x-auto scrollbar-hide'>
        <img src="/logoBK.png" alt="HCMUT logo" className='m-2 ml-3 h-10 w-10'/>
        <p className='text-xl ml-5 text-center font-bold text-red-300'>HOSPITAL DATABASE PROJECT</p>
        <div className='box-border w-1/2 min-w-96 flex justify-evenly text-slate-50 h-20 max-h-full items-center'>
            <button className='h-full px-5 hover:text-lg  hover:bg-cyan-300 hover:text-yellow-200 transition-colors duration-500 w-1/3 hover:font-bold font-bkel'
                    onClick={() => navigate('/main')}>Database</button>
            <button className='h-full px-5 hover:text-lg  hover:bg-cyan-300 hover:text-yellow-200 transition-colors duration-500 w-1/3 hover:font-bold font-bkel'
                    onClick={() => navigate('/about')}>About us</button>
            <button className='h-full px-5 hover:text-lg  hover:bg-cyan-300 hover:text-yellow-200 transition-colors duration-500 w-1/3 hover:font-bold font-bkel'
                    onClick={() => {
                        if (props.loggedIn) {
                            localStorage.removeItem('user')
                            props.setLoggedIn(false)
                          }
                    }}>Log out</button>
        </div>
    </div>
  )
}

export default navbar