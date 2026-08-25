import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(
        email,
        password
      );

      console.log(
        "Login response:",
        response
      );

      if (!response.success) {
        setError(
          response.message ||
            "Login failed"
        );
        return;
      }

      const token =
        response.data.token;

      const user =
        response.data.user;

      // Save authentication data
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log(
        "JWT received:",
        token
      );

      console.log(
        "User received:",
        user
      );

      // Navigate dashboard
      navigate("/dashboard", {
        replace: true,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex min-h-screen">

        {/* =================================
            LEFT SIDE
        ================================= */}

        <div className="relative hidden w-1/2 overflow-hidden bg-indigo-700 lg:flex">

          {/* Background decoration */}

          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-500 opacity-30 blur-3xl" />

          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-500 opacity-30 blur-3xl" />


          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-20">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-lg">
                🛒
              </div>

              <span className="text-xl font-bold text-white">
                MicroShop
              </span>

            </div>


            {/* Content */}

            <div className="max-w-lg">

              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-200">
                Microservice Application
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Manage your products,
                inventory and orders.
              </h1>

              <p className="mt-6 text-base leading-7 text-indigo-100">
                A modern full-stack application
                built using React, TypeScript,
                Node.js and PostgreSQL.
              </p>


              {/* Features */}

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-white">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    ✓
                  </div>

                  <span className="text-sm">
                    Product management
                  </span>

                </div>


                <div className="flex items-center gap-3 text-white">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    ✓
                  </div>

                  <span className="text-sm">
                    Inventory management
                  </span>

                </div>


                <div className="flex items-center gap-3 text-white">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    ✓
                  </div>

                  <span className="text-sm">
                    Order management
                  </span>

                </div>

              </div>

            </div>


            <p className="text-xs text-indigo-200">
              © 2026 MicroShop
            </p>

          </div>

        </div>


        {/* =================================
            RIGHT SIDE
        ================================= */}

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">

          <div className="w-full max-w-md">


            {/* Mobile Logo */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg">
                🛒
              </div>

              <span className="text-xl font-bold text-slate-900">
                MicroShop
              </span>

            </div>


            {/* Card */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">

              {/* Header */}

              <div className="mb-7">

                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to your account
                  to continue.
                </p>

              </div>


              {/* Error */}

              {error && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>

              )}


              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ✉
                    </span>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="sudhakar@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                  </div>

                </div>


                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      🔒
                    </span>

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-16 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-indigo-600"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>


                {/* Login button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}

                </button>

              </form>


              {/* Register */}

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">

                  Don't have an account?

                  <Link
                    to="/register"
                    className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Create account
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}