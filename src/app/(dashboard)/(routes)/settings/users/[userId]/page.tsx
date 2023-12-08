"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import "react-quill/dist/quill.snow.css";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { User } from "@/models/User";
import { useRouter } from "next/navigation";
import { getUserById } from "@/services/UserService";
import FormGrid from "@/components/custom/FormGrid";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
const UserDetailsPage = ({ params }: Params) => {
  const router = useRouter();
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({});
  const [error, setError] = useState("");
  const { userId } = params;
  const [user, setUser] = useState<User>();

  const handleBackClick = () => {
    router.back();
  };
  useEffect(() => {
    getUserById(userId)
      .then((data) => setUser(data))
      .catch((error) => setError(error.message));
  }, [userId]);
  console.log(user);
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
              <div>
                <h1 className="text-2xl font-bold">
                  Edit {user ? `${user.firstName} ${user.lastName}` : "User"}
                </h1>
                <p className="text-sm text-gray-600">User Details:</p>
              </div>
            </div>
            <form
              id="entry-form"
              className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
              noValidate
            >
              <div className="flex items-center space-x-2">
                <Button className="ml-auto">Save</Button>
              </div>

              {user && (
                <>
                  <FormGrid>
                    <div className="sm:col-span-3">
                      <FormFieldGroup
                        label="First name"
                        name="firstName"
                        id="firstName"
                        type="text"
                        required
                        value={user.firstName}
                        onChangeInput={handleChange}
                        error={errors.firstName}
                        minLength={2}
                        maxLength={20}
                        pattern="^[a-zA-Z\s]+$"
                      />
                    </div>
                  </FormGrid>
                  <FormGrid>
                    <div className="sm:col-span-3">
                      <FormFieldGroup
                        label="Last name"
                        name="lastName"
                        id="lastName"
                        type="text"
                        required
                        value={user.lastName}
                        onChangeInput={handleChange}
                        error={errors.lastName}
                        minLength={2}
                        maxLength={20}
                        pattern="^[a-zA-Z\s]+$"
                      />
                    </div>
                  </FormGrid>
                  <FormGrid>
                    <div className="sm:col-span-3">
                      <FormFieldGroup
                        label="Email address"
                        name="email"
                        id="email"
                        type="email"
                        required
                        value={user.email}
                        onChangeInput={handleChange}
                        error={errors.email}
                      />
                    </div>
                  </FormGrid>

                  <FormGrid>
                    <div>
                      <Label className="flex mb-4">Role</Label>
                      <Select
                        required
                        value={user.userType}
                        //  onValueChange={handleUserTypeChange}
                      >
                        <SelectTrigger className="w-[380px]">
                          <SelectValue placeholder="Choose here" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem id="admin" value="ADMIN">
                            Admin
                          </SelectItem>
                          <SelectItem id="editor" value="EDITOR">
                            Editor
                          </SelectItem>
                          <SelectItem id="default" value="DEFAULT">
                            Default
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormGrid>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
