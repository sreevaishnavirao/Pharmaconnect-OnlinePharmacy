import React from "react";

const DashboardOverview = ({ title, amount, Icon, revenue = false }) => {
  const formattedAmount = revenue
    ? `$${Number(amount || 0).toFixed(2)}`
    : String(amount ?? 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 border-l-4 border-teal-500">
    
      <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
        
        {Icon ? <Icon className="text-teal-600 text-xl" /> : null}
      </div>

      <div>
        <h4 className="text-gray-600 font-medium">{title}</h4>
        <p className="text-3xl font-bold mt-1 text-gray-800">{formattedAmount}</p>
      </div>
    </div>
  );
};
export default DashboardOverview;