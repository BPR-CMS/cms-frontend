export interface Attribute {
  attributeId?: string;
  name: string;
  textType?: string;
  dateType?: DateType;
  formatType?: string;
  contentType: AttributeType;
  minimumLength?: number;
  maximumLength?: number;
  maximumRichTextLength?: string;
  required?: boolean;
  unique?: boolean;
  format?: string;
}

export enum AttributeType {
  Text = "TEXT",
  RichText = "RICHTEXT",
  Date = "DATE",
  Number = "NUMBER",
}

export type DateType = 'DATE' | 'DATETIME' | 'TIME'; 