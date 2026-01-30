
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getUserCart } from "../../store/actions";
import { toast } from "react-toastify";
import { Star, ShoppingCart } from "lucide-react";
import api from "../../api/api";

const BACKEND = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop";

const resolveImageUrl = (img) => {
  const s = String(img ?? "").trim();
  if (!s || s.toLowerCase() === "default.png" || s === "null" || s === "undefined") {
    return PLACEHOLDER_IMG;
  }
  if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;
  if (s.startsWith("/")) return `${BACKEND}${s}`;
  return `${BACKEND}/images/${s}`;
};

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

const TABS = ["Description", "Ingredients", "Usage & Dosage", "Side Effects", "Reviews"];

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stateProduct = location?.state?.product || null;

  const { products } = useSelector((s) => s?.products || {});
  const list = Array.isArray(products) ? products : [];

  const [serverProduct, setServerProduct] = useState(null);
  const [serverDetails, setServerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchFull = async () => {
      if (!id) return;
      setLoadingDetails(true);
      try {
        const res = await api.get(`/public/products/${id}/full`);
        const data = res?.data;
        setServerProduct(data?.product || null);
        setServerDetails(data?.details || null);
      } catch {
        setServerProduct(null);
        setServerDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchFull();
  }, [id]);

  const product = useMemo(() => {
    if (serverProduct?.productId || serverProduct?.id) return serverProduct;
    if (stateProduct?.productId || stateProduct?.id) return stateProduct;

    const found = list.find((p) => String(p?.productId ?? p?.id) === String(id));
    return found || null;
  }, [serverProduct, stateProduct, list, id]);

  const safeProduct = product || {};
  const productId = safeProduct?.productId ?? safeProduct?.id ?? id;

  const name = safeProduct?.productName || safeProduct?.title || "Product";
  const brand = safeProduct?.brand || safeProduct?.manufacturer || "PharmaConnect";
  const category = safeProduct?.categoryName || "Medicines";
  const description = safeProduct?.description || "No description available.";

  const stock = Number(safeProduct?.quantity ?? safeProduct?.stock ?? 0);
  const inStock = stock > 0;

  const price = Number(safeProduct?.specialPrice ?? safeProduct?.price ?? 0);
  const originalPrice = Number(safeProduct?.price ?? 0);
  const mainImage = useMemo(() => {
    return resolveImageUrl(safeProduct?.imageUrl || safeProduct?.image);
  }, [safeProduct]);

  const images = useMemo(() => [mainImage, mainImage, mainImage], [mainImage]);

  const [activeImg, setActiveImg] = useState(mainImage);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Description");

  useEffect(() => setActiveImg(mainImage), [mainImage]);

  const safeQty = Math.min(Math.max(1, Number(qty || 1)), Math.max(1, stock || 1));

  const onAddToCart = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    if (!productId) return toast.error("Invalid product");
    if (!inStock) return toast.error("Out of stock");

    try {
      await dispatch(addToCart({ ...safeProduct, productId }, safeQty, toast));
      await dispatch(getUserCart());
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const details = serverDetails || {};
  const expiryDate = details?.expiryDate || "";
  const ingredients = details?.ingredients || "";
  const usageDosage = details?.usageDosage || "";
  const storageInfo = details?.storageInfo || "";
  const sideEffects = details?.sideEffects || "";

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-8">
      <div className="text-sm text-slate-500 mb-5">
        <Link to="/" className="hover:text-teal-700">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/products" className="hover:text-teal-700">Products</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700 font-semibold">{name}</span>
      </div>

      {!product && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          Product details not found. Go back to{" "}
          <button className="font-bold underline" onClick={() => navigate("/products")}>
            Products
          </button>
          .
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <img
              src={activeImg}
              alt={name}
              className="w-full h-[420px] object-cover bg-white"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMG;
              }}
            />
          </div>

          <div className="mt-4 flex gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImg(img)}
                className={`h-20 w-20 rounded-xl border overflow-hidden bg-white ${
                  img === activeImg ? "border-teal-500" : "border-slate-200"
                }`}
              >
                <img
                  src={img}
                  alt="thumb"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMG;
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
              {category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                inStock
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-rose-50 text-rose-700 border-rose-100"
              }`}
            >
              {inStock ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">{name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            By <span className="font-bold text-teal-700">{brand}</span>
          </p>

          <div className="mt-3 flex items-center gap-2 text-slate-500">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < 4 ? "text-yellow-500" : "text-slate-300"} />
              ))}
            </div>
            <span className="text-sm">(398 reviews)</span>
          </div>

          <div className="mt-6">
            <div className="text-emerald-700 font-extrabold text-4xl">
              ${Number(price || 0).toFixed(2)}
            </div>
            {originalPrice > price && (
              <div className="mt-1 text-slate-400 line-through">
                ${Number(originalPrice || 0).toFixed(2)}
              </div>
            )}
          </div>

          <p className="mt-5 text-slate-700">{description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                className="px-4 py-2 font-black text-slate-700 hover:bg-slate-50"
                onClick={() => setQty((q) => Math.max(1, Number(q || 1) - 1))}
                disabled={!inStock}
              >
                −
              </button>
              <div className="px-5 py-2 font-bold text-slate-800">{safeQty}</div>
              <button
                type="button"
                className="px-4 py-2 font-black text-slate-700 hover:bg-slate-50"
                onClick={() => setQty((q) => Math.min(Math.max(1, stock || 1), Number(q || 1) + 1))}
                disabled={!inStock}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={onAddToCart}
              disabled={!inStock}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-extrabold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap gap-3 border-b border-slate-100 pb-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold ${
                    tab === t
                      ? "bg-teal-50 text-teal-700 border border-teal-100"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="pt-5 text-slate-700">
              {tab === "Description" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Expiry Date
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {loadingDetails ? "Loading..." : (expiryDate ? String(expiryDate) : "Not available")}
                    </div>
                  </div>
                  <div className="leading-relaxed">{description}</div>
                </div>
              )}

              {tab === "Ingredients" && (
                <div className="leading-relaxed">
                  {loadingDetails
                    ? "Loading..."
                    : ingredients?.trim()
                    ? ingredients
                    : "Ingredients information is not available yet."}
                </div>
              )}

              {tab === "Usage & Dosage" && (
                <div className="space-y-4">
                  <div className="leading-relaxed">
                    {loadingDetails
                      ? "Loading..."
                      : usageDosage?.trim()
                      ? usageDosage
                      : "Usage & dosage information is not available yet."}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Storage
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {loadingDetails
                        ? "Loading..."
                        : storageInfo?.trim()
                        ? storageInfo
                        : "Storage information is not available yet."}
                    </div>
                  </div>
                </div>
              )}

              {tab === "Side Effects" && (
                <div className="leading-relaxed">
                  {loadingDetails
                    ? "Loading..."
                    : sideEffects?.trim()
                    ? sideEffects
                    : "Side effects information is not available yet."}
                </div>
              )}

              {tab === "Reviews" && <div>Reviews section placeholder (UI only for now).</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
