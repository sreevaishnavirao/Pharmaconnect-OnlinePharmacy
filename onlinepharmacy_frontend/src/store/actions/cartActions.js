
import api from "../../api/api";
import { CART_LOADING, CART_SUCCESS, CART_ERROR } from "./actionTypes";

export const clearCart = () => ({ type: "CLEAR_CART" });

const dispatchCart = (dispatch, data) => {
  dispatch({ type: CART_SUCCESS, payload: data });
};

export const fetchUserCart = () => async (dispatch) => {
  dispatch({ type: CART_LOADING });
  try {
    const res = await api.get("/carts/users/cart");
    dispatchCart(dispatch, res.data);
  } catch (e) {
    dispatch({
      type: CART_ERROR,
      payload:
        e?.response?.data?.message || e?.message || "Failed to fetch cart",
    });
  }
};
const incrementCart = async (productId, times = 1) => {
  const t = Math.max(1, Number(times || 1));
  for (let i = 0; i < t; i++) {
    await api.put(`/carts/products/${productId}/quantity/add`);
  }
};

export const addToCart = (productId, quantity = 1, toast) => async (dispatch) => {
  dispatch({ type: CART_LOADING });

  try {

    const res = await api.post(`/carts/products/${productId}/quantity/${quantity}`);
    dispatchCart(dispatch, res.data);

    toast?.success?.("Added to cart");
    return { ok: true };
  } catch (e) {
    const status = e?.response?.status;
    const msg = String(e?.response?.data?.message || e?.message || "");

    
    const alreadyExists =
      status === 400 ||
      status === 409 ||
      msg.toLowerCase().includes("already exists") ||
      msg.toLowerCase().includes("already in the cart") ||
      msg.toLowerCase().includes("exists in the cart");

    if (alreadyExists) {
      try {
        await incrementCart(productId, quantity);
        const cartRes = await api.get("/carts/users/cart");
        dispatchCart(dispatch, cartRes.data);

        toast?.success?.("Added to cart");
        return { ok: true, incremented: true };
      } catch (incErr) {
        dispatch({
          type: CART_ERROR,
          payload:
            incErr?.response?.data?.message ||
            incErr?.message ||
            "Failed to update cart quantity",
        });
        toast?.error?.("Failed to update cart");
        return { ok: false };
      }
    }
    if (status === 401) {
      return { ok: false, unauthorized: true };
    }
    dispatch({
      type: CART_ERROR,
      payload: e?.response?.data?.message || e?.message || "Failed to add to cart",
    });
    toast?.error?.("Failed to add to cart");
    return { ok: false };
  }
};

export const updateCartQty = (productId, operation) => async (dispatch) => {
  dispatch({ type: CART_LOADING });
  try {
    const res = await api.put(`/carts/products/${productId}/quantity/${operation}`);
    dispatchCart(dispatch, res.data);
  } catch (e) {
    dispatch({
      type: CART_ERROR,
      payload:
        e?.response?.data?.message || e?.message || "Failed to update quantity",
    });
  }
};

export const deleteFromCart = (cartId, productId) => async (dispatch) => {
  dispatch({ type: CART_LOADING });
  try {
    await api.delete(`/carts/${cartId}/product/${productId}`);
    const res = await api.get("/carts/users/cart");
    dispatchCart(dispatch, res.data);
  } catch (e) {
    dispatch({
      type: CART_ERROR,
      payload:
        e?.response?.data?.message || e?.message || "Failed to delete item",
    });
  }
};
