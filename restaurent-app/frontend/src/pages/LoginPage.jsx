import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';

const LoginPage =()=>{

    const [formData , setFormData] = useState({
        email: '',
        password: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const {isLoading,isError, isSuccess , user} = useSelector((state) => state.auth)
    const {email, password} = formData

    //REDIRECTING AFTER LOGIN SUCCESS - CHỈ redirect khi login thành công
    useEffect(() => {
        if(isSuccess && user){
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true })
            dispatch(reset())
        }
    }, [isSuccess, user, navigate, location, dispatch])

    const onChange = (e) =>{
        setFormData((prevState) =>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({email, password}))
    }

    return (
        <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='text-center'>
                    <p className='text-xs uppercase tracking-[0.3em] text-[#8f3721] font-semibold'>Welcome back</p>
                    <h2 className='mt-3 text-center text-3xl font-bold text-[#2b1e18] font-display'>Login</h2>
                    <p className='mt-2 text-center text-sm text-[#5a463d]'>
                        Or{' '}
                        <Link to='/register' className='font-semibold text-[#8f3721] hover:text-[#6f2a1a]'>
                            Register
                        </Link>
                    </p>
                </div>
                <form 
                className='mt-6 space-y-6 glass-panel p-6' onSubmit={onSubmit}>
                    <div className='rounded-xl -space-y-px overflow-hidden border border-[#eadfce]'>
                        <div>
                            <label htmlFor="email" className='sr-only'>Email address</label>
                            <input 
                            type="text"
                            id='email'
                            name='email'
                            autoComplete='email'
                            required
                            value={email}
                            onChange={onChange} 
                            placeholder='Email'
                            className='appearance-none relative block w-full px-4 py-3 border-b border-[#eadfce] placeholder-[#6d5b51] text-[#2b1e18] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:z-10 sm:text-sm'/>
                        </div>
                        <div>
                            <label htmlFor="password" className='sr-only'>Password</label>
                            <input type="password" name="password" id="password" autoComplete='current-password' required value={password} onChange={onChange} placeholder='Password'
                            className='appearance-none relative block w-full px-4 py-3 placeholder-[#6d5b51] text-[#2b1e18] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:z-10 sm:text-sm' />
                        </div>
                    </div>

                    {isError &&(
                        <div className='bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl'>
                            {useSelector((state) => state.auth.message)}
                        </div>
                    )}

                    <div>
                        <button 
                        type='submit'
                        disabled={isLoading}
                        className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-[#b1452a] hover:bg-[#8f3721] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a373] disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isLoading ?'Logging in...':'Login'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default LoginPage;
