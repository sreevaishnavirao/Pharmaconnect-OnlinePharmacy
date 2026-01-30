
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { addRxSubmission, getUserKey } from "../../utils/notificationStore";

const UploadPrescription = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s?.auth || {});
  const userKey = useMemo(() => getUserKey(user), [user]);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  const [notifyMe, setNotifyMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isImage = useMemo(() => {
    if (!file) return false;
    return String(file.type || "").startsWith("image/");
  }, [file]);

  const onPickFile = (f) => {
    setError("");
    setSubmitted(false);

    if (!f) {
      setFile(null);
      setPreviewUrl("");
      return;
    }

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowed.includes(f.type)) {
      setError("Please upload a PDF or an image (PNG/JPG/WEBP).");
      setFile(null);
      setPreviewUrl("");
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (f.size > maxBytes) {
      setError("File too large. Please upload a file under 5MB.");
      setFile(null);
      setPreviewUrl("");
      return;
    }

    setFile(f);

    if (String(f.type).startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl("");
    setError("");
    setSubmitted(false);
  };

  const validate = () => {
    if (!file) return "Please upload a prescription file (PDF or image).";
    if (!fullName.trim()) return "Please enter your full name.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!agree) return "Please accept the consent checkbox.";
    return "";
  };

  const fileToDataUrl = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const onSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const fileDataUrl = await fileToDataUrl(file);

      addRxSubmission({
        userKey,
        fullName: fullName.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
        fileName: file?.name || "prescription",
        fileType: file?.type || "",
        fileDataUrl,
        notifyOnUpdate: notifyMe,
      });

      setSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10">
    
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Upload Prescription
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            We offer a wide range of <span className="font-bold">OTC medicines</span> to purchase directly.But if you
            dont find any particular medicine we can help you with that too!
          </p>

          
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-800"
          >
            Browse Products <span aria-hidden>→</span>
          </Link>
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Go to Cart
          </button>
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <ShieldCheck className="text-teal-700" size={20} />
            </div>
            <div className="font-bold text-slate-900">Safe & Verified</div>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Upload clear prescription images/PDFs. We validate details before processing.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FileText className="text-indigo-700" size={20} />
            </div>
            <div className="font-bold text-slate-900">If not listed, upload</div>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Can’t find a medicine? Upload Rx and we’ll check availability for you.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Bell className="text-amber-700" size={20} />
            </div>
            <div className="font-bold text-slate-900">We’ll notify you</div>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Check the bell icon anytime to see admin responses.
          </p>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
      
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-extrabold text-slate-900">Prescription Details</h2>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {submitted && !error && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 text-sm flex items-start gap-2">
              <CheckCircle2 size={18} className="mt-0.5" />
              <div>
                <div className="font-bold">Upload received!</div>
                <div className="text-emerald-700/90">
                  You will get an update in Notifications after admin responds.
                </div>
              </div>
            </div>
          )}
          <div className="mt-5">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Upload Prescription (PDF / Image)
            </label>

            <div className="rounded-2xl border border-dashed border-slate-200 p-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-white file:font-bold hover:file:bg-teal-700"
                />

                {file && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <X size={16} />
                    Remove
                  </button>
                )}
              </div>

              {file && (
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-bold">Selected:</span> {file.name}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-300"
                placeholder="full name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-300"
                placeholder="phone number"
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Medicine name if known, dosage, brand preference, urgency, etc."
            />
          </div>
          <div className="mt-5 flex items-start gap-3">
            <input
              type="checkbox"
              checked={notifyMe}
              onChange={(e) => setNotifyMe(e.target.checked)}
              className="mt-1 h-4 w-4 accent-teal-600"
            />
            <p className="text-sm text-slate-600">
              Notify me when admin responds.
            </p>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 h-4 w-4 accent-teal-600"
            />
            <p className="text-sm text-slate-600">
              I confirm this prescription is valid and I consent to be contacted.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-extrabold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            <Upload size={18} />
            {isSubmitting ? "Submitting..." : "Submit Prescription"}
          </button>
        </form>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Preview</h2>

          <div className="mt-5 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
            {file ? (
              isImage ? (
                <img
                  src={previewUrl}
                  alt="Prescription preview"
                  className="w-full h-[340px] object-contain bg-white"
                />
              ) : (
                <div className="p-6 text-sm text-slate-600">
                  PDF uploaded: <span className="font-bold">{file.name}</span>
                </div>
              )
            ) : (
              <div className="p-10 text-center text-sm text-slate-600">
                No file selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
