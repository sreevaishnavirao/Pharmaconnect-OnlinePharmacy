
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_BACK_END_URL
    ? `${import.meta.env.VITE_BACK_END_URL.replace(/\/+$/, "")}/api`
    : "http://localhost:8080/api";

const getAuthToken = () => {
  try {
    const raw = localStorage.getItem("auth");
    const auth = raw ? JSON.parse(raw) : null;

    const token =
      auth?.jwtToken || auth?.accessToken || auth?.token || auth?.jwt || "";

    if (!token) return "";

    const s = String(token);


    const m = s.match(/onlinepharmacy=([^;]+)/i);
    if (m?.[1]) return m[1].trim();

    if (s.split(".").length === 3 && !s.includes(";")) return s.trim();

  
    return s.split(";")[0].trim();
  } catch {
    return "";
  }
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `Request failed (${res.status})`;

    if (res.status === 401 || res.status === 403) {
      toast.error("Unauthorized. Please login again as admin.");
    } else {
      toast.error(msg);
    }

    throw new Error(msg);
  }

  return data;
};
export const analyticsAction = () => async (dispatch) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    const data = await request("/admin/app/analytics");

    dispatch({ type: "ADMIN_SET_ANALYTICS", payload: data });
    dispatch({ type: "SET_LOADING", payload: false });
  } catch (err) {
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({
      type: "SET_ERROR",
      payload: err?.message || "Failed to load analytics",
    });
  }
};

export const adminFetchProducts =
  (pageNumber = 0, pageSize = 50) =>
  async (dispatch) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const data = await request(
        `/admin/products?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );

      dispatch({ type: "ADMIN_SET_PRODUCTS", payload: data });
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SET_ERROR",
        payload: err?.message || "Failed to load products",
      });
    }
  };

export const adminUpdateProduct =
  (productId, payload) =>
  async (dispatch) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const updated = await request(`/admin/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      dispatch({ type: "ADMIN_UPDATE_PRODUCT_SUCCESS", payload: updated });
      toast.success("Product updated successfully");
      dispatch({ type: "SET_LOADING", payload: false });

      return { ok: true, data: updated };
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SET_ERROR",
        payload: err?.message || "Update failed",
      });
      return { ok: false, error: err?.message || "Update failed" };
    }
  };

export const adminCreateProduct =
  (payload) =>
  async (dispatch) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const created = await request(`/admin/products`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      dispatch({ type: "ADMIN_CREATE_PRODUCT_SUCCESS", payload: created });
      toast.success("Product created successfully");
      dispatch({ type: "SET_LOADING", payload: false });

      return { ok: true, data: created };
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SET_ERROR",
        payload: err?.message || "Create failed",
      });
      return { ok: false, error: err?.message || "Create failed" };
    }
  };

export const adminDeleteProduct =
  (productId) =>
  async (dispatch) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      await request(`/admin/products/${productId}`, {
        method: "DELETE",
      });

      dispatch({ type: "ADMIN_DELETE_PRODUCT_SUCCESS", payload: productId });
      toast.success("Product deleted");
      dispatch({ type: "SET_LOADING", payload: false });

      return { ok: true };
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SET_ERROR",
        payload: err?.message || "Delete failed",
      });
      return { ok: false, error: err?.message || "Delete failed" };
    }
  };
export const adminFetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    const data = await request(`/public/categories`);
    const list = Array.isArray(data) ? data : (data?.content || []);

    dispatch({ type: "ADMIN_SET_CATEGORIES", payload: list });
    dispatch({ type: "SET_LOADING", payload: false });

    return { ok: true, data: list };
  } catch (err) {
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({
      type: "SET_ERROR",
      payload: err?.message || "Failed to load categories",
    });
    return { ok: false, error: err?.message || "Failed to load categories" };
  }
};
export const adminCreateCategory = (categoryName) => async (dispatch) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    const created = await request(`/admin/categories`, {
      method: "POST",
      body: JSON.stringify({ categoryName }),
    });

    dispatch({ type: "ADMIN_CREATE_CATEGORY_SUCCESS", payload: created });
    toast.success("Category created");
    await dispatch(adminFetchCategories());

    dispatch({ type: "SET_LOADING", payload: false });
    return { ok: true, data: created };
  } catch (err) {
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({
      type: "SET_ERROR",
      payload: err?.message || "Create category failed",
    });
    return { ok: false, error: err?.message || "Create category failed" };
  }
};
export const adminDeleteCategory = (categoryId) => async (dispatch) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    await request(`/admin/categories/${categoryId}`, { method: "DELETE" });

    dispatch({ type: "ADMIN_DELETE_CATEGORY_SUCCESS", payload: categoryId });
    toast.success("Category deleted");

    await dispatch(adminFetchCategories());

    dispatch({ type: "SET_LOADING", payload: false });
    return { ok: true };
  } catch (err) {
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({
      type: "SET_ERROR",
      payload: err?.message || "Delete category failed",
    });
    return { ok: false, error: err?.message || "Delete category failed" };
  }
};

export const adminUpdateCategory =
  (categoryId, payload) =>
  async (dispatch) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const updated = await request(`/admin/categories/${categoryId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      dispatch({ type: "SET_LOADING", payload: false });
      return { ok: true, data: updated };
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SET_ERROR",
        payload: err?.message || "Update category failed",
      });
      return { ok: false, error: err?.message || "Update category failed" };
    }
  };
