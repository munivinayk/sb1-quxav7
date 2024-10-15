import React, { useState } from 'react';
import { X, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps {
  onClose: () => void;
  onLoginClick: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onClose, onLoginClick }) => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      onClose();
      navigate('/dashboard');
    } catch (error) {
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Sign up to take your trip planning to the next level</h2>
        <form onSubmit={handleSignup}>
          <a href="http://localhost:5000/api/auth/google" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded-full mb-4 flex items-center justify-center">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </a>
          <a href="http://localhost:5000/api/auth/facebook" className="w-full bg-blue-600 text-white py-2 rounded-full mb-6 flex items-center justify-center">
            <Facebook className="mr-2" />
            Sign up with Facebook
          </a>
          <div className="text-center text-gray-500 dark:text-gray-400 mb-4">or</div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-full mb-4">Sign up with email</button>
        </form>
        <div className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Already have an account? <button onClick={onLoginClick} className="text-orange-500 hover:underline">Log in</button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;