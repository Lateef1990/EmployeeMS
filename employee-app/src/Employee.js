import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Employee() {
  const [data, setData] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:8081/getEmployees')
    .then(res => {
      if(res.data.Status === "Success"){
      setData(res.data.Result);
      } else{
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }, [])

  const handleDelete = (id) => {
    axios.delete('http://localhost:8081/delete/'+id)
    .then(res => {
      if(res.data.Status === "Success"){
        window.location.reload(true);
      } else{
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }
  return (
    <div className='px-5 py-3'>
        <div className='d-flex justify-content-center'>
            <h3>Employee List</h3>

        </div>
        <Link to="/create" className='btn btn-success'>Add Employee</Link>   
        <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return <tr key={index}>
                <td>{employee.name}</td>
                <td>{
                <img src={`http://localhost:8081/images/`+ employee.image} alt="" className='employee_image'/>
                  }</td>
                <td>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>

                <td>
                  <Link to={`/employeeEdit/`+employee.id} className='btn btn-primary btn-sm me-2'>Update</Link>
                  <button className='btn btn-sm btn-danger' onClick={e => handleDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            })}
          </tbody>
        </table> 
    </div>
    </div>
  )
}

export default Employee
