import { useState, ChangeEvent } from "react";

export const useFormWithValidation = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: target.validationMessage });
    setIsValid(!!target.closest("form")?.checkValidity());
  };

  return {
    values,
    errors,
    isValid,
    handleChange,
    setValues,
  };
};
