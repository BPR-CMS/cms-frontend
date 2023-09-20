import { Attribute } from "./Attribute";

export interface Collection {
  name: string;
  description: string;
  attributes: Attribute[]
}
