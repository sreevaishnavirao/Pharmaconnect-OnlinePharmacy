import React, { useState } from "react";

const StockNotifyModal = ({ open, onClose, onSubmit, defaultEmail = "" }) => {
  const [email, setEmail] = useState(defaultEmail);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">
            Notify me when back in stock
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-3">
          <label className="text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(email)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-extrabold hover:bg-teal-700"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockNotifyModal;
