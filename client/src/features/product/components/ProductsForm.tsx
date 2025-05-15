import React, { useEffect, useState } from "react";
import { CustomForm } from "../../../components/UI";

interface Subcategory {
  id: number;
  name: string;
}

interface ProductsFormProps {
  status: "create" | "edit";
  productId?: string;
  onSubmit: () => void;
}

interface FormData {
  product: {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    vendorid: number;
    imageURL: string[];
    subcategory: number[];
  };
  inventory: {
    stockQuantity: number;
    restockDate?: string;
  };
}

const baseUrl = "http://localhost:3333/product";

export const ProductsForm: React.FC<ProductsFormProps> = (props) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    product: {
      name: "",
      description: "",
      price: 0,
      vendorid: 1, // Default vendor ID
      imageURL: [""],
      subcategory: [], // Now initialized as array
    },
    inventory: {
      stockQuantity: 0,
    },
  });

  const { status, productId, onSubmit } = props;

  useEffect(() => {
    // Fetch subcategories
    fetch("http://localhost:3333/subcategory", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setSubcategories(data);

        if (status === "edit" && productId) {
          return fetch(`${baseUrl}/${productId}`, {
            method: "GET",
          });
        }
        return null;
      })
      .then((productResponse) => {
        if (productResponse) {
          return productResponse.json();
        }
        return null;
      })
      .then((productData) => {
        if (productData) {
          setFormData({
            product: {
              name: productData.name,
              description: productData.description,
              price: productData.price,
              discountPrice: productData.discountPrice,
              vendorid: productData.vendorid,
              imageURL: productData.imageURL,
              subcategory:
                productData.subcategory?.map((sc: any) => Number(sc.id)) || [],
            },
            inventory: {
              stockQuantity: productData.Inventory?.stockQuantity || 0,
              restockDate: productData.Inventory?.restockDate,
            },
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [status, productId]);

  const handleFormSubmit = () => {
    // Convert all numeric fields to numbers
    const numericProductFields = {
      ...formData.product,
      imageURL: Array.isArray(formData.product.imageURL)
        ? formData.product.imageURL
        : [formData.product.imageURL],
      price: Number(formData.product.price),
      discountPrice: formData.product.discountPrice
        ? Number(formData.product.discountPrice)
        : undefined,
      subcategory: formData.product.subcategory.map((id) => Number(id)),
    };

    const numericInventoryFields = {
      ...formData.inventory,
      stockQuantity: Number(formData.inventory.stockQuantity),
      ...(status === "edit" && productId ? { productId } : {}),
    };

    // Prepare the request body
    const requestBody =
      status === "create"
        ? {
            product: numericProductFields,
            inventory: numericInventoryFields,
          }
        : {
            ...numericProductFields,
            inventory: numericInventoryFields,
          };

    console.log("Request payload:", requestBody); // Debug log

    fetch(
      status === "create" ? `${baseUrl}/create` : `${baseUrl}/${productId}`,
      {
        method: status === "create" ? "POST" : "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      })
      .then(() => {
        onSubmit();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        product: {
          ...prev.product,
          [field]: value,
        },
      }));
    }
  };

  const handleSubcategoryChange = (selectedId: number) => {
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        subcategory: [selectedId].filter((id) => !isNaN(id)), // Ensure valid number
      },
    }));
  };

  const fields: any = [
    {
      id: "product.name",
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
      value: formData.product.name,
      onChange: (value: string) => handleInputChange("product.name", value),
    },
    {
      id: "product.description",
      label: "Description",
      type: "text",
      placeholder: "Enter product description",
      value: formData.product.description,
      onChange: (value: string) =>
        handleInputChange("product.description", value),
    },
    {
      id: "product.imageURL",
      label: "Image URL",
      type: "text",
      placeholder: "Enter Image URL",
      value: formData.product.imageURL,
      onChange: (value: string[]) =>
        handleInputChange("product.imageURL", value),
    },
    {
      id: "product.price",
      label: "Price",
      type: "number",
      placeholder: "Enter price",
      value: formData.product.price,
      onChange: (value: string) =>
        handleInputChange("product.price", value === "" ? 0 : Number(value)),
    },
    {
      id: "product.discountPrice",
      label: "Discount Price",
      type: "number",
      placeholder: "Enter discount price",
      value: formData.product.discountPrice,
      onChange: (value: string) =>
        handleInputChange(
          "product.discountPrice",
          value === "" ? undefined : Number(value)
        ),
    },
    {
      id: "product.subcategory",
      label: "Subcategory",
      type: "select",
      placeholder: "Select subcategory",
      value: formData.product.subcategory[0] || "", // For single select
      onChange: (value: string) => handleSubcategoryChange(Number(value)),
      options: subcategories,
    },
    {
      id: "inventory.stockQuantity",
      label: "Stock Quantity",
      type: "number",
      placeholder: "Enter stock quantity",
      value: formData.inventory.stockQuantity,
      onChange: (value: string) =>
        handleInputChange(
          "inventory.stockQuantity",
          value === "" ? 0 : parseInt(value)
        ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CustomForm
        title={
          status === "create" ? "New Product" : `Edit Product ${productId}`
        }
        fields={fields}
        onSubmit={handleFormSubmit}
        button={status === "create" ? "Create Product" : "Update Product"}
      />
    </div>
  );
};
