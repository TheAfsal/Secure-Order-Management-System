import { useState } from "react";
import { addNewBuyerOrder, addNewSellerOrder } from "../services/orderService";
import Loader from "./Loader";

const NewOrderForm = ({ isOpen, closeModal, updatePendingOrders }) => {
  const [buyer_qty, setBuyer_qty] = useState("");
  const [buyer_price, setBuyer_price] = useState("");
  const [seller_price, setSeller_price] = useState("");
  const [seller_qty, setSeller_qty] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "buyer") {
        await addNewBuyerOrder({
          buyer_qty: Number(buyer_qty),
          buyer_price: Number(buyer_price),
        });
      } else {
        await addNewSellerOrder({
          seller_qty: Number(seller_qty),
          seller_price: Number(seller_price),
        });
      }
      updatePendingOrders();
      setBuyer_qty("");
      setBuyer_price("");
      setSeller_price("");
      setSeller_qty("");
      closeModal();
    } catch (error) {
      console.error("Error creating new order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {loading ? (
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <Loader />
        </div>
      ) : (
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create New Order</h2>
              <button
                type="button"
                className="text-white/80 hover:text-white transition-colors p-1"
                onClick={closeModal}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  role === "buyer"
                    ? "bg-white dark:bg-gray-800 text-green-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600"
                }`}
                onClick={() => setRole("buyer")}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Buyer
                </span>
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  role === "seller"
                    ? "bg-white dark:bg-gray-800 text-red-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-red-600"
                }`}
                onClick={() => setRole("seller")}
              >
                <span className="flex items-center justify-center gap-2">
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
                  Seller
                </span>
              </button>
            </div>

            {role === "buyer" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={buyer_qty}
                    onChange={(e) => setBuyer_qty(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={buyer_price}
                    onChange={(e) => setBuyer_price(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter price"
                  />
                </div>
              </div>
            )}

            {role === "seller" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={seller_qty}
                    onChange={(e) => setSeller_qty(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={seller_price}
                    onChange={(e) => setSeller_price(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter price"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Place Order
              </button>
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewOrderForm;
