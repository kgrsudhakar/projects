import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  policyType: string;
  customerId: string;
  premiumAmount: string | number;
  coverageAmount: string | number;
  deductibleAmount: string | number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

export interface PolicyResponse {
  success: boolean;
  message: string;
  data: Policy[];
}

export const policyApi = createApi({
  reducerPath: "policyApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Policy"],

  endpoints: (builder) => ({
    getPolicies: builder.query<Policy[], void>({
      query: () => "/policies",

      transformResponse: (response: PolicyResponse) => response.data,

      providesTags: ["Policy"],
    }),
  }),
});

export const {
  useGetPoliciesQuery,
} = policyApi;