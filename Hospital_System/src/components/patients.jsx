import React from 'react'
import Navbar from './navbar'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const patients = (props) => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]); //Get Patient info from backend
  const [search, setSearch] = useState(""); // Store searchbar value
  const [error, setError] = useState(null);

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

  useEffect(() => {
    getMedication();
  }, []);

  const ipPatients = medications
  .filter(patient => patient.Patient_Code.startsWith('IP')) // Filter for 'IP' codes
  .map(patient => Number(patient.Patient_Code.slice(2))); // Remove the 'IP' prefix and convert to number

  const opPatients = medications
  .filter(patient => patient.Patient_Code.startsWith('OP')) // Filter for 'OP' codes
  .map(patient => Number(patient.Patient_Code.slice(2))); // Remove the 'OP' prefix and convert to number


  const findFirstGap = (arr) => {    
    if (!Array.isArray(arr) || arr.length === 0) {
        return String(0).padStart(9, '0'); // Return '000000000' for empty or invalid input
    }
    if (arr[0] !== 0) return String(0).padStart(9, '0'); // Gap at the start

    for (let i = 0; i < arr.length - 1; i++) {
        const nextExpected = arr[i] + 1;
        if (arr[i + 1] !== nextExpected) {
            return String(nextExpected).padStart(9, '0'); // Return first gap
        }
    }
    return String(arr.length).padStart(9, '0'); // No gap, return next in sequence
};


  const getMedication = () => {
    fetch('http://localhost:8000/patients/test')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      setMedications(data); // Store the fetched data in state
    })
    .catch((error) => {
      setError(error.message); // Catch and display any errors
    }); 
  }

  const handleDelete = async (index) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient? (This action can't be undone)"
    );
  
    if (!confirmDelete) {
      return; // Exit the function if the user cancels
    }
  
    try {
      const patientToDelete = medications[index]; // Extract the specific patient data
  
      const response = await fetch(`http://localhost:8000/patients/delete-patients`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient: patientToDelete }), // Send the patient data to the backend
      });
  
      if (response.ok) {
        // Remove the patient from the state
        setMedications((prevPatients) => prevPatients.filter((_, i) => i !== index));
      } else {
        console.error('Failed to delete the patient.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/patients/patient-search?search=${search}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      setMedications(data); // Store the fetched data in state
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message); // Catch and display any errors
      setLoading(false);
    });
  };

  return (
    <div>
      <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn}/> {/*Navbar component to navigate*/}
      <div className="container mx-auto p-4">
      <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-bold mb-4">Patient List</h1>
        <form onSubmit={handleSubmit}><input type='search'
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for patient's name" 
                    className='mb-5 inline border-2 border-black placeholder-slate-400 p-2 min-w-[30vw]'/></form>
      </div>
      <div className="overflow-x-auto w-full"> {/*Table design */}
        <table className="table-auto bg-white border border-gray-300 w-full mx-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Patient_Code</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">First Name</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Last Name</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Gender</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Date of Birth</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700">Address</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {medications.map((medication, index) => (
              <tr key={index} className="border-b hover:bg-blue-300">
                <td className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
                  <Link to={`/patients/patient?id=${medication.Patient_Code}`}>{medication.Patient_Code}</Link></td>
                <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{medication.F_name}</td>
                <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{medication.L_name}</td>
                <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{medication.Gender}</td>
                <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{new Date(medication.Dob).toLocaleDateString()}</td>
                <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{medication.Address}</td>
                <td className="py-2 px-4 w-1 text-center hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70"><button type='button' className="" onClick={() => handleDelete(index)}>🗑️</button></td>
              </tr>
            ))}
            <tr className="border-b hover:bg-blue-300">
              <td colSpan="1" className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
                <Link to={`/patients/patient?id=${"IP" + findFirstGap(ipPatients)}&insert=${true}`}>{"IP" + findFirstGap(ipPatients)}</Link></td>
              <td colSpan="5" className='py-2 px-4 font-semibold hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70'>
                <span>Insert new inpatient</span></td>
            </tr>
            <tr className="border-b hover:bg-blue-300">
              <td colSpan="1" className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
              <Link to={`/patients/patient?id=${"OP" + findFirstGap(opPatients)}&insert=${true}`}>{"OP" + findFirstGap(opPatients)}</Link></td>
              <td colSpan="5" className='py-2 px-4 font-semibold hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70'>
                <span>Insert new outpatient</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default patients