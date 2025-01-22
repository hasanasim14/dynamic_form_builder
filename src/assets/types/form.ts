export type FieldType =
  | "text"
  | "dropdown"
  | "radio"
  | "file"
  | "checkbox"
  | "country"
  | "date"
  | "phone";

export interface FieldBase {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  validation?: {
    type: string;
    value: any;
    message: string;
  }[];
  conditionalLogic?: {
    dependsOn: string;
    showIf: (value: any) => boolean;
  };
  value?: any;
}

export interface TextField extends FieldBase {
  type: "text";
}

export interface DropdownField extends FieldBase {
  type: "dropdown";
  options: string[];
}

export interface RadioField extends FieldBase {
  type: "radio";
  options: string[];
}

export interface FileField extends FieldBase {
  type: "file";
  accept?: string;
}

export interface CheckboxField extends FieldBase {
  type: "checkbox";
}

export interface CountryField extends FieldBase {
  type: "country";
}

export interface DateField extends FieldBase {
  type: "date";
}

export interface PhoneField extends FieldBase {
  type: "phone";
}

export type Field =
  | TextField
  | DropdownField
  | RadioField
  | FileField
  | CheckboxField
  | CountryField
  | DateField
  | PhoneField;

export interface Section {
  id: string;
  title: string;
  fields: (Field | Section)[];
  conditionalLogic?: {
    dependsOn: string;
    showIf: (value: any) => boolean;
  };
}

export interface FormData {
  sections: Section[];
}
