import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { getAthletes } from '../firebase/athleteService';
import AthleteForm from '../components/forms/AthleteForm';
import ScoreForm from '../components/forms/ScoreForm';

const AdminPage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState([]);

  const refreshAthletes = async () => {
    try {
      const athleteList = await getAthletes();
      setAthletes(athleteList);
    } catch (err) {
      console.error("Failed to fetch athletes", err);
    }
  };

  useEffect(() => {
    refreshAthletes();
  }, []);

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
          <AthleteForm onAthleteAdded={refreshAthletes} />
        </section>

        <section>
          <ScoreForm athletes={athletes} onScoreAdded={refreshAthletes} />
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
