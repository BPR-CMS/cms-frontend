import { Button } from "@/components/ui/Button";
import FormFieldGroup from "@/components/custom/FormFieldGroup";
import FormGrid from "@/components/custom/FormGrid";
import Logo from "./custom/Logo";

const AdminRegistration = () => {
  return (
    <form
      className="bg-white p-6 sm:p-8 md:p-10 rounded-md shadow-lg"
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
          />
        </div>

        <div className="sm:col-span-3">
          <FormFieldGroup
            label="Last name"
            name="lastName"
            id="lastName"
            type="text"
            required
          />
        </div>

        <div className="col-span-full">
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
          />
        </div>

        <div className="col-span-full">
          <FormFieldGroup
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            required
          />
        </div>
      </FormGrid>
      <div className="border-gray-900/10 pt-12">
        <Button variant="default" size="lg" className="w-full">
          {" "}
          Let&apos;s start
        </Button>
      </div>
    </form>
  );
};
export default AdminRegistration;
