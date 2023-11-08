"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import { Button } from "@/components/ui/Button";
import { values } from "cypress/types/lodash";
const CreateEntryPage = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
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
                onClick={handleBackClick}
                className="text-blue-600 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
              >
                ← Back
              </Button>
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">Create an entry</h1>
                <p className="text-sm text-gray-600">API ID: webinar</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Publish
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Save
                </button>
              </div>
            </div>

            <form
              id="post-form"
              className="bg-white mt-6 mr-6 mb-6 p-6 sm:mt-8 sm:mr-8 sm:mb-8 sm:p-8 md:mt-10 md:mr-10 md:mb-10 md:p-10 rounded-md shadow-lg"
              noValidate
            >
              <FormGrid>
                <div className="sm:col-span-3">
                  <FormFieldGroup
                    label="Email address"
                    name="email"
                    id="email"
                    type="email"
                    required
                  />
                </div>

                <div className="col-span-full">
                  <FormFieldGroup
                    label="Password"
                    name="password"
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={16}
                    pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,16}$"
                  />
                </div>
              </FormGrid>
              <div className="border-gray-900/10 pt-12"></div>
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

export default CreateEntryPage;
