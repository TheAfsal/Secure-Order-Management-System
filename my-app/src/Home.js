import { useState } from "react";
import PendingOrdersTable from "./components/PendingOrdersTable";
import NewOrderForm from "./components/NewOrderForm";
import CompletedOrdersTable from "./components/CompletedOrdersTable";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pendingOrders, setPendingOrders] = useState({
    buyers: [],
    sellers: [],
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updatePendingOrders = () => {
    setRefresh(!refresh);
    setPendingOrders({ ...pendingOrders });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Order Matching System
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track your trading orders in real-time
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              onClick={openModal}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Order
            </button>
          </div>
        </div>

        {/* Modal */}
        <NewOrderForm
          closeModal={closeModal}
          isOpen={isModalOpen}
          updatePendingOrders={updatePendingOrders}
        />

        {/* Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PendingOrdersTable refresh={refresh} />
          </div>
          <div className="space-y-6">
            <CompletedOrdersTable refresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
