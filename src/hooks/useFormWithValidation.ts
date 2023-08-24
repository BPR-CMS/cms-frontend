import { useState, ChangeEvent } from "react";

export const useFormWithValidation = (
  initialValues: Record<string, string>
) => {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
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
