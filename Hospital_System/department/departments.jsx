import React from 'react'
import Navbar from '../navbar'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Departments = (props)=>{
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);//for storing data fetched from database
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
        getDepartments();
    }, []);

    const getDepartments = () => {                       //fetching data from database
        fetch('http://localhost:8000/departments/get-departments').then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
            console.log(data)
            setDepartments(data); // Store the fetched data in state
        }).catch((error) => {
            setError(error.message); // Catch and display any errors
        }); 
    }

    //#endregion
    
    //#region Methodds used for interaction
    const handleSearch = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/departments/search?search=${search}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            setDepartments(data);
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
        <h1 className="text-2xl font-bold mb-4">Department List</h1>
        <form onKeyUp={handleSearch}><input type='search'
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for department's name" 
            className='mb-5 inline border-2 border-black placeholder-slate-400 p-2 min-w-[30vw]'/></form> {/*Search bar */}
        </div>
        <div className="overflow-x-auto"> {/*Table design */}
        <table className="table-auto min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100 border-b">
            <tr>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Department Code</th>
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Department Title</th>
            </tr>
            </thead>
            <tbody> 
            {departments.map((department, index) => (
                <tr key={index} className="border-b hover:bg-blue-300"> 
                    <td className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
                        <Link to={`/departments/info?Department_Code=${department.Dept_Code}` } className="block w-full h-full">{department.Dept_Code}</Link></td>
                    <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{department.Title}</td>
                </tr> 
            ))} 
            <tr className="border-b hover:bg-blue-300"> 
                <td colSpan="5" className='py-2 px-4 font-semibold text-center hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70 hover:underline'> {/* button for Adding new medication*/}
                    <Link to={`/departments/add_department` } className="block w-full h-full">
                    <span>Add department</span></Link></td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
    </div>
    )
}


export default Departments;