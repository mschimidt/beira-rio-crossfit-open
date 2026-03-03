import { useState, useEffect } from "react";
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
    if (activeCategory === "Geral") {
      setFilteredAthletes(allAthletes);
    } else {
      const filtered = allAthletes.filter(
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
    </div>
  );
};

export default HomePage;
