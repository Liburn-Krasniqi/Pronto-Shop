import { MessageConfig } from ".";

export interface CustomFieldProps {
  field: FormFieldConfig; // Pass in the field
  value: any; // Values if any there
  hasError: boolean;
  loading: boolean;
  onChange: (value: any) => void;
}

export interface FormMessage extends MessageConfig {
  field?: string; // For field-specific errors
  // for other things just use the standard message config
}

export interface FormFieldConfig {
  // Guessing this is the attribute of the entity
  key: string;
  // Naming
  label: string;
  // This one is a little complicated, in case of a dropdown it probably need to be a select, and it requires a helper component to make this possible
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "date"
    | "tel"
    | "url"
    | "form-select" // select is a tricky one!!
    | "file";

  // This is for styling, e.g. you want to have a field take up the entire width of a form, or want two fields in one row
  // 1-12 (Bootstrap grid)
  colSpan?: number;
  // Is the field required (will display Red Asterisk), helps in field validation
  required?: boolean;
  // Used for emails and such, helps in field validation
  pattern?: RegExp;
  // If pattern not matched or if its a required field and its not filled
  errorMessage?: string;
  // Just a place holder
  placeholder?: string;
  // Text to explain the field if neccessary
  helpText?: string;
  // In case we need a dropdown
  options?: Array<{ id: string | number; name: string }>;
}

export interface FormProps {
  // What form fields will the form have. Notice how its a type of its own, suggest to check it out.
  fields: FormFieldConfig[];
  // In case of the form being used for editing, the fields will be set to the entitys current values i.e. initialData
  initialData?: Record<string, any>;
  // For the spinner
  loading?: boolean;
  // Purely for the button, if no name is passed in then "Create/Update item" is default
  entityName?: string;
  // Title of form
  title: string;
  // Used to display pop up messages (e.g. success of deletion)
  messages?: FormMessage[];
  // Implementation of what happens when type="submit" button is clicked, needs data passed in!
  onSubmit: (data: Record<string, any>) => void;
  // Implementation of what happens when cancel button is clicked
  onCancel: () => void;
  // Im not gonna lie I dont get this one, its for closing the Alerts or something?
  onCloseMessage?: (index: number) => void;
}
