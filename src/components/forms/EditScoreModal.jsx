import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getScoreValue } from '../../lib/utils';
import Input from './Input';
import Button from './Button';

const TIME_BASED_PROVAS = ["26_2", "26_3"];

const EditScoreModal = ({ isOpen, onClose, onSave, athlete, provaKey }) => {
  const { t } = useTranslation();
  
  const [repsValue, setRepsValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [isCapped, setIsCapped] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!athlete || !provaKey) return;

    const score = athlete.scores?.[provaKey];
    const scoreValue = getScoreValue(score);

    const isTimeBased = score && score.hasOwnProperty('isCapped') && !score.isCapped;

    setIsCapped(!isTimeBased);

    if (isTimeBased) {
      const minutes = Math.floor(scoreValue / 60);
      const seconds = scoreValue % 60;
      setTimeValue(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      setRepsValue('');
    } else {
      setRepsValue(scoreValue > 0 ? scoreValue.toString() : '');
      setTimeValue('');
    }
    setError('');

  }, [athlete, provaKey, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let scorePayload;

    if (!isCapped) {
      const timeParts = timeValue.match(/^(\d{1,2}):(\d{2})$/);
      if (!timeParts) {
        setError(t('invalidTimeFormat'));
        setLoading(false);
        return;
      }
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);
      
      if (seconds >= 60) {
        setError(t('invalidTimeSeconds'));
        setLoading(false);
        return;
      }

      scorePayload = { isCapped: false, value: minutes * 60 + seconds };
    } else {
      if (!repsValue || parseFloat(repsValue) < 0) {
        setError(t('invalidReps'));
        setLoading(false);
        return;
      }
      scorePayload = { isCapped: true, value: parseFloat(repsValue) };
    }
    
    try {
      await onSave(scorePayload);
      onClose();
    } catch (err) {
      console.error(err);
      setError(t('scoreUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const canBeTimeBased = TIME_BASED_PROVAS.includes(provaKey);

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="p-6 bg-gray-800 rounded-lg space-y-4 w-full max-w-md">
        <h3 className="text-lg font-semibold text-neon-green">
          {t('editScoreFor')} <span className="text-white">{athlete.name}</span> - {provaKey.replace('_', '.')}
        </h3>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {canBeTimeBased && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsCappedToggle"
                checked={!isCapped}
                onChange={() => setIsCapped(!isCapped)}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-neon-green focus:ring-neon-green"
              />
              <label htmlFor="editIsCappedToggle" className="text-sm text-gray-300">
                {t('athleteFinishedEvent')}
              </label>
            </div>
          )}

          {isCapped ? (
            <Input
              id="edit-reps"
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
              id="edit-time"
              label={t('time')}
              type="text"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              placeholder="MM:SS"
              required
            />
          )}
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" onClick={onClose} className="!bg-gray-600 hover:!bg-gray-700">
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScoreModal;
