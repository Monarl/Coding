import React from 'react'
import Navbar from '../navbar'
import {useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'

const Add_department = (props)=>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);

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

    //#endregion

    //#region interaction

    const checkDept_Code = async (Dept_Code) => {
    try {
        const response = await fetch(`http://localhost:8000/departments/search?search=${Dept_Code}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data.length === 0;
    } catch (error) {
        setError(error.message);
        setLoading(false);
        return false;
    }
};


    const handleSubmit = async(e) =>{                        //handle submit
        e.preventDefault();
        //get submit info
        const formData = new FormData(e.currentTarget);
        const Dept_Code = formData.get("Dept_Code"); 
        const Title = formData.get("Title"); 

        if (!checkDept_Code(Dept_Code)) {
            alert (" Department code has existed.");
            return;
        }
            
        //send data to db
        try{
            const payload = { Dept_Code, Title};
            const response = await fetch('http://localhost:8000/departments/add-to-db',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Department added successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to add department:', errorData);
                alert("Department added Fail");
            }
        } catch (error){
            console.error(error);
        }
        
    }

    //#endregion

    //#region html

    const SpacesForDeptInfo = () =>{         //the area contains info of medication
    return (
        <div className='grid grid-cols-6 gap-y-5 mb-4 col-span-6'>
            <div className='md:col-span-3 col-span-6'>
                <span>+ Department Code: </span>
                    <input
                        name="Dept_Code"
                        className='bg-slate-100 rounded-2xl px-2'
                        required
                        />
            </div>
            <div className='md:col-span-3 col-span-6'>
                <span>+ Department Title: </span>
                <input
                    name="Title"
                    className='bg-slate-100 rounded-2xl px-2'
                    required
                />
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
                        ADD DEPARTMENT
                    </h1>
                    <SpacesForDeptInfo/>
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

export default Add_department