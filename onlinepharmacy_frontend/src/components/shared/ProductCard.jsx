
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, getUserCart } from "../../store/actions";
import toast from "react-hot-toast";
import { FaShoppingCart, FaBell, FaTimes } from "react-icons/fa";
import api from "../../api/api";

const BACKEND = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";


const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop";


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

const ProductCard = ({ product, onAddToCart, onOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);


  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  const productId = useMemo(() => product?.productId ?? product?.id, [product]);

  const stock = useMemo(
    () => Number(product?.quantity ?? product?.stock ?? 0),
    [product]
  );
  const inStock = stock > 0;

  const price = useMemo(
    () => Number(product?.specialPrice ?? product?.price ?? 0),
    [product]
  );
  const originalPrice = useMemo(() => Number(product?.price ?? 0), [product]);

  const imageUrl = useMemo(() => resolveImageUrl(product?.imageUrl || product?.image), [product]);

  const safeQty = Math.min(Math.max(1, Number(qty || 1)), Math.max(1, stock || 1));

  const stop = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
  };

  const onMinus = (e) => {
    stop(e);
    setQty((p) => Math.max(1, Number(p || 1) - 1));
  };

  const onPlus = (e) => {
    stop(e);
    setQty((p) => Math.min(Math.max(1, stock || 1), Number(p || 1) + 1));
  };

  const openDetails = () => {
    if (onOpen) return onOpen();
    if (!productId) return;
    navigate(`/products/${productId}`, { state: { product } });
  };

  const doAddToCart = async (e) => {
    stop(e);

  
    const token = getToken();
    if (!token) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    if (!productId) return toast.error("Invalid product");
    if (!inStock) return toast.error("Out of stock");

    const payload = { ...product, productId };

 
    if (onAddToCart) return onAddToCart(payload, safeQty);

    dispatch(addToCart(payload, safeQty, toast));
    dispatch(getUserCart());
  };

  const openNotify = (e) => {
    stop(e);
    if (!productId) return toast.error("Invalid product");
    setNotifyEmail("");
    setNotifyOpen(true);
  };

  const closeNotify = (e) => {
    stop(e);
    if (notifyLoading) return;
    setNotifyOpen(false);
  };

  const isValidEmail = (email) => {
    const s = String(email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  };

  const submitNotify = async (e) => {
    stop(e);

    const email = String(notifyEmail || "").trim();
    if (!isValidEmail(email)) return toast.error("Enter a valid email");
    if (!productId) return toast.error("Invalid product");

    setNotifyLoading(true);

    const payload = { productId, email };
    const candidates = [
      `/public/products/${productId}/notify`,
      `/public/notifications/back-in-stock`,
      `/public/stock-alerts`,
      `/notifications/back-in-stock`,
      `/stock-alerts`,
    ];

    let lastErr = null;

    for (const url of candidates) {
      try {
        await api.post(url, payload);
        toast.success("We’ll email you when it’s back in stock ✅");
        setNotifyOpen(false);
        setNotifyLoading(false);
        return;
      } catch (err) {
        lastErr = err;
      }
    }

    const msg =
      lastErr?.response?.data?.message || lastErr?.message || "Failed to subscribe";
    toast.error(msg);
    setNotifyLoading(false);
  };

  return (
    <>
      <div
        onClick={openDetails}
        className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden block hover:shadow-lg transition cursor-pointer"
      >
        {/* Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={product?.productName || product?.title || "Product"}
            className="w-full h-56 object-cover"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMG;
            }}
          />

          {Number(product?.discount || 0) > 0 && (
            <span className="absolute top-3 left-3 bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full">
              {Number(product?.discount)}% OFF
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="text-[11px] tracking-widest text-teal-700 font-bold uppercase">
            {product?.categoryName || "PHARMACY ESSENTIAL"}
          </div>

          <h3 className="text-slate-900 font-bold text-lg mt-1">
            {product?.productName || product?.title || "Product"}
          </h3>

          <p className="text-slate-500 text-sm mt-1 line-clamp-2">
            {product?.description || ""}
          </p>

          {/* Price */}
          <div className="mt-3">
            <div className="text-teal-700 font-extrabold text-xl">
              ${Number(price || 0).toFixed(2)}
            </div>
            {originalPrice > price && (
              <div className="text-slate-400 text-sm line-through">
                ${Number(originalPrice || 0).toFixed(2)}
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center border rounded-lg px-2 py-1 bg-slate-50">
              <button
                type="button"
                onClick={onMinus}
                className="px-2 text-slate-700 font-bold"
                disabled={!inStock}
              >
                −
              </button>
              <span className="w-8 text-center text-slate-800 font-semibold">
                {safeQty}
              </span>
              <button
                type="button"
                onClick={onPlus}
                className="px-2 text-slate-700 font-bold"
                disabled={!inStock}
              >
                +
              </button>
            </div>

            {inStock ? (
              <button
                type="button"
                onClick={doAddToCart}
                className="p-3 rounded-lg transition bg-teal-700 hover:bg-teal-800 text-white"
                title="Add to cart"
              >
                <FaShoppingCart />
              </button>
            ) : (
              <button
                type="button"
                onClick={openNotify}
                className="px-4 py-2 rounded-lg transition-all duration-300 bg-[#18837c] hover:bg-teal-600 text-white flex items-center gap-2 shadow-md active:scale-95"
                title="Notify me when back in stock"
              >
                <FaBell className="text-teal-100" />
                <span className="font-bold">Notify me</span>
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <div className={`flex items-center gap-2 ${inStock ? "text-teal-700" : "text-red-600"}`}>
              <span className={`w-2 h-2 rounded-full ${inStock ? "bg-teal-600" : "bg-red-500"}`} />
              <span className="font-semibold">{inStock ? "IN STOCK" : "OUT OF STOCK"}</span>
            </div>

            <div className="text-slate-400 text-xs">ID: #{productId ?? "-"}</div>
          </div>
        </div>
      </div>

      {notifyOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4"
          onClick={closeNotify}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
            onClick={(e) => stop(e)}
          >
            <div className="p-5 flex items-center justify-between border-b">
              <div>
                <h3 className="text-slate-900 font-bold text-lg">
                  Notify me when available
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Enter your email — we’ll send you a message when this product is back in stock.
                </p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-slate-100"
                onClick={closeNotify}
                disabled={notifyLoading}
                title="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-5">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
              />

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-lg border hover:bg-slate-50"
                  onClick={closeNotify}
                  disabled={notifyLoading}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white ${
                    notifyLoading ? "bg-slate-400 cursor-not-allowed" : "bg-teal-700 hover:bg-teal-800"
                  }`}
                  onClick={submitNotify}
                  disabled={notifyLoading}
                >
                  {notifyLoading ? "Saving..." : "Notify Me"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
