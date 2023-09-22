import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AddEployee() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    salary: '',
    address: '',
    image: null

  })
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("salary", data.salary);
    formData.append("address", data.address);
    formData.append("image", data.image);

    axios.post('http://localhost:8081/create', formData)
      .then(res => {
        navigate('/employee')
      })
      .catch(err => console.log(err));

  }
  return (
    <Fragment>
      <div className='d-flex flex-column align-items-center pt-4'>
        <h2>Add Employee</h2>
        <form className="row g-3 w-50" onSubmit={handleSubmit} >
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input type="text" className="form-control" id="inputName" placeholder='Enter Name' autoComplete='off'
              onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">Email</label>
            <input type="email" className="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
              onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">Password</label>
            <input type="password" className="form-control" id="inputPassword4" placeholder='Enter Password'
              onChange={(e) => setData({ ...data, password: e.target.value })} />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">Salary</label>
            <input type="text" className="form-control" id="inputSalary" placeholder="Enter Salary" autoComplete='off'
              onChange={(e) => setData({ ...data, salary: e.target.value })} />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">Address</label>
            <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" autoComplete='off'
              onChange={(e) => setData({ ...data, address: e.target.value })} />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">Select Image</label>
            <input type="file" className="form-control" id="inputGroupFile01"
              onChange={(e) => setData({ ...data, image: e.target.files[0] })} />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </Fragment>
  )
}

export default AddEployee
