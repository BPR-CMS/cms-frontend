import SettingsTabs from "./SettingsTabs";
type CheckboxStateValues = boolean | string;
type DetailedViewProps = {
  selectedField: any;
  values: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  numberFormat: string | undefined;
  setNumberFormat: React.Dispatch<React.SetStateAction<string | undefined>>;
  textType: string;
  setTextType: React.Dispatch<React.SetStateAction<string>>;
  checkboxStates: Record<string, CheckboxStateValues>;
  handleCheckboxChange: (name: string, checked: CheckboxStateValues) => void;
};

function DetailedView({
  selectedField,
  values,
  errors,
  handleChange,
  numberFormat,
  setNumberFormat,
  textType,
  setTextType,
  checkboxStates,
  handleCheckboxChange
}: DetailedViewProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 ">
        Add new {selectedField.label}
      </h1>
      <p className="text-gray-600 leading-relaxed">
        {selectedField.description}
      </p>

      <SettingsTabs
        selectedField={selectedField}
        values={values}
        errors={errors}
        handleChange={handleChange}
        numberFormat={numberFormat}
        setNumberFormat={setNumberFormat}
        textType={textType}
        setTextType={setTextType}
        checkboxStates={checkboxStates}
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
}

export default DetailedView;
