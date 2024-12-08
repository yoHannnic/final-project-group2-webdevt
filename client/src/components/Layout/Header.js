import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed unused 'Link' import
import { LogoutOutlined } from '@ant-design/icons';
import { message } from 'antd';
import logo from './expenseLogo.png';

const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    message.success('Logout successfully');
  };

  return (
    <header className="bg-blue-500 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Expense Tracker Logo"
            className="h-[90px] max-w-[250px] mx-3"
          />
          {/* Removed empty <h1> tag */}
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              {loginUser && (
                <span className="text-white font-medium">
                  Welcome, {loginUser.name.split(' ')[0]}
                </span>
              )}
            </li>
            <li>
              <button
                className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                onClick={handleLogout}
              >
                <LogoutOutlined className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
