import { useState, useEffect } from "react";
import {
  CustomTable,
  SuccessAlert,
  PlusIcon,
  CustomModal,
} from "../../../components/UI";
import { ProductsForm } from "./ProductsForm";

interface ColumnConfig {
  //the column config thing is done for the sole reason of being able to display names better
  key: keyof Product;
  displayName: string;
}

interface Product {
  id: string;
  Name: string;
  Description: string;
  Image_URLs: string;
  Type?: string;
  Price: number;
  Discount_Price: number;
  Quantity: number;
}

export const ProductsIndex = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Product[]>([]);
  const [change, setChange] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [productEditId, setProductEditId] = useState<string>("");
  const [formStatus, setFormStatus] = useState<"create" | "edit">("create");

  const handleFormClose = () => {
    setChange(!change);
    setShowForm(false);
  };

  const handleEditFormOpen = (id: string) => {
    setShowForm(true);
    setFormStatus("edit");
    setProductEditId(id);
  };

  const handleProductDelete = (id: string) => {
    fetch(`http://localhost:3333/product/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
        return response.json();
      })
      .then((data) => {
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 5000);
        setChange(!change);
        console.log("Successfully deleted product with ID:", id);
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3333/product", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data: any) => {
        const products: Product[] = [];
        console.log(data); //For debbuging remember to remove!!!
        for (const key in data) {
          const product: Product = {
            id: data[key].id,
            Name: data[key].name,
            Description: data[key].description,
            Image_URLs: data[key].imageURL,
            Type: data[key].subcategory[0].name,
            Price: data[key].price,
            Discount_Price: data[key].discountPrice,
            Quantity: data[key].Inventory.stockQuantity,
          };

          products.push(product);
        }
        setLoading(false);
        setData(products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [change]);

  const columns: ColumnConfig[] = [
    { key: "Name", displayName: "Name" },
    { key: "Description", displayName: "Description" },
    { key: "Image_URLs", displayName: "Image URLs" },
    { key: "Type", displayName: "Type" },
    { key: "Price", displayName: "Price" },
    { key: "Discount_Price", displayName: "Discount Price" },
    { key: "Quantity", displayName: "Quantity" },
  ];

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="ml-auto">Products of (insert vendor name)</h1>
        <button
          className="btn btn-primary mt-3 mb-2"
          onClick={() => {
            setShowForm(true);
            setFormStatus("create");
          }}
        >
          <PlusIcon /> Add New Product
        </button>
      </div>
      <CustomTable
        columns={columns}
        data={data}
        loading={loading}
        onDelete={handleProductDelete}
        onEdit={handleEditFormOpen}
      />
      <SuccessAlert show={alert}>Deletion was successful!</SuccessAlert>
      {showForm && (
        <CustomModal onClose={handleFormClose}>
          <ProductsForm
            productId={productEditId}
            onSubmit={handleFormClose}
            status={formStatus}
          />
        </CustomModal>
      )}
    </>
  );
};

export default ProductsIndex;
