import { useState } from "react";

import { CustomCard } from "../CustomCard"; // UI wrapper
import { LoadingSpinner, Alert } from "../../../assets"; // UI Assets
import { FormFieldConfig, FormProps } from "../../../types"; // Interfaces, not in this file so its cleaner

export const CustomForm = ({
  fields,
  initialData = {},
  loading = false,
  entityName = "item",
  title,
  messages = [],
  onSubmit,
  onCancel,
  onCloseMessage,
}: FormProps) => {
  // In case form is used for an edit it takes in a non empty initialData argument, for create its empty
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handling input on fields
  // Key is the name of field probably of the attribute as well
  const handleInputChange = (key: string, value: any) => {
    // Changes only the specific fields value
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateField = (_key: string, value: any, config: FormFieldConfig) => {
    if (config.required && !value?.toString().trim()) {
      return `${config.label} is required`;
    }
    if (config.pattern && !config.pattern.test(value)) {
      return (
        config.errorMessage || `Invalid ${config.label.toLowerCase()} format`
      );
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent from reloading, yuck!
    const newErrors: Record<string, string> = {}; // Creates an empty object to store validation errors (keys = field names, values = error messages).

    // Validate all fields
    fields.forEach((field) => {
      const error = validateField(field.key, formData[field.key], field);
      if (error) newErrors[field.key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // if there are any errors return to stop execution
    }

    onSubmit(formData);
  };

  return (
    <div className="container-fluid">
      {/* Form Title */}
      <div className="d-flex align-items-center justify-content-between mx-3 mt-3">
        <h1 className="ml-auto color-1 fw-bold">
          {title || (initialData?.id ? "Edit " : "Create " + entityName)}
        </h1>
      </div>

      {/* Form Card */}
      <CustomCard className="m-3">
        {loading ? ( // conditional display, if loading is set to true show the spinner!
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit}>
            {/* g-3 references bootstrap gutters A.K.A. the padding between form fields, and p-3 is just padding */}
            <div className="row g-3 p-3">
              {fields.map((field) => (
                // if no colSpan is specified the field will take up an entire row
                <div key={field.key} className={`col-${field.colSpan || 12}`}>
                  {/* Field Label */}
                  <label
                    htmlFor={field.key}
                    className="form-label color-2 fs-5"
                  >
                    {field.label}
                    {/* If required  display Red Asterisk */}
                    {field.required && <span className="text-danger">*</span>}
                  </label>
                  {/* Field Input */}
                  <input
                    type={field.type || "text"}
                    // If theres an error in said field's input, display that its not valid!
                    className={`form-control ${
                      errors[field.key] ? "is-invalid" : ""
                    }`}
                    id={field.key}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    disabled={loading}
                    aria-describedby={`${field.key}Help`}
                  />
                  {/* Descriptive text to help users understend what to input */}
                  {field.helpText && (
                    <div id={`${field.key}Help`} className="form-text">
                      {field.helpText}
                    </div>
                  )}
                  {/* Descriptive text to help users understend what to input after they input wrong values */}
                  {errors[field.key] && (
                    <div className="invalid-feedback">{errors[field.key]}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 p-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn background-1 color-white"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  `${initialData.id ? "Update" : "Create"} ${entityName}`
                )}
              </button>
            </div>
          </form>
        )}
      </CustomCard>

      {/* Messages */}
      {messages.map((message, index) => (
        <Alert
          key={`alert-${index}`}
          show={message.show}
          type={message.type}
          onClose={() => onCloseMessage?.(index)}
          autoCloseDelay={message.autoCloseDelay}
        >
          {message.title && <h4 className="alert-heading">{message.title}</h4>}
          <div>{message.content}</div>
        </Alert>
      ))}
    </div>
  );
};
