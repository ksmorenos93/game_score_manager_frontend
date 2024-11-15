import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const scoresApi = createApi({
  reducerPath: "scoresAPI", 
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/", // Base URL
  }),
  endpoints: (builder) => ({
    // Fetch leaderboard scores
    getLeaderboard: builder.query({
      query: () => "scores", // Endpoint for leaderboard
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetLeaderboardQuery, // Hook for leaderboard query
} = scoresApi;
