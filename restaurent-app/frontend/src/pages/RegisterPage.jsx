import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';

const RegisterPage =()=>{
    const [formData , setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone:'',
        address:''
    }); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isLoading,isError, isSuccess , user, } = useSelector((state) => state.auth)
    const {name, email, password, confirmPassword, phone, address} = formData

    //REDIRECTING AFTER REGISTER SUCCESS - CHỈ redirect khi register thành công
    useEffect(() => {
        if(isSuccess && user){
            navigate('/', { replace: true })
            dispatch(reset())
        }
    }, [isSuccess, user, navigate, dispatch])

    const onChange = (e) =>{
        setFormData((prevState) =>({
            ...prevState,
            [e.target.name]: e.target.value
        }))

    }

    const onSubmit = (e) =>{
        e.preventDefault();
        if(password !==confirmPassword){
            alert('Passwords do not match')
            return
        }
        if(password.length <6) {
            alert('Password must be at least 6 characters')
            return
        }

        dispatch(register({name, email, password, phone, address}))
    };

    return ( 
        <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                       Register 
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Login
                    </Link>
                    </p>
                </div>
<form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="enter@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone number (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0123456789"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address (optional)
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Re-enter your password"
              />
            </div>
          </div>
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              {useSelector((state) => state.auth.message)}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">Registering...</span>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
            </div>

        </div>
    )
}

export default RegisterPage;