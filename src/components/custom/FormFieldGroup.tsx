import React from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

interface FormFieldGroupProps {
  label: string;
  name: string;
  id: string;
  type: string;
  required?: boolean;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  label,
  name,
  id,
  type,
  required,
}) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">
        <Input type={type} name={name} id={id} required={required} />
      </div>
    </>
  );
};

export default FormFieldGroup;
