import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

export const fetchMovies = createAsyncThunk(
  "movies/fetch",
  async ({ query, genre, page }, { rejectWithValue, signal }) => {
    try {
      let res;
      if (query) {
        res = await api.get("/search/movie", { params: { query, page }, signal });
      } else if (genre) {
        res = await api.get("/discover/movie", {
          params: { with_genres: genre, page, sort_by: "popularity.desc" },
          signal,
        });
      } else {
        res = await api.get("/movie/popular", { params: { page }, signal });
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: { items: [], totalPages: 1, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload.results;
        state.totalPages = Math.min(payload.total_pages, 500); // TMDB caps at 500
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        if (action.meta.aborted) return; // cancelled by useEffect cleanup
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default moviesSlice.reducer;
