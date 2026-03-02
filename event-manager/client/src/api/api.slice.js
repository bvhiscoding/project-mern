import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "../store/slices/auth.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        user: response?.data?.user ?? response?.user ?? null,
        token: response?.data?.token ?? response?.token ?? null,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response) => ({
        user: response?.data?.user ?? response?.user ?? null,
        token: response?.data?.token ?? response?.token ?? null,
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      transformResponse: (response) =>
        response?.data?.user ?? response?.data ?? response?.user ?? null,
      providesTags: ["User"],
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation, useGetMeQuery } =
  apiSlice;
export default apiSlice;
