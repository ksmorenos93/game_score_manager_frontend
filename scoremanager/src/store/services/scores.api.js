import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scoresApi = createApi({
  reducerPath: "scoresAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/",
  }),
  endpoints: (builder) => ({
    getProfiles: builder.query({
      query: (userId) => `users/profile/${userId}`,
    }),

    getUserScores: builder.query({
      query: (userId) => `scores/leaderboard`,
    }),

    createRegistration: builder.mutation({
      query: (formDataNewUser) => ({
        url: "auth/register",
        method: "POST",
        body: formDataNewUser
      }),
    }),

    // New login endpoint
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetProfilesQuery, 
  useCreateRegistrationMutation, 
  useUserLoginMutation // Export the login hook
} = scoresApi;
