"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import React, { useState } from "react";
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
type ContentType = {
  id: string;
  title: string;
  description: string;
};
const contentTypes: ContentType[] = [
  {
    id: "user",
    title: "User",
    description: "This is the User content type.",
  },
  {
    id: "webinar",
    title: "Webinar",
    description: "This is the Webinar content type.",
  },
];

export default function HomePage() {
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    name: "",
    description: "",
  });
  const [selectedContentType, setSelectedContentType] =
    useState<ContentType | null>(null);
  const router = useRouter();

  const handleContentTypeClick = (contentType: ContentType) => {
    setSelectedContentType(contentType);
    router.push(`#${contentType.id}`, undefined);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("subbmited collection");
  };
  return (
    <div className="md:flex">
      <div className="h-full md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 border-r border-gray-300">
        <div className="space-y-4 py-4 flex flex-col h-full text-white">
          <div className="px-3 py-2 flex-1">
            <h3 className="text-xxs text-center font-bold leading-1 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
              Content-Type Builder
            </h3>
            <div className="space-y-1">
              <div className="flex items-center flex-1 text-sm group flex p-3 w-full justify-start font-medium text-gray-400">
                Collection types
              </div>
              <ul className="list-disc pl-5 space-y-2">
                {contentTypes.map((contentType, index) => (
                  <li
                    key={index}
                    className="text-sm font-medium text-customBlue"
                  >
                    <button
                      onClick={() => handleContentTypeClick(contentType)}
                      className="text-customBlue hover:opacity-70 focus:outline-none"
                    >
                      {contentType.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
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
                        value={values.name}
                        onChangeInput={handleChange}
                        error={errors.name}
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
                    <DialogClose>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      id="addCollectionButton"
                      type="submit"
                      disabled={!isValid}
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
      {selectedContentType && (
        <div className="md:ml-72 mt-4">
          <h2>{selectedContentType.title}</h2>
          <p>{selectedContentType.description}</p>
        </div>
      )}
    </div>
  );
}
