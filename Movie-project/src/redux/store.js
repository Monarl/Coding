// store/store.js
import { configureStore } from '@reduxjs/toolkit';
// Import your reducers here
import movieReducer from './movieSlice'; // Example slice

export const store = configureStore({
  reducer: {
    movies: movieReducer, // Add your reducers here
  },
});

export default store;
