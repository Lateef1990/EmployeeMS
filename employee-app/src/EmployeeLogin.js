import React from 'react'
import { useState } from 'react'
import '../src/style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function EmployeeLogin() {
          const [values, setValues] = useState({
                    email: '',
                    password: ''
          })
          axios.defaults.withCredentials = true;
          const navigate = useNavigate()
          const [error, setError] = useState('')
          const handleSubmit = (event) => {
                    event.preventDefault();
                    axios.post('http://localhost:8081/EmployeeLogin', values, { withCredentials: true })
                              .then(res => {
                                        if (res.data.Status === 'Success') {
                                                  const id = res.data.id;
                                                  navigate('/employeeDetail/'+id);
                                        } else {
                                                  setError(res.data.Error);
                                        }
                              })
                              .catch(err => console.log(err));
          }
          return (
                    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
                              <div className='p-3 rounded w-25 border loginForm'>
                                        <div className='text-danger'>
                                                  {error && error}
                                        </div>
                                        <h2>Employee Login</h2>
                                        <form onSubmit={handleSubmit}>
                                                  <div className='mb-3'>
                                                            <label htmlFor="email"><strong className='label'>Email</strong></label>
                                                            <input type="email" placeholder='Enter Email' name='email' onChange={e => setValues({ ...values, email: e.target.value })} className='form-control rounded-0' autoComplete='off' />
                                                  </div>
                                                  <div className='mb-3'>
                                                            <label htmlFor="password"><strong className='label'>Password</strong></label>
                                                            <input type="password" placeholder='Enter Password' name='password' onChange={e => setValues({ ...values, password: e.target.value })} className='form-control rounded-0 w-100' />
                                                  </div>
                                                  <button type='submit' className='btn btn-success w-100 rounded-2'> Log in</button>
                                                  <p>You are agree to aour terms and policies</p>
                                        </form>
                                        {/* <button type='submit' className='btn btn-secondary border w-100 rounded-0'> Create Account</button> */}
                              </div>
                    </div>
          )
}

export default EmployeeLogin
