import React, { useState } from 'react';
import myImage from '../assets/22d4c55fec765ffc334607b4b7051b75_3491298004772780088.webp'; // Adjust the path based on your structure

const Greeting = ({name, age}) => {
   return(
    <div>
        <h2>{name}</h2>
        <p>{age}</p>
    </div>
   )
};


export default Greeting;
