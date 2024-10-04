import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProductList as ProductListTable } from "../../types/ProductList";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductListTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9191/api/v1/products`,
        {
          params: { page, size: pageSize },
        }
      );
      setProducts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching products");
      setLoading(false);
    }
  };
  const handleNext = () => {
    setPage((prevPage) =>
      prevPage + 1 < totalPages ? prevPage + 1 : prevPage
    );
  };

  const handlePrevious = () => {
    setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter((product) => product.product.id !== id));
      } catch (err) {
        setError("Error deleting product");
      }
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Product List</h2>
      <Link to="/create" className="btn btn-primary mb-3">
        Add New Product
      </Link>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price ($)</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.product.id}>
                <td>
                  <img
                    src={item.product.imageUrl}
                    width="100"
                    height="100"
                    alt={item.product.name}
                  />
                </td>
                <td>{item.product.id}</td>
                <td>{item.product.name}</td>
                <td>{item.product.description}</td>
                <td>{item.product.price.toFixed(2)}</td>
                <td>{item.stock.qty}</td>
                <td>
                  <Link
                    to={`/edit/${item.product.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button
          onClick={handlePrevious}
          disabled={page === 0}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <span>
          {" "}
          Page {page + 1} of {totalPages}{" "}
        </span>
        <button
          onClick={handleNext}
          disabled={page + 1 === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
