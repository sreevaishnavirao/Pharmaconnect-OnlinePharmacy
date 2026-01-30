
import React, { useEffect, useMemo, useState } from "react";
import {
  listRxSubmissions,
  setRxSubmissionStatus,
} from "../../../utils/notificationStore";

const statusOptions = [
  { value: "APPROVED", label: "Approve" },
  { value: "NEEDS_INFO", label: "Needs Info" },
  { value: "REJECTED", label: "Reject" },
];

const badgeClass = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "APPROVED") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "REJECTED") return "bg-rose-100 text-rose-800 border-rose-200";
  if (s === "NEEDS_INFO") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-slate-100 text-slate-800 border-slate-200";
};

const fmtDate = (ts) => {
  try {
    return new Date(Number(ts)).toLocaleString();
  } catch {
    return "";
  }
};

const AdminPrescriptions = () => {
  const [tick, setTick] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

 
  const [status, setStatus] = useState("PENDING");
  const [adminMessage, setAdminMessage] = useState("");

 
  useEffect(() => {
    const onUpdate = () => setTick((t) => t + 1);
    window.addEventListener("pharma:store-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("pharma:store-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const submissions = useMemo(() => listRxSubmissions(), [tick]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return submissions.find((s) => String(s.id) === String(selectedId)) || null;
  }, [selectedId, submissions]);

  
  useEffect(() => {
    if (!selected) return;
    setStatus(String(selected.status || "PENDING"));
    setAdminMessage(String(selected.adminMessage || ""));
  }, [selected]);

  const onSave = () => {
    if (!selected) return;

    setRxSubmissionStatus(selected.id, {
      status,
      adminMessage: adminMessage?.trim() || "",
    });

   
    window.dispatchEvent(new CustomEvent("pharma:store-updated"));
  };

  
  const showRightPanel = !!selected;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Prescriptions
          </h1>
          
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
          Total: {submissions.length}
        </div>
      </div>

      <div className={`mt-6 grid gap-6 ${showRightPanel ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
        
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="font-extrabold text-slate-900">Uploaded List</div>
            {!selected && (
              <div className="mt-1 text-xs text-slate-500">
                Click to review and update status.
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-teal-50/60 text-teal-900">
                <tr>
                  <th className="text-left px-5 py-3 font-black tracking-wide">USER</th>
                  <th className="text-left px-5 py-3 font-black tracking-wide">PHONE</th>
                  <th className="text-left px-5 py-3 font-black tracking-wide">STATUS</th>
                  <th className="text-left px-5 py-3 font-black tracking-wide">UPLOADED</th>
                  <th className="text-left px-5 py-3 font-black tracking-wide">FILE</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                      No prescription uploads yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((s) => {
                    const isActive = String(selectedId) === String(s.id);
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedId(s.id)}
                        className={`cursor-pointer hover:bg-slate-50 ${
                          isActive ? "bg-teal-50/40" : ""
                        }`}
                      >
                        <td className="px-5 py-4 font-bold text-slate-900">
                          {s.fullName || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-700">{s.phone || "—"}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black ${badgeClass(
                              s.status
                            )}`}
                          >
                            {String(s.status || "PENDING").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {fmtDate(s.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-slate-700 truncate max-w-[240px]">
                          {s.fileName || "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        
        {showRightPanel && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Review & Respond
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Submission ID: <span className="font-mono">{selected.id}</span>
                </div>
              </div>

              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black ${badgeClass(
                  selected.status
                )}`}
              >
                {String(selected.status || "PENDING").toUpperCase()}
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="text-sm text-slate-700">
                <span className="font-bold">User:</span>{" "}
                {selected.fullName || "—"}
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-bold">Phone:</span> {selected.phone || "—"}
              </div>
              {selected.notes ? (
                <div className="text-sm text-slate-700">
                  <span className="font-bold">Notes:</span> {selected.notes}
                </div>
              ) : null}

              {selected.fileDataUrl ? (
                <div className="mt-2 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  {String(selected.fileType || "").startsWith("image/") ? (
                    <img
                      src={selected.fileDataUrl}
                      alt="Prescription"
                      className="w-full max-h-[320px] object-contain bg-white"
                    />
                  ) : (
                    <div className="p-4 text-sm text-slate-700">
                      PDF uploaded: <span className="font-bold">{selected.fileName}</span>
                      <div className="text-xs text-slate-500 mt-1">
                        (Preview not shown for PDF)
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mt-2">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="PENDING">Pending</option>
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Message to User (optional)
                </label>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="Example: Please upload a clearer image with doctor name visible."
                />
              </div>

              <button
                type="button"
                onClick={onSave}
                className="mt-1 w-full rounded-xl bg-teal-600 px-5 py-3 font-extrabold text-white hover:bg-teal-700"
              >
                Save Response
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPrescriptions;
