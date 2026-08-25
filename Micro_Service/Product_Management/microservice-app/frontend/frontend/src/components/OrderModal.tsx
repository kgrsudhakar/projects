import { useState } from "react";
import type { FormEvent } from "react";

import axiosClient from "../api/axiosClient";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface OrderModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderModal({
  product,
  onClose,
  onSuccess,
}: OrderModalProps) {

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  if (!product) {
    return null;
  }


  const total =
    Number(product.price) *
    quantity;


  const increaseQuantity = () => {

    setQuantity(
      current => {

        if (
          current >=
          product.stock
        ) {
          return current;
        }

        return current + 1;
      }
    );

  };


  const decreaseQuantity = () => {

    setQuantity(
      current =>
        Math.max(
          1,
          current - 1
        )
    );

  };


  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");


    if (quantity <= 0) {

      setError(
        "Quantity must be greater than 0"
      );

      return;
    }


    if (
      quantity >
      product.stock
    ) {

      setError(
        "Quantity exceeds available stock"
      );

      return;
    }


    try {

      setLoading(true);


      const response =
        await axiosClient.post(
          "/api/orders",
          {
            productId:
              product.id,

            quantity:
              quantity,

            totalAmount:
              total,
          }
        );


      console.log(
        "Order created:",
        response.data
      );


      // Notify Dashboard

      onSuccess();


      // Close modal

      onClose();


    } catch (error: any) {

      console.error(
        "Create order error:",
        error
      );


      setError(
        error.response?.data
          ?.message ||
        "Failed to create order"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">


      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">


        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Create Order
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Place a new order
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>

        </div>


        {/* BODY */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5 p-5"
        >


          {/* PRODUCT */}

          <div className="rounded-xl bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="font-semibold text-slate-900">
                  {product.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">

                  ₹
                  {Number(
                    product.price
                  ).toFixed(2)}{" "}
                  / item

                </p>

              </div>


              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                📦
              </div>

            </div>


            <div className="mt-3 border-t border-slate-200 pt-3">

              <p className="text-xs text-slate-500">
                Available stock
              </p>

              <p className="mt-1 font-semibold text-emerald-600">
                {product.stock}
              </p>

            </div>

          </div>


          {/* QUANTITY */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Quantity
            </label>


            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                className="h-11 w-11 rounded-xl border border-slate-200 bg-white text-lg font-bold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>


              <div className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-900">
                {quantity}
              </div>


              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  quantity >=
                  product.stock
                }
                className="h-11 w-11 rounded-xl bg-indigo-600 text-lg font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                +
              </button>

            </div>

          </div>


          {/* TOTAL */}

          <div className="flex items-center justify-between rounded-xl bg-indigo-50 p-4">

            <span className="text-sm font-medium text-indigo-700">
              Total
            </span>

            <span className="text-xl font-bold text-indigo-900">

              ₹
              {total.toFixed(2)}

            </span>

          </div>


          {/* ERROR */}

          {error && (

            <div className="rounded-lg border border-red-200 bg-red-50 p-3">

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

          )}


          {/* ACTIONS */}

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "Creating..."
                : "Place Order"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}