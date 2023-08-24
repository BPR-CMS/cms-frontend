"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import React, { useRef, useState, useEffect } from "react";
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
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { Collection } from "@/models/Collection";
import { addCollection, getCollections } from "@/services/CollectionService";
import { AxiosError } from "axios";
import { getErrors } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function CollectionsPage() {
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    name: "",
    description: "",
  });

  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [selectedContentType, setSelectedContentType] =
    useState<Collection | null>(null);
  const router = useRouter();
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleContentTypeClick = (contentType: Collection) => {
    setSelectedContentType(contentType);
    router.push(`#${contentType.name}`, undefined);
  };
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const fetchCollections = async () => {
    try {
      const allCollections = await getCollections();

      if (allCollections.length === 0) {
        setCollections([]);

        return;
      }

      setCollections(allCollections);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching collections:", error.message);

        if (error.message !== "No collections found") {
          toast({
            title: "Error",
            description: "Failed to fetch collections.",
            variant: "destructive",
          });
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const createCollection = async (collectionData: Collection) => {
    // Check if collection name already exists
    const doesNameExist = collections.some(
      (collection) => collection.name === collectionData.name
    );
    if (doesNameExist) {
      toast({
        title: "Error",
        description: "Collection name already exists!",
        variant: "destructive",
      });
      setSubmitted(false); // Reset the submitted state to allow another attempt
      return; // Exit the function early, preventing the API call
    }

    try {
      const newCollection = await addCollection(collectionData);
      // Add the new collection to the state
      setCollections((prevCollections) => [...prevCollections, newCollection]);

      toast({
        title: "Success",
        description: "You have successfully added a new collection.",
        variant: "success",
      });

      closeDialogButtonRef.current?.click();
      if (newCollection.name) {
        router.push(`/content-type-builder/collections/${newCollection.name}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);
      console.error("Error adding a new collection:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setSubmitted(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const collectionData: Collection = {
      name: values.name,
      description: values.description,
    };
    setSubmitted(true);
    createCollection(collectionData);
  };

  const resetForm = () => {
    values.name = "";
    values.description = "";
    errors.name = "";
    errors.description = "";
  };

  useEffect(() => {
    if (!isDialogOpen) {
      resetForm();
    }
  }, [isDialogOpen]);

  return (
    <div className="md:flex">
      <div className="h-full md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 border-r border-gray-300">
        <div className="space-y-4 py-4 flex flex-col h-full text-white">
          <div className="px-3 py-2 flex-1">
            <h3 className="text-xxs  font-bold leading-1 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
              Content-Type Builder
            </h3>
            <div className="space-y-1">
              <div className="flex items-center flex-1 text-sm group flex p-3 w-full justify-start font-medium text-gray-400">
                Collection types
              </div>
              <ul className="list-disc pl-5 space-y-2">
                {collections.length > 0 ? (
                  collections.map((contentType, index) => (
                    <li
                      key={index}
                      className="text-sm font-medium text-customBlue"
                    >
                      <button
                        onClick={() => handleContentTypeClick(contentType)}
                        className="text-customBlue hover:opacity-70 focus:outline-none"
                      >
                        {contentType.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">
                    No collections available.
                  </li>
                )}
              </ul>
            </div>

            <Dialog
              open={isDialogOpen}
              onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
            >
              <DialogTrigger asChild>
                <Button
                  id="createNewCollectionButton"
                  style={{
                    backgroundColor: "transparent",
                    color: "#0075FF",
                    paddingLeft: "0",
                  }}
                >
                  &#43; Create new collection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add collection</DialogTitle>
                  <DialogDescription>
                    Create a new collection type. Click save when you are done.
                  </DialogDescription>
                </DialogHeader>
                <form id="collection-form" onSubmit={handleSubmit} noValidate>
                  <FormGrid>
                    <div className="col-span-full">
                      <FormFieldGroup
                        label="Name"
                        name="name"
                        id="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={15}
                        value={values.name}
                        onChangeInput={handleChange}
                        error={errors.name}
                        pattern="^[a-zA-Z\s]+$"
                      />
                    </div>

                    <div className="col-span-full">
                      <FormFieldGroup
                        useTextarea
                        label="Description"
                        name="description"
                        id="description"
                        required
                        value={values.description}
                        onChangeTextArea={handleChange}
                        error={errors.description}
                      />
                    </div>
                  </FormGrid>

                  <DialogFooter style={{ paddingTop: "48px" }}>
                    <DialogClose ref={closeDialogButtonRef}>
                      <Button variant="outline" type="button" id="cancelButton">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      id="addCollectionButton"
                      type="submit"
                      disabled={submitted || !isValid}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {!selectedContentType && (
        <div className="md:ml-72 mt-4">
          <div className="flex justify-center items-center h-full p-8">
            <div className="flex justify-between items-center w-full">
              <div className="pr-8 w-1/2">
                <h1 className="text-xxs  font-bold leading-1 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
                  First, design the content model
                </h1>
                <p className="mb-6 mt-6">
                  The content model is a collection of all different types of
                  content for a project. It is a schema that editors repeatably
                  use and fill with content.
                </p>
                <Button onClick={handleOpenDialog}>
                  Design your content model
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedContentType && (
        <div className="md:ml-72 mt-4">
          <h2>{selectedContentType.name}</h2>
          <p>{selectedContentType.description}</p>
        </div>
      )}
    </div>
  );
}
