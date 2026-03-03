import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => changeLanguage('pt')}
        className={`px-2 py-1 text-xs rounded-md ${i18n.language === 'pt' ? 'bg-neon-green text-dark-blue' : 'bg-gray-700'}`}
      >
        PT
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-xs rounded-md ${i18n.language === 'en' ? 'bg-neon-green text-dark-blue' : 'bg-gray-700'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
