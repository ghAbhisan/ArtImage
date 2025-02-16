import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [state, setState] = useState('Access Your Account');
    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Access Your Account') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                    navigate('/'); // Navigate to the logged-in screen
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                    navigate('/'); // Navigate to the logged-in screen
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setShowLogin(false);
        }, 300); // Match the duration of the exit transition
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
                    <motion.form onSubmit={onSubmitHandler}
                        initial={{ opacity: 0.2, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className='relative bg-white p-10 rounded-xl text-slate-500'
                    >
                        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>

                        {state !== 'Access Your Account' ? (
                            <p className='text-sm'>
                                Join us today and start <span className='text-[#0415c9]'>Artimaging</span> instantly
                            </p>
                        ) : (
                            <p className='text-sm'>Good to have you back! Sign in to continue.</p>
                        )}

                        {state !== 'Access Your Account' && (
                            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                                <img className='w-3' src={assets.user_icon} alt="" />
                                <input onChange={e => setName(e.target.value)} value={name} type="text" className='outline-none text-sm' placeholder='Give Your Full Name' required />
                            </div>
                        )}

                        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                            <img className='w-3' src={assets.email_icon} alt="" />
                            <input onChange={e => setEmail(e.target.value)} value={email} type="email" className='outline-none text-sm' placeholder='Your Email ID ' required />
                        </div>

                        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                            <img className='w-3' src={assets.lock_icon} alt="" />
                            <input onChange={e => setPassword(e.target.value)} value={password} type="password" className='outline-none text-sm' placeholder='Password' required />
                        </div>

                        {state !== 'Access Your Account' ? (
                            <p className='hidden'>Forgot Your Password?</p>
                        ) : (
                            <p className='text-sm text-[#0415c9] my-4 cursor-pointer'>Forgot Your Password?</p>
                        )}

                        <button className='bg-[#0415c9] w-full text-white py-2 rounded-full'>
                            {state === 'Access Your Account' ? 'LogIn Now !' : 'Get Started !'}
                        </button>

                        {state === 'Access Your Account' ? (
                            <p className='mt-5 text-center'>
                                Not signed up yet? <span className='text-[#0415c9] cursor-pointer' onClick={() => setState('Sign Up Now!')}>Register Now !</span>
                            </p>
                        ) : (
                            <p className='mt-5 text-center'>
                                Signed up already? <span className='text-[#0415c9] cursor-pointer' onClick={() => setState('Access Your Account')}>Login Here !</span>
                            </p>
                        )}

                        <img onClick={handleClose} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' />
                    </motion.form>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Login;