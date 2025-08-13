interface SwitchProps {
  value: boolean;
  onChange: () => void;
}

const SwitchProps = ({ value, onChange }: SwitchProps) => {
  const toggleClass = "transform translate-x-3";
  return (
    <div
      onClick={onChange}
      className={`w-9 md:h-5 h-5 flex items-center
     ${
       value === true ? "bg-primary" : "bg-gray-100"
     } rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out`}
    >
      <div
        className={`${value === true ? "bg-gray-200" : "bg-white"}
      md:w-4 md:h-4 h-4 w-4 rounded-full shadow-md transition-all duration-300 ease-in-out transform${
        value ? toggleClass : null
      }`}
      ></div>
    </div>
  );
};

export default SwitchProps;
