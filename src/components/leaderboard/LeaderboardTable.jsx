import { useTranslation } from 'react-i18next';

const LeaderboardTable = ({ athletes, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <div className="text-center p-8 text-neon-green">{t('loading')}</div>;
  }

  if (!athletes || athletes.length === 0) {
    return <div className="text-center p-8 text-gray-400">{t('noAthletesFound')}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-gray-800/30">
      <table className="min-w-full text-left text-sm md:text-base">
        <thead className="border-b border-neon-green/30 font-semibold text-neon-green">
          <tr>
            <th scope="col" className="px-4 py-3 text-center">{t('position')}</th>
            <th scope="col" className="px-4 py-3">{t('athlete')}</th>
            <th scope="col" className="px-4 py-3 hidden md:table-cell">{t('box')}</th>
            <th scope="col" className="px-4 py-3 hidden md:table-cell">{t('time')}</th>
            <th scope="col" className="px-4 py-3 text-right">{t('points')}</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
              <td className="px-4 py-3 text-center font-bold">{athlete.position}</td>
              <td className="px-4 py-3 font-medium">{athlete.name}</td>
              <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{athlete.box}</td>
              <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{athlete.time}</td>
              <td className="px-4 py-3 text-right font-mono text-neon-green">{athlete.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
