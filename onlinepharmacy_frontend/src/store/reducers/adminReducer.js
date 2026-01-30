

const initialState = {
  analytics: {
    productCount: 0,
    totalRevenue: 0,
    totalOrders: 0,
  },
};

const toNumber = (v) => {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case "ADMIN_SET_ANALYTICS": {
      const payload = action.payload || {};

      return {
        ...state,
        analytics: {
          productCount: toNumber(payload.productCount),
          totalRevenue: toNumber(payload.totalRevenue),
          totalOrders: toNumber(payload.totalOrders),
        },
      };
    }

    case "ADMIN_CLEAR_ANALYTICS": {
      return {
        ...state,
        analytics: { ...initialState.analytics },
      };
    }

    default:
      return state;
  }
}
