
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProducts, addToCart, getUserCart } from "../../store/actions";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import { FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const SORT_OPTIONS = [
  { value: "relevance", label: "Sort by: Relevance" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "discountHigh", label: "Biggest Discount" },
  { value: "savingsHigh", label: "Highest Savings" },
];

const getToken = () => {
  const authStr = localStorage.getItem("auth");
  if (authStr) {
    try {
      const a = JSON.parse(authStr);
      return a?.token || a?.jwtToken || a?.accessToken || a?.jwt || null;
    } catch {}
  }
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    null
  );
};

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products || {});
  const { isLoading, errorMessage } = useSelector((state) => state.errors || {});

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const activeCategory = searchParams.get("category") || "";
  const keyword = searchParams.get("keyword") || searchParams.get("q") || "";

  const [searchText, setSearchText] = useState(keyword);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    dispatch(fetchProducts(location.search.replace("?", "")));
  }, [dispatch, location.search]);

  useEffect(() => {
    setSearchText(keyword);
  }, [keyword]);

  const getBasePrice = (p) => {
    const sp = Number(p?.specialPrice);
    const pr = Number(p?.price);
    return Number.isFinite(sp) && sp > 0 ? sp : Number.isFinite(pr) ? pr : 0;
  };

  const getDiscount = (p) => {
    const d = Number(p?.discount);
    return Number.isFinite(d) ? d : 0;
  };

  const getSavings = (p) => {
    const pr = Number(p?.price);
    const sp = Number(p?.specialPrice);
    if (!Number.isFinite(pr) || !Number.isFinite(sp)) return 0;
    return Math.max(0, pr - sp);
  };

  const sortedProducts = useMemo(() => {
    const list = Array.isArray(products) ? [...products] : [];
    if (sortBy === "relevance") return list;
    if (sortBy === "priceLow") return list.sort((a, b) => getBasePrice(a) - getBasePrice(b));
    if (sortBy === "priceHigh") return list.sort((a, b) => getBasePrice(b) - getBasePrice(a));
    if (sortBy === "discountHigh") return list.sort((a, b) => getDiscount(b) - getDiscount(a));
    if (sortBy === "savingsHigh") return list.sort((a, b) => getSavings(b) - getSavings(a));
    return list;
  }, [products, sortBy]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchText.trim();

    const next = new URLSearchParams(location.search);
    if (q) next.set("keyword", q);
    else next.delete("keyword");
    next.delete("q");

    navigate(`/products?${next.toString()}`);
  };

  const clearFilters = () => navigate("/products");
  const handleAddToCart = async (product, qty) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    try {
      await dispatch(addToCart(product, qty, toast));
      await dispatch(getUserCart());
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const openProduct = (product) => {
    const productId = product?.productId ?? product?.id;
    if (!productId) return toast.error("Invalid product");
    navigate(`/products/${productId}`, { state: { product } });
  };

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900">Products</h1>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear Filter
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <form onSubmit={onSearchSubmit} className="flex-1">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search medicines, supplements, wellness products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            />
          </form>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="md:w-64 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {(activeCategory || keyword) && (
          <div className="flex flex-wrap items-center gap-2">
            {activeCategory && (
              <span className="text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                Category selected
              </span>
            )}
            {keyword && (
              <span className="text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                Search: {keyword}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Loader />
        ) : errorMessage ? (
          <div className="flex justify-center items-center h-[200px]">
            <FaExclamationTriangle className="text-slate-800 text-3xl mr-2" />
            <span className="text-slate-800 text-lg font-medium">{errorMessage}</span>
          </div>
        ) : (
          <>
            <div className="text-sm text-slate-600 mb-3">
              Showing <span className="font-semibold">{sortedProducts.length}</span> products
            </div>

            <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
              {sortedProducts.map((item, i) => (
                <ProductCard
                  key={item?.productId ?? i}
                  product={item}
                  onOpen={() => openProduct(item)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
