import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CategoryFilters from "../components/leaderboard/CategoryFilters";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import { getAthletes } from "../firebase/athleteService";

const HomePage = () => {
  const { t } = useTranslation();
  const [allAthletes, setAllAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Geral");

  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      const athletes = await getAthletes();
      setAllAthletes(athletes);
      setLoading(false);
    };

    fetchAthletes();
  }, []);

  useEffect(() => {
    const validAthletes = allAthletes.filter(
      (athlete) =>
        athlete.category !== "Masculino Intermediário" &&
        athlete.category !== "Feminino Intermediário"
    );

    if (activeCategory === "Geral") {
      setFilteredAthletes(validAthletes);
    } else {
      const filtered = validAthletes.filter(
        (athlete) => athlete.category === activeCategory
      );
      setFilteredAthletes(filtered);
    }
  }, [activeCategory, allAthletes]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center text-white uppercase tracking-widest">
        {t('leaderboard')}
      </h2>
      <CategoryFilters
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <LeaderboardTable athletes={filteredAthletes} loading={loading} />

      <Link
        to="/login"
        className="fixed bottom-6 right-6 bg-neon-green text-dark-blue font-bold py-3 px-4 rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        title={t('adminArea')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Link>
    </div>
  );
};

export default HomePage;
