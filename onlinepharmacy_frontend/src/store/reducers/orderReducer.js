
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  totalPages: 1,
  totalElements: 0,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderRequestStart(state) {
      state.loading = true;
      state.error = null;
    },
    orderRequestFail(state, action) {
      state.loading = false;
      state.error = action.payload || "Request failed";
    },
    setAdminOrders(state, action) {
      state.loading = false;
      state.error = null;
      state.orders = action.payload?.orders || [];
      state.totalPages = action.payload?.totalPages || 1;
      state.totalElements = action.payload?.totalElements || 0;
    },
    clearOrders(state) {
      state.orders = [];
      state.totalPages = 1;
      state.totalElements = 0;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  orderRequestStart,
  orderRequestFail,
  setAdminOrders,
  clearOrders,
} = orderSlice.actions;


export const orderReducer = orderSlice.reducer;


export default orderSlice.reducer;
