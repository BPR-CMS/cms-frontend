import React from "react";
import { useState } from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { FaExclamationCircle } from "react-icons/fa";

interface FormFieldGroupProps {
  label: string;
  name: string;
  id: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  label,
  name,
  id,
  type,
  required,
  value,
  onChange,
  error,
  minLength,
  maxLength,
  pattern,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowTooltip(!showTooltip);
  };
  return (
    <>
      <Label htmlFor={id}>{label}</Label>

      <Input
        type={type}
        name={name}
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
      />

      {error && (
        <button
          id="error-button"
          className="mt-2 text-red-500 cursor-pointer relative p-1 border border-red-500 rounded hover:bg-red-100 focus:outline-none"
          onClick={handleIconClick}
        >
          <FaExclamationCircle />
          {showTooltip && (
            <div
              id="error-tooltip"
              className=" absolute left-full top-0 mt-0 ml-2 w-48 p-2 bg-white text-sm text-red-500 border border-red-500 rounded-md shadow-md z-10"
            >
              {error}
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default FormFieldGroup;
