import React, { useState } from 'react';
import { registerAPICall } from '../services/AuthService';

const RegisterComponent = () => {

    const [username, setUserName ] = useState('')
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')

    function handleRegistrationForm(e){

        e.preventDefault();

        const register = {username, email, password}
        console.log(register);

        registerAPICall(register).then((response)=>{
            console.log(response.data);
        }).catch(error=>{
            console.log(error);
        })
    }
  return (
    <div className='container'>
        <br></br>
        <br></br>

        <div className='row'>
            <div className='col-md-6 offset-md-3'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='text-center'>User Registration Form</h2>
                    </div>
                    <div className='card-body'>
                        <form>
                            <div className='row mb-3'>
                                <label className='col-md-3 control-label'> Name</label>
                                <div className='col-md-9'>
                                    <input
                                        type='text'
                                        name='name'
                                        className='form-control'
                                        placeholder='Enter name'
                                        value={username}
                                        onChange={(e)=>setUserName(e.target.value)}
                                    ></input>
                                </div>
                            </div>
                            
                            <div className='row mb-3'>
                                <label className='col-md-3 control-label'> Email</label>
                                <div className='col-md-9'>
                                    <input
                                        type='text'
                                        name='email'
                                        className='form-control'
                                        placeholder='Enter Email Address'
                                        value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                    ></input>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <label className='col-md-3 control-label'> Password</label>
                                <div className='col-md-9'>
                                    <input
                                        type='password'
                                        name='password'
                                        className='form-control'
                                        placeholder='Enter Password'
                                        value={password}
                                        onChange={(e)=>setPassword(e.target.value)}
                                    ></input>
                                </div>
                            </div>
                            <div className='form-group mb-3'>
                                <button className='btn btn-primary' onClick={(e)=>handleRegistrationForm(e)}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  );
}

export default RegisterComponent;
