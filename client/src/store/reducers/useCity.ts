import { createSlice } from "@reduxjs/toolkit";

interface CityState {
  city: string;
}

const initialState: CityState = {
  city: "Алматы",
};

export const citySlice = createSlice({
  name: "city",
  initialState: initialState,
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    },
  },
});

export default citySlice.reducer;
