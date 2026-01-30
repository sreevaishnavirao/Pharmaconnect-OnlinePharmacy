
import api from "../../api/api";
export * from "./adminActions";
import { FaFileMedical } from "react-icons/fa";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaThList,
  FaStore,
} from "react-icons/fa";

const useMockData = () =>
  String(import.meta.env.VITE_USE_MOCK_DATA).toLowerCase() === "true";

const BACKEND = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";

const calcTotal = (items = []) =>
  items.reduce(
    (acc, cur) =>
      acc +
      Number(cur?.specialPrice ?? cur?.price ?? 0) * Number(cur?.quantity ?? 0),
    0
  );

const saveCartToStorage = (cart = []) => {
  localStorage.setItem("cartItems", JSON.stringify(cart));
};
const isFetching = () => ({ type: "IS_FETCHING" });
const isSuccess = () => ({ type: "IS_SUCCESS" });
const isError = (message) => ({ type: "IS_ERROR", payload: message });
const btnLoader = () => ({ type: "BUTTON_LOADER" });

const normalizeProduct = (p) => {
  const strImg = p?.image != null ? String(p.image) : "";
  const PHARMACY_PLACEHOLDER = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop";

  const imageUrl =
    !strImg || strImg === "default.png"
      ? PHARMACY_PLACEHOLDER
      : strImg.startsWith("http://") ||
        strImg.startsWith("https://") ||
        strImg.startsWith("data:")
      ? strImg
      : `${BACKEND}/images/${strImg.replace(/^\/+/, "")}`;

  return {
    ...p,
    id: p?.productId ?? p?.id,
    productId: p?.productId ?? p?.id,
    title: p?.productName ?? p?.title ?? "",
    name: p?.productName ?? p?.name ?? "",
    productName: p?.productName ?? p?.name ?? "",
    description: p?.description ?? "",
    price: Number(p?.specialPrice ?? p?.price ?? 0),
    originalPrice: Number(p?.price ?? 0),
    discount: Number(p?.discount ?? 0),
    quantity: Number(p?.quantity ?? 0),
    stock: Number(p?.quantity ?? 0),
    inStock: Number(p?.quantity ?? 0) > 0,
    image: p?.image ?? null,
    imageUrl,
  };
};
const extractJwtToken = (value) => {
  if (!value) return "";
  const s = String(value);

  const m = s.match(/onlinepharmacy=([^;]+)/i);
  if (m?.[1]) return m[1].trim();

  if (s.split(".").length === 3 && !s.includes(";")) return s.trim();

  return s.split(";")[0].trim();
};

export const fetchProducts = (queryString = "") => async (dispatch) => {
  try {
    dispatch(isFetching());

    const params = new URLSearchParams(queryString);
    const category = params.get("category");
    const keyword = params.get("keyword");

   
    let endpoint = `/public/products?${params.toString()}`;


    if (category && category !== "all") {
      params.delete("category");
      endpoint = `/public/categories/${encodeURIComponent(
        category
      )}/products?${params.toString()}`;
    }

  
    if (keyword && keyword.trim()) {
      params.delete("keyword");
      endpoint = `/public/products/keyword/${encodeURIComponent(
        keyword.trim()
      )}?${params.toString()}`;
    }

    const res = await api.get(endpoint);
    const data = res.data;

    const raw = Array.isArray(data) ? data : data?.content || [];
    const normalized = raw.map(normalizeProduct);

    dispatch({
      type: "FETCH_PRODUCTS",
      payload: normalized,
      pageNumber: data?.pageNumber ?? 0,
      pageSize: data?.pageSize ?? normalized.length,
      totalElements: data?.totalElements ?? normalized.length,
      totalPages: data?.totalPages ?? 1,
      lastPage: data?.lastPage ?? true,
    });

    dispatch(isSuccess());
  } catch (err) {
    console.log(err);
    dispatch(
      isError(
        err?.response?.data?.message || err?.message || "Failed to load products"
      )
    );
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(isFetching());

    const res = await api.get("/public/categories");
    const data = res.data;

    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data?.content || [],
      pageNumber: data?.pageNumber ?? 0,
      pageSize: data?.pageSize ?? 50,
      totalElements: data?.totalElements ?? (data?.content?.length || 0),
      totalPages: data?.totalPages ?? 1,
      lastPage: data?.lastPage ?? true,
    });

    dispatch(isSuccess());
  } catch (err) {
    console.log(err);
    dispatch(
      isError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load categories"
      )
    );
  }
};

export const dashboardProductsAction = (queryString = "") =>
  fetchProducts(queryString);

export const authenticateSignInUser =
  (sendData, toast, navigate) => async (dispatch, getState) => {
    try {
      dispatch(btnLoader());

      const res = await api.post("/auth/signin", sendData);
      const data = res.data || {};
      const cleanToken = extractJwtToken(
        data?.token || data?.accessToken || data?.jwt || data?.jwtToken
      );

      const authToStore = {
        ...data,
        token: cleanToken,
        accessToken: cleanToken,
        jwt: cleanToken,
        jwtToken: cleanToken,
      };

      localStorage.setItem("auth", JSON.stringify(authToStore));
      dispatch({ type: "LOGIN_USER", payload: authToStore });
      dispatch(isSuccess());

      const localCart = getState()?.carts?.cart || [];
      const cartDTO = await dispatch(getUserCart());
      await dispatch(getUserAddresses());
      if (
        (!cartDTO?.cartId || (cartDTO?.products || []).length === 0) &&
        localCart.length > 0
      ) {
        await dispatch(createUserCart(localCart));
      }

      toast?.success?.("Logged in successfully");
      navigate?.("/");
    } catch (err) {
      dispatch(
        isError(err?.response?.data?.message || err?.message || "Login failed")
      );
      toast?.error?.("Invalid credentials");
    }
  };

export const registerNewUser =
  (sendData, toast, navigate) => async (dispatch) => {
    try {
      dispatch(btnLoader());
      await api.post("/auth/signup", sendData);
      dispatch(isSuccess());
      toast?.success?.("Account created. Please login.");
      navigate?.("/login");
    } catch (err) {
      dispatch(
        isError(
          err?.response?.data?.message || err?.message || "Registration failed"
        )
      );
      toast?.error?.("Registration failed");
    }
  };

export const logOutUser = (navigate) => async (dispatch) => {
  try {
    await api.post("/auth/signout");
  } catch (_) {}

  localStorage.removeItem("auth");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("CHECKOUT_ADDRESS");
  localStorage.removeItem("LAST_ORDER");

  dispatch({ type: "LOG_OUT" });
  dispatch({ type: "CLEAR_CART" });
  dispatch({ type: "REMOVE_CHECKOUT_ADDRESS" });

  navigate?.("/");
};

export const getUserAddresses = () => async (dispatch) => {
  try {
    const res = await api.get("/users/addresses");
    const list = Array.isArray(res.data) ? res.data : (res.data?.content || []);

    dispatch({ type: "USER_ADDRESS", payload: list });
  } catch (err) {
    dispatch({ type: "USER_ADDRESS", payload: [] });
  }
};


export const addUpdateUserAddress =
  (payload, toast, onDone) => async (dispatch) => {
    try {
      dispatch(btnLoader());

      if (payload?.addressId) {
        await api.put(`/addresses/${payload.addressId}`, payload);
      } else {
        await api.post(`/addresses`, payload);
      }

      dispatch(isSuccess());
      await dispatch(getUserAddresses());

      toast?.success?.("Address saved");
      onDone?.();
    } catch (err) {
      dispatch(
        isError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to save address"
        )
      );
      toast?.error?.("Failed to save address");
    }
  };

export const deleteUserAddress = (addressId, toast) => async (dispatch) => {
  try {
    dispatch(btnLoader());
    await api.delete(`/addresses/${addressId}`);
    dispatch(isSuccess());
    await dispatch(getUserAddresses());
    toast?.success?.("Address deleted");
  } catch (err) {
    dispatch(
      isError(
        err?.response?.data?.message || err?.message || "Failed to delete address"
      )
    );
    toast?.error?.("Failed to delete address");
  }
};

export const selectUserCheckoutAddress = (address) => (dispatch) => {
  localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
  dispatch({ type: "SELECT_CHECKOUT_ADDRESS", payload: address });
};

export const addPaymentMethod = (method) => (dispatch) => {
  dispatch({ type: "ADD_PAYMENT_METHOD", payload: method });
};
const addToBackendCart = async (productId, qty = 1) => {
  return await api.post(`/carts/products/${productId}/quantity/${qty}`);
};

const incrementBackendCart = async (productId, times = 1) => {
  const t = Math.max(1, Number(times || 1));

  for (let i = 0; i < t; i++) {
    let lastErr = null;

    for (const url of [
      `/carts/products/${productId}/quantity/add`,
      `/cart/products/${productId}/quantity/add`,
    ]) {
      try {
        await api.put(url);
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (lastErr) throw lastErr;
  }
};

const decrementBackendCart = async (productId, times = 1) => {
  const t = Math.max(1, Number(times || 1));

  for (let i = 0; i < t; i++) {
    let lastErr = null;

    for (const url of [
      `/carts/products/${productId}/quantity/delete`,
      `/cart/products/${productId}/quantity/delete`,
    ]) {
      try {
        await api.put(url);
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (lastErr) throw lastErr;
  }
};

export const getUserCart = () => async (dispatch) => {
  try {
    const res = await api.get("/carts/users/cart");
    const data = res.data;

    const products = (data?.products || []).map(normalizeProduct);
    const totalPrice = data?.totalPrice ?? calcTotal(products);

    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: products,
      totalPrice,
      cartId: data?.cartId ?? null,
    });

    saveCartToStorage(products);
    return { ...data, products };
  } catch (err) {
    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: [],
      totalPrice: 0,
      cartId: null,
    });
    saveCartToStorage([]);
    return { cartId: null, products: [] };
  }
};

export const createUserCart = (items = []) => async (dispatch, getState) => {
  try {
    if (!items || items.length === 0) return;

    if (useMockData()) {
      saveCartToStorage(items);
      dispatch({
        type: "GET_USER_CART_PRODUCTS",
        payload: items,
        totalPrice: calcTotal(items),
        cartId: null,
      });
      return;
    }

    for (const item of items) {
      const productId = item?.productId;
      const qty = Number(item?.quantity || 1);
      if (!productId || qty <= 0) continue;

      try {
        await addToBackendCart(productId, qty);
      } catch (err) {
        
        await incrementBackendCart(productId, qty);
      }
    }

    await dispatch(getUserCart());
  } catch (err) {
    const local = getState()?.carts?.cart || items;
    saveCartToStorage(local);
    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: local,
      totalPrice: calcTotal(local),
      cartId: null,
    });
  }
};
export const addToCart =
  (product, qty = 1, toast) => async (dispatch, getState) => {
    const state = getState();
    const user = state?.auth?.user;

    const addLocal = () => {
      const cart = state?.carts?.cart || [];
      const existing = cart.find((c) => c.productId === product.productId);
      const newQty = (existing?.quantity || 0) + Number(qty || 1);

      const updated = existing
        ? cart.map((c) =>
            c.productId === product.productId ? { ...c, quantity: newQty } : c
          )
        : [...cart, { ...product, quantity: Number(qty || 1) }];

      dispatch({
        type: "GET_USER_CART_PRODUCTS",
        payload: updated,
        totalPrice: calcTotal(updated),
        cartId: state?.carts?.cartId ?? null,
      });

      saveCartToStorage(updated);
    };

    if (user && !useMockData()) {
      try {
        try {
          await addToBackendCart(product.productId, qty);
        } catch (err) {
          const msg = String(err?.response?.data?.message || err?.message || "");
          const status = err?.response?.status;

          if (
            status === 400 ||
            status === 409 ||
            status === 500 ||
            msg.toLowerCase().includes("already") ||
            msg.toLowerCase().includes("exists")
          ) {
            await incrementBackendCart(product.productId, qty);
          } else {
            throw err;
          }
        }

        await dispatch(getUserCart());
        toast?.success?.("Added to cart");
        return;
      } catch (err) {
        console.log(
          "addToCart backend failed:",
          err?.response?.status,
          err?.message
        );

        addLocal();
        toast?.error?.("Backend cart failed — added locally");
        return;
      }
    }
    addLocal();
    toast?.success?.("Added to cart");
  };

export const removeFromCart = (item, toast) => async (dispatch, getState) => {
  const state = getState();
  const user = state?.auth?.user;
  const cartId = state?.carts?.cartId;

  if (user && cartId && !useMockData()) {
    try {
      await api.delete(`/carts/${cartId}/product/${item.productId}`);
      await dispatch(getUserCart());
      toast?.success?.("Removed from cart");
      return;
    } catch (err) {
      toast?.error?.("Could not remove item");
      return;
    }
  }

  const cart = state?.carts?.cart || [];
  const updated = cart.filter((c) => c.productId !== item.productId);

  dispatch({
    type: "GET_USER_CART_PRODUCTS",
    payload: updated,
    totalPrice: calcTotal(updated),
    cartId: null,
  });
  saveCartToStorage(updated);
  toast?.success?.("Removed from cart");
};
export const increaseCartQuantity =
  (cartItem, toast, currentQuantity, setCurrentQuantity) =>
  async (dispatch, getState) => {
    const state = getState();
    const user = state?.auth?.user;

    const nextQty = Number(currentQuantity ?? cartItem?.quantity ?? 1) + 1;
    setCurrentQuantity?.(nextQty);
    if (user && !useMockData()) {
      try {
        await incrementBackendCart(cartItem.productId, 1);
        await dispatch(getUserCart());
        toast?.success?.("Quantity updated");
        return;
      } catch (e) {
     
      }
    }
    dispatch({
      type: "ADD_CART",
      payload: { ...cartItem, quantity: nextQty },
    });
    toast?.success?.("Quantity updated");
  };
export const decreaseCartQuantity =
  (cartItem, arg2, arg3, arg4) => async (dispatch, getState) => {
    const state = getState();
    const user = state?.auth?.user;
    if (typeof arg2 === "number") {
      const nextQty = Math.max(1, arg2);
      if (user && !useMockData()) {
        try {
          const cur = Number(cartItem?.quantity ?? 1);
          const delta = cur - nextQty;
          if (delta > 0) await decrementBackendCart(cartItem.productId, delta);
          await dispatch(getUserCart());
          return;
        } catch (e) {
        
        }
      }

      dispatch({
        type: "ADD_CART",
        payload: { ...cartItem, quantity: nextQty },
      });
      return;
    }
    const toast = arg2;
    const currentQuantity = arg3;
    const setCurrentQuantity = arg4;

    const nextQty = Math.max(
      1,
      Number(currentQuantity ?? cartItem?.quantity ?? 1) - 1
    );
    setCurrentQuantity?.(nextQty);

    if (user && !useMockData()) {
      try {
        await decrementBackendCart(cartItem.productId, 1);
        await dispatch(getUserCart());
        toast?.success?.("Quantity updated");
        return;
      } catch (e) {
        
      }
    }

    dispatch({
      type: "ADD_CART",
      payload: { ...cartItem, quantity: nextQty },
    });

    toast?.success?.("Quantity updated");
  };
export const removeFromCartItem = (cartItem, toast) => async (dispatch, getState) => {
  const state = getState();
  const user = state?.auth?.user;

  if (user && !useMockData()) {
    try {
      const cartId = state?.carts?.cartId;
      if (cartId) {
        await api.delete(`/carts/${cartId}/product/${cartItem?.productId}`);
        await dispatch(getUserCart());
        toast?.success?.("Removed from cart");
        return;
      }
    } catch (e) {
      
    }
  }

  dispatch({ type: "REMOVE_CART", payload: { productId: cartItem?.productId } });
  toast?.success?.("Removed from cart");
};
export const placeOrder = (orderPayload, toast, navigate) => async (dispatch) => {
  try {
    dispatch(btnLoader());

    const paymentMethod =
      orderPayload?.paymentMethod ||
      orderPayload?.method ||
      "COD";

    const body = {
      addressId: orderPayload?.addressId,
      pgName: orderPayload?.pgName || "NA",
      pgPaymentId: orderPayload?.pgPaymentId || "NA",
      pgStatus: orderPayload?.pgStatus || "SUCCESS",
      pgResponseMessage: orderPayload?.pgResponseMessage || "OK",
    };

    const res = await api.post(
      `/order/users/payments/${encodeURIComponent(paymentMethod)}`,
      body
    );
    const order = res.data;

    localStorage.setItem("LAST_ORDER", JSON.stringify(order || {}));
    toast?.success?.("Order placed successfully!");
    await dispatch(getUserCart());

    navigate?.("/");

    return { success: true, order };
  } catch (err) {
    console.log("placeOrder failed:", err?.response?.status, err?.message);
    toast?.error?.(
      err?.response?.data?.message || err?.message || "Failed to place order"
    );
    return { success: false, error: err };
  }
};
export const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: FaHome },
  { name: "Orders", href: "/admin/orders", icon: FaShoppingCart },
  { name: "Products", href: "/admin/products", icon: FaBoxOpen },
  { name: "Categories", href: "/admin/categories", icon: FaThList },
  { name: "Prescriptions", href: "/admin/prescriptions", icon: FaFileMedical },
];
