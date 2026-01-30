import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";

import {
  adminFetchCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../../../store/actions";

const Category = () => {
  const dispatch = useDispatch();

  
  const reduxCategories = useSelector(
    (state) =>
      state?.admin?.categories ||
      state?.categories?.categories ||
      state?.categories?.content ||
      []
  );

  const [loading, setLoading] = useState(false);
  const [localCategories, setLocalCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const categories = useMemo(() => {
    const fromRedux = Array.isArray(reduxCategories) ? reduxCategories : [];
    const fromLocal = Array.isArray(localCategories) ? localCategories : [];
    return fromRedux.length ? fromRedux : fromLocal;
  }, [reduxCategories, localCategories]);

  const normalizeCategories = (data) => {
    const arr = Array.isArray(data) ? data : data?.content || [];
    return arr.map((c) => ({
      categoryId: c?.categoryId ?? c?.id,
      categoryName: c?.categoryName ?? c?.name ?? "",
    }));
  };

  const fetchCategoriesAdmin = async () => {
    try {
      setLoading(true);

      const res = await dispatch(adminFetchCategories());
      if (res?.ok) {
        setLocalCategories(normalizeCategories(res.data));
      } else {
        setLocalCategories([]);
      }
    } catch (e) {
      toast.error("Failed to load categories");
      setLocalCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAdmin();
    
  }, []);

  const resetForm = () => {
    setName("");
    setEditing(null);
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setName(cat?.categoryName || "");
  };

  const handleSave = async () => {
    const trimmed = String(name || "").trim();
    if (!trimmed) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSaving(true);

      if (editing?.categoryId) {
       
        const res = await dispatch(
          adminUpdateCategory(editing.categoryId, { categoryName: trimmed })
        );
        if (!res?.ok) throw new Error(res?.error || "Update failed");
        toast.success("Category updated");
      } else {
       
        const res = await dispatch(adminCreateCategory(trimmed));
        if (!res?.ok) throw new Error(res?.error || "Create failed");
        toast.success("Category created");
      }

      resetForm();
      await fetchCategoriesAdmin();
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!cat?.categoryId || !window.confirm(`Delete "${cat.categoryName}"?`))
      return;

    try {
      setSaving(true);

      const res = await dispatch(adminDeleteCategory(cat.categoryId));
      if (!res?.ok) throw new Error(res?.error || "Delete failed");

      toast.success("Category deleted");
      await fetchCategoriesAdmin();
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
     
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
          <h1 className="text-2xl font-extrabold text-teal-900 uppercase tracking-tight">
            Inventory Categories
          </h1>
        </div>
        <p className="text-teal-600 font-medium ml-4">
          Organize your pharmacy products for easier browsing.
        </p>
      </div>
      <div className="bg-white border border-teal-100 rounded-xl shadow-sm p-6 mb-8 transition-all">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 ml-1">
              {editing ? "Edit Category Name" : "Create New Category"}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cold & Flu, Vitamins, Pain Relief"
              className="w-full border border-teal-100 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all bg-teal-50/20"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-600 text-white font-bold shadow-md hover:bg-teal-700 disabled:opacity-60 transition-all active:scale-95"
            >
              {editing ? <FaEdit /> : <FaPlus />}
              {saving ? "Processing..." : editing ? "Update" : "Create"}
            </button>

            {editing && (
              <button
                onClick={resetForm}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg border border-teal-200 text-teal-700 font-bold hover:bg-teal-50 transition-all disabled:opacity-60"
              >
                Cancel
              </button>
            )}

            <button
              onClick={fetchCategoriesAdmin}
              disabled={loading || saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-teal-100 text-teal-600 hover:bg-teal-50 disabled:opacity-60 transition-colors"
              title="Refresh List"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border border-teal-100 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between">
          <div className="font-bold text-teal-900 uppercase text-sm tracking-widest">
            Existing Groups{" "}
            <span className="ml-2 px-2 py-0.5 bg-teal-200 text-teal-800 rounded-full text-xs">
              {categories?.length || 0}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-teal-600 font-medium">
            Loading records...
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="p-10 text-center text-teal-600 font-medium">
            No categories in database.
          </div>
        ) : (
          <div className="divide-y divide-teal-50">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                className="px-6 py-4 flex items-center justify-between hover:bg-teal-50/20 transition-colors"
              >
                <div className="text-teal-900 font-bold flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                  {cat.categoryName}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 rounded-lg border border-teal-100 text-teal-600 hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                    title="Edit Name"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={saving}
                    className="p-2 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm disabled:opacity-40"
                    title="Delete Category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
