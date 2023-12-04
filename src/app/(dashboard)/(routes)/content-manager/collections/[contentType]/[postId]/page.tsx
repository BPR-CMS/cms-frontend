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
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { getStepValue } from "@/lib/utils";
import { FaExclamationCircle } from "react-icons/fa";
import { addPost } from "@/services/PostService";
const PostDetailsPage = ({ params }: Params) => {

  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({});
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState("");

  const { contentType, postId } = params;



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
                // onClick={handleBackClick}
                className="text-blue-600 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
              >
                ← Back
              </Button>
            </div>
            <div className="flex justify-between items-start mb-6">
              {collection && (
                <div>
                  <h1 className="text-2xl font-bold">{collection.name}</h1>
                  <p className="text-sm text-gray-600">
                    API ID: {collection.name}
                  </p>
                </div>
              )}
            </div>
            <form
            //   onSubmit={handleSubmit}
              id="entry-form"
              className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
              noValidate
            >
              <div className="flex items-center space-x-2">
                <Button
                //   disabled={
                //     submitted ||
                //     !isValid ||
                //     (hasRichText && !isRichTextFieldValid)
                //   }
                >
                  Publish
                </Button>
              </div>
              {/* Dynamically create form fields based on attributes */}
              {collection &&
                collection.attributes.map((attribute) => {
                  const useTextarea = attribute.textType === "LONG";
                  const stepValue = getStepValue(attribute.formatType);
                  const isRequired = attribute.required;

                  const label = `${attribute.name}${isRequired ? " *" : ""}`;

                  if (attribute.contentType === "DATE") {
                    const dateInputType = getInputType(
                      attribute.contentType,
                      attribute.dateType
                    );
                    return (
                      <FormGrid>
                        <div key={attribute.name} className="sm:col-span-3">
                          <FormFieldGroup
                            label={label}
                            name={attribute.name}
                            id={attribute.name}
                            type={dateInputType}
                            value={values[attribute.name] || ""}
                            onChangeInput={handleChange}
                            required={attribute.required}
                          />
                        </div>
                      </FormGrid>
                    );
                  }
                  if (attribute.contentType === "RICHTEXT") {
                    return (
                      <div
                        key={attribute.attributeId}
                        className="sm:col-span-3 mt-4"
                      >
                        <label>{label}</label>
                        <div className="p-2 ">
                          <div className="max-w-4xl bg-white">
                            {" "}
                            <ReactQuill
                              theme="snow"
                            //   value={richTextFieldValues[attribute.name] || ""}
                            //   onChange={(content) =>
                            //     handleRichTextChange(attribute.name, content)
                            //   }
                            />
                          </div>
                        </div>
                 
                      </div>
                    );
                  } else if (useTextarea) {
                    return (
                      <FormGrid>
                        <div key={attribute.name} className="sm:col-span-3">
                          <FormFieldGroup
                            label={label}
                            name={attribute.name}
                            id={attribute.name}
                            useTextarea={true}
                            type={getInputType(attribute.contentType)}
                            value={values[attribute.name] || ""}
                            onChangeTextArea={handleChange}
                            required={attribute.required}
                            minLength={attribute.minimumLength}
                            maxLength={attribute.maximumLength}
                            error={errors[attribute.name] || ""}
                          />
                        </div>
                      </FormGrid>
                    );
                  } else {
                    return (
                      <FormGrid>
                        <div key={attribute.name} className="sm:col-span-3">
                          <FormFieldGroup
                            label={label}
                            name={attribute.name}
                            id={attribute.name}
                            type={getInputType(attribute.contentType)}
                            value={values[attribute.name] || ""}
                            onChangeInput={handleChange}
                            required={attribute.required}
                            minLength={attribute.minimumLength}
                            maxLength={attribute.maximumLength}
                            error={errors[attribute.name] || ""}
                            step={stepValue}
                          />
                        </div>
                      </FormGrid>
                    );
                  }
                })}
            </form>
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

export default PostDetailsPage;