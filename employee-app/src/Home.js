import React, {useEffect, useState} from 'react'
import axios from 'axios'


function Home() {
  const [adminCount, setAdminCount] = useState();
  const [employeeCount, setEmployeeCount] = useState();
  const [employeeSalary, setEmployeeSalary] = useState();

  useEffect(()=>{
    axios.get('http://localhost:8081/adminCount')
    .then(res => {
      setAdminCount(res.data[0].admin)
    });

    axios.get('http://localhost:8081/employeeCount')
    .then(res => {
      setEmployeeCount(res.data[0].employee)
    })

    
    axios.get('http://localhost:8081/employeeSalary')
    .then(res => {
      setEmployeeSalary(res.data[0].sumOfSalary)
    })

  }, [])
  return (
    <div>
    <div className='d-flex justify-content-around mt-3'>
    <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
        <div className='text-center pb-1'>
            <h4>Admin</h4>
        </div>
        <hr />
        <div className=''>
            <h5>Total : {adminCount}</h5>
        </div>
     </div> 
     <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
        <div className='text-center pb-1'>
            <h4>Employees</h4>
        </div>
        <hr />
        <div className=''>
            <h5>Total : {employeeCount}</h5>
        </div>
     </div> 
     <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
        <div className='text-center pb-1'>
            <h4>Salary</h4>
        </div>
        <hr />
        <div className=''>
            <h5>Total : {employeeSalary}</h5>
        </div>
     </div> 
    </div>
    <div className='mt-4 px-5 pt-3'>
        <h3>List of Admin</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Admin</td>
              <td>Admin</td>
            </tr>
          </tbody>
        </table>
     </div>
    </div>    
  )
}

export default Home
