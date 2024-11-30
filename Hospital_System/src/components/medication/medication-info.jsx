import React from 'react'
import Navbar from '../navbar'
import {useState, useEffect} from 'react'
import { Await, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';


const Medication_info = (props)=>{
    const navigate = useNavigate();
    const location = useLocation(); // For taking query parameters
    const [disableEdit, setDisableEdit] = useState(true); // To allow edit form; True: not allowed to edit
    const [medications, setMedications] = useState([]);

    const queryParams = new URLSearchParams(location.search); // Read query parameters
    const MedID = queryParams.get('id');
    const [error, setError] = useState(null);

    //#region start up + methods

    useEffect(() => {                                          // Verify authentication
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

    const getMedications = async() => {                         // get the medication data from databases
        try { const response = await fetch(`http://localhost:8000/medications/med-search?search=${MedID}`); 
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            const data = await response.json();
            console.log(data);
            setMedications(data);
        }
        catch (error) { 
            setError(error.message); 
        }
    };

    useEffect(() => {
        getMedications();
    }, []);

    

    //#endregion
    
    const handleSubmit = async(e) =>{ ///for handel submit and send data to backend
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const Med_Name = formData.get('new_Med_Name')? formData.get('new_Med_Name'):medications[0].Med_Name;
        const Price = formData.get('new_Price') ? formData.get('new_Price') : medications[0].Price;
        const Expiration_date = formData.get('new_Expiration_date') ?formData.get('new_Expiration_date'): medications[0].Expiration_date;
        const Effects = formData.get('new_Effects')? formData.get('new_Effects'): medications[0].Effects;
        const payLoad = { Med_Name, Price, Expiration_date, Effects, MedID};
        console.log(payLoad);
        try{
            const response = await fetch('http://localhost:8000/medications/update',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Medication updated successfully:', data);
                navigate('/medications/');
            } else{
                const errorData = await response.json();
                console.error('Failed to update medication:', errorData);
                alert("Medication updated Fail");
            }
        } catch (err){
            setError(err.message);
        }
    };

    //#region Elements in html
    
    const EditButton = () => {      // the button for editing
        return(<button type='button' onClick={() => setDisableEdit(!disableEdit)} className='col-span-1 col-start-2 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Edit ✏️</button>);
    } 

    const SpacesForMedInfo = () =>{  //the area contains info of medication
    return (
        <div className='grid grid-cols-6 gap-y-5 mb-4 gap-x-1 col-span-6'>
            {/*Med Name */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Medication Name: </span>
                    {medications.map((medication,index) => <input key={index}
                        name="Med_Name"
                        value={medication.Med_Name}
                        disabled = {true}
                        className='bg-slate-100 rounded-2xl px-2'/>)}
            </div>
            {(disableEdit)? <div className='md:col-span-3 col-span-6'/> : <div className='md:col-span-3 col-span-6'>
                <span>+ New Medication Name: </span>
                    <input
                        name="new_Med_Name"
                        className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

            {/*Price */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Price: </span>
                {medications.map((medication,index) => <input key={index}
                    type = 'number'
                    name="Price"
                    value={medication.Price}
                    disabled = {true}
                    className='bg-slate-100 rounded-2xl px-2'/>)}
            </div>
            {(disableEdit)? <div className='md:col-span-3 col-span-6'/> : <div className='md:col-span-3 col-span-6'>
                <span>+ New Price: </span>
                <input
                    type = 'number'
                    name="new_Price"
                    className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

            {/*Expiration date */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Expiration Date: </span>
                {medications.map((medication,index) => <input key={index}
                    type='date'
                    name="Expiration_date"
                    value={ new Date(medication.Expiration_date).toISOString().split("T")[0]}
                    disabled = {true}
                    className='bg-slate-100 rounded-2xl px-2'/>)}
            </div>
            {(disableEdit)? <div className='md:col-span-3 col-span-6'/> : <div className='md:col-span-3 col-span-6'>
                <span>+ New Expiration Date: </span>
                <input
                    type='date'
                    name="new_Expiration_date"
                    className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

            {/*Effects*/}
            <div className='col-span-6'>
                <span>+ Effects: </span>
                {medications.map((medication,index) => <textarea key={index}
                    name="Effects"
                    value={medication.Effects}
                    disabled = {true}
                    className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                    rows={3} /> )}
            </div>
            {(disableEdit)? "" : <div className='col-span-6'>
                <span>+ New Effects: </span>
                <textarea
                    name="new_Effects"
                    className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                    rows={3}  // Adjust the rows based on how many lines you want visible initially
                />
            </div>}
        </div>
        
    );  
    }

    //#endregion

    return(
        <div>
            <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
            <div className='w-3/4 border-2 rounded-lg m-auto p-2 bg-slate-200 my-20 overflow-hidden'> {/* Medication data form */}
                <form onSubmit={handleSubmit}>
                <div className='grid-cols-6 grid justify-center text-xl p-3 m-auto'> 
                    <h1 className='text-4xl font-bold col-span-6 text-center m-4 mb-10 p-4 shadow-slate-700 shadow-sm'>
                        MEDICATION No. {MedID}
                    </h1>
                    <EditButton/>
                    <SpacesForMedInfo/>
                </div>
                <div className='w-full flex justify-center'>
                    {(disableEdit)? "" : <button className='col-span-1 col-start-5 m-5 p-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
                        type = 'submit'>
                        Submit</button>}
                </div>
                </form>
            </div>
        </div>
    )
}


export default Medication_info;