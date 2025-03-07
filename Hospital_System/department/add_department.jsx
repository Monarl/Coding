import React from 'react'
import Navbar from '../navbar'
import {useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'

const Add_department = (props)=>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [deans, setDeans] = useState([]);

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

    const getEmployees = async() => {                         // get the medication data from databases
        try { const response = await fetch(`http://localhost:8000/employees/employee-list`); 
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            const data = await response.json();
            console.log(data);
            setEmployees(data);
        }
        catch (error) { 
            setError(error.message); 
        }
    };

    const getDeans = async() => {                         // get the medication data from databases
        try { const response = await fetch(`http://localhost:8000/departments/get_deans`); 
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            const data = await response.json();
            console.log(data);
            setDeans(data);
        }
        catch (error) { 
            setError(error.message); 
        }
    };

    useEffect(() => {
        getEmployees();
        getDeans();
    }, []);

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
        return (data.length === 0);
    } catch (error) {
        setError(error.message);
        setLoading(false);
        return false;
    }
};


    const handleSubmit = async(e) =>{                        //handle submit
        e.preventDefault();

        let isGood = true;
        //get submit info
        const formData = new FormData(e.currentTarget);
        const Dept_Code = formData.get("Dept_Code"); 
        const Title = formData.get("Title"); 
        const Doc_Code = formData.get ("new_Doc_Code_of_Dean");
        const Experience_year = formData.get("new_Experience");


        const isDeptCodeValid = await checkDept_Code(Dept_Code);
        if (!isDeptCodeValid) {
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
                isGood = false;
            }
        } catch (error){
            console.error(error);
            isGood = false;
        }

        //add DEAN
        try{
            const payload = { Doc_Code , Dept_Code, Experience_year};
            const response = await fetch('http://localhost:8000/departments/add_dean',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('DEAN added successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to add DEAN:', errorData);
                alert("DEAN added Fail");
                isGood = false;
            }
        } catch (error){
            console.error(error);
            isGood = false;
        }

        
        if (isGood) navigate('/departments');
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

            {/*Dean */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ DEAN: </span>
                <select
                    value={employees.Doc_Code}
                    required
                    name="new_Doc_Code_of_Dean"
                    className='bg-slate-100 rounded-2xl px-2'>
                    <option value="">Select a Doctor</option> {/* Lựa chọn mặc định */}
                        {employees
                            .filter(employee => employee.Emp_Code.startsWith('D') && (!deans.some(dean => dean.Doc_Code === employee.Emp_Code)))
                            .map(doctor =>(
                            <option key={doctor.Emp_Code} required>{doctor.Emp_Code}</option>
                        ))}
                </select>
            </div>
            
            {/*Experience year */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Experience Year: </span>
                <input
                    name="new_Experience"
                    type='number'
                    required
                    min={Number(5)}
                    className='bg-slate-100 rounded-2xl px-2'/>
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