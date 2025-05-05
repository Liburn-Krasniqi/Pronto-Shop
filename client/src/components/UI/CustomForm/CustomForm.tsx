import { Form, Button } from "react-bootstrap";
import { Field, FieldProps } from "./Field";
import { FormEvent } from "react";

interface CustomFormProps {
  title: string;
  fields: FieldProps[];
  onSubmit: () => void;
  button: string;
}

export const CustomForm = ({
  title,
  fields,
  onSubmit,
  button,
}: CustomFormProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit} className="m-4">
      <h1>{title}</h1>
      {fields.map((field, index) => (
        <Field key={index} field={field} index={index} />
      ))}

      <Button
        variant=""
        type="submit"
        className="mt-3 background-1 color-white "
      >
        {button}
      </Button>
    </Form>
  );
};
