import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateAthletePerformance } from '../../firebase/athleteService';
import Input from './Input';
import Button from './Button';

const PROVAS = ["26_1", "26_2", "26_3"];

const ScoreForm = ({ athletes, onScoreAdded }) => {
  const { t } = useTranslation();
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [prova, setProva] = useState(PROVAS[0]);
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAthlete) {
      setError(t('selectAthleteError'));
      return;
    }

    setLoading(true);
    try {
      // The score is sent as a float, and the event name is included.
      await updateAthletePerformance(selectedAthlete, prova, parseFloat(score));
      setSuccess(t('scoreUpdated'));
      
      // Notify parent to refresh data
      if (onScoreAdded) {
        onScoreAdded();
      }

      // Reset form
      setSelectedAthlete('');
      setScore('');
      setProva(PROVAS[0]);
    } catch (err) {
      console.error(err);
      setError(t('scoreUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-800/50 rounded-lg space-y-4 h-full"
    >
      <h3 className="text-lg font-semibold text-neon-green">
        {t('enterResults')}
      </h3>
      
      {success && <p className="text-sm text-green-400">{success}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <label
          htmlFor="athlete"
          className="text-sm font-bold text-gray-400 block mb-1"
        >
          {t('athlete')}
        </label>
        <select
          id="athlete"
          value={selectedAthlete}
          onChange={(e) => setSelectedAthlete(e.target.value)}
          required
          className="w-full p-2 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
        >
          <option value="" disabled>
            {t('selectAthlete')}
          </option>
          {athletes.map((ath) => (
            <option key={ath.id} value={ath.id}>
              {ath.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label
          htmlFor="prova"
          className="text-sm font-bold text-gray-400 block mb-1"
        >
          {t('event')}
        </label>
        <select
          id="prova"
          value={prova}
          onChange={(e) => setProva(e.target.value)}
          required
          className="w-full p-2 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
        >
          {PROVAS.map((p) => (
            <option key={p} value={p}>
              {p.replace('_', '.')}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="score"
        label={t('points')}
        type="number"
        step="any" // Allow decimals
        value={score}
        onChange={(e) => setScore(e.target.value)}
        required
      />
      
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? t('saving') : t('saveResult')}
        </Button>
      </div>
    </form>
  );
};

export default ScoreForm;
