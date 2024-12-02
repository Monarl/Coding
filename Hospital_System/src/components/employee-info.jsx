import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Employee_info = (props) => {
    const location = useLocation(); // For taking query parameters
    const navigate = useNavigate(); // For navigating to other components
    const [edited, setEdited] = useState(true); // To allow edit patient form; True: not allowed

    const queryParams = new URLSearchParams(location.search); // Read query parameters
    const employeeId = queryParams.get('id');
    let inserted = queryParams.get('insert')

    const doctor = employeeId.substring(0, 1) === "D";
    const today = new Date();

    // Calculate max date for 18 years ago
    const maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate() + 1
    ).toISOString().split("T")[0];

    // Calculate min date for 65 years ago
    const minDate = new Date(
        today.getFullYear() - 65,
        today.getMonth(),
        today.getDate() + 1
    ).toISOString().split("T")[0];

    const zeroAge = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
    ).toISOString().split("T")[0];

    const oldAge = new Date(
        today.getFullYear() - 120,
        today.getMonth(),
        today.getDate() + 1
    ).toISOString().split("T")[0];

    
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employeeData, setEmployeeData] = useState({
        F_name: '',
        L_name: '',
        Phone_num: '',
        Gender: '',
        Dob: '',
        Address: '',
        Start_date: '',
        Dept_Code: '',
        Specialty_Name: '',
        Degree_year:'',
        id: '',
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const now = new Date();
        console.log(user);

        if (!user || !user.token) {
            props.setLoggedIn(false);
            navigate('/');
            return;
        }

        if (now.getTime() > user.expiry) {
            localStorage.removeItem('user');
            props.setLoggedIn(false);
            navigate('/');
            return;
        }
    }, [navigate, props]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/employees/employee-detail?search=${employeeId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                data.forEach(obj => {
                    Object.keys(obj).forEach(key => {
                        const value = obj[key];
                
                        // Check if the key contains 'date' or 'dob' (case-insensitive)
                        if (/date|dob/i.test(key)) {
                            // Check if the value is a string and looks like a valid date
                            if (typeof value === 'string') {
                                const parsedDate = new Date(value);
                                // Only adjust if it's a valid date (not NaN)
                                if (!isNaN(parsedDate.getTime())) {
                                    obj[key] = adjustDate(parsedDate);
                                }
                            }
                        }
                    });
                });
                console.log(data);
                setEmployees(data);
    
                // Set employee data from the fetched data
                setEmployeeData({
                    F_name: data[0]?.F_name || '',
                    L_name: data[0]?.L_name || '',
                    Phone_num: data[0]?.Phone_number || '',
                    Gender: data[0]?.Gender || '',
                    Dob: data[0]?.Dob || '',
                    Address: data[0]?.Address || '',
                    Start_date: data[0]?.['Start date'] || '',
                    Dept_Code: data[0]?.Dept_Code || '',
                    Specialty_Name: data[0]?.['Specialty Name'] || '',
                    Degree_year: data[0]?.['Degree\'s year'] || '',
                    id: employeeId || '',
                });

                // Fetch department for dropdown selection
                const responseDepartments = await fetch(`http://localhost:8000/employees/department-list`);
                if (!responseDepartments.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataDepartment = await responseDepartments.json();
                //console.log(dataDoctors);
                setDepartments(dataDepartment);


            } catch (error) {
                console.error('Failed to fetch patient data:', error);
            }
        };
    
        fetchEmployeeData();
    }, [employeeId]);
    

    // Handle changes for the input fields
    const handleChange = (e) => {
        let { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
      
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(employees)
        // Log dữ liệu đang được gửi
    // console.log('Submitting Data:', { employeeData, employees });
    fetch(`http://localhost:8000/employees/employee-update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeData, employees }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((error) => {
                    throw new Error(`Error: ${error.message}`);
                });
            }
            setEdited(!edited);
            //if (inserted) navigate('/employees');
            //window.location.reload();
        })
        .catch((error) => {
            console.error('Submit Error:', error);
        });
};


      const adjustDate = (dateString) => {
        if (!dateString) return null; // Return null if date string is empty
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1); // Add 1 day
        return date.toISOString().split("T")[0]; // Return formatted date
      };

      const handleInvalid = (e) => {
        e.target.setCustomValidity(
          'Please enter a valid phone number with 10 numbers.'
        );
      };

    return (
        <div>
            <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
            <div className='w-3/4 border-2 rounded-lg m-auto p-2 bg-slate-200 my-20 overflow-hidden'>
            {/* Patient data form */}
                <form onSubmit={handleSubmit}>
                <div className='grid-cols-6 grid justify-center text-xl p-3 m-auto'> 
                    <h1 className='text-4xl font-bold col-span-6 text-center m-4 mb-10 p-4 shadow-slate-700 shadow-sm'>
                        EMPLOYEE {employeeId}
                    </h1>
                    <button type='button' onClick={() => setEdited(!edited)} className='col-span-2 col-start-3 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Edit ✏️</button>
                    {/* <button type='button' className='col-span-1 col-start-5 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Delete 🗑️</button> */}
                    <div className='grid grid-cols-6 gap-y-5 mb-4 col-span-6'>
                        <div className='md:col-span-3 col-span-6'>
                            <span>+ First Name: {edited === false && (
                            <span style={{ color: 'red' }}>* </span>
                            )}</span>
                            <input
                                name="F_name"
                                value={employeeData.F_name}
                                onChange={handleChange}
                                disabled={edited}
                                required={!edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='md:col-span-3 col-span-6'>
                            <span>+ Last Name: {edited === false && (
                            <span style={{ color: 'red' }}>* </span>
                            )}</span>
                            <input
                                name="L_name"
                                value={employeeData.L_name}
                                onChange={handleChange}
                                disabled={edited}
                                required={!edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='md:col-span-3 col-span-6'>
                        <span>
                            + Gender: 
                            {edited === false && (
                            <span style={{ color: 'red' }}>* </span>
                            )}
                        </span>
                        <select
                            name="Gender"
                            value={employeeData.Gender || ""}
                            onChange={handleChange}
                            disabled={edited}
                            required={!edited}
                            className='bg-slate-100 rounded-2xl px-2 disabled:bg-white'
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                        </div>

                        <div className='md:col-span-3 col-span-6'>
                            <span>+ Date of Birth: {edited === false && (
                            <span style={{ color: 'red' }}>* </span>
                            )}</span>
                            <input
                                type='date'
                                name="Dob"
                                value={employeeData.Dob ? new Date(employeeData.Dob).toISOString().split("T")[0] : ''}
                                max={zeroAge}
                                min={oldAge}
                                onChange={handleChange}
                                disabled={edited}
                                required={!edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='md:col-span-3 col-span-6'>
                            <span>+ Specialty: {edited === false && (
                            <span style={{ color: 'red' }}>* </span>
                            )}</span>
                            <input
                                name="Specialty_Name"
                                value={employeeData.Specialty_Name}
                                onChange={handleChange}
                                disabled={edited}
                                required={!edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='md:col-span-3 col-span-6'>
  <span>+ Start Date: {edited === false && (
    <span style={{ color: 'red' }}>* </span>
  )}</span>
  <input
    type='date'
    name="Start_date"
    value={employeeData.Start_date ? new Date(employeeData.Start_date).toISOString().split("T")[0] : ''}
    max={new Date().toISOString().split("T")[0]} // Không cho phép chọn ngày trong tương lai
    min={oldAge} // Giới hạn ngày bắt đầu sớm nhất có thể (tùy chỉnh giá trị `oldAge` nếu cần)
    onChange={handleChange}
    disabled={edited}
    required={!edited}
    className='bg-slate-100 rounded-2xl px-2'
  />
</div>

                        <div className='md:col-span-3 col-span-6'>
  <span>+ Degree Year: </span>
  <input
    type='number'
    name="Degree_year"
    min="1900"
    max={new Date().getFullYear()} // Giới hạn giá trị đến năm hiện tại
    onInvalid={handleInvalid}
    value={employeeData.Degree_year}
    onChange={handleChange}
    disabled={edited}
    className='bg-slate-100 rounded-2xl px-2'
  />
</div>
<div className='md:col-span-3 col-span-6'>
  <span>+ Department Code: {edited === false && (
    <span style={{ color: 'red' }}>* </span>
  )}</span>
  
  <select
    name="Dept_Code"
    value={employeeData.Dept_Code || ''} // Mặc định là chuỗi trống nếu không có giá trị
    onChange={handleChange}
    disabled={edited}
    required={!edited}
    className='bg-slate-100 rounded-2xl px-2 disabled:bg-white'
  >
    <option value="" disabled>Select a department</option> {/* Lựa chọn mặc định */}
    {departments.map((department) => (
      <option key={department.Dept_Code} value={department.Dept_Code}>
        {department.Dept_Code}
      </option>
    ))}
  </select>
</div>

                        <div className='col-span-6'>
                            <span>+ Phone number: </span>
                            <input
                                type='tel'
                                name="Phone_num"
                                pattern="[0-9]{10}"
                                onInvalid={handleInvalid}
                                value={employeeData.Phone_num}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='col-span-6'>
                            <span>+ Address: </span>
                            <textarea
                                name="Address"
                                value={employeeData.Address}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                                rows={3}  // Adjust the rows based on how many lines you want visible initially
                            />
                        </div>
                       
                    </div>
                </div>

                <div className='w-full flex justify-center'>
                    {(edited)? "" : <button className='col-span-1 col-start-5 m-5 p-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>
                                            Submit</button>}
                </div>
                </form>
            </div>
        </div>
    );
};

export default Employee_info