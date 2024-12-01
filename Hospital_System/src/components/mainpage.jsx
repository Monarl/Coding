import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const MainPage = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const now = new Date();

    if (!user || !user.token) {
      props.setLoggedIn(false);
      navigate('/');
      return;
    }

    if (now.getTime() > user.expiry) {
      localStorage.removeItem('user');
      props.setLoggedIn(false);
      navigate('/');
      return;
    }
  }, [navigate, props]);

  return (
    <div className="w-screen h-screen">
      <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
  
      <div className="flex justify-center m-auto mt-5 w-5/6 h-5/6 p-6 bg-gray-200 rounded-lg bg-opacity-80 shadow-md">
        <button
          className="aspect-square max-w-[33%] max-h-[50%] font-bkel transition-all duration-500 
                     hover:scale-105 hover:font-bold rounded-lg overflow-hidden"
          onClick={() => navigate('/patients')}
        >
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="flex items-center justify-center w-full h-1/2 bg-gray-600 text-white text-[5vw] md:text-[3vw]">
              🛌
            </div>
            <div className="w-full h-0.5 bg-gray-400"></div>
            <div className="flex items-center justify-center w-full h-1/2 bg-white text-gray-800 text-[3vw] md:text-[1.5vw]">
              Patients
            </div>
          </div>
        </button>
      </div>
    </div>
  );    
};

export default MainPage;
