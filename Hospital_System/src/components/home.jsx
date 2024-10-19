import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()

  const onButtonClick = () => {
    // You'll update this function later
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/medical-records-1342x671.jpg')]">
      <div><img src="/HCMUT_official_logo.png" alt="HCMUT logo" className='absolute top-0 left-0 m-4 h-20 w-20 opacity-90'/></div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-90">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
        </div>
        <div className="text-center text-gray-600 mb-6">
          Please login to continue using the service
        </div>
        <div className="flex flex-col items-center">
          <input
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
            type="button"
            onClick={onButtonClick}
            value={loggedIn ? 'Log out' : 'Log in'}
          />
          {loggedIn ? (
            <div className="mt-4 text-gray-700">Your email address is {email}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
  
}

export default Home