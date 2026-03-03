const Input = ({ id, label, type = "text", ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-gray-400 block mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full p-2 text-gray-100 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
        {...props}
      />
    </div>
  );
};

export default Input;
