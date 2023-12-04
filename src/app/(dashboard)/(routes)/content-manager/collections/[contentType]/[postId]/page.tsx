"use client";
import React, { useState, useEffect } from "react";
import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import { Button } from "@/components/ui/Button";
import { getCollectionByApiId } from "@/services/CollectionService";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getInputType } from "@/lib/utils";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { getStepValue } from "@/lib/utils";
import { getPostById } from "@/services/PostService";
import { Post } from "@/models/Post";
import { getUserById } from "@/services/UserService";
import { User } from "@/models/User";
import { Attribute } from "@/models/Attribute";
const PostDetailsPage = ({ params }: Params) => {
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({});
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState("");
  const { contentType, postId } = params;
  const [post, setPost] = useState<Post>();
  const [user, setUser] = useState<User>();

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

  useEffect(() => {
    if (postId && collection) {
      getPostById(postId)
        .then((data) => {
          if (data.userId) {
            getUserById(data.userId)
              .then((userData) => {
                setUser(userData);
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
              });
          }
          // Merges content types from the collection into post attributes
          const attributesArray = Object.keys(data.attributes).map((key) => {
            const attributeFromCollection =
              collection.attributes.find((attr) => attr.name === key) || {};
            return {
              name: key,
              value: data.attributes[key],
              contentType: attributeFromCollection.contentType,
            };
          });

          setPost({ ...data, attributes: attributesArray });
        })
        .catch((error) => {
          setError(
            error.message || "An error occurred while fetching the post"
          );
        });
    }
  }, [postId, collection]);

  const renderFormField = (attribute: Attribute) => {
    const useTextarea = attribute.textType === "LONG";
    const stepValue = getStepValue(attribute.formatType);
    const isRequired = attribute.required;
    const dateInputType = getInputType(
      attribute.contentType,
      attribute.dateType
    );

    const label = `${attribute.name}${isRequired ? " *" : ""}`;
    console.log("Rendering field for:", attribute);
    switch (attribute.contentType) {
      case "TEXT":
        console.log("is text");
        if (useTextarea)
          return (
            <FormGrid>
              <div key={attribute.name} className="sm:col-span-3">
                <FormFieldGroup
                  label={label}
                  name={attribute.name}
                  id={attribute.name}
                  useTextarea={true}
                  type={getInputType(attribute.contentType)}
                  value={attribute.value}
                  onChangeTextArea={handleChange}
                  required={attribute.required}
                  minLength={attribute.minimumLength}
                  maxLength={attribute.maximumLength}
                  error={errors[attribute.name] || ""}
                />
              </div>
            </FormGrid>
          );

      case "NUMBER":
        console.log(attribute.value);
        return (
          <FormGrid>
            <div key={attribute.name} className="sm:col-span-3">
              <FormFieldGroup
                label={label}
                name={attribute.name}
                id={attribute.name}
                type={getInputType(attribute.contentType)}
                value={attribute.value}
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
      case "DATE":
        console.log(attribute.value);
        return (
          <FormGrid>
            <div key={attribute.name} className="sm:col-span-3">
              <FormFieldGroup
                label={label}
                name={attribute.name}
                id={attribute.name}
                type={dateInputType}
                value={attribute.value}
                onChangeInput={handleChange}
                required={attribute.required}
              />
            </div>
          </FormGrid>
        );
      case "RICHTEXT":
        return (
          <div key={attribute.attributeId} className="sm:col-span-3 mt-4">
            <label>{attribute.name}</label>
            <div className="p-2">
              <div className="max-w-4xl bg-white">
                <ReactQuill theme="snow" value={attribute.value} />
              </div>
            </div>
          </div>
        );
      default:
        console.log("Default case hit", attribute);
        return null;
    }
  };

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
              id="entry-form"
              className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
              noValidate
            >
              <div className="flex items-center space-x-2">
                <Button>Publish</Button>
              </div>
              {post ? (
                post.attributes.map((attribute) => renderFormField(attribute))
              ) : (
                <p>Loading or no post data...</p> // Fallback content
              )}
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
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
