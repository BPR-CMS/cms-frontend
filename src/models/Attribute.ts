export interface Attribute {
  name: string;
  type: string;
  contentType: AttributeType;
  minimumLength?: number;
  maximumLength?: number;
  required?: boolean;
}

export enum AttributeType {
  Text = "TEXT",
  RichText = "RICH TEXT",
  Date = "DATE",
  Number = "NUMBER",
  Media = "MEDIA",
}
