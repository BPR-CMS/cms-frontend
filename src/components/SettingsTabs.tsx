import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/Select";
import FormFieldGroup from "./custom/FormFieldGroup";
type SettingsTabsProps = {
    selectedField: any; 
    values: any; 
    errors: any; 
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  const SettingsTabs: React.FC<SettingsTabsProps> = ({
    selectedField,
    values,
    errors,
    handleChange,
  }) => {
    return (
      <Tabs defaultValue="account" className="w-[400px]">
     <TabsList>
            <TabsTrigger value="basic">Basic settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced settings</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <div className="col-span-full">
              <FormFieldGroup
                label="Name"
                name="name"
                id="name"
                type="text"
                required
                value={values.name}
                onChangeInput={handleChange}
                error={errors.name}
              />
            </div>

            {selectedField && selectedField.label === "Text" && (
              <div>
                <Label>Type</Label>
                <RadioGroup defaultValue="short-text">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short-text" id="short-texte" />
                    <Label htmlFor="short-text">Short text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long-text" id="long-text" />
                    <Label htmlFor="long-text">Long text</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            {selectedField && selectedField.label === "Number" && (
              <div>
                <Label>Number format</Label>
                <Select>
                  <SelectTrigger className="w-[380px]">
                    <SelectValue placeholder="Choose here" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="integer">integer (ex: 10)</SelectItem>
                    <SelectItem value="bigInteger">
                      big integer (ex: 123456789)
                    </SelectItem>
                    <SelectItem value="decimal">decimal (ex: 2.22)</SelectItem>
                    <SelectItem value="float">
                      float (ex: 3.33333333)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedField && selectedField.label === "Date" && (
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger className="w-[380px]">
                    <SelectValue placeholder="Choose here" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">date (ex: 01/01/2023)</SelectItem>
                    <SelectItem value="dateTime">
                      datetime (ex: 01/01/2023 00:00 AM)
                    </SelectItem>
                    <SelectItem value="time">time (ex: 00:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedField && selectedField.label === "Media" && (
              <div>
                <Label>Type</Label>
                <RadioGroup defaultValue="multiple-media">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="multiple-media"
                      id="multiple-media"
                    />
                    <Label htmlFor="multiple-media">Multiple Media</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single-media" id="single-media" />
                    <Label htmlFor="single-media">Single Media</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced">
            <div className="flex items-center space-x-2">
              <Checkbox id="required" />
              <Label
                htmlFor="required"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Required
              </Label>
            </div>

            {selectedField && selectedField.label === "Text" && (
              <div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Default value"
                    name="defaultValue"
                    id="defaultValue"
                    type="text"
                    required
                    value={values.defaultValue}
                    onChangeInput={handleChange}
                    error={errors.defaultValue}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="unique" />
                  <Label
                    htmlFor="unique"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Unique
                  </Label>
                </div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Maximum Length"
                    name="maximumLength"
                    id="maximumLength"
                    type="number"
                    value={values.maximumLength}
                    onChangeInput={handleChange}
                    error={errors.maximumLength}
                  />
                </div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Minimum Length"
                    name="minimumLength"
                    id="minimumLength"
                    type="number"
                    value={values.minimumLength}
                    onChangeInput={handleChange}
                    error={errors.minimumLength}
                  />
                </div>
              </div>
            )}
            {selectedField && selectedField.label === "Rich Text" && (
              <div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Default value"
                    name="defaultValue"
                    id="defaultValue"
                    type="text"
                    required
                    value={values.defaultValue}
                    onChangeInput={handleChange}
                    error={errors.defaultValue}
                  />
                </div>

                <div className="col-span-full">
                  <FormFieldGroup
                    label="Maximum Length"
                    name="maximumLength"
                    id="maximumLength"
                    type="number"
                    value={values.maximumLength}
                    onChangeInput={handleChange}
                    error={errors.maximumLength}
                  />
                </div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Minimum Length"
                    name="minimumLength"
                    id="minimumLength"
                    type="number"
                    value={values.minimumLength}
                    onChangeInput={handleChange}
                    error={errors.minimumLength}
                  />
                </div>
              </div>
            )}

            {selectedField && selectedField.label === "Number" && (
              <div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Default value"
                    name="defaultValue"
                    id="defaultValue"
                    type="number"
                    required
                    value={values.defaultValue}
                    onChangeInput={handleChange}
                    error={errors.defaultValue}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="unique" />
                  <Label
                    htmlFor="unique"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Unique
                  </Label>
                </div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Maximum Value"
                    name="maximumValue"
                    id="maximumValue"
                    type="number"
                    value={values.maximumValue}
                    onChangeInput={handleChange}
                    error={errors.maximumValue}
                  />
                </div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Minimum Value"
                    name="minimumValue"
                    id="minimumValue"
                    type="number"
                    value={values.minimumValue}
                    onChangeInput={handleChange}
                    error={errors.minimumValue}
                  />
                </div>
              </div>
            )}

            {selectedField && selectedField.label === "Date" && (
              <div>
                <div className="col-span-full">
                  <FormFieldGroup
                    label="Default value"
                    name="defaultValue"
                    id="defaultValue"
                    type="date"
                    required
                    value={values.defaultValue}
                    onChangeInput={handleChange}
                    error={errors.defaultValue}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="unique" />
                  <Label
                    htmlFor="unique"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Unique
                  </Label>
                </div>
              </div>
            )}
          </TabsContent>
      </Tabs>
    );
  };
  
  export default SettingsTabs;