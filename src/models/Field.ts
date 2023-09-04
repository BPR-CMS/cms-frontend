export interface Field {
    name: string;
    type: FieldType;
  }
  
  export enum FieldType {
  Text = 'Text',
  RichText = 'Rich Text',
  Date = 'Date',
  Number = 'Number',
  Media = 'Media',
}
