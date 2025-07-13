import orderService from "../services/orderService.js";
import logger from "winston";

const getAllBuyerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllBuyerOrders();
    res.json(orders);
  } catch (error) {
    logger.error("Error fetching buyer orders", { error: error.message });
    next(error);
  }
};

const getAllSellerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllSellerOrders();
    res.json(orders);
  } catch (error) {
    logger.error("Error fetching seller orders", { error: error.message });
    next(error);
  }
};

const getAllCompletedOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllCompletedOrders();
    res.json(orders);
  } catch (error) {
    logger.error("Error fetching completed orders", { error: error.message });
    next(error);
  }
};

const addNewBuyerOrder = async (req, res, next) => {
  const { buyer_qty, buyer_price } = req.body;
  try {
    await orderService.addNewBuyerOrder(buyer_qty, buyer_price);
    logger.info("Buyer order placed successfully", { buyer_qty, buyer_price });
    res.sendStatus(201);
  } catch (error) {
    logger.error("Error adding buyer order", { error: error.message });
    next(error);
  }
};

const addNewSellerOrder = async (req, res, next) => {
  const { seller_qty, seller_price } = req.body;
  try {
    await orderService.addNewSellerOrder(seller_qty, seller_price);
    logger.info("Seller order placed successfully", {
      seller_qty,
      seller_price,
    });
    res.sendStatus(201);
  } catch (error) {
    logger.error("Error adding seller order", { error: error.message });
    next(error);
  }
};

export default {
  getAllBuyerOrders,
  getAllSellerOrders,
  getAllCompletedOrders,
  addNewBuyerOrder,
  addNewSellerOrder,
};
