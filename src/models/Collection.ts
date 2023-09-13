import { Field } from "./Attribute";

export interface Collection {
  name: string;
  description: string;
  attributes: Field[]
}
