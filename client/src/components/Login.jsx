import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext.jsx';
import { toast } from 'react-toastify';
import { data } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [state, setState] = useState('Sign Up');

    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);

    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



//     const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     console.log("1. Form Submitted"); // Check if button click works

//     try {
//         console.log("2. Sending request to:", backendUrl); 
        
//         if (state === 'Login') {
//             const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
//             console.log("3. Backend Response:", data);
//             // ... rest of code
//         } else {
//             const { data } = await axios.post(backendUrl + '/api/user/register', { name: Name, email, password });
//             console.log("3. Backend Response:", data);
//         }
//     } catch (error) {
//         console.error("X. Error occurred:", error); // This will show why it failed
//     }
// }

const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
                
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token); // Corrected to setItem
                    setShowLogin(false);
                    toast.success("Logged in successfully!");
                } else {
                    toast.error(data.message);
                }
            } else {
                // Notice the 'name: Name' fix below to match your state variable
                const { data } = await axios.post(backendUrl + '/api/user/register', { name: Name, email, password });
                
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token); // Corrected to setItem
                    setShowLogin(false);
                    toast.success("Account created!");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            // This catches network errors or backend crashes
            toast.error(error.response?.data?.message || error.message);
        }
    };



    // const onSubmitHandler = async (e) => {
    //     e.preventDefault();
    //     // Handle form submission logic here
    //     try {
    //         if (state === 'Login') {
    //             const { data } = await axios.post(backendUrl + 'api/user/login',
    //                 { email, password })
    //             // if (data.success) {
    //             //     setUser(data.user);
    //             //     setToken(data.token);
    //             //     localStorage.setItem('token', data.token);
    //             //     setShowLogin(false);
    //             // }

    //             else {
    //                 toast.error(data.message);
    //             }
    //         } else {
    //             const { data } = await axios.post(backendUrl + 'api/user/register',
    //                 { name: Name, email, password })
    //             if (data.success) {
    //                 setUser(data.user);
    //                 setToken(data.token);
    //                 localStorage.setItem('token', data.token);
    //                 setShowLogin(false);
    //             }
    //             else {
    //                 toast.error(data.message);
    //             }
    //         }
    //     } catch (error) {
    //         toast.error(data.message);
    //     }
    // }
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])


    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex items-center justify-center'>
            <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue.</p>

                {state != 'Login' && <div className='border px-6 py-3 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.user_icon} alt="" />
                    <input onChange={e => setName(e.target.value)} value={Name} className='outline-none text-sm' type="text" placeholder='Full Name' required />
                </div>}

                <div className='border px-6 py-3 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.email_icon} alt="" />
                    <input onChange={e => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email Id' required />
                </div>

                <div className='border px-6 py-3 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.lock_icon} alt="" />
                    <input onChange={e => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' required />
                </div>

                <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

                <button className='bg-blue-600 w-full text-white py-2 cursor-pointer rounded-full'>{state === 'Login' ? 'Login' : 'Create account'}</button>

                {state === 'Login' ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>Sign up</span></p>
                    :
                    <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span></p>}

                <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' />

            </form>
        </div>
    )
}

export default Login
