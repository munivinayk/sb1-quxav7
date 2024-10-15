import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '../context/AuthContext';
import citiesData from '../data/cities.json';
import { Link } from 'react-router-dom';

interface City {
  name: string;
  region: string;
  country: string;
  type: string;
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = citiesData.cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCitySelect = (city: City) => {
    console.log('Selected destination:', city);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M16 2L2 10L16 18L30 10L16 2Z" fill="#FF5A5F"/>
              <path d="M16 22L2 14V26L16 30L30 26V14L16 22Z" fill="#FF5A5F"/>
            </svg>
            <span className="text-xl font-bold text-gray-800 dark:text-white">tinoto</span>
          </Link>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Explore by destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {showDropdown && (
              <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto">
                {filteredCities.map((city, index) => (
                  <li
                    key={`${city.name}-${city.country}-${city.type}-${index}`}
                    onClick={() => handleCitySelect(city)}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    {city.name}, {city.country} ({city.type})
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300">
              {darkMode ? <Sun /> : <Moon />}
            </button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Log out
              </button>
            ) : (
              <>
                <button onClick={openLoginModal} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  Log in
                </button>
                <button onClick={openSignupModal} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && <LoginForm onClose={closeModals} onSignupClick={openSignupModal} />}
      {showSignupModal && <SignupForm onClose={closeModals} onLoginClick={openLoginModal} />}
    </>
  );
};

export default Header;