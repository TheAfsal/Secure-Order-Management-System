import React, { useEffect, useState } from "react";
import { getAllCompletedOrders } from "../services/orderService";
import Loader from "./Loader";

const CompletedOrdersTable = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const orders = await getAllCompletedOrders();
        setCompletedOrders(orders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed orders:', error);
        setLoading(false);
      }
    };

    fetchCompletedOrders();
    const interval = setInterval(fetchCompletedOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-y-auto border border-gray-200 rounded-lg shadow-md h-[20rem]">
          <h2 className="px-4 py-2 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700">
            Completed Orders
          </h2>
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="bg-slate-300">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
            </table>
            <div className="h-[calc(100%-2.5rem)]">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedOrders.map((order) => (
                    <tr key={order.id} className={order.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 whitespace-nowrap text-left">{order.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">{order.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedOrdersTable;