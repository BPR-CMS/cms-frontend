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
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/models/User";
const CreateEntryPage = ({ params }: Params) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isRichTextFieldValid, setIsRichTextFieldValid] = useState(false);
  const [creator, setCreator] = useState<User>();
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({});
  const { toast } = useToast();
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [richTextFieldValues, setRichTextFieldValues] = useState({});
  const [richTextError, setRichTextError] = useState("");
  const [showRichTextErrorTooltip, setShowRichTextErrorTooltip] =
    useState(false);
  const [isFormValid, setIsFormValid] = useState(isValid);
  const [richTextFieldsValidity, setRichTextFieldsValidity] = useState({});

  const { contentType } = params;
  const hasRichText =
    collection &&
    collection.attributes.some((attr) => attr.contentType === "RICHTEXT");

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    if (contentType) {
      getCollectionByApiId(contentType)
        .then((data) => {
          setCollection(data);
          // Initializes form values with default values for attributes that have them
          const initialValues = {};
          data.attributes.forEach((attribute) => {
            if (attribute.defaultValue !== undefined) {
              initialValues[attribute.name] = attribute.defaultValue;
            }
          });
          setValues((prevValues) => ({ ...prevValues, ...initialValues }));
        })
        .catch((error) => {
          setError(error.message || "An error occurred");
        });
    }
  }, [contentType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    // Converting number fields from string to number
    const convertedValues = { ...values };
    collection.attributes.forEach((attribute) => {
      if (
        attribute.contentType === "NUMBER" &&
        convertedValues[attribute.name]
      ) {
        convertedValues[attribute.name] = Number(
          convertedValues[attribute.name]
        );
      }
    });

    // Combining regular form values and rich text field values
    const attributesPayload = {
      ...convertedValues,
      ...richTextFieldValues,
    };

    const payload = {
      attributes: attributesPayload,
    };

    if (!isFormValid) {
      toast({
        title: "Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await addPost(collection.id, payload);
      console.log("Post created:", response);
      console.log(payload);
      setCreator(user);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const validateRichTextField = (attributeId, content, isRequired) => {
    const valid = !isRequired || (content && content.trim() !== "");
    setRichTextFieldsValidity((prevState) => ({
      ...prevState,
      [attributeId]: valid,
    }));
  };

  useEffect(() => {
    // Checsk if any field (regular or rich text) is filled
    const isAnyFieldFilled =
      Object.keys(values).some((key) => values[key]) ||
      Object.values(richTextFieldValues).some(
        (value) => value && value.trim() !== ""
      );

    // Checks if every required field (regular and rich text) is valid
    const areAllRequiredFieldsValid =
      collection &&
      collection.attributes.every((attr) => {
        if (attr.required) {
          if (attr.contentType === "RICHTEXT") {
            // Checks validity of required rich text fields
            return richTextFieldsValidity[attr.attributeId];
          } else {
            // Checks validity of required regular fields
            return values[attr.name] && !errors[attr.name];
          }
        }
        return true;
      });

    // The form is valid if all required fields are valid and if at least one field is filled
    setIsFormValid(areAllRequiredFieldsValid && isAnyFieldFilled);
  }, [collection, values, errors, richTextFieldsValidity, richTextFieldValues]);

  return (
    <div className="md:flex">
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
            </div>
            <form
              onSubmit={handleSubmit}
              id="entry-form"
              className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
              noValidate
            >
              <div className="flex items-center space-x-2">
                <Button
                  className="ml-auto"
                  disabled={submitted || !isFormValid}
                >
                  Publish
                </Button>
              </div>
              {/* Dynamically creates form fields based on attributes */}
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
                            value={
                              values[attribute.name] ||
                              "" ||
                              attribute.defaultValue
                            }
                            onChangeInput={handleChange}
                            required={isRequired}
                            maxLength={attribute.maximumLength}
                            minLength={attribute.minimumLength}
                            minValue={attribute.minValue}
                            maxValue={attribute.maxValue}
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
                              value={
                                richTextFieldValues[attribute.name] ||
                                "" ||
                                attribute.defaultValue
                              }
                              onChange={(content) => {
                                setRichTextFieldValues({
                                  ...richTextFieldValues,
                                  [attribute.name]: content,
                                });
                                validateRichTextField(
                                  attribute.attributeId,
                                  content,
                                  attribute.required
                                );
                              }}
                            />
                          </div>
                        </div>
                        {richTextError && (
                          <button
                            className="mt-2 text-red-500 cursor-pointer relative p-1 border border-red-500 rounded hover:bg-red-100 focus:outline-none"
                            onClick={toggleRichTextErrorTooltip}
                          >
                            <FaExclamationCircle />
                            {showRichTextErrorTooltip && (
                              <div className="absolute left-full top-0 mt-0 ml-2 w-48 p-2 bg-white text-sm text-red-500 border border-red-500 rounded-md shadow-md z-10">
                                {richTextError}
                              </div>
                            )}
                          </button>
                        )}
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
                            value={
                              values[attribute.name] ||
                              "" ||
                              attribute.defaultValue
                            }
                            onChangeTextArea={handleChange}
                            required={attribute.required}
                            minValue={attribute.minValue}
                            maxValue={attribute.maxValue}
                            maxLength={attribute.maximumLength}
                            minLength={attribute.minimumLength}
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
                            value={
                              values[attribute.name] ||
                              "" ||
                              attribute.defaultValue
                            }
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
                <span>
                  {creator ? `${creator.firstName} ${creator.lastName}` : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEntryPage;
