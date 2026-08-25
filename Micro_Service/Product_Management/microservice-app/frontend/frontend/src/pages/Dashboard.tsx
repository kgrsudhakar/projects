import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import OrderList from "../components/OrderList";
import OrderModal from "../components/OrderModal";


// =====================================================
// TYPES
// =====================================================

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
}

interface Order {
    id: number;
    userId?: number;
    totalAmount?: number;
    status?: string;
}


// =====================================================
// DASHBOARD
// =====================================================

export default function Dashboard() {

    const navigate = useNavigate();


    // ===================================================
    // USER
    // ===================================================

    const [user, setUser] =
        useState<User | null>(null);


    // ===================================================
    // REFRESH
    // ===================================================

    const [productRefresh, setProductRefresh] =
        useState(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderRefresh, setOrderRefresh] =
        useState(0);


  const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null);


    // ===================================================
    // DASHBOARD COUNTERS
    // ===================================================

    const [productCount, setProductCount] =
        useState(0);

    const [orderCount, setOrderCount] =
        useState(0);

    const [inventoryCount, setInventoryCount] =
        useState(0);


    // ===================================================
    // LOAD USER
    // ===================================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const storedUser =
            localStorage.getItem("user");


        if (!token || !storedUser) {
            navigate("/login", {
                replace: true,
            });
            return;
        }

        try {
            setUser(
                JSON.parse(storedUser)
            );
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", {
                replace: true,
            });
        }
    }, [navigate]);


    // ===================================================
    // PRODUCTS LOADED
    // ===================================================

    const handleProductsLoaded = (
        products: Product[]
    ) => {
        console.log("Dashboard products:",
            products
        );

        // Total products
        setProductCount(products.length);

        // Total inventory / stock
        const totalStock =
            products.reduce(
                (
                    total,
                    product
                ) => {
                    return (
                        total +
                        Number(
                            product.stock || 0
                        )
                    );
                },
                0
            );
        setInventoryCount(totalStock);
    };

    // ===================================================
    // ORDERS LOADED
    // ===================================================

    const handleOrdersLoaded = (
        orders: Order[]
    ) => {

        console.log(
            "Dashboard orders:",
            orders
        );
        setOrderCount(
            orders.length
        );
    };


    // ===================================================
    // PRODUCT CREATED
    // ===================================================

    const handleProductCreated = () => {
        console.log(
            "Product created - refreshing"
        );

        setProductRefresh(
            (value) => value + 1
        );
    };

    // ===================================================
    // ORDER CREATED
    // ===================================================

    //   const handleOrderCreated = () => {

    //     console.log(
    //       "Order created - refreshing products and orders"
    //     );


    //     // Product stock changed

    //     setProductRefresh(
    //       (value) => value + 1
    //     );


    //     // Orders changed

    //     setOrderRefresh(
    //       (value) => value + 1
    //     );

    //   };


    // ===================================================
    // ORDER BUTTON
    // ===================================================

    const handleCreateOrder = (
        product: Product
    ) => {

        console.log(
            "Order product:",
            product
        );

        setSelectedProduct(product);

        /*
         * Your order modal/API can be called here.
         *
         * After successful order creation:
         *
         * handleOrderCreated();
         */

    };


    // ===================================================
    // LOGOUT
    // ===================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/login", {
            replace: true,
        });

    };

    const handleOrderSuccess = () => {

  console.log(
    "Order created successfully"
  );


  // Reload products
  // This updates stock + inventory

  setProductRefresh(
    value => value + 1
  );


  // Reload orders

  setOrderRefresh(
    value => value + 1
  );

};


    // ===================================================
    // UI
    // ===================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* =================================================
          HEADER
      ================================================= */}

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


                    {/* LOGO */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white">
                            🛒
                        </div>

                        <div>

                            <h1 className="text-base font-bold text-slate-900">
                                MicroShop
                            </h1>

                            <p className="hidden text-xs text-slate-400 sm:block">
                                Microservice Dashboard
                            </p>

                        </div>

                    </div>


                    {/* USER */}

                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name}
                            </p>

                            <p className="text-xs text-slate-400">
                                {user?.email}
                            </p>

                        </div>


                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">

                            {user?.name
                                ?.charAt(0)
                                .toUpperCase()}

                        </div>


                        <button
                            onClick={
                                handleLogout
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >

                            Logout

                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
          MAIN
      ================================================= */}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


                {/* TITLE */}

                <div className="mb-8">

                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage products, inventory and orders
                    </p>

                </div>


                {/* =================================================
            STATS
        ================================================= */}

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


                    {/* PRODUCTS */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Total Products
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {productCount}
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                                📦
                            </div>

                        </div>

                    </div>


                    {/* ORDERS */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Total Orders
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {orderCount}
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                                🛍️
                            </div>

                        </div>

                    </div>


                    {/* INVENTORY */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Total Inventory
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {inventoryCount}
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl">
                                📊
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
            PRODUCT FORM + ORDERS
        ================================================= */}

                <div className="mb-8 grid gap-6 lg:grid-cols-[380px_1fr]">


                    {/* PRODUCT FORM */}

                    <ProductForm
                        onCreated={
                            handleProductCreated
                        }
                    />


                    {/* ORDERS */}

                    <OrderList
                        refresh={
                            orderRefresh
                        }
                        onOrdersLoaded={
                            handleOrdersLoaded
                        }
                    />

                </div>


                {/* =================================================
            PRODUCTS
        ================================================= */}

                <ProductList
                    refresh={
                        productRefresh
                    }
                    onOrder={
                        handleCreateOrder
                    }
                    onProductsLoaded={
                        handleProductsLoaded
                    }
                />

            </main>

            <OrderModal
  product={selectedProduct}
  onClose={() =>
    setSelectedProduct(null)
  }
  onSuccess={
    handleOrderSuccess
  }
/>

        </div>

    );
}