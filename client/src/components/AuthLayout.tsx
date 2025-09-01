import React from 'react';
import backgroundImage from '../assets/background.jpg';
import logo from '../assets/logo.jpg';
interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex">
    {/* Left: Centered column, minimal look */}
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen w-full px-4">
      {/* Logo row at the very top left */}
      <div className="absolute left-6 top-6 flex items-center">
        <img src={logo} alt="HD Logo" className="h-5 w-50 mr-2" />
        
      </div>
      {/* The main vertical block for form */}
      <div className="w-full max-w-xs flex flex-col items-center mb-15">
        {children}
      </div>
    </div>
    {/* Right: keep image from earlier */}
    <div className="hidden lg:block lg:w-3/5 relative">
      <img
        src={backgroundImage}
        alt="Abstract"
        className="absolute inset-0 w-full h-full object-cover rounded-tl-[36px]"
      />
    </div>
  </div>
);

export default AuthLayout;
