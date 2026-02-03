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
    const {isLoading,isError, isSuccess , user, message } = useSelector((state) => state.auth)
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
        <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='text-center'>
                    <p className='text-xs uppercase tracking-[0.3em] text-[#8f3721] font-semibold'>Join the table</p>
                    <h2 className='mt-3 text-center text-3xl font-bold text-[#2b1e18] font-display'>Register</h2>
                    <p className="mt-2 text-center text-sm text-[#5a463d]">
                    Or{' '}
                    <Link
                    to="/login"
                    className="font-semibold text-[#8f3721] hover:text-[#6f2a1a]"
                    >
                        Login
                    </Link>
                    </p>
                </div>
 <form className="mt-6 space-y-6 glass-panel p-6" onSubmit={onSubmit}>
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
                className="mt-1 block w-full px-4 py-3 border border-[#eadfce] rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent sm:text-sm"
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
                className="mt-1 block w-full px-4 py-3 border border-[#eadfce] rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent sm:text-sm"
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
                className="mt-1 block w-full px-4 py-3 border border-[#eadfce] rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent sm:text-sm"
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
                className="mt-1 block w-full px-4 py-3 border border-[#eadfce] rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent sm:text-sm"
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
                className="mt-1 block w-full px-4 py-3 border border-[#eadfce] rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent sm:text-sm"
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
                className="mt-1 block w-full px-4 py-3 border border-[#eadfce] rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent sm:text-sm"
                placeholder="Re-enter your password"
              />
            </div>
          </div>
          {isError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">
              {message}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-[#b1452a] hover:bg-[#8f3721] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a373] disabled:opacity-50 disabled:cursor-not-allowed"
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
