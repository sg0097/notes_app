import React from 'react';
import logo from '../assets/logo.jpg';

const Header = () => {
  return (
    // Add justify-start to be explicit
    <div className="flex justify-left mb-10">
      <img src={logo} alt="HD Logo" className="w-30 h-4" />
    </div>
  );
};

export default Header;