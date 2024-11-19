import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/", // Base URL
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Add 'Authorization' header with the token
      }
      headers.set("accept", "*/*"); // Optionally set other headers, like accept
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login", // Endpoint for login
        method: "POST",    // HTTP method
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials, // Payload (email and password)
      }),
    }),
    // Validate token query
    validateToken: builder.query({
      query: () => ({
        url: "auth/token-validate", // Endpoint for token validation
        method: "GET",              // HTTP method
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,    // Hook for login mutation
  useValidateTokenQuery, // Hook for token validation
} = authApi;
