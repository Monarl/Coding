import React from 'react'
import Navbar from '../navbar'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Medications = (props)=>{
    const navigate = useNavigate();
    const [medications, setMedications] = useState([]);//for storing data fetched from database
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);

    //#region Methods used on start up
    useEffect(() => {                                   //checking authenthication
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

    const getMedication = () => {                       //fetching data from database
        fetch('http://localhost:8000/medications/getMed').then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
            console.log(data)
            setMedications(data); // Store the fetched data in state
        }).catch((error) => {
            setError(error.message); // Catch and display any errors
        }); 
    }

    //#endregion
    
    //#region Methodds used for interaction
    const handleSearch = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/medications/med-search?search=${search}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            setMedications(data);
            setLoading(false);
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    };


    //#endregion

    return(
        <div>
        <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn}/> {/*Navbar component to navigate*/}
        <div className="container mx-auto p-4">
        <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-bold mb-4">Medication List</h1>
        <form onKeyUp={handleSearch}><input type='search'
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for patient's name" 
            className='mb-5 inline border-2 border-black placeholder-slate-400 p-2 min-w-[30vw]'/></form> {/*Search bar */}
        </div>
        <div className="overflow-x-auto"> {/*Table design */}
        <table className="table-auto min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100 border-b">
            <tr>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Medication Code</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Medication Name</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Price</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Effect</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Expiration Date</th>
            </tr>
            </thead>
            <tbody> 
            {medications.map((medication, index) => (
                <tr key={index} className="border-b hover:bg-blue-300"> 
                    <td className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
                        <Link to={`/medications/med_info?id=${medication.Med_Code}` } className="block w-full h-full">{medication.Med_Code}</Link></td>
                    <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{medication.Med_Name}</td>
                    <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{medication.Price}</td>
                    <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{medication.Effects}</td>
                    <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{new Date(medication.Expiration_date).toDateString()}</td>
                </tr> 
            ))} 
            <tr className="border-b hover:bg-blue-300"> 
                <td colSpan="5" className='py-2 px-4 font-semibold text-center hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70 hover:underline'> {/* button for Adding new medication*/}
                    <Link to={`/medications/add_medication` } className="block w-full h-full">
                    <span>Add medication</span></Link></td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
    </div>
    )
}


export default Medications;