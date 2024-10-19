import React from 'react'

const WelcomeMessage = () => {
    return (
        <div className="h-screen flex justify-center bg-gray-100">
          <div className='h-40 flex items-center bg-yellow-600'>
          <h1 className="text-4xl font-bold text-blue-500">
            Hello, Tailwind in React!
          </h1>
          </div>
          <p>Test_box</p>
        </div>
      );
}

export default WelcomeMessage