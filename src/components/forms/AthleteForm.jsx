import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addAthlete } from '../../firebase/athleteService';
import Input from './Input';
import Button from './Button';

const CATEGORIES = [
  'Masculino RX',
  'Feminino RX',
  'Masculino Intermediário',
  'Feminino Intermediário',
  'Masculino Scale',
  'Feminino Scale',
];

const AthleteForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [box, setBox] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await addAthlete({ name, box, category });
      setSuccess(t('athleteAdded'));
      // Reset form
      setName('');
      setBox('');
      setCategory('');
    } catch (err) {
      setError(t('addAthleteFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-800/50 rounded-lg space-y-4"
    >
      <h3 className="text-lg font-semibold text-neon-green">
        {t('addAthlete')}
      </h3>
      
      {success && <p className="text-sm text-green-400">{success}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Input
        id="name"
        label={t('fullName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        id="box"
        label={t('boxName')}
        value={box}
        onChange={(e) => setBox(e.target.value)}
        required
      />
      <div>
        <label
          htmlFor="category"
          className="text-sm font-bold text-gray-400 block mb-1"
        >
          {t('category')}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full p-2 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
        >
          <option value="" disabled>
            {t('selectCategory')}
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? t('saving') : t('saveAthlete')}
        </Button>
      </div>
    </form>
  );
};

export default AthleteForm;
