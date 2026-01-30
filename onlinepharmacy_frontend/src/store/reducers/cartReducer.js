// src/store/reducers/cartReducer.js

const initialState = {
  cart: [],
  totalPrice: 0,
  cartId: null,
  loading: false,
  error: null,
};

const calcTotal = (items = []) =>
  items.reduce(
    (acc, cur) =>
      acc +
      Number(cur?.specialPrice ?? cur?.price ?? 0) *
        Number(cur?.quantity ?? 1),
    0
  );

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CART_LOADING":
      return { ...state, loading: true, error: null };

    case "CART_ERROR":
      return { ...state, loading: false, error: action.payload || "Cart error" };

    case "CART_SUCCESS": {
      const dto = action.payload || {};
      const products = Array.isArray(dto.products) ? dto.products : [];
      const totalPrice = Number(dto.totalPrice ?? calcTotal(products));

      return {
        ...state,
        loading: false,
        error: null,
        cart: products,
        totalPrice,
        cartId: dto.cartId ?? null,
      };
    }
    case "GET_USER_CART_PRODUCTS": {
      const items = Array.isArray(action.payload) ? action.payload : [];
      const totalPrice = Number(action.totalPrice ?? calcTotal(items));
      return {
        ...state,
        loading: false,
        error: null,
        cart: items,
        totalPrice,
        cartId: action.cartId ?? null,
      };
    }

    case "ADD_CART": {
      const productToAdd = action.payload;
      const existing = state.cart.find((i) => i.productId === productToAdd.productId);

      const updatedCart = existing
        ? state.cart.map((i) =>
            i.productId === productToAdd.productId ? productToAdd : i
          )
        : [...state.cart, productToAdd];

      return {
        ...state,
        cart: updatedCart,
        totalPrice: calcTotal(updatedCart),
      };
    }

    case "REMOVE_CART": {
      const updatedCart = state.cart.filter(
        (i) => i.productId !== action.payload.productId
      );
      return {
        ...state,
        cart: updatedCart,
        totalPrice: calcTotal(updatedCart),
      };
    }
    case "CART_CLEAR":
    case "CLEAR_CART":
    case "LOG_OUT":
      return { ...initialState };

    default:
      return state;
  }
};
