import { useState } from "react";
import { CustomForm } from "../../components/UI";
import { FormMessage, MessageType, FormFieldConfig } from "../../types";

// Dummy product data
const dummyProducts = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    description: "Noise-cancelling wireless headphones",
    category: "2",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 249.99,
    description: "Fitness tracking and notifications",
  },
  {
    id: 3,
    name: "Wireless Charger",
    price: 29.99,
    description: "Fast-charging pad for all devices",
  },
];

export const TestFeature1 = () => {
  // State management
  const [selectedProduct, setSelectedProduct] = useState(dummyProducts[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<FormMessage[]>([]);

  // Handler functions
  const handleSubmit = (formData: Record<string, any>) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);

      // Update the dummy product
      const updatedProduct = { ...selectedProduct, ...formData };
      setSelectedProduct(updatedProduct);

      // Show success message
      setMessages([
        {
          type: MessageType.SUCCESS,
          title: "Success!",
          content: "Product updated successfully",
          show: true,
          autoCloseDelay: 3000,
        },
      ]);

      setIsLoading(false);
    }, 1500);
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    setMessages([
      {
        type: MessageType.INFO,
        content: "Changes were discarded",
        show: true,
        autoCloseDelay: 2000,
      },
    ]);
    // In a real app, you might navigate back or clear the form
  };

  const handleCloseMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  // Field configurations
  const productFields: FormFieldConfig[] = [
    {
      key: "name",
      label: "Product Name",
      type: "text",
      required: true,
      colSpan: 6,
      placeholder: "Enter product name",
    },
    {
      key: "price",
      label: "Price",
      type: "number",
      required: true,
      pattern: /^\d+(\.\d{1,2})?$/,
      errorMessage: "Invalid price format (e.g. 19.99)",
      colSpan: 6,
      placeholder: "0.00",
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      colSpan: 12,
      helpText: "Detailed product description for customers",
    },
    {
      key: "inStock",
      label: "In Stock",
      type: "number",
      colSpan: 4,
      placeholder: "Quantity available",
    },
    {
      key: "category",
      label: "Category",
      type: "form-select",
      colSpan: 4,
      placeholder: "Product category",
      options: [
        { id: "1", name: "Electronics" },
        { id: "2", name: "Books" },
      ],
    },
    {
      key: "sku",
      label: "SKU",
      type: "text",
      colSpan: 4,
      pattern: /^[A-Z0-9]{6,12}$/,
      errorMessage: "SKU must be 6-12 alphanumeric characters",
      helpText: "Stock Keeping Unit",
    },
  ];

  return (
    <CustomForm
      title=""
      entityName="Product"
      fields={productFields}
      initialData={dummyProducts[0]}
      loading={isLoading}
      messages={messages}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onCloseMessage={handleCloseMessage}
    />
  );
};
