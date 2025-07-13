import express from "express";
import orderController from "../controllers/orderController.js";
import decrypt from "../middleware/decrypt.js";
const router = express.Router();

// Routes
router.get("/buyers", orderController.getAllBuyerOrders);
router.get("/sellers", orderController.getAllSellerOrders);
router.get("/completed", orderController.getAllCompletedOrders);
router.post("/buyers", decrypt, orderController.addNewBuyerOrder);
router.post("/sellers", decrypt, orderController.addNewSellerOrder);

export default router;
