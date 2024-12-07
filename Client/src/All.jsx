// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const All = () => {
//   const [getAll, setGetAll] = useState(null); // State to store fetched data
//   const [loading, setLoading] = useState(true); // Loading state for fetching data
//   const [error, setError] = useState(null); // State to handle error messages
// const [data,setData]=useState({
//     name:'',
//     email:'',
//     password:''
// })
//   useEffect(() => {
//     const fetchAllValues = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/get');
//         setGetAll(response.data.data); // Set the fetched data to state
//         setLoading(false); // Set loading to false after data is fetched
//       } catch (error) {
//         setError("Server error occurred while fetching data."); // Handle error
//         setLoading(false); // Stop loading on error
//       }
//     };
//     fetchAllValues();
//   }, []); // Empty dependency array ensures this effect runs only once when the component is mounted

//   if (loading) {
//     return <h2>Loading...</h2>; // Display loading message while data is being fetched
//   }

//   if (error) {
//     return <h2>{error}</h2>; // Display error message if any error occurs
//   }

//     // Handle form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Form data submitted:', data);
//         const response=axios.post('http://localhost:5000/post',data);
//         console.log(response);
        
//       };
    
//   const Update=async(id)=>{

//     const response=await axios.put('http://localhost:5000/put/',id);
    
//   }

//   const Delete=async(id)=>{
// const response=await axios.delete('http://localhost:5000/delete/',id);
// console.log(response);

//     // console.log("Delete is working : ",id);
//   }

//   const handleChange=(e)=>{
//     e.preventDefault();
// const {name,value}=e.target;
// setData({
//     ...data,
//     [name]:value,
// })
//   }


//   return (
//     <div>
//         <div className="">
        
//         <form action="">
//         <h1>Post</h1>
//         <input type="text" placeholder='Enter the Name' name='name' value={data.name} onChange={handleChange} />
//         <input type="email" placeholder='Enter the Email' name='email' value={data.email} onChange={handleChange}/>
//         <input type="password" placeholder='Enter the password' name='password' value={data.password} onChange={handleChange} />
//         <button onClick={handleSubmit}>Submit</button>
//         </form>
//         </div>
//         <div className="">
//       <h1>fetch All Files</h1>
//       {getAll && getAll.length > 0 ? (
//         <table border={2}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Password</th>
//             </tr>
//           </thead>
//           <tbody>
//             {getAll.map((data, index) => (
//               <tr key={index}>
//                 <td>{data.name}</td>
//                 <td>{data.email}</td>
//                 <td>{data.password}</td>
//                 <td onClick={()=>Update(data._id)}>edit</td>
//                 <td onClick={()=>Delete(data._id)}>Delete</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No data found.</p> // Message if there's no data available
//       )}
//     </div>
//     </div>
//   );
// };

// export default All;









import React, { useEffect, useState } from 'react';
import axios from 'axios';

const All = () => {
  const [getAll, setGetAll] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // State to handle error messages
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [editingId, setEditingId] = useState(null); // Track which record is being edited

  useEffect(() => {
    const fetchAllValues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get');
        setGetAll(response.data.data); // Set the fetched data to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Server error occurred while fetching data.'); // Handle error
        setLoading(false); // Stop loading on error
      }
    };
    fetchAllValues();
  }, []); // Empty dependency array ensures this effect runs only once when the component is mounted

  if (loading) {
    return <h2>Loading...</h2>; // Display loading message while data is being fetched
  }

  if (error) {
    return <h2>{error}</h2>; // Display error message if any error occurs
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // If editing an existing entry, update the data
        const response = await axios.put(`http://localhost:5000/put/${editingId}`, data);
        console.log('Update successful:', response);
        // Update the state with the modified data
        setGetAll(getAll.map((item) => (item._id === editingId ? response.data.data : item)));
      } else {
        // If adding new data, post the data
        const response = await axios.post('http://localhost:5000/post', data);
        console.log('Form data submitted:', response);
        setGetAll([...getAll, response.data.data]); // Add new data to the table without reloading
      }
      setData({ name: '', email: '', password: '' }); // Clear form after submit
      setEditingId(null); // Reset editing ID
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  // Update data by id
  const handleEdit = (id) => {
    const recordToEdit = getAll.find((data) => data._id === id);
    if (recordToEdit) {
      setData({
        name: recordToEdit.name,
        email: recordToEdit.email,
        password: recordToEdit.password,
      });
      setEditingId(id); // Set the ID of the record being edited
    }
  };

  // Delete data by id
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete/${id}`);
      console.log('Delete successful:', response);
      setGetAll(getAll.filter((item) => item._id !== id)); // Remove deleted item from local state
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div>
      <div>
        <h1>{editingId ? 'Edit' : 'Post'} Data</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter the Name"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Enter the Email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Enter the password"
            name="password"
            value={data.password}
            onChange={handleChange}
          />
          <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
        </form>
      </div>

      <div>
        <h1>All Files</h1>
        {getAll && getAll.length > 0 ? (
          <table border={2}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getAll.map((data) => (
                <tr key={data._id}>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.password}</td>
                  <td>
                    <button onClick={() => handleEdit(data._id)}>Edit</button>
                    <button onClick={() => handleDelete(data._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data found.</p>
        )}
      </div>
    </div>
  );
};

export default All;
