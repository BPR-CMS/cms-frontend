"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import Logo from "@/components/custom/Logo";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { useToast } from "@/hooks/use-toast";
import { checkAdminExists, registerAdmin } from "@/services/AdminService";
import { Admin } from "@/models/Admin";
import { getErrors } from "@/lib/utils";
import { AxiosError } from "axios";
const AdminRegistration = () => {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const { toast } = useToast();
  const router = useRouter();

  const register = async (adminData: Admin) => {
    try {
      await registerAdmin(adminData);
      localStorage.setItem("adminExists", "true");
      toast({
        title: "Success",
        description: "You have successfully created an admin account.",
        variant: "success",
      });
      router.push("/account");
    } catch (error) {
      const axiosError = error as AxiosError; // Type cast the error to AxiosError
      const errorMessage = getErrors(axiosError);
      console.error("Error registering the admin:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    const adminStatus = await checkAdminExists();
    if (adminStatus) {
      toast({
        title: "Error",
        description: "An admin account already exists.",
        variant: "destructive",
      });
      return;
    }

    const adminData: Admin = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    register(adminData);
  };

  return (
    <form
      id="admin-registration"
      className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex items-center justify-center pb-6 ">
        <Logo width={60} variant="noText" />
      </div>
      <h2 className="text-2xl text-center font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Welcome to WebEase
      </h2>
      <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
        Let&apos;s set up your initial admin account to get started.{" "}
      </p>

      <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
        Personal Information
      </h2>

      <FormGrid>
        <div className="sm:col-span-3">
          <FormFieldGroup
            label="First name"
            name="firstName"
            id="firstName"
            type="text"
            required
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
            minLength={2}
            maxLength={20}
          />
        </div>

        <div className="sm:col-span-3">
          <FormFieldGroup
            label="Last name"
            name="lastName"
            id="lastName"
            type="text"
            required
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
            minLength={2}
            maxLength={20}
          />
        </div>

        <div className="col-span-full">
          <FormFieldGroup
            label="Email address"
            name="email"
            id="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            error={errors.email}
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
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />
        </div>

        <div className="col-span-full">
          <FormFieldGroup
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            maxLength={16}
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        </div>
      </FormGrid>
      <div className="border-gray-900/10 pt-12">
        <Button
          variant="default"
          size="lg"
          className="w-full"
          disabled={!isValid}
        >
          Let&apos;s start
        </Button>
      </div>
    </form>
  );
};

export default AdminRegistration;
