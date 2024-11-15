import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/", // The base URL of your API
  }),
  endpoints: (builder) => ({
    getProfiles: builder.query({
      query: (userId) => `users/${userId}`,
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
      query: () => 'users', // GET request to fetch all users
    }),

    // New mutation to change user status
    changeUserStatus: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`, // Assuming this is your API endpoint
        method: 'PATCH',
      }),
    }),

    // New mutation to delete a user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProfilesQuery,
  useCreateRegistrationMutation,
  useUserLoginMutation,
  useGetUsersQuery,
  useChangeUserStatusMutation, // Export the mutation hook for changing user status
  useDeleteUserMutation, // Export the mutation hook for deleting users
} = usersApi;
