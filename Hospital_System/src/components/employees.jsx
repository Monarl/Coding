import React from 'react'
import Navbar from './navbar'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const employees = (props) => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]); //Get employees info from backend
    const [search, setSearch] = useState(""); // Store searchbar value
    const [error, setError] = useState(null);


    useEffect(() => {
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
      getEmployees();
    }, []);

    const doctor = employees
  .filter(employee => employee.Emp_Code.startsWith('D'))
  .map(employee => Number(employee.Emp_Code.slice(1)))
  .sort((a, b) => a - b); // Sắp xếp tăng dần

const nurse = employees
  .filter(employee => employee.Emp_Code.startsWith('N'))
  .map(employee => Number(employee.Emp_Code.slice(1)))
  .sort((a, b) => a - b); // Sắp xếp tăng dần


  const findFirstGap = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return String(1).padStart(3, '0'); // Trả về '001' cho mảng rỗng
    }
  
    arr.sort((a, b) => a - b); // Sắp xếp lại mảng
  
    for (let i = 0; i < arr.length; i++) {
      const nextExpected = i + 1; // Giá trị mong đợi
      if (arr[i] !== nextExpected) {
        return String(nextExpected).padStart(3, '0'); // Trả về giá trị bị thiếu
      }
    }
    return String(arr.length + 1).padStart(3, '0'); // Không có khoảng trống, trả về giá trị tiếp theo
  };



    const doctor = employees
  .filter(employee => employee.Emp_Code.startsWith('D'))
  .map(employee => Number(employee.Emp_Code.slice(1)))
  .sort((a, b) => a - b); // Sắp xếp tăng dần

const nurse = employees
  .filter(employee => employee.Emp_Code.startsWith('N'))
  .map(employee => Number(employee.Emp_Code.slice(1)))
  .sort((a, b) => a - b); // Sắp xếp tăng dần


  const findFirstGap = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return String(1).padStart(3, '0'); // Trả về '001' cho mảng rỗng
    }
  
    arr.sort((a, b) => a - b); // Sắp xếp lại mảng
  
    for (let i = 0; i < arr.length; i++) {
      const nextExpected = i + 1; // Giá trị mong đợi
      if (arr[i] !== nextExpected) {
        return String(nextExpected).padStart(3, '0'); // Trả về giá trị bị thiếu
      }
    }
    return String(arr.length + 1).padStart(3, '0'); // Không có khoảng trống, trả về giá trị tiếp theo
  };



    const getEmployees = () => {
      fetch('http://localhost:8000/employees/employee-list')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setEmployees(data); // Store the fetched data in state
      })
      .catch((error) => {
        setError(error.message); // Catch and display any errors
      }); 
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      fetch(`http://localhost:8000/employees/employee-search?search=${search}`)
      fetch(`http://localhost:8000/employees/employee-search?search=${search}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setEmployees(data); // Store the fetched data in state
        setLoading(false);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message); // Catch and display any errors
        setLoading(false);
        setLoading(false);
      });
    };
  

    return (
      <div>
        <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn}/> {/*Navbar component to navigate*/}
        <div className="container mx-auto p-4">
          <div className='flex items-center justify-between'>
            <h1 className="text-2xl font-bold mb-4">Employee List</h1>
            <form onSubmit={handleSubmit}><input type='search'
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for employee's name" 
                        className='mb-5 inline border-2 border-black placeholder-slate-400 p-2 min-w-[30vw]'/></form>
          </div>
            <div className="overflow-x-auto"> {/*Table design */}
              <table className="table-auto min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Emp_Code</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">First Name</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Last Name</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Gender</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Date of Birth</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Specialty</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Specialty</th>
                    <th className="py-2 px-4 text-left font-semibold text-gray-700">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={index} className="border-b hover:bg-blue-300">
                      <td className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
                        <Link to={`/employees/employee?id=${employee.Emp_Code}`}>{employee.Emp_Code}</Link></td>
                        <Link to={`/employees/employee?id=${employee.Emp_Code}`}>{employee.Emp_Code}</Link></td>
                      <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{employee.F_name}</td>
                      <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{employee.L_name}</td>
                      <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{employee.Gender}</td>
                      <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{new Date(employee.Dob).toLocaleDateString()}</td>
                      <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{employee["Specialty Name"]}</td>
                      <td className="py-2 px-4  hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70">{employee.Address}</td>
                     
                     
                    </tr>
                  ))}
                  <tr className="border-b hover:bg-blue-300">
                  <tr className="border-b hover:bg-blue-300">
                    <td colSpan="1" className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
                      <Link to={`/employees/employee?id=${"D" + findFirstGap(doctor)}&insert=${true}`}>{"D" + findFirstGap(doctor)}</Link></td>
                      <Link to={`/employees/employee?id=${"D" + findFirstGap(doctor)}&insert=${true}`}>{"D" + findFirstGap(doctor)}</Link></td>
                    <td colSpan="5" className='py-2 px-4 font-semibold hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70'>
                      <span>Insert new doctor</span></td>
                      <span>Insert new doctor</span></td>
                  </tr>
                  <tr className="border-b hover:bg-blue-300">
                    <td colSpan="1" className="py-2 px-4 underline hover:bg-blue-600 hover:text-red-600 hover:font-semibold hover:bg-opacity-70">
                    <Link to={`/employees/employee?id=${"N" + findFirstGap(nurse)}&insert=${true}`}>{"N" + findFirstGap(nurse)}</Link></td>
                    <Link to={`/employees/employee?id=${"N" + findFirstGap(nurse)}&insert=${true}`}>{"N" + findFirstGap(nurse)}</Link></td>
                    <td colSpan="5" className='py-2 px-4 font-semibold hover:bg-blue-600 hover:font-semibold hover:bg-opacity-70'>
                      <span>Insert new nurse</span></td>
                  </tr>
                      <span>Insert new nurse</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </div>
  )
}

export default employees