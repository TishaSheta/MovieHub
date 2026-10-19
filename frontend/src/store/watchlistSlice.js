import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backend from "../services/backend.js";

export const fetchWatchlist = createAsyncThunk("watchlist/fetch", async () => {
  const { data } = await backend.get("/watchlist");
  return data;
});

export const addToWatchlist = createAsyncThunk("watchlist/add", async (movie) => {
  const { id, title, poster_path, vote_average, release_date } = movie;
  const { data } = await backend.post("/watchlist", { id, title, poster_path, vote_average, release_date });
  return data;
});

export const removeFromWatchlist = createAsyncThunk("watchlist/remove", async (id) => {
  await backend.delete(`/watchlist/${id}`);
  return id;
});

export const clearWatchlist = createAsyncThunk("watchlist/clear", async () => {
  await backend.delete("/watchlist");
});

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: { items: [] },
  reducers: {
    reset(state) {
      state.items = []; // used on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.fulfilled, (state, { payload }) => {
        state.items = payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, { payload }) => {
        if (!state.items.some((m) => m.id === payload.id)) state.items.unshift(payload);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((m) => m.id !== payload);
      })
      .addCase(clearWatchlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { reset } = watchlistSlice.actions;
export default watchlistSlice.reducer;
