"use client";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import FormFieldGroup from "./FormFieldGroup";
import FormGrid from "./FormGrid";
import { useRef, useState } from "react";
import { inviteUser } from "@/services/EmailInvitationService";

import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { User } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { getErrors } from "@/lib/utils";
function InviteUserDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { toast } = useToast();

  const sendInvitation = async (userData: User) => {
    try {
      await inviteUser(userData);

      toast({
        title: "Success",
        description: "You have successfully sent an invitation.",
        variant: "success",
      });
      setIsDialogOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = getErrors(axiosError);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const userData: User = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    };

    sendInvitation(userData).finally(() => {
      setSubmitted(false);
    });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
    >
      <DialogTrigger asChild>
        <Button id="inviteUserButton">&#9993; Invite new user</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle> Invite new user</DialogTitle>
          <DialogDescription>User details</DialogDescription>
        </DialogHeader>
        <form id="invite-user-form" onSubmit={handleSubmit} noValidate>
          <FormGrid>
            <div className="sm:col-span-3">
              <FormFieldGroup
                label="First name"
                name="firstName"
                id="firstName"
                type="text"
                required
                value={values.firstName}
                onChangeInput={handleChange}
                error={errors.firstName}
                minLength={2}
                maxLength={20}
                pattern="^[a-zA-Z\s]+$"
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
                onChangeInput={handleChange}
                error={errors.lastName}
                minLength={2}
                maxLength={20}
                pattern="^[a-zA-Z\s]+$"
              />
            </div>

            <div className="sm:col-span-3">
              <FormFieldGroup
                label="Email address"
                name="email"
                id="email"
                type="email"
                required
                value={values.email}
                onChangeInput={handleChange}
                error={errors.email}
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
              id="inviteUserButton"
              type="submit"
              disabled={submitted || !isValid}
            >
              Invite user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUserDialog;
