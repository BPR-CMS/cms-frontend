"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import { Button } from "@/components/ui/Button";
import { getCollectionByApiId } from "@/services/CollectionService";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getInputType } from "@/lib/utils";
const CreateEntryPage = ({ params }: Params) => {
  const router = useRouter();

  const [collection, setCollection] = useState(null);
  const [error, setError] = useState("");
  const { contentType } = params;

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    if (contentType) {
      getCollectionByApiId(contentType)
        .then((data) => {
          setCollection(data);
        })
        .catch((error) => {
          setError(error.message || "An error occurred");
        });
    }
  }, [contentType]);

  if (collection) {
    console.log(collection);
  }

  return (
    <div className="md:flex">
      <ContentBuilderSideBar title="Content" />
      <div className="flex-grow md:ml-72 mt-4">
        <div className="flex flex-col md:flex-row p-8">
          {/* Form Section */}
          <div className="flex-grow">
            <div className="mb-4">
              <Button
                variant="link"
                onClick={handleBackClick}
                className="text-blue-600 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
              >
                ← Back
              </Button>
            </div>
            <div className="flex justify-between items-start mb-6">
              {collection && (
                <div>
                  <h1 className="text-2xl font-bold">Create an entry</h1>
                  <p className="text-sm text-gray-600">
                    API ID: {collection.name}
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Publish
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Save
                </button>
              </div>
            </div>

            {/* Dynamically create form fields based on attributes */}
            {collection &&
              collection.attributes.map((attribute) => (
                <FormGrid>
                  <div className="sm:col-span-3">
                    {/* Replace with your actual form field component */}
                    <FormFieldGroup
                      label={attribute.name}
                      name={attribute.name}
                      id={attribute.name}
                      type={getInputType(attribute.contentType)}
                      // value={formData[attribute.name]}
                      // onChange={handleInputChange}
                      required={attribute.required}
                    />
                  </div>
                </FormGrid>
              ))}
          </div>

          {/* Sidebar Section */}
          <div className="  p-8 border-l self-center">
            <div className="flex justify-between items-center mb-6"></div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900">
                  INFORMATION
                </h3>
              </div>
              <div className="text-xs text-gray-600">
                <p>Created by</p>
                <span>-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEntryPage;
