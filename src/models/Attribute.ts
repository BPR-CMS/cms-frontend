export interface Attribute {
  name: string;
  textType: string;
  mediaType: string;
  dateType: string;
  formatType: string;
  contentType: AttributeType;
  minimumLength?: number;
  maximumLength?: number;
  required?: boolean;
  unique?: boolean;
  format?: string;
}

export enum AttributeType {
  Text = "TEXT",
  RichText = "RICHTEXT",
  Date = "DATE",
  Number = "NUMBER",
  Media = "MEDIA",
}
