import api from "./api";

export const getAllBuyerOrders = async () => {
  const response = await api.get("/orders/buyers");
  return response.data;
};

export const getAllSellerOrders = async () => {
  const response = await api.get("/orders/sellers");
  return response.data;
};

export const getAllCompletedOrders = async () => {
  const response = await api.get("/orders/completed");
  return response.data;
};

export const addNewBuyerOrder = async (orderData) => {
  const response = await api.post("/orders/buyers", orderData);
  return response.data;
};

export const addNewSellerOrder = async (orderData) => {
  const response = await api.post("/orders/sellers", orderData);
  return response.data;
};
