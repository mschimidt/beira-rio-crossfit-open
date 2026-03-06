import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { updateAthletePerformance } from '../../firebase/athleteService';
import Input from './Input';
import Button from './Button';

const PROVAS = ["26_1", "26_2", "26_3"];
const TIME_BASED_PROVAS = ["26_2", "26_3"]; // Provas que podem ter tempo

const ScoreForm = ({ athletes, onScoreAdded }) => {
  const { t } = useTranslation();
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [prova, setProva] = useState(PROVAS[0]);
  
  // States for score inputs
  const [repsValue, setRepsValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  
  // State for workout type
  const [isCapped, setIsCapped] = useState(true); // true = reps, false = time

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset form state when prova changes
  useEffect(() => {
    setRepsValue('');
    setTimeValue('');
    setError('');
    // Prova 26.1 is always reps (capped)
    if (prova === '26_1') {
      setIsCapped(true);
    }
  }, [prova]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAthlete) {
      setError(t('selectAthleteError'));
      return;
    }

    let scorePayload;

    if (!isCapped) {
      // Time-based score
      const timeParts = timeValue.match(/^(\d{1,2}):(\d{2})$/);
      if (!timeParts) {
        setError(t('invalidTimeFormat'));
        return;
      }
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);
      
      if (seconds >= 60) {
        setError(t('invalidTimeSeconds'));
        return;
      }

      scorePayload = {
        isCapped: false,
        value: minutes * 60 + seconds,
      };

    } else {
      // Reps-based score
      if (!repsValue || parseFloat(repsValue) < 0) {
        setError(t('invalidReps'));
        return;
      }
      scorePayload = {
        isCapped: true,
        value: parseFloat(repsValue),
      };
    }

    setLoading(true);
    try {
      await updateAthletePerformance(selectedAthlete, prova, scorePayload);
      setSuccess(t('scoreUpdated'));
      
      if (onScoreAdded) {
        onScoreAdded();
      }

      // Reset form
      setSelectedAthlete('');
      setProva(PROVAS[0]);
      setRepsValue('');
      setTimeValue('');
      setIsCapped(true);

    } catch (err) {
      console.error(err);
      setError(t('scoreUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  const canBeTimeBased = TIME_BASED_PROVAS.includes(prova);

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

      {canBeTimeBased && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isCappedToggle"
            checked={!isCapped}
            onChange={() => setIsCapped(!isCapped)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-neon-green focus:ring-neon-green"
          />
          <label htmlFor="isCappedToggle" className="text-sm text-gray-300">
            {t('athleteFinishedEvent')}
          </label>
        </div>
      )}

      {isCapped ? (
        <Input
          id="reps"
          label={t('resultRepsTiebreak')}
          type="number"
          step="any"
          value={repsValue}
          onChange={(e) => setRepsValue(e.target.value)}
          placeholder="Ex: 150.5"
          required
        />
      ) : (
        <Input
          id="time"
          label={t('time')}
          type="text"
          value={timeValue}
          onChange={(e) => setTimeValue(e.target.value)}
          placeholder="MM:SS"
          required
        />
      )}
      
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? t('saving') : t('saveResult')}
        </Button>
      </div>
    </form>
  );
};

export default ScoreForm;
