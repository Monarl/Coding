import React from 'react'
import Navbar from '../navbar'
import {useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'

const Add_medication = (props)=>{
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);        // list of all provider

    //#region start up
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

    const getProviders = () => {                       //get providers data from database
        fetch('http://localhost:8000/providers/getProviders').then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
            console.log(data)
            setProviders(data); // Store the fetched data in state
        }).catch((error) => {
            setError(error.message); // Catch and display any errors
        }); 
    }

    useEffect(() => {
        getProviders();

    }, []);

    //#endregion

    //#region interaction

    const handleSubmit = async(e) =>{                        //handle submit
        e.preventDefault();

        let isGood = true;
        let Med_Code = 0;
        //get submit info
        const formData = new FormData(e.currentTarget);
        const Med_Name = formData.get("Med_Name"); 
        const Price = formData.get("Price"); 
        const Expiration_date = formData.get("Expiration-Date"); 
        const Effects = formData.get("Effects");    // Prepare the payload 

        // get providers
        const listProviders = []; 
        providers.forEach((provider) => { if (formData.get(provider.Provider_num.toString()) === "on") { 
            listProviders.push(provider.Provider_num); 
        }});
        if (listProviders.length === 0) {
            alert("Medication must have atleast a provider.");
            return;
        }
            
        //send data to db
        try{
            const payload = { Med_Name, Price, Expiration_date, Effects};
            const response = await fetch('http://localhost:8000/medications/add-to-db',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Medication added successfully:', data);
                Med_Code = data.insertId;
                console.log('Medication code:', Med_Code);
            } else{
                const errorData = await response.json();
                console.error('Failed to add medication:', errorData);
                alert("Medication added Fail");
                isGood = false;
            }
        } catch (error){
            console.error(error);
            isGood = false;
        }
        
        //set relationship with providers
        try{
            const payLoad = listProviders.map(Provider_num => [Med_Code,Provider_num])
            console.log(payLoad);
            const response = await fetch('http://localhost:8000/medications/addListProvider',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payLoad),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Provide relation add successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to add Provide relation:', errorData);
                alert("Provide relation add Fail");
                isGood = false;
            }
        } catch (error){
            console.error(error);
            isGood = false;
        }
        if (isGood) {navigate(-1);}
    }

    //#endregion

    //#region html

    const SpacesForMedInfo = () =>{         //the area contains info of medication
    return (
        <div className='grid grid-cols-6 gap-y-5 mb-4 col-span-6'>
            <div className='md:col-span-3 col-span-6'>
                <span>+ Medication Name: </span>
                    <input
                        name="Med_Name"
                        className='bg-slate-100 rounded-2xl px-2'
                        required
                        />
            </div>
            <div className='md:col-span-3 col-span-6'>
                <span>+ Price: </span>
                <input
                    type='number'
                    name="Price"
                    min='0'
                    className='bg-slate-100 rounded-2xl px-2'
                    required
                />
            </div>
            <div className='md:col-span-3 col-span-6'>
                <span>+ Expiration Date: </span>
                <input
                    type='date'
                    name="Expiration-Date"
                    className='bg-slate-100 rounded-2xl px-2'
                    required
                    />
            </div>
            <div className='col-span-6'>
                <span>+ Effects: </span>
                <textarea
                    name="Effects"
                    className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                    required
                    rows={3}  // Adjust the rows based on how many lines you want visible initially
                />
            </div>
        </div>
        
    );  
    }

    const ProviderTable = () => {
    return (
        <div className='justify-center flex'> {/* Provider Table design */}
                <div className="overflow-x-auto p-3 w-5/6">
                    <h1 className="text-2xl font-bold my-4">Provider</h1>

                    <table className="table-auto text-lg min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100 border-b">
                            <tr className='*:py-2 *:px-4 *:text-center *:border-x-2 *:font-semibold *:text-gray-700 '>
                                <th className="">Provider Number</th>
                                <th className="">Provider Name</th>
                                <th className="">Phone</th>
                                <th className="">Address</th>
                                <th className="">Include</th>
                            </tr>
                        </thead>
                        <tbody>
                        {providers.map((provider,index)=>
                            <tr key= {index} className="border-b hover:bg-blue-300 *:py-2 *:px-4 *:border-x-2  hover:*:bg-blue-600 hover:*:font-semibold hover:*:bg-opacity-70">
                                    <td className="">{provider.Provider_num}</td>
                                    <td className="">{provider.P_Name}</td>
                                    <td className="">{provider.Phone}</td>
                                    <td className=""> {provider.Address}</td>
                                    <td className=""> 
                                        <input className='h-6 w-6 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-50' 
                                        type='checkbox'
                                        name={provider.Provider_num.toString()}
                                        /></td>
                            </tr>
                        )}</tbody>
                    </table>
                </div>
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
                        ADD MEDICATION
                    </h1>
                    <SpacesForMedInfo/>
                </div>
                <ProviderTable/>
                <div className='w-full flex justify-center'>
                    <button className='col-span-1 col-start-5 m-5 p-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
                        type = 'submit'>
                        Submit</button>
                </div>
                
                </form>
            </div>
        </div>
    )
}

export default Add_medication