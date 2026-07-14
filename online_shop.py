def create_order(order_id, *items, **shipping):
    print(f"Order ID: {order_id}")

    print("\nItems:")
    for item in items:
        print("-", item)

    print("\nShipping Details:")
    for key, value in shipping.items():
        print(f"{key}: {value}")

create_order(
    101,
    "Laptop",
    "Mouse",
    "Keyboard",
    "pendrive",
    name="John",
    city="Hyderabad",
    pincode="500072"
)