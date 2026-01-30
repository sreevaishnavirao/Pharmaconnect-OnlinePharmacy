
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

const BACKEND = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop";

const resolveImageUrl = (img) => {
  const s = String(img || "").trim();

  if (!s || s.toLowerCase() === "default.png") return PLACEHOLDER_IMG;

  if (/^https?:\/\//i.test(s) || s.startsWith("data:")) return s;
  if (s.startsWith("/")) return `${BACKEND}${s}`;
  return `${BACKEND}/images/${s}`;
};

const toYMD = (val) => {
  if (!val) return "";
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  if (typeof val === "string" && val.includes("T")) return val.split("T")[0];
  return String(val);
};

const money = (n) => Number(n ?? 0).toFixed(2);

const ProductViewModal = ({ open, setOpen, product, isAvailable }) => {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [details, setDetails] = useState({
    ingredients: "",
    usageDosage: "",
    storageInfo: "",
    sideEffects: "",
    expiryDate: "",
  });

  const productId = product?.productId;

  const imageUrl = useMemo(() => resolveImageUrl(product?.image), [product]);

  useEffect(() => {
    if (!open || !productId) return;

    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const res = await api.get(`/public/products/${productId}/details`);
        const d = res?.data || {};
        setDetails({
          ingredients: d?.ingredients || "",
          usageDosage: d?.usageDosage || "",
          storageInfo: d?.storageInfo || "",
          sideEffects: d?.sideEffects || "",
          expiryDate: toYMD(d?.expiryDate || ""),
        });
      } catch {
        setDetails({
          ingredients: "",
          usageDosage: "",
          storageInfo: "",
          sideEffects: "",
          expiryDate: "",
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [open, productId]);

  if (!open) return null;

  const basePrice = Number(product?.price ?? 0);
  const discount = Number(product?.discount ?? 0);
  const specialPrice = Number(product?.specialPrice ?? basePrice);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={() => setOpen(false)}
    >
      <div className="min-h-full flex items-start justify-center p-4 py-10 font-sans">
        <div
          className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          style={{ maxHeight: "92vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#3d9991]">
                Product View
              </div>
              <div className="text-xl font-bold text-slate-700">
                {product?.productName || "-"}
              </div>
            </div>

            <button
              className="h-10 w-10 rounded-full grid place-items-center text-slate-400 hover:text-rose-500 hover:bg-slate-50 text-2xl"
              onClick={() => setOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>

       
          <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: "calc(92vh - 148px)" }}>
            <div className="w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
              <img
                src={imageUrl}
                alt={product?.productName || "product"}
                className="w-full h-[280px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
            </div>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              {product?.categoryName ? (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-teal-50 text-[#3d9991] border border-teal-100">
                  {product.categoryName}
                </span>
              ) : null}

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100"
                }`}
              >
                {isAvailable ? "IN STOCK" : "OUT OF STOCK"}
              </span>
            </div>

            <div className="mt-8">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#3d9991] mb-4">
                Base Product Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="Base Price" value={`$${money(basePrice)}`} />
                <InfoCard label="Discount %" value={`${money(discount)}%`} />
                <InfoCard label="Special Price" value={`$${money(specialPrice)}`} />
                <InfoCard label="Quantity" value={`${Number(product?.quantity ?? 0)} units`} />
              </div>

              <div className="mt-6">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#3d9991] mb-2">
                  Description
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {product?.description || "-"}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#3d9991] mb-4">
                Product Details
              </h3>

              {loadingDetails ? (
                <div className="mt-4 text-slate-400 text-sm animate-pulse">Loading details...</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <DetailBlock title="Ingredients" value={details.ingredients} />
                  <DetailBlock title="Usage & Dosage" value={details.usageDosage} />
                  <DetailBlock title="Storage Info" value={details.storageInfo} />
                  <DetailBlock title="Side Effects" value={details.sideEffects} />
                  <DetailBlock title="Expiry Date" value={details.expiryDate || "-"} />
                </div>
              )}
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
            <button
              className="px-8 py-2 rounded-xl bg-[#3d9991] font-bold text-white hover:bg-[#327d76] transition-all active:scale-95 shadow-md shadow-teal-100"
              onClick={() => setOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-100 bg-white p-4 transition-colors hover:border-teal-100">
    <div className="text-[10px] font-bold uppercase tracking-widest text-[#3d9991] mb-1">
      {label}
    </div>
    <div className="text-lg font-bold text-slate-700">{value}</div>
  </div>
);

const DetailBlock = ({ title, value }) => (
  <div className="rounded-xl border border-slate-100 bg-white p-4 transition-colors hover:border-teal-100">
    <div className="text-[10px] font-bold uppercase tracking-widest text-[#3d9991] mb-1">
      {title}
    </div>
    <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
      {value ? value : "Information not provided."}
    </div>
  </div>
);

export default ProductViewModal;
