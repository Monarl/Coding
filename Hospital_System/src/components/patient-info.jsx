import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientInfo = (props) => {
    const location = useLocation(); // For taking query parameters
    const navigate = useNavigate(); // For navigating to other components
    const [edited, setEdited] = useState(true); // To allow edit patient form; True: not allowed

    const queryParams = new URLSearchParams(location.search); // Read query parameters
    const patientId = queryParams.get('id');
    const inPatient = patientId.substring(0, 2) === "IP";
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
    
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patientData, setPatientData] = useState({
        F_name: '',
        L_name: '',
        Phone_num: '',
        Gender: '',
        Dob: '',
        Address: '',
        Dateofadmission: '',
        Diagnosis: '',
        Fee: '',
        Dateofdischarge: '',
        Sickroom: '',
        Nurse_Code: '',
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
        const fetchPatientData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/patients/patient-detail?search=${patientId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setPatients(data);
    
                // Set patient data from the fetched data
                setPatientData({
                    F_name: data[0]?.F_name || '',
                    L_name: data[0]?.L_name || '',
                    Phone_num: data[0]?.Phone_number || '',
                    Gender: data[0]?.Gender || '',
                    Dob: data[0]?.Dob || '',
                    Address: data[0]?.Address || '',
                    Dateofadmission: data[0]?.["Date of admission"] || '',
                    Diagnosis: data[0]?.Diagnosis || '',
                    Fee: data[0]?.Fee || '',
                    Dateofdischarge: data[0]?.["Date of discharge"] || '',
                    Sickroom: data[0]?.Sickroom || '',
                    Nurse_Code: data[0]?.Nurse_Code || '',
                    id: patientId || '',
                });

                // Fetch doctors for dropdown selection
                const responseDoctors = await fetch(`http://localhost:8000/patients/doctor-list`);
                if (!responseDoctors.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataDoctors = await responseDoctors.json();
                console.log(dataDoctors);
                setDoctors(dataDoctors);
            } catch (error) {
                console.error('Failed to fetch patient data:', error);
            }
        };
    
        fetchPatientData();
    }, [patientId]);
    

    // Handle changes for the input fields
    const handleChange = (e) => {
        let { name, value } = e.target;
        setPatientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleTable = (e, index) => {
        let { name, value } = e.target;
        console.log(name, value, index);
        setPatients((prevPatients) => {
            const updatedPatients = [...prevPatients];
            // Update the specific field of the patient at the given index
            updatedPatients[index] = {
                ...updatedPatients[index],
                ["new_" + name]: value
            }
            return updatedPatients
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/patients/patient-update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({patientData, patients}),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          setEdited(!edited)
          window.location.reload();
        })
      };

      const addRecord = () => {
        // Define a new patient object (customize as needed)
        const newPatient = {
          Patient_Code: patientId,
          'Start date': new Date(),
          'End date': new Date(),
          Doc_Code: 'D001',
          'Result': "Fine",
          'Diagnosis': 'Flu',
          'Fee': 10,
          'Examination date': new Date(),
          'Next_examination': new Date()
        };
    
        // Update state by adding the new object to the existing array
        setPatients([...patients, newPatient]);
      };

    return (
        <div>
            <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
            <div className='w-3/4 border-2 rounded-lg m-auto p-2 bg-slate-200 my-20 overflow-hidden'>
            {/* Patient data form */}
                <form onSubmit={handleSubmit}>
                <div className='grid-cols-6 grid justify-center text-xl p-3 m-auto'> 
                    <h1 className='text-4xl font-bold col-span-6 text-center m-4 mb-10 p-4 shadow-slate-700 shadow-sm'>
                        PATIENT {patientId}
                    </h1>
                    <button type='button' onClick={() => setEdited(!edited)} className='col-span-1 col-start-2 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Edit ✏️</button>
                    <button type='button' className='col-span-1 col-start-5 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Delete 🗑️</button>
                    <div className='grid grid-cols-6 gap-y-5 mb-4 col-span-6'>
                        <div className='md:col-span-3 col-span-6'>
                            <span>+ First Name: </span>
                            <input
                                name="F_name"
                                value={patientData.F_name}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='md:col-span-3 col-span-6'>
                            <span>+ Last Name: </span>
                            <input
                                name="L_name"
                                value={patientData.L_name}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='md:col-span-3 col-span-6'>
                            <span>+ Gender: </span>
                            <input
                                name="Gender"
                                value={patientData.Gender}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='md:col-span-3 col-span-6'>
                            <span>+ Date of Birth: </span>
                            <input
                                type='date'
                                name="Dob"
                                value={patientData.Dob ? new Date(patientData.Dob).toISOString().split("T")[0] : ''}
                                max={maxDate}
                                min={minDate}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='col-span-6'>
                            <span>+ Phone number: </span>
                            <input
                                name="Phone_num"
                                value={patientData.Phone_num}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                        </div>
                        <div className='col-span-6'>
                            <span>+ Address: </span>
                            <textarea
                                name="Address"
                                value={patientData.Address}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                                rows={3}  // Adjust the rows based on how many lines you want visible initially
                            />
                        </div>
                        {(inPatient) ? (
                        <div className='grid grid-cols-6 col-span-6 gap-y-5'>
                            <div className='md:col-span-3 col-span-6'>
                                <span>+ Date of Admission: </span>
                                <input
                                    type='date'
                                    name="Dateofadmission"
                                    value={patientData.Dateofadmission ? new Date(patientData.Dateofadmission).toISOString().split("T")[0] : ''}
                                    onChange={handleChange}
                                    disabled={edited}
                                    className='bg-slate-100 rounded-2xl px-2 w-1/2'
                                />
                            </div>
                            <div className='md:col-span-3 col-span-6'>
                            <span>+ Date of Discharge: </span>
                            <input
                                type='date'
                                name="Dateofdischarge"
                                value={patientData.Dateofdischarge ? new Date(patientData.Dateofdischarge).toISOString().split("T")[0] : ''}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2 w-1/2'
                            />
                            </div>
                            <div className='md:col-span-3 col-span-6'>
                            <span>+ Diagnosis: </span>
                            <input
                                name="Diagnosis"
                                value={patientData.Diagnosis}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                            </div>
                            <div className='md:col-span-3 col-span-6'>
                            <span>+ Fee: </span>
                            <input
                                name="Fee"
                                value={patientData.Fee}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                            </div>
                            <div className='md:col-span-3 col-span-6'>
                            <span>+ Sickroom: </span>
                            <input
                                name="Sickroom"
                                value={patientData.Sickroom}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                            </div>
                            <div className='md:col-span-3 col-span-6'>
                            <span>+ Nurse Code: </span>
                            <input
                                name="Nurse_Code"
                                value={patientData.Nurse_Code}
                                onChange={handleChange}
                                disabled={edited}
                                className='bg-slate-100 rounded-2xl px-2'
                            />
                            </div>
                        </div>
                        ) : ""}
                    </div>
                </div>

                <div className='justify-center flex'> {/* Record Table design */}
                    <div className="overflow-x-auto p-3 w-5/6">
                        <h1 className="text-2xl font-bold my-4">Patient Record</h1>

                        <table className="table-auto text-lg min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-100 border-b">
                                <tr className='*:py-2 *:px-4 *:text-center *:border-x-2 *:font-semibold *:text-gray-700 '>
                                    <th className="">Doc_Code</th>
                                    <th className="">Patient_Code</th>
                                    <th className="">{(inPatient) ? "Start date" : "Examination Date"}</th>
                                    <th className="">{(inPatient) ? "End date" : "Diagnosis"}</th>
                                    <th className="">{(inPatient) ? "Result" : "Fee"}</th>
                                    {(!inPatient) ? <th className="">Next_examination</th> : ""}
                                </tr>
                            </thead>

                            <tbody>
                                {patients.map((patient, index) => (
                                    <tr key={index} className="border-b hover:bg-blue-300 *:py-2 *:px-4 *:border-x-2  hover:*:bg-blue-600 hover:*:font-semibold hover:*:bg-opacity-70">
                                        <td className=""><select 
                                                            name="Doc_Code" 
                                                            disabled={edited}
                                                            value={patient['new_Doc_Code'] || patient['Doc_Code']} // Set default value here
                                                            onChange={(e) => handleTable(e, index)} // Update selected doctor on change
                                                            className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center disabled:text-black"
                                                        >
                                                            {doctors.map((doctor) => (
                                                                <option key={doctor.Doc_Code} value={doctor.Doc_Code}>
                                                                    {doctor.Doc_Code}
                                                                </option>
                                                            ))}
                                                        </select></td>
                                                            
                                        <td className="">{patient.Patient_Code}</td>
                                        <td className="">{(inPatient) ? (
                                            <input
                                                type='date'
                                                name="Start date"
                                                value={patient["Start date"] ? new Date(patient['new_Start date'] || patient["Start date"]).toISOString().split("T")[0] : ''}
                                                onChange={(e) => handleTable(e, index)}
                                                disabled={edited}
                                                className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center"
                                            />) : (
                                            <input
                                                type='date'
                                                name="Examination date"
                                                value={patient["Examination date"] ? new Date(patient["new_Examination date"] || patient["Examination date"]).toISOString().split("T")[0] : ''}
                                                onChange={(e) => handleTable(e, index)}
                                                disabled={edited}
                                                className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center"
                                                />)}</td>

                                        <td className="">{(inPatient) ? (
                                            <input
                                                type='date'
                                                name="End date"
                                                value={patient["End date"] ? new Date(patient["new_End date"] || patient["End date"]).toISOString().split("T")[0] : ''}
                                                onChange={(e) => handleTable(e, index)}
                                                disabled={edited}
                                                className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center"
                                            />) : (
                                            <input
                                                name="Diagnosis"
                                                value={patient["Diagnosis"] ? patient["new_Diagnosis"] ?? patient["Diagnosis"] : ''}
                                                onChange={(e) => handleTable(e, index)}
                                                disabled={edited}
                                                className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center"
                                                />)}</td>

                                        <td className="">{(inPatient) ? (
                                            <input
                                                name="Result"
                                                value={patient["Result"] ? patient["new_Result"] ?? patient["Result"] : ''}
                                                onChange={(e) => handleTable(e, index)}
                                                disabled={edited}
                                                className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center"
                                            />) : (
                                            <input
                                                name="Fee"
                                                value={patient["Fee"] ? patient["new_Fee"] ?? patient["Fee"] : ''}
                                                onChange={(e) => handleTable(e, index)}
                                                disabled={edited}
                                                className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center"
                                                />)}</td>

                                        {(!inPatient) ? <td className="">{
                                            <input
                                                type='date'
                                                name="Next_examination"
                                                value={patient["Next_examination"] ? new Date(patient["new_Next_examination"] || patient["Next_examination"]).toISOString().split("T")[0] : ''}
                                                onChange={(e) => handleTable(e, index)}
                                                disabled={edited}
                                                className="rounded-md bg-opacity-50 px-2 disabled:bg-transparent text-center"
                                            />}</td> : ""}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(edited)? "" : <button type='button' onClick={addRecord} className='mt-2 font-semibold'>Add Record</button>}
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

export default PatientInfo;
