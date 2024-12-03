import React from 'react'
import Navbar from '../navbar'
import {useState, useEffect} from 'react'
import { Await, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';


const Provider_info = (props)=>{
    const navigate = useNavigate();
    const location = useLocation(); // For taking query parameters
    const [disableEdit, setDisableEdit] = useState(true); // To allow edit form; True: not allowed to edit
    const [providers, setProviders] = useState([]);
    const [medications, setMedications] = useState([]);        // list of all med
    const [iniMedProvides, setIniMedProvides] = useState([]);        // list of all med for handling changes

    const queryParams = new URLSearchParams(location.search); // Read query parameters
    const Provider_num = queryParams.get('id');
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

    const getproviders = async() => {                         // get the provider data from databases
        try { const response = await fetch(`http://localhost:8000/providers/provider-search?search=${Provider_num}`); 
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            const data = await response.json();
            console.log(data);
            setProviders(data);
        }
        catch (error) { 
            setError(error.message); 
        }
    };

    const getMedication = () => {                       //get all medications from database
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

    const getMedProvide = async () =>{        //get the med of this provider
        try { const response = await fetch(`http://localhost:8000/providers/medOfProvider?Provider_num=${Provider_num}`,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        }); 
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            const data = await response.json();
            console.log(data);
            setIniMedProvides(data);
        }
        catch (error) { 
            setError(error.message); 
        }
    }


    useEffect(() => {
        getproviders();
        getMedication();
        getMedProvide();
    }, []);

    //#endregion
    
    //#region interaction

    const handleSubmit = async(e) =>{ ///for handel submit and send data to backend
        e.preventDefault();

        let isGood = true;
        //get submit info
        const formData = new FormData(e.currentTarget);
        const P_Name = formData.get('new_P_Name')? formData.get('new_P_Name'):providers[0].P_Name;
        const Phone = formData.get('new_Phone') ? formData.get('new_Phone') : providers[0].Phone;
        const Address = formData.get('new_Address')? formData.get('new_Address'): providers[0].Address;
        
        //get info in the table
        const listMedications = []; 
        medications.forEach((medication) => { if (formData.get(medication.Med_Code.toString()) === "on") { 
            listMedications.push(medication.Med_Code); 
        }});
        if (listMedications.length === 0) {
            alert("Provider must provide at least a medication.");
            return;
        }

        //add new provider to db
        try{
            const payLoad = { P_Name, Phone, Address, Provider_num};
            const response = await fetch('http://localhost:8000/providers/update',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Provider updated successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to update provider:', errorData);
                alert("Provider updated Fail");
                isGood= false;
            }
        } catch (err){
            setError(err.message);
            isGood= false;
        }

        //set provide relationship
        const addList = listMedications.filter(item => !iniMedProvides.some( medProvide => medProvide.Med_code === item));           //list of row need to add into the database (in tem list but not in initial list)
        const deleteList = iniMedProvides.filter(item => !listMedications.includes(item.Med_code));        //list of row need to delete into the database (in initial list but not tem list)
        if ( addList.length != 0) try{
            const payLoad = addList.map(Med_Code => [Med_Code,Provider_num])
            const response = await fetch('http://localhost:8000/medications/addListProvider',{               //adding 
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Provide relation add successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to add Provide relation:', errorData);
                alert("Provide relation add Fail");
                isGood = false;
            }
        } catch (err){
            setError(err.message);
            isGood = false;
        }

        if (deleteList.length != 0) try{
            const payLoad = deleteList.map(medication => [medication.Med_code,Provider_num])
            console.log("payload del:",payLoad);
            const response = await fetch('http://localhost:8000/medications/deleteListProvider',{               //deleting 
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Provide relation delete successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to delete Provide relation:', errorData);
                alert("Provide relation delete Fail");
                isGood = false;
            }
        } catch (err){
            setError(err.message);
            isGood = false;
        }
        if (isGood) {navigate('/providers');}
    };

    const handelDelete = async()=>{                 ///for send delete order to background
        const confirm = window.confirm ("Are you sure to delete this provider?")
        if (!confirm) return;

        
        const payLoad = {Provider_num};
        try{                                                    //delete the relationship
            const response = await fetch ('http://localhost:8000/providers/deleteRelationship',{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Provide relation deleted successfully:', data);
            } else{
                const errorData = await response.json();
                console.error('Failed to delete provide relation:', errorData);
                alert("Provide relation deleted Fail");
            }
        }catch(err){
            setError(err.message);
        }
        try{                                                    //delete the entity itself
            const response = await fetch ('http://localhost:8000/providers/delete',{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payLoad),
            })
            if (response.ok) {
                const data = await response.json();
                console.log('Provider deleted successfully:', data);
                navigate('/providers/');
            } else{
                const errorData = await response.json();
                console.error('Failed to delete provider:', errorData);
                alert("Provider deleted Fail");
            }
        }catch(err){
            setError(err.message);
        }
    }

    //#endregion

    //#region Elements in html
    
    const EditButton = () => {      // the button for editing
        return(<button type='button' onClick={() => setDisableEdit(!disableEdit)} className='col-span-1 col-start-2 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Edit ✏️</button>);
    } 

    const DeleteButton = () => {      // the button for deleting
        return(<button type='button' onClick={handelDelete} className='col-span-1 col-start-5 mb-10 py-4 text-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Delete 🗑️</button>);
    } 
    
    const SpacesForProviderInfo = () =>{  //the area contains info of provider
    return (
        <div className='grid grid-cols-6 gap-y-5 mb-4 gap-x-1 col-span-6'>
            {/* P_Name */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Provider Name: </span>
                    {providers.map((provider,index) => <input key={1}
                        name="P_Name"
                        value={provider.P_Name}
                        disabled = {true}
                        className='bg-slate-100 rounded-2xl px-2'/>)}
            </div>
            {(disableEdit)? <div className='md:col-span-3 col-span-6'/> : <div className='md:col-span-3 col-span-6'>
                <span>+ New Provider Name: </span>
                    <input
                        name="new_P_Name"
                        className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

            {/*Phone */}
            <div className='md:col-span-3 col-span-6'>
                <span>+ Phone: </span>
                {providers.map((provider,index) => <input key={1}
                    name="Phone"
                    value={provider.Phone}
                    disabled = {true}
                    className='bg-slate-100 rounded-2xl px-2'/>)}
            </div>
            {(disableEdit)? <div className='md:col-span-3 col-span-6'/> : <div className='md:col-span-3 col-span-6'>
                <span>+ New Phone: </span>
                <input
                    type='tel'
                    pattern='[0-9]{10}'
                    name="new_Phone"
                    className='bg-slate-100 rounded-2xl px-2'/>
            </div>}

            {/*Address*/}
            <div className='col-span-6'>
                <span>+ Address: </span>
                {providers.map((provider,index) => <textarea key={1}
                    name="Address"
                    value={provider.Address}
                    disabled = {true}
                    className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                    rows={3} /> )}
            </div>
            {(disableEdit)? "" : <div className='col-span-6'>
                <span>+ New Address: </span>
                <textarea
                    name="new_Address"
                    className='bg-slate-100 rounded-2xl p-2 w-full mt-2 resize-none'
                    rows={3}  // Adjust the rows based on how many lines you want visible initially
                />
            </div>}
        </div>
        
    );  
    }

    const MedTable = () => {
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
                                    {disableEdit ? "": <th className="">Include</th>}
                                </tr>
                            </thead>
                            {disableEdit ? 
                            <tbody>
                            {medications.map((medication,index)=> iniMedProvides.some( medProvide => medProvide.Med_code === medication.Med_Code) ? 
                                <tr key= {index} className="border-b hover:bg-blue-300 *:py-2 *:px-4 *:border-x-2  hover:*:bg-blue-600 hover:*:font-semibold hover:*:bg-opacity-70">
                                        <td className="">{medication.Med_Code}</td>
                                        <td className="">{medication.Med_Name}</td>
                                        <td className="">{medication.Price}</td>
                                        <td className="">{new Date(medication.Expiration_date).toISOString().split("T")[0]}</td>
                                        <td className=""> {medication.Effects}</td>
                                </tr>
                            : "")}
                            </tbody>:<tbody>
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
                                            defaultChecked = {iniMedProvides.some( medProvide => medProvide.Med_code === medication.Med_Code)}
                                            /></td>
                                </tr>
                            )}</tbody>}
                        </table>
                    </div>
                </div>
        );
    }

    //#endregion

    return(
        <div>
            <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
            <div className='w-3/4 border-2 rounded-lg m-auto p-2 bg-slate-200 my-20 overflow-hidden'> {/* Provider data form */}
                <form onSubmit={handleSubmit}>
                <div className='grid-cols-6 grid justify-center text-xl p-3 m-auto'> 
                    <h1 className='text-4xl font-bold col-span-6 text-center m-4 mb-10 p-4 shadow-slate-700 shadow-sm'>
                        PROVIDER No. {Provider_num}
                    </h1>
                    <EditButton/>
                    <DeleteButton/>
                    <SpacesForProviderInfo/>
                </div>
                <MedTable/>
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


export default Provider_info;