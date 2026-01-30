

const initialState = {
  categories: [],
  pageNumber: 0,
  pageSize: 50,
  totalElements: 0,
  totalPages: 1,
  lastPage: true,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CATEGORIES":
      return {
        ...state,
        categories: Array.isArray(action.payload) ? action.payload : [],
        pageNumber: action.pageNumber ?? 0,
        pageSize: action.pageSize ?? 50,
        totalElements: action.totalElements ?? (action.payload?.length || 0),
        totalPages: action.totalPages ?? 1,
        lastPage: action.lastPage ?? true,
      };

    default:
      return state;
  }
};

export default categoryReducer;
