// src/components/ProductForm.tsx

import {
  useState,
  type FormEvent,
} from "react";

import apiClient from "../api/axiosClient";


interface ProductFormProps {
  onCreated?: () => void;
}


export default function ProductForm({
  onCreated,
}: ProductFormProps) {

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // CREATE PRODUCT
  // ==========================================

  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault();

    try {

      setLoading(true);

      setError("");

      setSuccess("");


      // ----------------------------------------
      // Check JWT
      // ----------------------------------------

      const token =
        localStorage.getItem("token");


      console.log(
        "Create Product JWT:",
        token
      );


      if (!token) {

        setError(
          "You are not logged in."
        );

        return;

      }


      // ----------------------------------------
      // Request body
      // ----------------------------------------

      const productData = {

        name,

        description,

        price: Number(price),

        stock: Number(stock),

      };


      console.log(
        "Creating product:",
        productData
      );


      // ----------------------------------------
      // POST PRODUCT
      // ----------------------------------------

      const response =
        await apiClient.post(
          "/api/products",
          productData
        );


      console.log(
        "Create product response:",
        response.data
      );


      // ----------------------------------------
      // Success
      // ----------------------------------------

      if (
        response.data.success
      ) {

        setSuccess(
          "Product created successfully."
        );


        // Clear form

        setName("");

        setDescription("");

        setPrice("");

        setStock("");


        // Refresh ProductList

        if (onCreated) {

          onCreated();

        }

      } else {

        setError(
          response.data.message ||
          "Failed to create product"
        );

      }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      console.error(
        "Create product error:",
        error
      );


      console.error(
        "Status:",
        error.response?.status
      );


      console.error(
        "Response:",
        error.response?.data
      );


      if (
        error.response?.status === 401
      ) {

        setError(
          "Unauthorized. Please login again."
        );

      } else {

        setError(
          error.response?.data?.message ||
          "Failed to create product"
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <div className="mb-6">

    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xl">
      📦
    </div>

    <h2 className="text-lg font-bold text-slate-900">
      Create Product
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Add a new product to your inventory
    </p>

  </div>


  <form
    onSubmit={handleSubmit}
    className="space-y-4"
  >

    {/* NAME */}

    <div>

      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Product Name
      </label>

      <input
        type="text"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="e.g. MacBook Pro"
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        required
      />

    </div>


    {/* DESCRIPTION */}

    <div>

      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Description
      </label>

      <textarea
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        placeholder="Product description"
        rows={3}
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        required
      />

    </div>


    {/* PRICE + STOCK */}

    <div className="grid grid-cols-2 gap-3">

      <div>

        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Price
        </label>

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          placeholder="75000"
          min="0"
          step="0.01"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />

      </div>


      <div>

        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Stock
        </label>

        <input
          type="number"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
          placeholder="10"
          min="0"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />

      </div>

    </div>


    {/* ERROR */}

    {error && (
      <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
        {error}
      </div>
    )}


    {/* SUCCESS */}

    {success && (
      <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
        {success}
      </div>
    )}


    {/* SUBMIT */}

    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
    >

      {loading ? (
        <span className="flex items-center justify-center gap-2">

          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

          Creating...

        </span>
      ) : (
        "Create Product"
      )}

    </button>

  </form>

</div>

  );

}