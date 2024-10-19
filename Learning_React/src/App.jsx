
import { useState, useEffect } from 'react'
import Greet from './components/Greet'
import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'
import WelcomeMessage from './components/WelcomeMessage'
import Greeting from './components/Greeting'
import ProductInfo from './components/ProductInfo'

function App() {

  return (
      <div>
        <Greeting name="Timmy" age = {8}/>
        <ProductInfo name='Laptop' price="1000$"/>
      </div>
  )
}

export default App
