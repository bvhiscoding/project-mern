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
        <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                        Login
                    </h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Or{' '}
                        <Link to='/register' className='font-medium text-blue-600 hover:text-blue-500'>
                            Register
                        </Link>
                    </p>
                </div>
                <form 
                className='mt-8 space-y-6' onSubmit={onSubmit}>
                    <div className='rounded-md shadow-md -space-y-px'>
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
                            className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'/>
                        </div>
                        <div>
                            <label htmlFor="password" className='sr-only'>Password</label>
                            <input type="password" name="password" id="password" autoComplete='current-password' required value={password} onChange={onChange} placeholder='Password'
                            className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm' />
                        </div>
                    </div>

                    {isError &&(
                        <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative'>
                            {useSelector((state) => state.auth.message)}
                        </div>
                    )}

                    <div>
                        <button 
                        type='submit'
                        disabled={isLoading}
                        className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isLoading ?'Logging in...':'Login'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default LoginPage;