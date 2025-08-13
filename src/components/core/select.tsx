import React, { useState } from "react";

interface SelectProps {
  options: Array<{ value: string; label: string }>;
  onChange: (selectedValue: string) => void;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({ options, onChange, defaultValue }) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue
  );

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <select
      value={selectedValue || ""}
      onChange={handleSelectChange}

      // placeholder="Select your region"
      className="drop-no-outline bg-transparent w-full cursor-pointer !outline-none focus:!outline-none
       focus:!border-none !border-none text-xs leading-[18px]"

    >
      {options.map((option) => (
        <option
          className="text-xs leading-[18px]"
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
