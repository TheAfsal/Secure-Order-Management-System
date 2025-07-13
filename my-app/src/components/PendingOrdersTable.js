import { useEffect, useState } from "react";
import {
  getAllBuyerOrders,
  getAllSellerOrders,
} from "../services/orderService";
import Loader from "./Loader";

const PendingOrdersTable = ({ refresh }) => {
  const [pendingBuyer, setPendingBuyer] = useState([]);
  const [pendingSeller, setPendingSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const [buyers, sellers] = await Promise.all([
        getAllBuyerOrders(),
        getAllSellerOrders(),
      ]);
      setPendingBuyer(buyers);
      setPendingSeller(sellers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Orders
          </h2>
        </div>
        <Loader />
      </div>
    );
  }

  const maxRows = Math.max(pendingBuyer.length, pendingSeller.length);
  const rows = [];

  for (let i = 0; i < maxRows; i++) {
    const buyerOrder = pendingBuyer[i];
    const sellerOrder = pendingSeller[i];
    rows.push({ buyerOrder, sellerOrder, index: i });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pending Orders
          <span className="ml-auto text-sm font-normal text-gray-600 dark:text-gray-400">
            {maxRows} orders
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Buyer Qty
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                Buyer Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Seller Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Seller Qty
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {rows.map(({ buyerOrder, sellerOrder, index }) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {buyerOrder ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {buyerOrder.quantity}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {buyerOrder ? (
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${buyerOrder.price}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sellerOrder ? (
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${sellerOrder.price}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sellerOrder ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      {sellerOrder.quantity}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      No pending orders
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Create a new order to get started
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrdersTable;
