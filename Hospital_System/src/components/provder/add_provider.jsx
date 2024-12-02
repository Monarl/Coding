import React from 'react'
import Navbar from '../navbar'
import {useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'

const Add_provider = (props)=>{
    const navigate = useNavigate();
    const [medications, setMedications] = useState([]);        // list of all provider

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

    const getMedications = () => {                       //get medications data from database
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

    useEffect(() => {
        getMedications();

    }, []);

    //#endregion

    //#region interaction

    const handleSubmit = async(e) =>{                        //handle submit
        e.preventDefault();

        let isGood = true;
        let Provider_num = 0;
        //get submit info
        const formData = new FormData(e.currentTarget);
        const P_Name = formData.get("P_Name"); 
        const Phone = formData.get("Phone"); 
        const Address = formData.get("Address");    // Prepare the payload 

        //get info in the table
        const listMedications = []; 
        medications.forEach((medication) => { if (formData.get(medication.Med_Code.toString()) === "on") { 
            listMedications.push(medication.Med_Code); 
        }});
        if (listMedications.length === 0) {
            alert("Provider must provide at least a medication.");
            return;
        }

        //set info to create new provider
        try{
            const payload = { P_Name, Phone, Address};
            const response = await fetch('http://localhost:8000/providers/add-to-db',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Provider added successfully:', data);
                Provider_num = data.insertId;
            } else{
                const errorData = await response.json();
                console.error('Failed to add provider:', errorData);
                alert("Provider added Fail");
                isGood = false;
            }
        } catch (error){
            console.error(error);
            isGood = false;
        }

        //set provide relation
        try{
            const payLoad = listMedications.map(Med_Code => [Med_Code,Provider_num])
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

    //#region html elements

    const SpacesForProviderInfo = () =>{         //the area contains info of medication
    return (
        <div className='grid grid-cols-6 gap-y-5 mb-4 col-span-6'>
            <div className='md:col-span-3 col-span-6'>
                <span>+ Provider Name: </span>
                    <input
                        name="P_Name"
                        className='bg-slate-100 rounded-2xl px-2'
                        required
                        />
            </div>
            <div className='md:col-span-3 col-span-6'>
                <span>+ Phone: </span>
                <input
                    type='tel'
                    pattern='[0-9]{10}'
                    name="Phone"
                    className='bg-slate-100 rounded-2xl px-2'
                    required
                    />
            </div>
            <div className='col-span-6'>
                <span>+ Address: </span>
                <textarea
                    name="Address"
                    className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                    required
                    rows={3}  // Adjust the rows based on how many lines you want visible initially
                />
            </div>
        </div>
        
    );  
    }

    const MedicationTable = () => {
        return (
            <div className='justify-center flex'> {/* Med Table design */}
                    <div className="overflow-x-auto p-3 w-5/6">
                        <h1 className="text-2xl font-bold my-4">Medications</h1>

                        <table className="table-auto text-lg min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-100 border-b">
                                <tr className='*:py-2 *:px-4 *:text-center *:border-x-2 *:font-semibold *:text-gray-700 '>
                                    <th className="">Medication Code</th>
                                    <th className="">Medication Name</th>
                                    <th className="">Price</th>
                                    <th className="">Expiration Date</th>
                                    <th className="">Effects</th>
                                    <th className="">Include</th>
                                </tr>
                            </thead>
                            <tbody>
                            {medications.map((medication,index)=>
                                <tr key= {index} className="border-b hover:bg-blue-300 *:py-2 *:px-4 *:border-x-2  hover:*:bg-blue-600 hover:*:font-semibold hover:*:bg-opacity-70">
                                        <td className="">{medication.Med_Code}</td>
                                        <td className="">{medication.Med_Name}</td>
                                        <td className="">{medication.Price}</td>
                                        <td className="">{new Date(medication.Expiration_date).toISOString().split("T")[0]}</td>
                                        <td className=""> {medication.Effects}</td>
                                        <td className=""> 
                                            <input className='h-6 w-6 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-50' 
                                            type='checkbox'
                                            name={medication.Med_Code.toString()}
                                            defaultChecked = {medications.some( medProvide => medProvide.Med_code === medication.Med_Code)}
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
                        ADD PROVIDER
                    </h1>
                    <SpacesForProviderInfo/>
                </div>
                <MedicationTable/>
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

export default Add_provider