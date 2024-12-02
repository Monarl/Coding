import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './login';

const Signin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const checkAccountExists = (callback) => {
    fetch('http://localhost:8000/login/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      })
  }

  const logIn = () => {
    fetch('http://localhost:8000/login/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, employeeId: "123" }),
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r.message)
        if ('success' === r.message) {
          console.log(r.message)
        } else {
          window.alert('Wrong email or password')
        }
      })
  }

  const onButtonClick = () => {
    setEmailError('')
    setPasswordError('')
  
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email!')
      return
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email!')
      return
    }
  
    if ('' === password) {
      setPasswordError('Please enter a password!')
      return
    }
  
    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer!')
      return
    }

    checkAccountExists((accountExists) => {
      // If yes, 
      if (accountExists) 
        alert('An account already exist with this email address: ' + email)
      //Else, ask user if they want to create a new account and if yes, then log in
      else logIn()
    })
  };

  return (
    <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <input
            type='search'
            value={email}
            placeholder="Enter your email here"
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <label className="text-red-500 text-sm mt-2">{emailError}</label>}
        </div>

        <div className="mb-6">
          <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && <label className="text-red-500 text-sm mt-2">{passwordError}</label>}
        </div>

        <div className="flex items-center justify-center">
          <input
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
            type="button"
            onClick={onButtonClick}
            value={'Sign in'}
          />
        </div>
      </div>
  )
}

export default Signin