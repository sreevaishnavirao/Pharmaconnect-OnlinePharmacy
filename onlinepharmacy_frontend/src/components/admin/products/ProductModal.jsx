import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const ProductModal = ({ open, setOpen, categories, editing, onSaved }) => {
  const [form, setForm] = useState({
    productName: "",
    image: "",
    description: "",
    quantity: 1,
    price: 0,
    discount: 0,
    specialPrice: 0,
    categoryId: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editing) {
      setForm({
        productName: editing.productName || "",
        image: editing.image || "",
        description: editing.description || "",
        quantity: editing.quantity ?? 1,
        price: editing.price ?? 0,
        discount: editing.discount ?? 0,
        specialPrice: editing.specialPrice ?? 0,
        categoryId: editing.categoryId ?? "",
      });
    } else {
      setForm({
        productName: "",
        image: "",
        description: "",
        quantity: 1,
        price: 0,
        discount: 0,
        specialPrice: 0,
        categoryId: categories?.[0]?.categoryId || "",
      });
    }
  }, [open, editing, categories]);

  if (!open) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.productName || !form.description || !form.categoryId) {
      toast.error("Please fill Product Name, Description, Category");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        discount: Number(form.discount),
        specialPrice: Number(form.specialPrice),
        categoryId: Number(form.categoryId),
      };
      if (editing?.productId) {
        await api.put(`/admin/products/${editing.productId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post(`/admin/products`, payload);
        toast.success("Product added");
      }

      onSaved?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => !saving && setOpen(false)}
    >
    
      <div
        className="bg-white rounded-lg w-full max-w-xl shadow-lg flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {editing ? "Edit Product" : "Add Product"}
          </h2>
          <button
            className="text-slate-600 hover:text-slate-900"
            onClick={() => setOpen(false)}
            type="button"
            disabled={saving}
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Product Name</label>
              <input
                name="productName"
                value={form.productName}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              >
                {categories?.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Image</label>
            <input
              name="image"
              value={form.image}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="default.png or filename.jpg"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-sm font-semibold">Qty</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                min={0}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                step="0.01"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Discount</label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                step="0.01"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Special Price</label>
              <input
                type="number"
                name="specialPrice"
                value={form.specialPrice}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                step="0.01"
              />
            </div>
          </div>
          <div className="sticky bottom-0 bg-white pt-4 border-t mt-6">
            <div className="flex justify-end gap-2 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded hover:bg-slate-50"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                disabled={saving}
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
