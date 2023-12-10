import { useState, ChangeEvent } from "react";
type FormValues = {
  [key: string]: string; // Or be more specific about the value type if possible
};

export const useFormWithValidation = <T extends FormValues>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
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
    setErrors,
    setIsValid
  };
};
