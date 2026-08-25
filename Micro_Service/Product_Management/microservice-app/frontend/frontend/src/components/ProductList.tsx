import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

interface ProductListProps {
  refresh?: number;
  onOrder?: (product: Product) => void;
  onProductsLoaded?: (products: Product[]) => void;
}

export default function ProductList({
  refresh = 0,
  onOrder,
  onProductsLoaded,
}: ProductListProps) {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {

    let cancelled = false;

    const loadProducts = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await axiosClient.get(
            "/api/products"
          );

        console.log(
          "Products response:",
          response.data
        );


        let result: Product[] = [];

        if (
          Array.isArray(
            response.data
          )
        ) {

          result =
            response.data;

        } else if (
          Array.isArray(
            response.data?.data
          )
        ) {

          result =
            response.data.data;

        }


        if (!cancelled) {

          setProducts(result);

          onProductsLoaded?.(
            result
          );

        }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {

        console.error(
          "Products error:",
          error
        );

        if (!cancelled) {

          setError(
            error.response?.data
              ?.message ||
            "Unable to load products"
          );

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };

    loadProducts();

    return () => {
      cancelled = true;
    };

  }, [
    refresh,
    onProductsLoaded,
  ]);


  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (
    productId: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(
        productId
      );


      await axiosClient.delete(
        `/api/products/${productId}`
      );


      // Remove from UI immediately

      setProducts(
        (current) =>
          current.filter(
            (product) =>
              product.id !== productId
          )
      );


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      console.error(
        "Delete product error:",
        error
      );


      alert(
        error.response?.data
          ?.message ||
        "Unable to delete product"
      );

    } finally {

      setDeletingId(null);

    }

  };


  // ==========================================
  // ORDER
  // ==========================================

  const handleOrder = (
    product: Product
  ) => {

    if (product.stock <= 0) {

      alert(
        "This product is out of stock."
      );

      return;

    }


    if (onOrder) {

      onOrder(product);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-center gap-3 py-10">

          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />

          <span className="text-sm text-slate-500">
            Loading products...
          </span>

        </div>

      </section>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">

        <h2 className="font-semibold text-red-700">
          Unable to load products
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

      </section>

    );

  }


  // ==========================================
  // EMPTY
  // ==========================================

  if (products.length === 0) {

    return (

      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
          📦
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          No products
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Create your first product to see it here.
        </p>

      </section>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">


      {/* HEADER */}

      <div className="border-b border-slate-200 p-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
              📦
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Products
              </h2>

              <p className="text-xs text-slate-500">
                Manage products and inventory
              </p>

            </div>

          </div>


          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">

            {products.length} Products

          </span>

        </div>

      </div>


      {/* DESKTOP TABLE */}

      <div className="hidden overflow-x-auto md:block">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Product
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stock
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-slate-100">

            {products.map(
              (product) => (

                <tr
                  key={product.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* PRODUCT */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                        📦
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>

                        {product.description && (

                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {product.description}
                          </p>

                        )}

                      </div>

                    </div>

                  </td>


                  {/* PRICE */}

                  <td className="px-5 py-4">

                    <span className="font-semibold text-slate-900">

                      ₹
                      {Number(
                        product.price
                      ).toFixed(2)}

                    </span>

                  </td>


                  {/* STOCK */}

                  <td className="px-5 py-4">

                    {product.stock > 0 ? (

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        {product.stock} available

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                        Out of stock

                      </span>

                    )}

                  </td>


                  {/* ACTIONS */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {/* ORDER */}

                      <button
                        type="button"
                        disabled={
                          product.stock <= 0
                        }
                        onClick={() =>
                          handleOrder(
                            product
                          )
                        }
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      >
                        Order
                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          product.id
                        }
                        onClick={() =>
                          handleDelete(
                            product.id
                          )
                        }
                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {deletingId ===
                        product.id
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>


      {/* MOBILE */}

      <div className="space-y-4 p-4 md:hidden">

        {products.map(
          (product) => (

            <div
              key={product.id}
              className="rounded-xl border border-slate-200 p-4"
            >

              {/* TOP */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                    📦
                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-400">
                      Product #{product.id}
                    </p>

                  </div>

                </div>

                <span className="font-bold text-slate-900">

                  ₹
                  {Number(
                    product.price
                  ).toFixed(2)}

                </span>

              </div>


              {/* DESCRIPTION */}

              {product.description && (

                <p className="mt-4 text-sm text-slate-500">
                  {product.description}
                </p>

              )}


              {/* STOCK */}

              <div className="mt-4">

                {product.stock > 0 ? (

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

                    {product.stock} available

                  </span>

                ) : (

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                    Out of stock

                  </span>

                )}

              </div>


              {/* ACTIONS */}

              <div className="mt-4 grid grid-cols-2 gap-2">

                <button
                  type="button"
                  disabled={
                    product.stock <= 0
                  }
                  onClick={() =>
                    handleOrder(
                      product
                    )
                  }
                  className="rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400"
                >
                  🛒 Order
                </button>


                <button
                  type="button"
                  disabled={
                    deletingId ===
                    product.id
                  }
                  onClick={() =>
                    handleDelete(
                      product.id
                    )
                  }
                  className="rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >

                  {deletingId ===
                  product.id
                    ? "Deleting..."
                    : "🗑 Delete"}

                </button>

              </div>

            </div>

          )
        )}

      </div>

    </section>

  );
}