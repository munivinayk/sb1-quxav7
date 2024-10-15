import React, { useState } from 'react';
import { X, Facebook, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onClose: () => void;
  onSignupClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSignupClick }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Log in to Tinoto</h2>
        <form onSubmit={handleLogin}>
          <a href="http://localhost:5000/api/auth/google" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded-full mb-4 flex items-center justify-center">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Log in with Google
          </a>
          <a href="http://localhost:5000/api/auth/facebook" className="w-full bg-blue-600 text-white py-2 rounded-full mb-4 flex items-center justify-center">
            <Facebook className="mr-2" />
            Log in with Facebook
          </a>
          <div className="text-center text-gray-500 dark:text-gray-400 mb-4">or</div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-full mb-4">Log in</button>
        </form>
        <div className="text-center">
          <a href="#" className="text-orange-500 hover:underline">Forgot password</a>
        </div>
        <div className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Don't have an account yet? <button onClick={onSignupClick} className="text-orange-500 hover:underline">Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;