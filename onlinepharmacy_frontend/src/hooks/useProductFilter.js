import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

import { fetchCategories, fetchProducts } from "../store/actions";


export default function useProductFilter() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { products, categories, pagination } = useSelector((state) => state.products);
  const { errorMessage, isLoading } = useSelector((state) => state.errors);

  const queryString = useMemo(() => {
    const keyword = (searchParams.get("keyword") || "").trim();
    const category = searchParams.get("category") || "all";

  
    const page = Number(searchParams.get("page") || "1");
    const pageNumber = Number.isFinite(page) && page > 0 ? String(page - 1) : "0";

    const pageSize = searchParams.get("pageSize") || "50";
    const sortBy = searchParams.get("sortBy") || "productId";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (category && category !== "all") params.set("category", category);
    params.set("pageNumber", pageNumber);
    params.set("pageSize", pageSize);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    return `?${params.toString()}`;
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  useEffect(() => {
    dispatch(fetchProducts(queryString));

  }, [dispatch, location.pathname, location.search, queryString]);

  return {
    products: Array.isArray(products) ? products : [],
    categories: Array.isArray(categories) ? categories : [],
    pagination: pagination || { pageNumber: 0, pageSize: 50, totalPages: 1, totalElements: 0, lastPage: true },
    loading: Boolean(isLoading),
    error: errorMessage || null,
  };
}
