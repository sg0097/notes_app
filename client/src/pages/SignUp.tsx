import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import api from '../service/api';
import { useAuth } from '../hooks/useAuth';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SignUp = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    dateOfBirth: null as Date | null,
    email: '' 
  });
  
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.dateOfBirth) {
        setError("Please select your date of birth.");
        setLoading(false);
        return;
    }

    const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth.toISOString().split('T')[0],
    };

    try {
      await api.post('/auth/signup', payload);
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { email: formData.email, otp });
      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold mb-1 w-full text-left">Sign up</h1>
      <p className="text-gray-400 text-sm mb-6 w-full text-left">Sign up to enjoy the feature of HD</p>
      {error && <p className="text-red-500 mb-2 text-xs">{error}</p>}

      <form onSubmit={!isOtpSent ? handleGetOtp : handleVerifyOtp} className="w-full">
        
        <div className="relative mb-4">
            <label 
                htmlFor="name" 
                className="absolute left-2 -top-2 text-gray-500 text-xs bg-white px-1"
            >
                Your Name
            </label>
            <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-transparent focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                required
                autoComplete="off"
                disabled={isOtpSent}
                placeholder="e.g. Jonas Khanwald"
            />
        </div>

        <div className="relative mb-4">
            <label 
                htmlFor="dateOfBirth" 
                // --- THE FIX IS HERE ---
                className="absolute left-2 -top-2 text-gray-400 text-xs bg-white px-1 z-10"
            >
                Date of Birth
            </label>
            <DatePicker
                id="dateOfBirth"
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                wrapperClassName="w-full"
                className="block w-full border border-gray-300 rounded-md pl-10 py-2 text-sm bg-transparent focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                required
                autoComplete="off"
                disabled={isOtpSent}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={70}
                maxDate={new Date()}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>
        
        <div className="relative mb-5">
            <label 
                htmlFor="email" 
                className="absolute left-2 -top-2 text-gray-500 text-xs bg-white px-1"
            >
                Email
            </label>
            <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-transparent focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                required
                autoComplete="off"
                disabled={isOtpSent}
                placeholder="you@example.com"
            />
        </div>

        {isOtpSent && (
          <div className="mb-5">
            <label className="block text-xs text-gray-400 font-medium mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-transparent focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white text-sm font-semibold rounded-md py-2.5 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : (isOtpSent ? 'Sign Up' : 'Get OTP')}
        </button>
      </form>
      
      <p className="mt-5 text-xs text-gray-500 text-center w-full">
        Already have an account?{' '}
        <Link to="/signin" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;