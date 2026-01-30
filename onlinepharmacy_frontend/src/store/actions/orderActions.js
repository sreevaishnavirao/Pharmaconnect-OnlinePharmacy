
import api from "../../api/api";
import {
  orderRequestStart,
  orderRequestFail,
  setAdminOrders,
} from "../reducers/orderReducer";

const apiPrefix = () => {
  const base = String(api?.defaults?.baseURL || "").replace(/\/+$/, "");
  return base.endsWith("/api") ? "" : "/api";
};

const normalizeOrdersResponse = (data) => {
 
  if (data && typeof data === "object" && Array.isArray(data.content)) {
    return {
      orders: data.content,
      totalPages: data.totalPages ?? 1,
      totalElements: data.totalElements ?? data.content.length ?? 0,
    };
  }
  if (data && typeof data === "object" && Array.isArray(data.orders)) {
    return {
      orders: data.orders,
      totalPages: data.totalPages ?? 1,
      totalElements: data.totalElements ?? data.orders.length ?? 0,
    };
  }
  if (Array.isArray(data)) {
    return { orders: data, totalPages: 1, totalElements: data.length };
  }

  return { orders: [], totalPages: 1, totalElements: 0 };
};
export const fetchAllOrdersForAdmin =
  (pageNumber = 0, pageSize = 10) =>
  async (dispatch) => {
    dispatch(orderRequestStart());
    try {
      const prefix = apiPrefix();
      const url = `${prefix}/admin/orders`;

      const res = await api.get(url, {
        params: { pageNumber, pageSize },
      });

      dispatch(setAdminOrders(normalizeOrdersResponse(res?.data)));
      return { success: true, data: res?.data };
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch admin orders";

      dispatch(orderRequestFail(msg));

      console.error("fetchAllOrdersForAdmin failed:", {
        status,
        urlTried: `${apiPrefix()}/admin/orders`,
        baseURL: api?.defaults?.baseURL,
        response: err?.response?.data,
      });

      return { success: false, error: msg, status };
    }
  };
export const placeOrder = (payload) => async (dispatch) => {
  dispatch(orderRequestStart());
  try {
    const prefix = apiPrefix();
    const paymentMethod = payload?.paymentMethod || "stripe";

    const url = `${prefix}/order/users/payments/${paymentMethod}`;
    const res = await api.post(url, payload);

    return { success: true, data: res?.data };
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.message || "Place order failed";
    dispatch(orderRequestFail(msg));
    return { success: false, error: msg };
  }
};
