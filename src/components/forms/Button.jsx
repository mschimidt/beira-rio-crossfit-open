const Button = ({ children, type = "button", ...props }) => {
  return (
    <button
      type={type}
      className="w-full px-4 py-2 font-bold text-dark-blue bg-neon-green rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-blue focus:ring-neon-green transition-transform transform hover:scale-105"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
