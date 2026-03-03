import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(t('loginFailed'));
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">
          {t('adminArea')}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-bold text-gray-400 block"
            >
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-400 block"
            >
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-dark-blue bg-neon-green rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-blue focus:ring-neon-green transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? t('loading') : t('loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
