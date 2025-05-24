import { useState } from "react";
import { CustomTable } from "../../components/UI/CustomTable/CustomTable";
import { MessageConfig, MessageType } from "../../types";

const columns = [
  { key: "id", displayName: "ID" },
  { key: "name", displayName: "Product Name" },
  { key: "price", displayName: "Price" },
  { key: "stock", displayName: "Stock Quantity" },
  { key: "category", displayName: "Category" },
];

// Sample data
const data = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$99.99",
    stock: 45,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: "$24.99",
    stock: 120,
    category: "Clothing",
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: "$19.99",
    stock: 80,
    category: "Accessories",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: "$59.99",
    stock: 25,
    category: "Electronics",
  },
  { id: 5, name: "Yoga Mat", price: "$29.99", stock: 65, category: "Fitness" },
];

const handleEditFormOpen = (id: string | number) => {
  console.log("Edit product with id:", id);
};

const handleCreateFormOpen = () => {
  console.log("Create product");
};

export function TestFeature() {
  const [messages, setMessages] = useState<MessageConfig[]>([]);
  const loading = false;

  const addMessage = (newMessage: Omit<MessageConfig, "show">) => {
    setMessages((prev) => [...prev, { ...newMessage, show: true }]);
  };

  const handleCloseMessage = (index: number) => {
    // understand this one a little more
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, show: false } : msg))
    );
  };

  const handleProductDelete = (id: string | number) => {
    console.log("Delete product with id:", id);
    addMessage({
      type: MessageType.SUCCESS,
      title: "Deletion Successful!",
      content: `Product with ID ${id} was deleted successfully.`,
      autoCloseDelay: 5000,
    });
  };

  return (
    <CustomTable
      columns={columns}
      data={data}
      loading={loading}
      messages={messages}
      entityName="Product"
      title="Products of Vendor"
      onDelete={handleProductDelete}
      onEdit={handleEditFormOpen}
      onCreate={handleCreateFormOpen}
      onCloseMessage={handleCloseMessage}
    />
  );
}
