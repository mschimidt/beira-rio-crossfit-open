const CATEGORIES = [
  "Geral",
  "Masculino RX",
  "Feminino RX",
  "Masculino Scale",
  "Feminino Scale",
];

const CategoryFilters = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-2 text-xs md:px-4 md:text-sm font-semibold rounded-full transition-all duration-200 transform
              ${
                activeCategory === category
                  ? "bg-neon-green text-dark-blue shadow-lg shadow-neon-green/30 scale-105"
                  : "bg-gray-700/50 hover:bg-gray-600/70 text-white"
              }
            `}
          >
            {category.replace(" Intermediário", " Int")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
