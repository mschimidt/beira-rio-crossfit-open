import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { getAthletes, deleteAthlete, deleteScore } from '../firebase/athleteService';
import AthleteForm from '../components/forms/AthleteForm';
import ScoreForm from '../components/forms/ScoreForm';
import Button from '../components/forms/Button';

const PROVAS = ["26.1", "26.2", "26.3"];

const AthleteList = ({ athletes, onDataChanged }) => {
  const { t } = useTranslation();

  const handleDeleteAthlete = async (athleteId) => {
    if (window.confirm(t('confirmDeleteAthlete'))) {
      try {
        await deleteAthlete(athleteId);
        onDataChanged();
      } catch (error) {
        alert(t('deleteAthleteFailed'));
      }
    }
  };

  const handleDeleteScore = async (athleteId, event) => {
    if (window.confirm(t('confirmDeleteScore', { event }))) {
      try {
        await deleteScore(athleteId, event);
        onDataChanged();
      } catch (error) {
        alert(t('deleteScoreFailed'));
      }
    }
  };

  return (
    <div className="p-6 bg-gray-800/50 rounded-lg space-y-6">
      <h3 className="text-lg font-semibold text-neon-green">{t('athleteList')}</h3>
      {athletes.map((athlete) => (
        <div key={athlete.id} className="p-4 bg-gray-900/50 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-bold text-white">{athlete.name}</p>
              <p className="text-sm text-gray-400">{athlete.category} - {athlete.box}</p>
            </div>
            <Button
              onClick={() => handleDeleteAthlete(athlete.id)}
              className="!bg-red-600 hover:!bg-red-700"
            >
              {t('deleteAthlete')}
            </Button>
          </div>
          <div className="space-y-2">
            {PROVAS.map((prova) => (
              <div key={prova} className="flex justify-between items-center p-2 bg-gray-700/50 rounded">
                <div>
                  <span className="font-semibold text-gray-300">{prova}:</span>
                  <span className="ml-2 font-mono text-neon-green">{athlete.scores?.[prova] || '0.0'}</span>
                </div>
                {athlete.scores?.[prova] > 0 && (
                  <button
                    onClick={() => handleDeleteScore(athlete.id, prova)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    {t('delete')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


const AdminPage = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState([]);

  const refreshAthletes = async () => {
    try {
      const athleteList = await getAthletes();
      // Sort athletes alphabetically for consistent display
      athleteList.sort((a, b) => a.name.localeCompare(b.name));
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

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <AthleteForm onAthleteAdded={refreshAthletes} />
          </section>
          <section>
            <ScoreForm athletes={athletes} onScoreAdded={refreshAthletes} />
          </section>
        </div>
        
        <section>
          <AthleteList athletes={athletes} onDataChanged={refreshAthletes} />
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
