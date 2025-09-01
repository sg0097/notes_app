import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import api from '../service/api';
import { useAuth } from '../hooks/useAuth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const handleGetOtp = async (
    e?: React.FormEvent<HTMLFormElement>
  ) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/login', { email });
      setIsOtpSent(true);
      setResendCooldown(30);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'Failed to send OTP');
      } else {
        setError('Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown === 0) {
      handleGetOtp(); // No event, so undefined is fine
    }
  };

  const handleVerifyOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      login(data);
      navigate('/');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'OTP verification failed');
      } else {
        setError('OTP verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-xl font-bold mb-1 w-full text-left">Sign in</h1>
      <p className="text-gray-400 text-sm mb-6 w-full text-left">
        Please login to continue to your account.
      </p>
      {error && <p className="text-red-500 mb-2 text-xs">{error}</p>}

      <form onSubmit={!isOtpSent ? handleGetOtp : handleVerifyOtp} className="w-full">
        <div className="mb-5">
          <label className="block text-xs text-gray-400 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-100 disabled:bg-gray-100"
            required
            disabled={isOtpSent}
          />
        </div>
        {isOtpSent && (
          <>
            <div className="mb-5">
              <label className="block text-xs text-gray-400 font-medium mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-100"
                required
              />
            </div>
            {/* Correct row alignment for Resend OTP and Keep Me Logged In */}
            <div className="mb-5 flex flex-row items-center justify-between">
              <div>
                {resendCooldown > 0 ? (
                  <span className="text-xs text-gray-500">
                    Resend OTP in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <div className="flex items-center ml-4">
                <input
                  id="keep-logged-in"
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="keep-logged-in" className="ml-2 block text-xs text-gray-700">
                  Keep me logged in
                </label>
              </div>
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white text-sm font-semibold rounded-md py-2 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : isOtpSent ? 'Sign In' : 'Get OTP'}
        </button>
      </form>
      <p className="mt-5 text-xs text-gray-500 text-center w-full">
        Need an account?{' '}
        <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignIn;
