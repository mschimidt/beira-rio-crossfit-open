import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAthletes, updateAthletePerformance } from '../../firebase/athleteService';
import Input from './Input';
import Button from './Button';

const ScoreForm = () => {
  const { t } = useTranslation();
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [score, setScore] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const athleteList = await getAthletes();
        setAthletes(athleteList);
      } catch (err) {
        console.error("Failed to fetch athletes", err);
        setError(t('fetchAthletesFailed'));
      }
    };
    fetchAthletes();
  }, [t]);

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
      await updateAthletePerformance(selectedAthlete, { score: Number(score), time });
      setSuccess(t('scoreUpdated'));
      // Reset form
      setSelectedAthlete('');
      setScore('');
      setTime('');
    } catch (err) {
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

      <Input
        id="score"
        label={t('points')}
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        required
      />
      <Input
        id="time"
        label={t('time')}
        placeholder={t('timeFormat')}
        value={time}
        onChange={(e) => setTime(e.target.value)}
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
