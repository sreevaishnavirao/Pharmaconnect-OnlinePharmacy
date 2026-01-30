import { useMemo, useState } from "react";

const OrderTable = ({ data = [] }) => {
  const [selected, setSelected] = useState(null); 
  const [details, setDetails] = useState(null);  
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const getId = (o) => o?.orderId ?? o?.id ?? o?._id ?? "—";
  const getDate = (o) => o?.orderDate || o?.createdAt || o?.date || "";

  const getStatus = (o) => o?.orderStatus ?? o?.status ?? "—";
  const getCustomer = (o) =>
    o?.email || o?.user?.username || o?.customerName || "—";

  const getTotal = (o) =>
    o?.totalAmount ?? o?.totalPrice ?? o?.total ?? o?.amount ?? 0;

  const money = (n) => {
    const x = Number(n || 0);
    return x.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };
  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        const dt = new Date(`${d}T00:00:00`);
        return dt.toLocaleDateString();
      }
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return dt.toLocaleString();
    } catch {
      return String(d);
    }
  };
  const getToken = () => {
  
    let t =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("jwtToken");

    if (t && t !== "undefined" && t !== "null") return t;
    try {
      const authStr = localStorage.getItem("auth");
      if (authStr) {
        const auth = JSON.parse(authStr);
        const token =
          auth?.token || auth?.jwtToken || auth?.jwt || auth?.accessToken;
        if (token) return token;
      }
    } catch {}

    return "";
  };
  const safeItems = () => {
    const o = details || selected;
    if (!o) return [];
    return o?.items || o?.orderItems || [];
  };

  const openModal = async (order) => {
    setSelected(order);
    setDetails(null);
    setErr("");
    setLoading(true);

    const orderId = getId(order);

    try {
      const token = getToken();

      if (!token) {
        setErr("Unauthorized (401). Your admin token is missing. Please login again.");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/admin/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (res.status === 401) {
        setErr("Unauthorized (401). Your admin token is missing or expired. Please login again.");
        return;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to load order details (${res.status})`);
      }

      const json = await res.json();
      setDetails(json);
    } catch (e) {
      setErr(e?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setDetails(null);
    setErr("");
    setLoading(false);
  };

  const current = details || selected;

return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-teal-100">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-teal-50 border-b border-teal-100">
              <tr className="text-left text-teal-800">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500 text-center" colSpan={6}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                rows.map((o, idx) => (
                  <tr
                    key={`${getId(o)}-${idx}`}
                    className="border-b last:border-b-0 hover:bg-teal-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{getId(o)}</td>
                    <td className="px-4 py-3 text-gray-700">{getCustomer(o)}</td>
                    <td className="px-4 py-3 text-gray-700">{fmtDate(getDate(o))}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-teal-100 text-teal-700 font-medium text-xs">
                        {String(getStatus(o))}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{money(getTotal(o))}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openModal(o)}
                        className="px-3 py-1 rounded-md bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-teal-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-teal-50 bg-teal-50/50">
              <div className="font-bold text-teal-900">
                Order Details —{" "}
                <span className="text-teal-600">{getId(current)}</span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-teal-600 transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Customer" value={getCustomer(current)} />
                <Info label="Status" value={String(getStatus(current))} />
                <Info label="Date" value={fmtDate(getDate(current))} />
                <Info label="Total" value={money(getTotal(current))} />
              </div>

              <div className="mt-6">
                <div className="font-bold text-teal-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-teal-500 rounded-full"></div>
                  Items Ordered
                </div>

                <div className="border border-teal-100 rounded-lg overflow-hidden shadow-sm">
                  <div className="grid grid-cols-12 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-3 text-center">Qty</div>
                    <div className="col-span-3 text-right">Price</div>
                  </div>

                  {loading ? (
                    <div className="px-4 py-4 text-sm text-gray-600">
                      Loading order items...
                    </div>
                  ) : err ? (
                    <div className="px-4 py-4 text-sm text-red-600">{err}</div>
                  ) : safeItems().length === 0 ? (
                    <div className="px-4 py-4 text-sm text-gray-500 italic">
                      No items available in this order.
                    </div>
                  ) : (
                    safeItems().map((it, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-12 px-4 py-3 text-sm border-t border-teal-50 hover:bg-teal-50/20"
                      >
                        <div className="col-span-6 text-gray-800 font-medium">
                          {it?.productName ||
                            it?.product?.productName ||
                            it?.name ||
                            "—"}
                        </div>
                        <div className="col-span-3 text-center text-gray-600">
                          {it?.quantity ?? 1}
                        </div>
                        <div className="col-span-3 text-right text-teal-700 font-semibold">
                          {money(
                            it?.orderedProductPrice ??
                              it?.specialPrice ??
                              it?.price ??
                              0
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-teal-50">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 rounded-md bg-teal-900 text-white hover:bg-black transition-colors shadow-md font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-teal-50/30 border border-teal-100 rounded-lg p-3 hover:border-teal-300 transition-colors">
    <div className="text-[10px] uppercase tracking-widest text-teal-600 font-bold">
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-900 mt-1 break-words">
      {value}
    </div>
  </div>
);

export default OrderTable;
