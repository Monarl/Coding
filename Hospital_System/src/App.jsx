import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/home.jsx'
import Login from './components/login.jsx'
import Patients from './components/patients.jsx'
import About from './components/about.jsx'
import Patient from './components/patient-info.jsx'
import Employees from './components/employees.jsx'
import Medications from './components/medication/medications.jsx'
import Medication_info from './components/medication/medication-info.jsx'
import Add_medication from './components/medication/add_medication.jsx'
import Providers from './components/provder/providers.jsx'
import Add_provider from './components/provder/add_provider.jsx'
import { useEffect, useState } from 'react'
import Provider_info from './components/provder/provider_info.jsx'
import Mainpage from './components/mainpage.jsx'
import Signin from './components/signin.jsx'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem('user'))
    const now = new Date()
  
    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }

    console.log(`Time left: ${(user.expiry - now.getTime()) / 1000}`)

    if (now.getTime() > user.expiry) {
      localStorage.removeItem('user')
      setLoggedIn(false)
      return
    }
  
    // If the token exists, verify it with the auth server to see if it is valid
    fetch('http://localhost:8000/login/verify', {
      method: 'POST',
      headers: {
        'jwt-token': user.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        setLoggedIn('success' === r.message)
        setEmail(user.email || '')
      })
  }, []) //Check if user already logged in

  return (
    <div className="App"> {/*Router for different component to render*/}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route 
            path='/main' 
            element={<Mainpage loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} loggedIn = {loggedIn} />} />
          <Route path="/signin" element={<Signin setLoggedIn={setLoggedIn} setEmail={setEmail} loggedIn = {loggedIn} />} />

          <Route 
            path='/patients' 
            element={<Patients loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/about' 
            element={<About loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/patients/patient' 
            element={<Patient loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/employees' 
            element={<Employees loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/medications' 
            element={<Medications loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/medications/med_info' 
            element={<Medication_info loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/medications/add_medication' 
            element={<Add_medication loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/providers' 
            element={<Providers loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/providers/add_provider' 
            element={<Add_provider loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
          <Route 
            path='/providers/provider_info' 
            element={<Provider_info loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App