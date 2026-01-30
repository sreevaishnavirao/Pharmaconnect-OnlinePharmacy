import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBoxOpen, FaDollarSign, FaShoppingCart } from "react-icons/fa";

import DashboardOverview from "./DashboardOverview";
import { analyticsAction } from "../../../store/actions";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";
const Dashboard = () => {
  const dispatch = useDispatch();

  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const adminState = useSelector((state) => state.admin);

  const productCount = adminState?.analytics?.productCount ?? 0;
  const totalOrders = adminState?.analytics?.totalOrders ?? 0;
  const totalRevenue = adminState?.analytics?.totalRevenue ?? 0;

  useEffect(() => {
    dispatch(analyticsAction());
  }, [dispatch]);
if (isLoading) return <Loader />;
  if (errorMessage) return <ErrorPage message={errorMessage} />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardOverview
          title="Total Products"
          amount={productCount}
          Icon={FaBoxOpen}
        />

        <DashboardOverview
          title="Total Orders"
          amount={totalOrders}
          Icon={FaShoppingCart}
        />

        <DashboardOverview
          title="Total Revenue"
          amount={totalRevenue}
          Icon={FaDollarSign}
          revenue
        />
      </div>
    </div>
  );
};

export default Dashboard;
