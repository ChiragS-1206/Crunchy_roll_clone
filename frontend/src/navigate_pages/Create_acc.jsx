import React from 'react';
import axios from 'axios';
import connection from '../componets/photos/connection.png';
import './Create_acc.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Create_acc = ({ setUsername , setDisplayName }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

const onSubmit = async (data) => {
  try {
    const response = await axios.post('/Create', data, { // CHANGED: Using proxy path
      withCredentials: true
    });
    console.log('user created successfully');
    setUsername(data.Username);
    setDisplayName(data.Displayname);
    reset();
    navigate('/');
  } catch (err) {
    if (err.response?.status === 409) {
      setError('Username', {
        type: 'manual',
        message: 'Username already exists'
      });
    } else {
      console.log('Server error');
    }
  }
};

  return (
    <div>
      <nav>
        <div className="logo-container1">
          <img src={connection} className="logo1" alt="Crunchyroll" />
          <span className="brand-name1">Crunchyroll</span>
        </div>
      </nav>
      <div className="info_create">
        <p className="text_create">Create Account</p>
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)}>
           
            <input
              className="form__input"
              type="text"
              placeholder=" "
              {...register('Username', { required: true })}
            />
            <label htmlFor="create_input">Email or Phone Number</label>
            {errors.Username && <p >Username is required</p>}
            <input
              className="form__input"
              type="password"
              placeholder="Password"
              {...register('Password', { required: true })}
            />
            {errors.Password && <span className="error">Password is required</span>}
            <div className="create_check">
              <input className="check_box" type="checkbox" />
              <p>Send me CrunchyRoll info, news, offers</p>
            </div>
            
             <input
              className="form__input"
              type="text"
              placeholder="Display Name"
              {...register('Displayname', { required: true })}
            />
            <button className="create_button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Create_acc;
