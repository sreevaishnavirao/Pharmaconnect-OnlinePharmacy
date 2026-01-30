// src/components/admin/products/AdminProducts.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/api";
import { FaPlus, FaEdit, FaTrash, FaEye, FaImage, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import ProductViewModal from "../../shared/ProductViewModal";

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

const AdminProducts = () => {
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    categoryId: "",
    price: "",
    quantity: "",
    description: "",
    discount: "",
    specialPrice: "",
    image: "default.png", 
  });

  const [details, setDetails] = useState({
    ingredients: "",
    usageDosage: "",
    storageInfo: "",
    sideEffects: "",
    expiryDate: "",
  });

  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const resetForm = () => {
    setForm({
      productName: "",
      categoryId: "",
      price: "",
      quantity: "",
      description: "",
      discount: "",
      specialPrice: "",
      image: "default.png",
    });
    setDetails({
      ingredients: "",
      usageDosage: "",
      storageInfo: "",
      sideEffects: "",
      expiryDate: "",
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/public/categories");
      const list = Array.isArray(res?.data) ? res?.data : res?.data?.content || [];
      setCategories(list);
    } catch {
      setCategories([]);
    }
  };

  const attachDetailsToProducts = async (baseList) => {
    if (!Array.isArray(baseList) || baseList.length === 0) return [];
    try {
      const enriched = await Promise.all(
        baseList.map(async (p) => {
          const id = p?.productId;
          if (!id) return p;

          try {
            const d = await api.get(`/public/products/${id}/details`);
            return { ...p, expiryDate: toYMD(d?.data?.expiryDate || "") };
          } catch {
            return { ...p, expiryDate: "" };
          }
        })
      );
      return enriched;
    } catch {
      return baseList;
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/products");
      const base = Array.isArray(res?.data) ? res?.data : [];
      const enriched = await attachDetailsToProducts(base);
      setProducts(enriched);
    } catch {
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (products || []).filter((p) => {
      const matchesSearch =
        !s ||
        String(p?.productName || "").toLowerCase().includes(s) ||
        String(p?.description || "").toLowerCase().includes(s) ||
        String(p?.categoryName || "").toLowerCase().includes(s);

      const matchesCategory =
        categoryFilter === "ALL" || String(p?.categoryId) === String(categoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openAdd = () => {
    setSelected(null);
    resetForm();
    setOpenForm(true);
  };

  const fetchDetailsForEdit = async (productId) => {
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
    }
  };

const openEdit = async (p) => {
    setSelected(p);
    setForm({
      productName: p?.productName ?? "",
      categoryId: p?.categoryId ?? "",
      price: p?.price ?? "",
      quantity: p?.quantity ?? "",
      description: p?.description ?? "",
      discount: p?.discount ?? "",
      specialPrice: p?.specialPrice ?? "",
      image: p?.image ?? "default.png",
    });
    await fetchDetailsForEdit(p?.productId);
    setOpenForm(true);
  };

  const openViewModal = (p) => {
    setSelected(p);
    setOpenView(true);
  };

  const openImageModal = (p) => {
    setSelected(p);
    setImageFile(null);
    setOpenImage(true);
  };

  const deleteProduct = async (p) => {
    if (!window.confirm(`Delete product: ${p?.productName}?`)) return;
    try {
      await api.delete(`/admin/products/${p.productId}`);
      toast.success("Deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const saveAll = async () => {
    if (!form.productName?.trim()) return toast.error("Product Name required");
    if (!form.categoryId) return toast.error("Category required");

    const basePayload = {
      ...form,
      categoryId: Number(form.categoryId),
      price: Number(form.price || 0),
      quantity: Number(form.quantity || 0),
      discount: Number(form.discount || 0),
      specialPrice: Number(form.specialPrice || 0),
    };

    const detailsPayload = {
      productId: selected?.productId || null,
      ingredients: details.ingredients || "",
      usageDosage: details.usageDosage || "",
      storageInfo: details.storageInfo || "",
      sideEffects: details.sideEffects || "",
      expiryDate: details.expiryDate || null,
    };

    try {
      setSaving(true);

      let savedProductId = selected?.productId;

      if (selected?.productId) {
        await api.put(`/admin/products/${selected.productId}`, basePayload);
        savedProductId = selected.productId;
      } else {
        const created = await api.post(`/admin/products`, basePayload);
        savedProductId = created?.data?.productId;
      }

      if (savedProductId) {
        await api.put(`/admin/products/${savedProductId}/details`, {
          ...detailsPayload,
          productId: savedProductId,
        });
      }

      toast.success(selected?.productId ? "Product updated" : "Product added");
      setOpenForm(false);
      await fetchProducts();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return toast.error("Please choose an image file");
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("image", imageFile);

      await api.put(`/admin/products/${selected.productId}/image`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image uploaded");
      setOpenImage(false);
      fetchProducts();
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
  
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
          <h1 className="text-2xl font-extrabold tracking-wide text-teal-900 uppercase">
            Product Inventory
          </h1>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
        >
          <FaPlus />
          Add Product
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6 bg-white p-4 rounded-xl border border-teal-50 shadow-sm">
        <input
          className="w-full md:w-[420px] border border-teal-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3 items-center">
          <select
            className="border border-teal-100 rounded-lg px-4 py-2 outline-none focus:border-teal-400 bg-white text-teal-900 font-medium"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c?.categoryId} value={c?.categoryId}>
                {c?.categoryName}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("ALL");
            }}
            className="px-4 py-2 text-teal-600 font-semibold hover:bg-teal-50 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-teal-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="bg-teal-50/50 border-b border-teal-100">
              <tr className="text-left text-teal-900 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Product Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Expiry</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-teal-50">
              {loading ? (
                <tr>
                  <td className="px-6 py-10 text-center text-teal-600" colSpan={7}>
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-center text-teal-600 font-medium" colSpan={7}>
                    No products matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-teal-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{p.productName}</td>

                    <td className="px-6 py-4">
                      <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-bold uppercase">
                        {p.categoryName || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-teal-700">
                      ${Number(p.price ?? 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{p.quantity} units</td>

                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {p?.expiryDate ? p.expiryDate : "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-500 max-w-[280px] truncate italic">
                      {p.description}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <ActionButton
                          icon={<FaImage />}
                          onClick={() => openImageModal(p)}
                          color="bg-teal-500"
                          label="Image"
                        />
                        <ActionButton
                          icon={<FaEdit />}
                          onClick={() => openEdit(p)}
                          color="bg-teal-600"
                          label="Edit"
                        />
                        <ActionButton
                          icon={<FaTrash />}
                          onClick={() => deleteProduct(p)}
                          color="bg-rose-500"
                          label="Delete"
                        />
                        <ActionButton
                          icon={<FaEye />}
                          onClick={() => openViewModal(p)}
                          color="bg-slate-800"
                          label="View"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ProductViewModal
        open={openView}
        setOpen={setOpenView}
        product={
          selected
            ? {
                ...selected,
                image: resolveImageUrl(selected?.image),
              }
            : null
        }
        isAvailable={Number(selected?.quantity || 0) > 0}
      />
      {openForm && (
        <Modal
          title={selected?.productId ? "Update Product" : "New Product Entry"}
          onClose={() => setOpenForm(false)}
          footer={
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 border border-teal-200 text-teal-700 rounded-lg font-bold hover:bg-teal-50 disabled:opacity-60"
                onClick={() => setOpenForm(false)}
                disabled={saving}
                type="button"
              >
                Cancel
              </button>

              <button
                className="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold shadow-md hover:bg-teal-700 disabled:opacity-60"
                onClick={saveAll}
                disabled={saving}
                type="button"
              >
                {saving ? "Saving..." : "Confirm Save"}
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Name">
              <input
                className="input"
                value={form.productName}
                onChange={(e) => setForm((s) => ({ ...s, productName: e.target.value }))}
              />
            </Field>

            <Field label="Category">
              <select
                className="input"
                value={form.categoryId}
                onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Base Price">
              <input
                type="number"
                className="input"
                value={form.price}
                onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
              />
            </Field>

            <Field label="Quantity In Stock">
              <input
                type="number"
                className="input"
                value={form.quantity}
                onChange={(e) => setForm((s) => ({ ...s, quantity: e.target.value }))}
              />
            </Field>

            <Field label="Discount %">
              <input
                type="number"
                className="input"
                value={form.discount}
                onChange={(e) => setForm((s) => ({ ...s, discount: e.target.value }))}
              />
            </Field>

            <Field label="Special Price">
              <input
                type="number"
                className="input"
                value={form.specialPrice}
                onChange={(e) => setForm((s) => ({ ...s, specialPrice: e.target.value }))}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className="input min-h-[70px]"
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                />
              </Field>
            </div>

            <div className="md:col-span-2 pt-2">
              <div className="border-t border-teal-50 pt-5">
                <div className="text-sm font-black uppercase tracking-wider text-teal-900 mb-3">
                  Product Details (Tabs)
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Field label="Ingredients">
                <textarea
                  className="input min-h-[60px]"
                  value={details.ingredients}
                  onChange={(e) => setDetails((s) => ({ ...s, ingredients: e.target.value }))}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Usage & Dosage">
                <textarea
                  className="input min-h-[60px]"
                  value={details.usageDosage}
                  onChange={(e) => setDetails((s) => ({ ...s, usageDosage: e.target.value }))}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Storage Info">
                <textarea
                  className="input min-h-[60px]"
                  value={details.storageInfo}
                  onChange={(e) => setDetails((s) => ({ ...s, storageInfo: e.target.value }))}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Side Effects">
                <textarea
                  className="input min-h-[60px]"
                  value={details.sideEffects}
                  onChange={(e) => setDetails((s) => ({ ...s, sideEffects: e.target.value }))}
                />
              </Field>
            </div>

            <Field label="Expiry Date (YYYY-MM-DD)">
              <input
                type="date"
                className="input"
                value={details.expiryDate}
                onChange={(e) => setDetails((s) => ({ ...s, expiryDate: e.target.value }))}
              />
            </Field>
          </div>

          <style>{`
            .input {
              width: 100%;
              border: 1px solid #ccf2f4;
              border-radius: 10px;
              padding: 12px;
              outline: none;
              transition: all 0.2s;
            }
            .input:focus {
              border-color: #14b8a6;
              box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
            }
          `}</style>
        </Modal>
      )}
      {openImage && (
        <Modal title="Product Artwork" onClose={() => setOpenImage(false)}>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="h-40 w-40 rounded-2xl border-4 border-teal-50 bg-white flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={previewUrl || resolveImageUrl(selected?.image)}
                alt="preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-bold text-teal-900 mb-2">
                Upload New Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>

            <button
              disabled={uploading}
              className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 disabled:opacity-50"
              onClick={uploadImage}
              type="button"
            >
              <FaUpload /> {uploading ? "Processing..." : "Image upload"}
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-5 py-2 border border-teal-200 text-teal-700 rounded-lg font-bold hover:bg-teal-50"
              onClick={() => setOpenImage(false)}
              disabled={uploading}
              type="button"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const ActionButton = ({ icon, onClick, color, label }) => (
  <button
    onClick={onClick}
    className={`${color} text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all hover:brightness-110 active:scale-95 shadow-sm`}
    type="button"
  >
    {icon} {label}
  </button>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-teal-800 ml-1">
      {label}
    </label>
    {children}
  </div>
);

const Modal = ({ title, onClose, children, footer }) => (
  <div
    className="fixed inset-0 z-50 overflow-y-auto bg-teal-900/20 backdrop-blur-sm"
    onClick={onClose}
  >
    <div className="min-h-full flex items-start justify-center p-4 py-10">
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-teal-50 flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-teal-50 p-6">
          <h3 className="text-xl font-black text-teal-900 uppercase tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-teal-400 hover:text-rose-500 text-2xl transition-colors"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer ? (
          <div className="sticky bottom-0 bg-white border-t border-teal-50 p-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

export default AdminProducts;
