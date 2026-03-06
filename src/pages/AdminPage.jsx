import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { getAthletes, deleteAthlete, deleteScore, updateAthletePerformance } from '../firebase/athleteService';
import { formatScore, getScoreValue } from '../lib/utils';
import AthleteForm from '../components/forms/AthleteForm';
import ScoreForm from '../components/forms/ScoreForm';
import EditScoreModal from '../components/forms/EditScoreModal';
import Button from '../components/forms/Button';

const PROVAS = ["26.1", "26.2", "26.3"];

const AthleteList = ({ athletes, onDataChanged, onEditScore }) => {
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
    const eventKey = event.replace('.', '_');
    if (window.confirm(t('confirmDeleteScore', { event }))) {
      try {
        await deleteScore(athleteId, eventKey);
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
            {PROVAS.map((prova) => {
              const provaKey = prova.replace('.', '_');
              const score = athlete.scores?.[provaKey];

              return (
                <div key={prova} className="flex justify-between items-center p-2 bg-gray-700/50 rounded">
                  <div>
                    <span className="font-semibold text-gray-300">{prova}:</span>
                    <span className="ml-2 font-mono text-neon-green">{formatScore(score, t)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEditScore(athlete, provaKey)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {t('edit')}
                    </button>
                    {getScoreValue(score) > 0 && (
                      <button
                        onClick={() => handleDeleteScore(athlete.id, prova)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        {t('delete')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
  
  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScoreInfo, setEditingScoreInfo] = useState({ athlete: null, provaKey: null });

  const refreshAthletes = async () => {
    try {
      const athleteList = await getAthletes();
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

  const handleOpenEditModal = (athlete, provaKey) => {
    setEditingScoreInfo({ athlete, provaKey });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingScoreInfo({ athlete: null, provaKey: null });
  };

  const handleSaveScore = async (newScorePayload) => {
    const { athlete, provaKey } = editingScoreInfo;
    if (!athlete || !provaKey) return;

    await updateAthletePerformance(athlete.id, provaKey, newScorePayload);
    await refreshAthletes(); // Refresh data after saving
  };

  return (
    <>
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
            <AthleteList athletes={athletes} onDataChanged={refreshAthletes} onEditScore={handleOpenEditModal} />
          </section>
        </div>
      </div>

      <EditScoreModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveScore}
        athlete={editingScoreInfo.athlete}
        provaKey={editingScoreInfo.provaKey}
      />
    </>
  );
};

export default AdminPage;

