import { useTranslation } from 'react-i18next';

const PROVAS = ["26_1", "26_2", "26_3"];

/**
 * Formats the score for display based on its structure.
 * @param {object | number} score - The score object or legacy number.
 * @param {function} t - The translation function.
 * @returns {string} The formatted score string.
 */
const formatScore = (score, t) => {
  // Check for missing scores or scores that are explicitly zero
  const scoreValue = typeof score === 'number' ? score : score?.value;
  if (scoreValue === undefined || scoreValue === null || Number(scoreValue) === 0) {
    return 'N/A';
  }

  // Legacy support for old numeric scores
  if (typeof score === 'number') {
    return (Number(score) || 0).toFixed(1);
  }

  // New score object format
  if (score.isCapped) {
    return `${(Number(score.value) || 0).toFixed(1)} ${t('reps')}`;
  } else {
    const totalSeconds = Number(score.value) || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
};

const LeaderboardTable = ({ athletes, loading, activeEvent }) => {
  const { t } = useTranslation();

  if (loading) {
    return <div className="text-center p-8 text-neon-green">{t('loading')}</div>;
  }

  if (!athletes || athletes.length === 0) {
    return <div className="text-center p-8 text-gray-400">{t('noAthletesFound')}</div>;
  }

  const renderOverallHeader = () => (
    <thead className="border-b border-neon-green/30 font-semibold text-neon-green">
      <tr>
        <th scope="col" className="px-4 py-3 text-center">{t('position')}</th>
        <th scope="col" className="px-4 py-3">{t('athlete')}</th>
        <th scope="col" className="px-4 py-3 hidden md:table-cell">{t('box')}</th>
        <th scope="col" className="px-4 py-3 text-right">{t('totalPoints')}</th>
        {PROVAS.map(prova => (
          <th key={prova} scope="col" className="px-4 py-3 text-center hidden lg:table-cell">{prova.replace('_', '.')}</th>
        ))}
      </tr>
    </thead>
  );

  const renderOverallBody = () => (
    <tbody>
      {athletes.map((athlete, index) => (
        <tr key={athlete.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
          <td className="px-4 py-3 text-center font-bold">{index + 1}</td>
          <td className="px-4 py-3 font-medium">{athlete.name}</td>
          <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{athlete.box}</td>
          <td className="px-4 py-3 text-right font-mono text-neon-green font-bold">
            {Number(athlete.totalPoints) || 0}
          </td>
          {PROVAS.map(prova => (
            <td key={prova} className="px-4 py-3 text-center font-mono text-gray-400 hidden lg:table-cell">
              {`(${athlete.individualRanks?.[prova] > 0 ? athlete.individualRanks[prova] : 'N/A'})`}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const renderEventHeader = () => (
    <thead className="border-b border-neon-green/30 font-semibold text-neon-green">
      <tr>
        <th scope="col" className="px-4 py-3 text-center">{t('position')}</th>
        <th scope="col" className="px-4 py-3">{t('athlete')}</th>
        <th scope="col" className="px-4 py-3 hidden md:table-cell">{t('box')}</th>
        <th scope="col" className="px-4 py-3 text-right">{t('score')}</th>
      </tr>
    </thead>
  );

  const renderEventBody = () => (
    <tbody>
      {athletes.map((athlete) => (
        <tr key={athlete.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
          <td className="px-4 py-3 text-center font-bold">{athlete.rank || 'N/A'}</td>
          <td className="px-4 py-3 font-medium">{athlete.name}</td>
          <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{athlete.box}</td>
          <td className="px-4 py-3 text-right font-mono text-neon-green">
            {formatScore(athlete.scores?.[activeEvent], t)}
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="overflow-x-auto rounded-lg bg-gray-800/30">
      <table className="min-w-full text-left text-sm md:text-base">
        {activeEvent === 'Geral' ? renderOverallHeader() : renderEventHeader()}
        {activeEvent === 'Geral' ? renderOverallBody() : renderEventBody()}
      </table>
    </div>
  );
};

export default LeaderboardTable;
