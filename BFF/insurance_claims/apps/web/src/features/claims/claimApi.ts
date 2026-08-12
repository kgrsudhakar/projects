import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

/* =========================
   Claim Type
========================= */

export interface Claim {
  id: string;

  claimNumber: string;

  policyId: string;

  customerId?: string;

  claimType?: string;

  description?: string;

  claimAmount: string | number;

  approvedAmount?: string | number;

  status: string;

  incidentDate?: string;

  createdAt: string;

  updatedAt?: string;

  policy?: {
    id: string;
    policyNumber: string;
    policyType: string;
  };

  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  adjuster?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/* =========================
   API Response
========================= */

interface ClaimsResponse {
  success: boolean;

  message: string;

  data: Claim[];
}

/* =========================
   Create Claim Request
========================= */

export interface CreateClaimRequest {
  policyId: string;

  customerId?: string;

  claimType?: string;

  description?: string;

  claimAmount: number;

  incidentDate?: string;
}

/* =========================
   Update Claim Request
========================= */

export interface UpdateClaimRequest {
  id: string;

  claimType?: string;

  description?: string;

  claimAmount?: number;

  approvedAmount?: number;

  status?: string;

  incidentDate?: string;
}

/* =========================
   API
========================= */

export const claimsApi = createApi({
  reducerPath: "claimsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.set(
          "Authorization",
          `Bearer ${token}`
        );
      }

      headers.set(
        "Content-Type",
        "application/json"
      );

      return headers;
    },
  }),

  tagTypes: ["Claim"],

  endpoints: (builder) => ({

    /* =========================
       GET ALL CLAIMS
    ========================= */

    getClaims: builder.query<Claim[], void>({
      query: () => "/claims",

      transformResponse: (
        response: ClaimsResponse
      ) => {
        return response.data;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((claim) => ({
                type: "Claim" as const,
                id: claim.id,
              })),

              {
                type: "Claim" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Claim" as const,
                id: "LIST",
              },
            ],
    }),

    /* =========================
       GET CLAIM BY ID
    ========================= */

    getClaimById: builder.query<Claim, string>({
      query: (id) => `/claims/${id}`,

      transformResponse: (
        response: {
          success: boolean;
          message: string;
          data: Claim;
        }
      ) => {
        return response.data;
      },

      providesTags: (_result, _error, id) => [
        {
          type: "Claim",
          id,
        },
      ],
    }),

    /* =========================
       CREATE CLAIM
    ========================= */

    createClaim: builder.mutation<
      Claim,
      CreateClaimRequest
    >({
      query: (body) => ({
        url: "/claims",
        method: "POST",
        body,
      }),

      transformResponse: (
        response: {
          success: boolean;
          message: string;
          data: Claim;
        }
      ) => {
        return response.data;
      },

      invalidatesTags: [
        {
          type: "Claim",
          id: "LIST",
        },
      ],
    }),

    /* =========================
       UPDATE CLAIM
    ========================= */

    updateClaim: builder.mutation<
      Claim,
      UpdateClaimRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/claims/${id}`,
        method: "PUT",
        body,
      }),

      transformResponse: (
        response: {
          success: boolean;
          message: string;
          data: Claim;
        }
      ) => {
        return response.data;
      },

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Claim",
          id,
        },

        {
          type: "Claim",
          id: "LIST",
        },
      ],
    }),

    /* =========================
       DELETE CLAIM
    ========================= */

    deleteClaim: builder.mutation<
      { success: boolean },
      string
    >({
      query: (id) => ({
        url: `/claims/${id}`,
        method: "DELETE",
      }),

      transformResponse: (
        response: {
          success: boolean;
          message: string;
        }
      ) => {
        return {
          success: response.success,
        };
      },

      invalidatesTags: [
        {
          type: "Claim",
          id: "LIST",
        },
      ],
    }),

  }),
});

/* =========================
   Export Hooks
========================= */

export const {
  useGetClaimsQuery,
  useGetClaimByIdQuery,
  useCreateClaimMutation,
  useUpdateClaimMutation,
  useDeleteClaimMutation,
} = claimsApi;