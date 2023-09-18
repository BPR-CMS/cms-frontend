"use client";
type Params = {
  params: {
    contentType: string;
  };
};

import { Collection } from "@/models/Collection";
import { PlusIcon, Files, ArrowLeftIcon } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { getCollections } from "@/services/CollectionService";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Attribute, AttributeType } from "@/models/Attribute";
import { Button } from "@/components/ui/Button";
import { fields } from "@/utils/constants";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { addAttributesToCollection } from "@/services/ContentModelService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import DetailedView from "@/components/DetailedView";
import GridView from "@/components/GridView";
import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";
export const columns: ColumnDef<Attribute>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contentType",
    header: "Type",
  },
];
export default function ContentTypePage({ params }: Params) {
  const { contentType } = params;
  type CheckboxStateValues = boolean | string;
  const [checkboxStates, setCheckboxStates] = useState<
    Record<string, CheckboxStateValues>
  >({});

  function handleCheckboxChange(name: string, checked: CheckboxStateValues) {
    console.log(name, checked);
    setCheckboxStates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  }
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({
      name: "",
      minimumLength: "",
      maximumLength: "",
      minimumValue: "",
      maximumValue: "",
      defaultValue: "",
    });
  const [collections, setCollections] = useState<Collection[]>([]);

  const [selectedFieldType, setSelectedFieldType] =
    useState<AttributeType | null>(null);
  const [numberFormat, setNumberFormat] = useState<string>("INTEGER");
  const [dateType, setDateType] = useState<string>("DATE");

  const [fieldsData, setFieldsData] = useState<Attribute[]>([]);
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState("grid"); // 'grid' or 'detail'
  const [selectedField, setSelectedField] = useState(null);
  const [textType, setTextType] = useState<string>("SHORT");
  const [mediaType, setMediaType] = useState<string>("SINGLE");
  const handleCardClick = useCallback((field: any) => {
    setSelectedField(field);
    setCurrentView("detail");
    setSelectedFieldType(field.label.toUpperCase());
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFieldType) {
      const newField: Attribute = {
        name: values.name,
        textType: textType,
        mediaType: mediaType,
        dateType: dateType,
        contentType: selectedFieldType,
        formatType: numberFormat,
        required: checkboxStates.required || false,
        unique: checkboxStates.unique || false,
        minimumLength: values.minimumLength,
        maximumLength: values.maximumLength,
        minimumValue: values.minimumValue,
        maximumValue: values.maximumValue,
        defaultValue: values.defaultValue,
      };

      try {
        await addAttributesToCollection(selectedContentType.id, newField);
        console.log(newField);
        setFieldsData((prevFields) => [...prevFields, newField]);
        setCollections((prevCollections) => {
          return prevCollections.map((collection) => {
            if (collection.id === selectedContentType.id) {
              return {
                ...collection,
                attributes: [...collection.attributes, newField],
              };
            }
            return collection;
          });
        });

        setIsDialogOpen(false);

        toast({
          title: "Success",
          description: "Field added successfully.",
          variant: "success",
        });
      } catch (error) {
        console.error("Error adding new field:", error);

        toast({
          title: "Error",
          description: "Failed to add new field.",
          variant: "destructive",
        });
      }
    } else {
      console.log("error");
      toast({
        title: "Error",
        description: "Please select a field type.",
        variant: "destructive",
      });
    }
  };

  const selectedContentType = collections.find(
    (item) => item.name === contentType
  );
  if (!selectedContentType) {
    return <div>Content type not found.</div>;
  }

  const attributes: Attribute[] = selectedContentType
    ? selectedContentType.attributes
    : [];

  function resetDialog() {
    setCurrentView("grid");
    setSelectedField(null);
    setSelectedFieldType(null);
    setValues({
      name: "",
      minimumLength: "",
      maximumLength: "",
      minimumValue: "",
      maximumValue: "",
      defaultValue: "",
    });
    setCheckboxStates({});
    setNumberFormat("INTEGER");
    setDateType("DATE");
  }

  return (
    <>
      <div className="md:flex">
        <ContentBuilderSideBar />
        <div className="flex-grow md:ml-72 mt-4">
          <h2>{selectedContentType.name}</h2>
          <p>{selectedContentType.description}</p>
          <div className="pl-56 pr-56">
            <div className="mt-6">
              <div className="container mx-auto py-10">
                {/* Data Table */}
                <DataTable
                  columns={columns}
                  data={attributes}
                  emptyStateComponent={
                    <div className="flex flex-col items-center space-y-4">
                      <div aria-hidden="true">
                        <Files size={60} color="#0075ff" />
                      </div>
                      <p>Add your first field to this Collection-Type</p>
                      {/* Only display button if attributes are empty */}
                      {attributes.length === 0 && (
                        <Button
                          className="flex items-center space-x-2 mt-4"
                          aria-disabled="false"
                          type="button"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <PlusIcon />
                          <span>Add new field</span>
                        </Button>
                      )}
                    </div>
                  }
                />
                {/* Show Add New Field Button if attributes aren't empty */}
                {attributes.length > 0 && (
                  <Button
                    className="flex items-center space-x-2 mt-4"
                    aria-disabled="false"
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <PlusIcon />
                    <span>Add new field</span>
                  </Button>
                )}

                <Dialog
                  open={isDialogOpen}
                  onOpenChange={() => {
                    if (isDialogOpen) {
                      resetDialog();
                    }
                    setIsDialogOpen(!isDialogOpen);
                  }}
                >
                  <DialogContent className="w-full max-w-xl sm:max-w-3xl">
                    <form onSubmit={handleSubmit} noValidate>
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
                                setValues({});
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
                        <>
                          <DetailedView
                            textType={textType}
                            setTextType={setTextType}
                            selectedField={selectedField}
                            values={values}
                            errors={errors}
                            handleChange={handleChange}
                            numberFormat={numberFormat}
                            setNumberFormat={setNumberFormat}
                            dateType={dateType}
                            setDateType={setDateType}
                            mediaType={mediaType}
                            setMediaType={setMediaType}
                            checkboxStates={checkboxStates}
                            handleCheckboxChange={handleCheckboxChange}
                          />
                          <DialogFooter>
                            <DialogClose>
                              <Button
                                variant="outline"
                                type="button"
                                id="cancelButton"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              id="finishButton"
                              type="submit"
                              disabled={!isValid}
                            >
                              Finish
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
