// CustomField.tsx
import { CustomFieldProps } from "../../../types";

export const CustomField = ({
  field,
  value,
  hasError,
  loading,
  onChange,
}: CustomFieldProps) => {
  if (field.type === "form-select") {
    // Conditional returns
    return (
      <select
        id={field.key}
        className={`form-select ${hasError ? "is-invalid" : ""}`}
        value={value.id ?? ""} // It is very important that the object being passed in as the current value here has an id attribute!!!
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        aria-describedby={`${field.key}Help`}
      >
        {/* <option selected >Select</option> */}
        {field.options?.map((option: any) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }
  // Conditional returns
  return (
    <input
      id={field.key}
      type={field.type || "text"}
      className={`form-control ${hasError ? "is-invalid" : ""}`}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      disabled={loading}
      aria-describedby={`${field.key}Help`}
    />
  );
};
