import React from 'react'
import axios from 'axios';
import connection from "../componets/photos/connection.png";
import "./Create_acc.css"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login_acc = ({ setUsername , setDisplayName}) => {
    const navigate = useNavigate();
    const [success, setsuccess] = useState("");
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        reset,
        unregister,
        formState: { errors, isSubmitting },
    } = useForm();
    
    const onSubmit = async (data) => {
        setsuccess("");
        const url = "/Login"; // CHANGED: Using proxy path
        try {
            const r = await axios.post(url, {
                Username: data.username,
                Password: data.password
            }, {
                withCredentials: true
            });
            const result = r.data;
            console.log('Login successful:', result);
            
            setUsername(data.username);
            setDisplayName(result.Displayname);
            
            reset();
            navigate('/');
        }catch (err) {
            const status = err.response?.status;
            if (status === 402) {
                setError("password", {
                    type: "manual",
                    message: "Incorrect password",
                });
                return;
            }
            if (status === 404) {
                setError("username", {
                    type: "manual",
                    message: "User not found",
                });
                return;
            }
        }
    };

    return (
        <div>
            <nav >
                <div className="logo-container1">
                    <img src={connection} className="logo1" alt="Crunchyroll" />
                    <span className="brand-name1">Crunchyroll</span>
                </div>
            </nav>
            <div className='info_create'>
                <p className='text_create'>Log In</p>
                <div className="container">
                    <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <input
                            className="form__input2"
                            type="text"
                            placeholder=" "
                            {...register("username", {required:true})}
                        />
                        <label htmlFor="create_input">Email or Phone Number</label>
                        {errors.username && <span className='error'>{errors.username.message}</span>}
                        
                        <input
                            className="form__input2"
                            type="password"
                            placeholder="Password" 
                            {...register("password", {required:true})}
                        />
                    
                        {errors.password && <span className='error'> {errors.password.message}</span>}
                        <button className='create_button' type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Logging in...' : 'Next'}
                        </button>
                    </form>
                    <div className='login_acc'>
                        <p className='login_sample'>Forget Password?</p>|
                        <p className='login_sample'>Create Account</p>
                    </div>
                    <div className='create_sample3'>
                        <p>Terms of Use</p>|
                        <p>Privacy Policy</p>|
                        <p>Cookie Consent Tool</p>
                    </div>
                </div> 
            </div>
            
            <div className='create_end'>
                <hr></hr><br></br><br></br>
                <div className='INROW'>        
                    <h4 className='tag_create'> SONY PICTURES | © Crunchyroll, LLC</h4>
                    <h4>
                        <select >
                            <option>FRENCH</option>
                            <option>ENGLISH(US)</option>
                            <option>GERMAN</option>
                            <option>RUSSIAN</option>
                            <option>JAPANESSE</option>
                            <option>KOREAN</option>
                            <option>ITALIAN</option>
                            <option>MAXICAN</option>
                        </select>
                    </h4>
                </div>
                <br></br><br></br>
            </div>
        </div>
    )
}
export default Login_acc
