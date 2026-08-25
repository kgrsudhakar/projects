import { useState } from "react";

import type { Product } from "../types/product";

import {
  createOrder,
} from "../api/orderApi";


interface OrderFormProps {
  product: Product;
  onCreated: () => void;
}


export default function OrderForm({
  product,
  onCreated,
}: OrderFormProps) {

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    setError("");


    try {

      setLoading(true);

      await createOrder({
        productId: product.id,
        quantity,
      });

      onCreated();

    } catch (error) {

      console.error(error);

      setError(
        "Failed to create order"
      );

    } finally {

      setLoading(false);

    }
  };


  const total =
    Number(product.price) * quantity;


  return (
    <div className="order-container">

      <h2>
        Create Order
      </h2>

      <p>
        Product:
        <strong>
          {" "}
          {product.name}
        </strong>
      </p>

      <p>
        Price: ₹
        {Number(product.price)
          .toLocaleString()}
      </p>

      <form onSubmit={handleSubmit}>

        <label>
          Quantity
        </label>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) =>
            setQuantity(
              Number(event.target.value)
            )
          }
        />

        <h3>
          Total: ₹
          {total.toLocaleString()}
        </h3>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Order"}
        </button>

      </form>

    </div>
  );
}