import React, { useState } from "react";
import PendingOrdersTable from "./components/PendingOrdersTable";
import NewOrderForm from "./components/NewOrderForm";
import CompletedOrdersTable from "./components/CompletedOrdersTable";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState({ buyers: [], sellers: [] });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updatePendingOrders = () => {
    // Trigger a refresh of pending orders in PendingOrdersTable
    setPendingOrders({ ...pendingOrders }); // Force re-render
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8">Order Matching System</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
          onClick={openModal}
        >
          Create New Order
        </button>
      </div>

      {isModalOpen && (
        <NewOrderForm
          closeModal={closeModal}
          isOpen={isModalOpen}
          updatePendingOrders={updatePendingOrders}
        />
      )}
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
          <PendingOrdersTable />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Completed Orders</h2>
          <CompletedOrdersTable />
        </div>
      </div>
    </div>
  );
};

export default Home;