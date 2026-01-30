

const initialState = {
  products: [],
  categories: [],
  pagination: {
    pageNumber: 0,
    pageSize: 50,
    totalElements: 0,
    totalPages: 0,
    lastPage: true,
  },
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS": {
      const payload = action.payload;
      if (payload && Array.isArray(payload.content)) {
        return {
          ...state,
          products: payload.content,
          pagination: {
            pageNumber: payload.pageNumber ?? 0,
            pageSize: payload.pageSize ?? 50,
            totalElements: payload.totalElements ?? payload.content.length,
            totalPages: payload.totalPages ?? 1,
            lastPage: payload.lastPage ?? true,
          },
        };
      }

      if (Array.isArray(payload)) {
        return {
          ...state,
          products: payload,
        };
      }
      if (payload && Array.isArray(payload.products)) {
        return {
          ...state,
          products: payload.products,
          pagination: payload.pagination ?? state.pagination,
        };
      }

      return state;
    }

    case "FETCH_CATEGORIES": {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        return {
          ...state,
          categories: payload,
        };
      }
      if (payload && Array.isArray(payload.content)) {
        return {
          ...state,
          categories: payload.content,
        };
      }

      return state;
    }

    default:
      return state;
  }
};
