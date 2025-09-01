import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import api from '../service/api';
import { useAuth } from '../hooks/useAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', email: '' });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', formData);
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

      {/* --- MODIFIED SECTION START --- */}
      <form onSubmit={!isOtpSent ? handleGetOtp : handleVerifyOtp} className="w-full">
        <div className="mb-3">
          <label className="block text-xs text-gray-400 font-medium mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-100 disabled:bg-gray-100"
            required
            autoComplete="off"
            disabled={isOtpSent} // <-- Field is disabled after OTP is sent
          />
        </div>


<div className="mb-3">
  <label className="block text-xs text-gray-400 font-medium mb-0">Date of Birth</label>
  <div className="relative mt-1"> {/* Added relative positioning and margin */}
    {/* Calendar Icon */}
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <svg className="h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    
    <input
      type="date"
      name="dateOfBirth"
      value={formData.dateOfBirth}
      onChange={handleInputChange}
      // Added pl-10 for padding on the left to make space for the icon
      className="block w-full border border-gray-300 rounded-md pl-10 py-1.5 text-sm bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-100 disabled:bg-gray-100"
      required
      autoComplete="off"
      disabled={isOtpSent}
    />
  </div>
</div>
        <div className="mb-5">
          <label className="block text-xs text-gray-400 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-100 disabled:bg-gray-100"
            required
            autoComplete="off"
            disabled={isOtpSent} // <-- Field is disabled after OTP is sent
          />
        </div>

        {/* Conditionally render OTP field when isOtpSent is true */}
        {isOtpSent && (
          <div className="mb-5">
            <label className="block text-xs text-gray-400 font-medium mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-100"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white text-sm font-semibold rounded-md py-2 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : (isOtpSent ? 'Sign Up' : 'Get OTP')}
        </button>
      </form>
      {/* --- MODIFIED SECTION END --- */}

      <p className="mt-5 text-xs text-gray-500 text-center w-full">
        Already have an account?{' '}
        <Link to="/signin" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;