import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scoresApi = createApi({
  reducerPath: "scoresAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/",
  }),
  endpoints: (builder) => ({
    getProfiles: builder.query({
      query: (id) => `users/profile/{}`
    }),
    createRegistration: builder.mutation({
      query: (body) => ({
          url: "/register",
          method: "POST",
          body,
      }
      )
    })
  })
});

export const {useGetProfilesQuery, useCreateRegistrationMutation} = scoresApi;
