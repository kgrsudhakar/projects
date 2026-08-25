// src/api/axiosClient.ts

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",

  headers: {
    "Content-Type": "application/json",
  },
});


// ============================================
// REQUEST INTERCEPTOR
// ============================================

apiClient.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    console.log(
      "Axios Request:",
      config.method?.toUpperCase(),
      config.url
    );

    console.log(
      "JWT token:",
      token
    );


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;
  },

  (error) => {

    return Promise.reject(error);

  }
);


// ============================================
// RESPONSE INTERCEPTOR
// ============================================

apiClient.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    if (
      error.response?.status === 401
    ) {

      console.log(
        "JWT authentication failed"
      );

    }

    return Promise.reject(error);

  }

);


export default apiClient;