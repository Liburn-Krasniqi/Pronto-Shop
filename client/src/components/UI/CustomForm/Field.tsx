import { Form } from "react-bootstrap";
import { ChangeEvent } from "react";
// Field is a helper thingy i use for the form

interface Option {
  id: string | number;
  name: string;
}

interface BaseFieldProps {
  id: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  options: Option[];
}

interface InputFieldProps extends BaseFieldProps {
  type: "text" | "number" | "email" | "password" | "date" | "tel" | "url"; // Add more HTML input types as needed
  autocomplete?: string;
}

export type FieldProps = SelectFieldProps | InputFieldProps;
// or directly export the interface if it's in the same file
export function Field({ field, index }: { field: FieldProps; index: number }) {
  if (field.type === "select") {
    return (
      <Form.Group key={index} controlId={field.id}>
        <Form.Label>{field.label}</Form.Label>
        <Form.Select
          value={field.value ?? ""}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            field.onChange(e.target.value)
          }
        >
          <option value="">{field.placeholder}</option>
          {field.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    );
  } else {
    return (
      <Form.Group key={index} controlId={field.id}>
        <Form.Label>{field.label}</Form.Label>
        <Form.Control
          type={field.type}
          placeholder={field.placeholder}
          value={field.value ?? ""}
          autoComplete={field.autocomplete}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            field.onChange(e.target.value)
          }
        />
      </Form.Group>
    );
  }
}
