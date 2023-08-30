"use client";
type Params = {
  params: {
    contentType: string;
  };
};

import { Collection } from "@/models/Collection";
import { PlusIcon, Files, ArrowLeftIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getCollections } from "@/services/CollectionService";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Field } from "@/models/Field";
import { Button } from "@/components/ui/Button";
import { fields } from "@/utils/constants";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { DialogClose } from "@radix-ui/react-dialog";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
export const columns: ColumnDef<Field>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];
export default function ContentTypePage({ params: { contentType } }: Params) {
  const [collections, setCollections] = useState<Collection[]>([]);

  const { values, errors, handleChange } = useFormWithValidation({
    name: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const fetchCollections = async () => {
    try {
      const allCollections = await getCollections();
      setCollections(allCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch collections.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  async function getData(): Promise<Field[]> {
    // Fetch data
    return [
      {
        name: "title",
        type: "String",
      },
      // ...
    ];
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState("grid"); // 'grid' or 'detail'
  const [selectedField, setSelectedField] = useState(null);

  const handleCardClick = (field: any) => {
    setSelectedField(field);
    setCurrentView("detail");
    // router.push(field.href); 
  };

  const selectedContentType = collections.find(
    (item) => item.name === contentType
  );
  if (!selectedContentType) {
    return <div>Content type not found.</div>;
  }
  const data = getData();

  function GridView({ fields, onCardClick }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <Card
            onClick={() => onCardClick(field)}
            key={field.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-center space-x-2">
                <field.icon className="w-8 h-8" />
                <CardTitle>{field.label}</CardTitle>
              </div>
              <CardDescription>{field.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  function DetailedView() {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-800 ">
          Add new {selectedField.label}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {selectedField.description}
        </p>

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
      </>
    );
  }

  return (
    <>
      <h2>{selectedContentType.name}</h2>
      <p>{selectedContentType.description}</p>
      <div className="pl-56 pr-56">
        <div className="mt-6">
          <div className="container mx-auto py-10">
            <DataTable
              columns={columns}
              data={data}
              emptyStateComponent={
                <div className="flex flex-col items-center space-y-4">
                  <div aria-hidden="true">
                    <Files size={60} color="#0075ff" />
                  </div>
                  <p>Add your first field to this Collection-Type</p>

                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center space-x-2"
                        aria-disabled="false"
                        type="button"
                      >
                        <PlusIcon />
                        <span>Add new field</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-xl sm:max-w-3xl">
                      <DialogHeader className="flex justify-between">
                        {currentView === "grid" ? (
                          <>
                            <DialogTitle>
                              {selectedContentType.name}
                            </DialogTitle>
                            <DialogDescription>
                              Select a field for your collection type
                            </DialogDescription>
                          </>
                        ) : (
                          <div className="flex items-center">
                            <button
                              className="text-sm text-blue-600 hover:underline mr-2"
                              onClick={() => {
                                setCurrentView("grid");
                                setSelectedField(null);
                              }}
                            >
                              <ArrowLeftIcon />
                            </button>
                            <DialogTitle>
                              {selectedContentType.name}
                            </DialogTitle>
                          </div>
                        )}
                      </DialogHeader>

                      {currentView === "grid" ? (
                        <GridView
                          fields={fields}
                          onCardClick={handleCardClick}
                        />
                      ) : (
                        <DetailedView field={selectedField} />
                      )}

                      <DialogFooter style={{ paddingTop: "48px" }}>
                        <DialogClose>
                          <Button
                            variant="outline"
                            type="button"
                            id="cancelButton"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
