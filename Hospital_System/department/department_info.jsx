import React from 'react'
import Navbar from '../navbar'
import {useState, useEffect} from 'react'
import { Await, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';


const Department_info = (props)=>{
    const navigate = useNavigate();
    const location = useLocation(); // For taking query parameters
    const [disableEdit, setDisableEdit] = useState(true); // To allow edit form; True: not allowed to edit
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [deans, setDeans] = useState([]);

    const queryParams = new URLSearchParams(location.search); // Read query parameters
    const Dept_Code = queryParams.get('Department_Code');
    const [error, setError] = useState(null);

    //#region start up

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

    const getDepartments = async() => {                         // get the medication data from databases
        try { const response = await fetch(`http://localhost:8000/departments/search?search=${Dept_Code}`); 
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            const data = await response.json();
            console.log(data);
            setDepartments(data);
        }
        catch (error) { 
            setError(error.message); 
        }
    };

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
        getDepartments();
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
        return data.length === 0;
    } catch (error) {
        setError(error.message);
        setLoading(false);
        return false;
    }
};

    const handleSubmit = async(e) =>{ ///for handel submit and send data to backend
        e.preventDefault();

        let isGood = true;
        const oldDept_Code = departments[0].Dept_Code;
        const oldDoc_Code = deans.find(dean => dean.Dept_Code === oldDept_Code)["Doc_Code"];
        const oldExperience = deans.find(dean => dean.Dept_Code === oldDept_Code)["Experience_year"];
        //get submit info
        const formData = new FormData(e.currentTarget);
        const Dept_Code = formData.get('new_Dept_Code')? formData.get('new_Dept_Code'):oldDept_Code;
        if (formData.get('new_Dept_Code')){
            if (!checkDept_Code(Dept_Code)) {
            alert (" Department code has existed.");
            return;
        }}
        const Title = formData.get('new_Title') ? formData.get('new_Title') : departments[0].Title;

        const Doc_Code = formData.get('new_Doc_Code_of_Dean')? formData.get('new_Doc_Code_of_Dean'):oldDoc_Code;
        if (Doc_Code !== oldDoc_Code){
            if (!formData.get('new_Experience')) {
            alert ("Experience is required");
            return;
        }}
        const Experience_year = formData.get('new_Experience')? formData.get('new_Experience'):oldExperience;

        //update dean
        try{
            const payLoad = {Doc_Code, Experience_year, oldDept_Code};
            const response = await fetch('http://localhost:8000/departments/update_dean',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Dean updated successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to update dean:', errorData);
                alert("Dean updated Fail");
                isGood = false;
            }
        } catch (err){
            setError(err.message);
            isGood = false;
        }

        try{
            const payLoad = {Dept_Code, Title, oldDept_Code};
            const response = await fetch('http://localhost:8000/departments/update',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Department updated successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to update department:', errorData);
                alert("Department updated Fail");
                isGood = false;
            }
        } catch (err){
            setError(err.message);
            isGood = false;
        }

        

        if (isGood) {navigate('/departments');}
    };

    //#endregion

    //#region Elements in html
    
    const EditButton = () => {      // the button for editing
        return(<button type='button' onClick={() => setDisableEdit(!disableEdit)} className='col-span-1 col-start-2 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Edit ✏️</button>);
    } 

    const DeleteButton = () => {      // the button for deleting
        return(<button type='button' className='col-span-1 col-start-5 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Delete 🗑️</button>);
    } 

    const SpacesForDeptInfo = () =>{  //the area contains info of medication
    return (
        <div className='grid grid-cols-6 gap-y-5 mb-4 gap-x-1 col-span-6'>
            {/*Dept_Code */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Department Code: </span>
                    {departments.map((department,index) => <input key={1}
                        name="Dept_Code"
                        value={department.Dept_Code}
                        disabled = {true}
                        className='bg-slate-100 rounded-2xl px-2'/>)}
            </div>
            {(disableEdit)? <div className='md:col-span-3 col-span-6'/> : <div className='md:col-span-3 col-span-6'>
                <span>+ New Department Code: </span>
                    <input
                        name="new_Dept_Code"
                        className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

            {/*Title */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Department Title: </span>
                {departments.map((department,index) => <input key={1}
                    name="Title"
                    value={department.Title}
                    disabled = {true}
                    className='bg-slate-100 rounded-2xl px-2'/>)}
            </div>
            {(disableEdit)? <div className='md:col-span-3 col-span-6'/> : <div className='md:col-span-3 col-span-6'>
                <span>+ New Department Title: </span>
                <input
                    name="new_Title"
                    className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

            {/*Dean */}
            {(disableEdit)? "": <div className='md:col-span-3 col-span-6'>
                <span>+ DEAN: </span>
                <input
                    name="Doc_Code_of_Dean"
                    disabled = {true}
                    value={deans.find(dean => dean.Dept_Code === Dept_Code)["Doc_Code"]}
                    className='bg-slate-100 rounded-2xl px-2'/>
            </div>}
            {(disableEdit)? "": <div className='md:col-span-3 col-span-6'>
                <span>+ New DEAN: </span>
                <select
                    value={employees.Doc_Code}
                    name="new_Doc_Code_of_Dean"
                    className='bg-slate-100 rounded-2xl px-2'>
                    <option value="">Select a Doctor</option> {/* Lựa chọn mặc định */}
                        {employees
                            .filter(employee => employee.Emp_Code.startsWith('D') && (!deans.some(dean => dean.Doc_Code === employee.Emp_Code && dean.Dept_Code !== Dept_Code)))
                            .map(doctor =>(
                            <option key={doctor.Emp_Code}>{doctor.Emp_Code}</option>
                        ))}
                </select>
            </div>}
            
            {/*Experience year */}
            {(disableEdit)? "": <div className='md:col-span-3 col-span-6'>
                <span>+ Experience Year: </span>
                <input
                    name="Experience"
                    disabled = {true}
                    value={deans.find(dean => dean.Dept_Code === Dept_Code)["Experience_year"]}
                    className='bg-slate-100 rounded-2xl px-2'/>
            </div>}
            {(disableEdit)? "": <div className='md:col-span-3 col-span-6'>
                <span>+ New Experience Year: </span>
                <input
                    name="new_Experience"
                    type='number'
                    min={Number(5)}
                    className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

        </div>
        
    );  
    }

    const DeanTable = () =>{
        if (!disableEdit) return "" ;
        else return (
            <div className='justify-center flex'> {/* Dean Table design */}
                    <div className="overflow-x-auto p-3 w-5/6">
                        <h1 className="text-2xl font-bold my-4">DEAN</h1>

                        <table className="table-auto text-lg min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-100 border-b">
                                <tr className='*:py-2 *:px-4 *:text-center *:border-x-2 *:font-semibold *:text-gray-700 '>
                                    <th className="">Employee Code</th>
                                    <th className="">Date of Birth</th>
                                    <th className="">Specialty</th>
                                    <th className="">Degree's Year</th>
                                    <th className="">Start Date</th>
                                    <th className="">First Name</th>
                                    <th className="">Last Name</th>
                                    <th className="">Phone Number</th>
                                    <th className="">Gender</th>
                                    <th className="">Experience Year</th>
                                </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee,index)=> (deans.some(dean => dean.Doc_Code === employee.Emp_Code && dean.Dept_Code === Dept_Code)) ? 
                                <tr key= {index} className="border-b hover:bg-blue-300 *:py-2 *:px-4 *:border-x-2  hover:*:bg-blue-600 hover:*:font-semibold hover:*:bg-opacity-70">
                                        <td className="">{employee.Emp_Code}</td>
                                        <td className="">{new Date(employee.Dob).toISOString().split("T")[0]}</td>
                                        <td className="">{employee['Specialty Name']}</td>
                                        <td className=""> {employee["Degree's year"]}</td>
                                        <td className=""> {new Date(employee["Start date"]).toISOString().split("T")[0]}</td>
                                        <td className=""> {employee["F_name"]}</td>
                                        <td className=""> {employee["L_name"]}</td>
                                        <td className=""> {employee["Phone_number"]}</td>
                                        <td className=""> {employee["Gender"]}</td>
                                        <td className=""> {deans.find(dean => dean.Dept_Code === Dept_Code)["Experience_year"]}</td>
                                </tr>
                            : "")}
                            </tbody>
                        </table>
                    </div>
                </div>
        );
    }

    const EmployeesTable = () =>{
        if (!disableEdit) return "";
        else return (
            <div className='justify-center flex'> {/* Employees Table design */}
                    <div className="overflow-x-auto p-3 w-5/6">
                        <h1 className="text-2xl font-bold my-4">Employees</h1>

                        <table className="table-auto text-lg min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-100 border-b">
                                <tr className='*:py-2 *:px-4 *:text-center *:border-x-2 *:font-semibold *:text-gray-700 '>
                                    <th className="">Employee Code</th>
                                    <th className="">Date of Birth</th>
                                    <th className="">Specialty</th>
                                    <th className="">Degree's Year</th>
                                    <th className="">Start Date</th>
                                    <th className="">First Name</th>
                                    <th className="">Last Name</th>
                                    <th className="">Phone Number</th>
                                    <th className="">Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee,index)=> (employee.Dept_Code === Dept_Code) ? 
                                <tr key= {index} className="border-b hover:bg-blue-300 *:py-2 *:px-4 *:border-x-2  hover:*:bg-blue-600 hover:*:font-semibold hover:*:bg-opacity-70">
                                        <td className="">{employee.Emp_Code}</td>
                                        <td className="">{new Date(employee.Dob).toISOString().split("T")[0]}</td>
                                        <td className="">{employee['Specialty Name']}</td>
                                        <td className=""> {employee["Degree's year"]}</td>
                                        <td className=""> {new Date(employee["Start date"]  ).toISOString().split("T")[0]}</td>
                                        <td className=""> {employee["F_name"]}</td>
                                        <td className=""> {employee["L_name"]}</td>
                                        <td className=""> {employee["Phone_number"]}</td>
                                        <td className=""> {employee["Gender"]}</td>
                                </tr>
                            : "")}
                            </tbody>
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
                        DEPARTMENT: {Dept_Code}
                    </h1>
                    <EditButton/>
                    <DeleteButton/>
                    <SpacesForDeptInfo/>
                </div>
                <DeanTable/>
                <EmployeesTable/>
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


export default Department_info;