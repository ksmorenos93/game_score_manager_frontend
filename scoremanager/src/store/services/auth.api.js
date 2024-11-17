import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/", // Base URL
  }),
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login", // Endpoint for login
        method: "POST",   // HTTP method
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials, // Payload (email and password)
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation, // Hook for login mutation
} = authApi;
