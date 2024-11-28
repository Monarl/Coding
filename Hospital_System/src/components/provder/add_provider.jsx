import React from 'react'
import Navbar from '../navbar'
import {useEffect} from 'react'
import {useNavigate } from 'react-router-dom'

const Add_provider = (props)=>{
    const navigate = useNavigate();

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


    const handleSubmit = async(e) =>{                        //handle submit
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const P_Name = formData.get("P_Name"); 
        const Phone = formData.get("Phone"); 
        const Address = formData.get("Address");    // Prepare the payload 
        const payload = { P_Name, Phone, Address};
        try{
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
                navigate('/providers');
            } else{
                const errorData = await response.json();
                console.error('Failed to add provider:', errorData);
                alert("Provider added Fail");
            }
        } catch (error){
            console.error(error);
        }
    }


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