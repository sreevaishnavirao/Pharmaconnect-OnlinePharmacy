import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import OrderTable from "./OrderTable";
import { fetchAllOrdersForAdmin } from "../../../store/actions/orderActions";

const isYMD = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

const Orders = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { orders, totalPages } = useSelector((state) => state.order);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("date"); 
  const [sortOrder, setSortOrder] = useState("desc"); 

  const pageNumber = Number(new URLSearchParams(location.search).get("page") || 1);
  useEffect(() => {
    dispatch(fetchAllOrdersForAdmin(pageNumber - 1));
  }, [dispatch, pageNumber]);

  useEffect(() => {
    const t = setInterval(() => {
      dispatch(fetchAllOrdersForAdmin(pageNumber - 1));
    }, 10000);
    return () => clearInterval(t);
  }, [dispatch, pageNumber]);

  const filteredData = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    const q = searchQuery.trim().toLowerCase();

    let out = list.filter((o) => {
      if (!q) return true;
      const id = String(o?.orderId ?? "").toLowerCase();
      const email = String(o?.email ?? "").toLowerCase();
      const status = String(o?.orderStatus ?? "").toLowerCase();
      return id.includes(q) || email.includes(q) || status.includes(q);
    });

    out.sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;

      if (filterBy === "customer") {
        const A = String(a?.email ?? "").toLowerCase();
        const B = String(b?.email ?? "").toLowerCase();
        return A.localeCompare(B) * dir;
      }
      const da = a?.orderDate;
      const db = b?.orderDate;
      const A = isYMD(da) ? da : String(da ?? "");
      const B = isYMD(db) ? db : String(db ?? "");
      return A.localeCompare(B) * dir;
    });

    return out;
  }, [orders, searchQuery, filterBy, sortOrder]);

  const handlePageChange = (event, value) => {
    navigate(`/admin/orders?page=${value}`);
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none rounded-md px-3 py-2 w-full md:w-[280px] transition-all"
            placeholder="Search orders (id, email, status)..."
          />

          <select
            className="border border-gray-300 focus:border-teal-500 outline-none rounded-md px-3 py-2 bg-white text-gray-700 cursor-pointer"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="customer">Customer</option>
          </select>

          <select
            className="border border-gray-300 focus:border-teal-500 outline-none rounded-md px-3 py-2 bg-white text-gray-700 cursor-pointer"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl">
        <OrderTable data={filteredData} />
      </div>

      <div className="flex justify-center mt-8 pb-4">
        <Pagination count={totalPages || 1} page={pageNumber} onChange={handlePageChange} />
      </div>
    </div>
  );
};

export default Orders;
