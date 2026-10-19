import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice.js";
import watchlistReducer from "./watchlistSlice.js";

// The watchlist now lives in PostgreSQL, so no localStorage persistence here.
const store = configureStore({
  reducer: { movies: moviesReducer, watchlist: watchlistReducer },
});

export default store;
