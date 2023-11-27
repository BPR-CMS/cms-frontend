import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrors = (err: AxiosError): string => {
  if (err.response && err.response.status) {
    const data = err.response.data as { message?: string };

    switch (err.response.status) {
      case 400:
        if (data.message === "An admin account already exists.") {
          return "An admin account already exists. Only one account can be created.";
        } else {
          return "The data provided is invalid. Please check the information you provided and try again.";
        }
      case 401:
        if (data.message === "Unauthorized") {
          return "You are not authorized to perform this action.";
        } else {
          return "The data provided is incorrect.";
        }

      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested data was not found.";
      case 409:
        return "An admin account with this email already exists.";
      case 429:
        return "Too many requests. Please try again later.";
      default:
        return "Server Error.";
    }
  } else {
    return `We can't connect to the server right now. Please check your internet connection and try again. ${err.message}`;
  }
};

export type ContentType = 'TEXT' | 'RICHTEXT' | 'NUMBER' | 'DATE' | 'MEDIA';

export function getInputType(contentType: ContentType): string {
  const typeMapping: { [K in ContentType]: string } = {
    TEXT: "text",
    RICHTEXT: "text",
    NUMBER: "number",
    DATE: "date",
    MEDIA: "file",
  };

  return typeMapping[contentType];
}

export const getStepValue = (numberType: string) => {
  switch (numberType) {
    case "INTEGER":
      return "1";
    case "DECIMAL":
    case "FLOAT":
      return "any";
    default:
      return "any";
  }
};