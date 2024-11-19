import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/", // The base URL of your API
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Use 'Bearer' with the token
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfiles: builder.query({
      query: (userId) => `users/${userId}`,
    }),
    getUserScores: builder.query({
      query: (userId) => `scores/leaderboard`,
    }),
    createRegistration: builder.mutation({
      query: (formDataNewUser) => ({
        url: "users",
        method: "POST",
        body: formDataNewUser,
      }),
    }),
    userLogin: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUsers: builder.query({
      query: () => "users", // GET request to fetch all users
    }),
    changeUserStatus: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "PATCH",
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProfilesQuery,
  useCreateRegistrationMutation,
  useUserLoginMutation,
  useGetUsersQuery,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
} = usersApi;
