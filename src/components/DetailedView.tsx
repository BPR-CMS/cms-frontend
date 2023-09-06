import SettingsTabs from "./SettingsTabs";

type DetailedViewProps = {
  selectedField: any;
  values: Record<string, string>;
  errors: Record<string, string>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  numberFormat: string | undefined;
  setNumberFormat: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function DetailedView({
  selectedField,
  values,
  errors,
  handleChange,
  numberFormat,
  setNumberFormat,
}: DetailedViewProps) {
  return (
    <>
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
      />
    </>
  );
}

export default DetailedView;
