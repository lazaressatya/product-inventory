"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: ""
  };

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  async function loadProducts() {

    try {

      setLoading(true);

      const response = await fetch("/api/products");

      const data = await response.json();

      setProducts(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadProducts();

  }, []);


  function handleChange(event) {

    setForm({
      ...form,
      [event.target.name]: event.target.value
    });

  }


  async function handleSubmit(event) {

    event.preventDefault();

    try {

      setSaving(true);

      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? {
            id: editingId,
            ...form
          }
        : form;

      const response = await fetch("/api/products", {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {

        throw new Error("Request failed");

      }

      resetForm();

      await loadProducts();

    } catch (error) {

      alert("Something went wrong");

      console.error(error);

    } finally {

      setSaving(false);

    }
  }


  function editProduct(product) {

    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      quantity: product.quantity
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  async function deleteProduct(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id
        })
      });

      loadProducts();

    } catch (error) {

      console.error(error);

      alert("Unable to delete product");

    }
  }


  function resetForm() {

    setEditingId(null);

    setForm(emptyForm);

  }


  const filteredProducts = useMemo(() => {

    return products.filter((product) => {

      const searchText = search.toLowerCase();

      return (
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)
      );

    });

  }, [products, search]);


  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (sum, product) => sum + Number(product.quantity || 0),
    0
  );

  const totalValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0
  );


  return (

    <main className="container">

      {/* HEADER */}

      <header className="header">

        <div>

          <div className="brand">
            InventoryPro
          </div>

          <p className="subtitle">
            Product inventory management dashboard
          </p>

        </div>

      </header>


      {/* STATS */}

      <section className="stats">

        <div className="stat-card">

          <span>Total Products</span>

          <strong>{totalProducts}</strong>

        </div>


        <div className="stat-card">

          <span>Inventory Units</span>

          <strong>{totalQuantity}</strong>

        </div>


        <div className="stat-card">

          <span>Inventory Value</span>

          <strong>
            ₹{totalValue.toLocaleString("en-IN")}
          </strong>

        </div>

      </section>


      {/* FORM */}

      <section className="panel">

        <div className="panel-header">

          <div>

            <h2>
              {editingId
                ? "Update Product"
                : "Add Product"}
            </h2>

            <p>
              Enter product information below.
            </p>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="form"
        >

          <div className="form-grid">

            <input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
            />


            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />


            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />


            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />

          </div>


          <textarea
            name="description"
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />


          <div className="form-actions">

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}

            </button>


            {editingId && (

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </section>


      {/* PRODUCTS */}

      <section className="panel">

        <div className="products-header">

          <div>

            <h2>Products</h2>

            <p>
              Manage your inventory
            </p>

          </div>


          <input
            className="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {loading ? (

          <div className="empty">
            Loading products...
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="empty">
            No products found.
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Product</th>

                  <th>Category</th>

                  <th>Price</th>

                  <th>Quantity</th>

                  <th>Value</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.map(
                  (product) => (

                    <tr key={product._id}>

                      <td>

                        <strong>
                          {product.name}
                        </strong>

                        <small>
                          {product.description}
                        </small>

                      </td>


                      <td>

                        <span className="badge">
                          {product.category}
                        </span>

                      </td>


                      <td>
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </td>


                      <td>
                        {product.quantity}
                      </td>


                      <td>

                        ₹
                        {(
                          Number(product.price) *
                          Number(product.quantity)
                        ).toLocaleString("en-IN")}

                      </td>


                      <td>

                        <button
                          className="edit-button"
                          onClick={() =>
                            editProduct(product)
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteProduct(
                              product._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      <footer>
        InventoryPro • Next.js + MongoDB
      </footer>

    </main>
  );
}