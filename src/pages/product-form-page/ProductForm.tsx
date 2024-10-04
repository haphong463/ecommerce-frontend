import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../../types/Product";

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [product, setProduct] = useState<Omit<Product, "id" | "createdAt">>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  });
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isEditMode && id) {
      // Fetch existing product data
      axios
        .get<Product>(`/api/products/${id}`)
        .then((response) => {
          const { name, description, price, imageUrl } = response.data;
          setProduct({ name, description, price, imageUrl });
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching product data");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!product.name || !product.description || product.price <= 0) {
      setError("Please fill in all fields correctly.");
      return;
    }

    try {
      if (isEditMode && id) {
        // Update existing product
        await axios.put(`/api/products/${id}`, product);
      } else {
        // Create new product
        await axios.post("/api/products", product);
      }
      navigate("/");
    } catch (err) {
      setError("Error saving product");
    }
  };

  if (loading) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={product.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price ($):
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          {isEditMode ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
