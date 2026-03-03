import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import AthleteForm from '../components/forms/AthleteForm';

const AdminPage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
      alert('Falha ao fazer logout.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {t('adminArea')}
        </h2>
        <button
          onClick={handleLogout}
          className="text-sm text-neon-green hover:underline"
        >
          {t('logout')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <AthleteForm />
        </section>

        <section>
          {/* A seção de lançamento de provas será adicionada aqui */}
          <div className="p-6 bg-gray-800/50 rounded-lg h-full">
            <h3 className="text-lg font-semibold text-neon-green mb-4">
              Lançamento de Provas
            </h3>
            <p className="text-gray-400">
              {t('wipPanel')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
