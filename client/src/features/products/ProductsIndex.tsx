import { useState, useEffect } from "react";
import { CustomTable, CustomForm } from "../../components/UI";
import { FormFieldConfig, MessageConfig, MessageType } from "../../types";
import { apiClient } from "../../api/client";

export function ProductsIndex() {
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageConfig[]>([]);

  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  // Fetch products and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, subcategoriesRes] = await Promise.all([
          apiClient.get("/product"),
          apiClient.get("/subcategory"),
        ]);
        // Transform products data so it can display (we have some nested fields)
        const transformedProducts = productsRes.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          vendorid: product.vendorid,
          imageURL: product.imageURL[0],
          //were doing this trasnform cause of these fields!
          stockQuantity: product.Inventory?.stockQuantity,
          restockDate: product.Inventory?.restockDate || null,
          subcategories: product.subcategory[0] || null, // dirty fix please ignore
        }));

        setProducts(transformedProducts);
        setSubcategories(subcategoriesRes || []);
      } catch (error) {
        addMessage("Error fetching data", MessageType.ERROR);
        setProducts([]);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addMessage = (content: string, type: MessageType, autoClose = 3000) => {
    setMessages((prev) => [
      ...prev,
      {
        show: true,
        type,
        content,
        autoCloseDelay: autoClose,
      },
    ]);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await apiClient.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addMessage("Product deleted successfully", MessageType.SUCCESS);
    } catch (error) {
      addMessage("Delete failed", MessageType.ERROR);
    }
  };

  const handleEdit = (id: string | number) => {
    setEditProduct(id.toString());
    setFormVisible(true);
  };

  const handleCreate = () => {
    setEditProduct(null);
    setFormVisible(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editProduct) {
        const payload = {
          price: Number(data.price),
          name: data.name,
          description: data.description,
          id: data.id,
          discountPrice: Number(data.discountPrice),
          vendorid: Number(data.vendorid),
          // Ensure subcategories is an array
          subcategory: [Number(data.subcategories)],
          // Split image URLs into array
          imageURL: data.imageURL.split(",").map((url: string) => url.trim()),
          inventory: {
            stockQuantity: data.stockQuantity,
            restockDate: data.restockDate,
            productId: data.id,
          },
        };

        // Update existing product
        await apiClient.patch(`/product/${editProduct}`, payload);
        addMessage("Product updated", MessageType.SUCCESS);
      } else {
        // Convert data for server expectations
        const payload = {
          product: {
            ...data,
            // Ensure subcategories is an array
            subcategory: [Number(data.subcategories)],
            // Split image URLs into array
            imageURL: data.imageURL.split(",").map((url: string) => url.trim()),
          },
          inventory: {
            stockQuantity: data.stockQuantity,
            restockDate: data.restockDate,
          },
        };
        await apiClient.post("/product/create", payload);
        addMessage("Product created", MessageType.SUCCESS);
      }
      // Refresh product list
      const res = await apiClient.get("/product");
      setProducts(res.data);
      setFormVisible(false);
    } catch (error) {
      addMessage(
        editProduct ? "Update failed" : "Creation failed",
        MessageType.ERROR
      );
    }
  };

  const productFields: FormFieldConfig[] = [
    {
      key: "name",
      label: "Product Name",
      type: "text",
      required: true,
      colSpan: 6,
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      required: true,
      colSpan: 6,
    },
    {
      key: "price",
      label: "Price",
      type: "number",
      required: true,
      pattern: /^\d+(\.\d{1,2})?$/,
      colSpan: 3,
    },
    {
      key: "discountPrice",
      label: "Discount Price",
      type: "number",
      pattern: /^\d+(\.\d{1,2})?$/,
      colSpan: 3,
    },
    {
      key: "vendorid",
      label: "Vendor ID",
      type: "number",
      required: true,
      colSpan: 3,
    },
    {
      key: "subcategories",
      label: "Subcategories",
      type: "form-select",
      required: true,
      options: subcategories,
      colSpan: 3,
    },
    {
      key: "imageURL",
      label: "Image URLs (comma separated)",
      type: "text",
      helpText: "Separate multiple URLs with commas",
    },
    {
      key: "stockQuantity",
      label: "Stock Quantity",
      type: "number",
      required: true,
      colSpan: 4,
    },
    {
      key: "restockDate",
      label: "Restock Date",
      type: "date",
      colSpan: 4,
    },
  ];

  const tableColumns = [
    { key: "name", displayName: "Name" },
    { key: "description", displayName: "Description" },
    { key: "price", displayName: "Price" },
    { key: "discountPrice", displayName: "Discount Price" },
    { key: "vendorid", displayName: "Vendor ID" },
    {
      key: "stockQuantity",
      displayName: "Stock",
      transform: (product: any) => product.Inventory?.stockQuantity || "None",
    },
    {
      key: "subcategories",
      displayName: "Type",
      transform: (product: any) =>
        product.subcategory?.map((s: any) => s.name).join(", "),
    },
    {
      key: "restockDate",
      displayName: "Restock Date",
    },
    { key: "imageURL", displayName: "Image URLs" },
  ];

  return (
    <>
      {formVisible && (
        <CustomForm
          fields={productFields}
          entityName="product"
          title={editProduct ? "Edit Product" : "Create Product"}
          initialData={products.find((p) => p.id === editProduct)}
          onSubmit={handleSubmit}
          onCancel={() => setFormVisible(false)}
          messages={messages}
          onCloseMessage={(index) =>
            setMessages((prev) => prev.filter((_, i) => i !== index))
          }
        />
      )}

      {!formVisible && (
        <CustomTable
          columns={tableColumns}
          data={products}
          loading={loading}
          entityName="product"
          title="Products"
          onDelete={handleDelete}
          onEdit={handleEdit}
          onCreate={handleCreate}
          messages={messages}
          onCloseMessage={(index) =>
            setMessages((prev) => prev.filter((_, i) => i !== index))
          }
        />
      )}
    </>
  );
}
