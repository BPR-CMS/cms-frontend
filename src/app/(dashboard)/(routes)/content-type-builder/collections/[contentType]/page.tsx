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
import { Field, FieldType } from "@/models/Field";
import { Button } from "@/components/ui/Button";
import { fields } from "@/utils/constants";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import DetailedView from "@/components/DetailedView";
import GridView from "@/components/GridView";
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
export default function ContentTypePage({ params }: Params) {
  const { contentType } = params;

  const { values, errors, isValid, handleChange } = useFormWithValidation({
    name: "",
  });
  const [collections, setCollections] = useState<Collection[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(
    null
  );
  const [numberFormat, setNumberFormat] = useState<string | undefined>(
    undefined
  );

  const [fieldsData, setFieldsData] = useState<Field[]>([]);
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

  function getData(): Field[] {
    return fieldsData;
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState("grid"); // 'grid' or 'detail'
  const [selectedField, setSelectedField] = useState(null);

  const handleCardClick = useCallback((field: any) => {
    setSelectedField(field);
    setCurrentView("detail");
    setSelectedFieldType(field.label);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFieldType) {
      const newField: Field = {
        name: values.name,
        type: selectedFieldType,
      };

      setFieldsData((prevFields) => [...prevFields, newField]);

      setIsDialogOpen(false);
    } else {
      console.log("error");
      // Handle error, maybe show a toast saying "Please select a field type"
    }
  };

  const selectedContentType = collections.find(
    (item) => item.name === contentType
  );
  if (!selectedContentType) {
    return <div>Content type not found.</div>;
  }
  const data = getData();

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
                              selectedField={selectedField}
                              values={values}
                              errors={errors}
                              handleChange={handleChange}
                              numberFormat={numberFormat}
                              setNumberFormat={setNumberFormat}
                            />
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
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
