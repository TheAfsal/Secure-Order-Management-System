// src/services/orderService.js
import { pool } from "../config/dbConnection.js";

const getAllBuyerOrders = async () => {
  const [orders] = await pool.query(
    'SELECT * FROM pending_orders WHERE type = "buy" AND status = "pending" AND quantity > 0 ORDER BY price DESC, created_at'
  );
  return orders;
};

const getAllSellerOrders = async () => {
  const [orders] = await pool.query(
    'SELECT * FROM pending_orders WHERE type = "sell" AND status = "pending" AND quantity > 0 ORDER BY price ASC, created_at'
  );
  return orders;
};

const getAllCompletedOrders = async () => {
  const [orders] = await pool.query(
    "SELECT * FROM completed_orders WHERE quantity > 0 ORDER BY created_at DESC"
  );
  return orders;
};

const addNewBuyerOrder = async (buyer_qty, buyer_price) => {
  const connection = await pool.getConnection();
  try {
    await connection.query("START TRANSACTION");

    // Insert new buyer order only if quantity > 0
    if (buyer_qty <= 0) {
      throw new Error("Buyer quantity must be greater than 0");
    }
    const [result] = await connection.query(
      'INSERT INTO pending_orders (type, quantity, price, status) VALUES ("buy", ?, ?, "pending")',
      [buyer_qty, buyer_price]
    );
    const orderId = result.insertId;

    // Find matching seller order
    const [matchedSeller] = await connection.query(
      'SELECT * FROM pending_orders WHERE type = "sell" AND status = "pending" AND quantity > 0 AND price <= ? ORDER BY price ASC, created_at FOR UPDATE',
      [buyer_price]
    );

    if (matchedSeller.length > 0) {
      const seller = matchedSeller[0];
      const sellerQty = seller.quantity;
      const matchedQty = Math.min(buyer_qty, sellerQty);

      // Insert into completed orders only if matched quantity > 0
      if (matchedQty > 0) {
        await connection.query(
          "INSERT INTO completed_orders (quantity, price) VALUES (?, ?)",
          [matchedQty, buyer_price]
        );
      }

      if (sellerQty === matchedQty) {
        // Delete seller order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [seller.id]
        );
        // Delete buyer order if fully matched
        if (buyer_qty === matchedQty) {
          await connection.query(
            'UPDATE pending_orders SET status = "completed" WHERE id = ?',
            [orderId]
          );
        } else {
          // Update buyer quantity
          const newBuyerQty = buyer_qty - matchedQty;
          if (newBuyerQty > 0) {
            await connection.query(
              "UPDATE pending_orders SET quantity = ? WHERE id = ?",
              [newBuyerQty, orderId]
            );
          } else {
            await connection.query(
              'UPDATE pending_orders SET status = "completed" WHERE id = ?',
              [orderId]
            );
          }
        }
      } else if (sellerQty < buyer_qty) {
        // Delete seller order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [seller.id]
        );
        // Update buyer quantity
        const newBuyerQty = buyer_qty - matchedQty;
        if (newBuyerQty > 0) {
          await connection.query(
            "UPDATE pending_orders SET quantity = ? WHERE id = ?",
            [newBuyerQty, orderId]
          );
        } else {
          await connection.query(
            'UPDATE pending_orders SET status = "completed" WHERE id = ?',
            [orderId]
          );
        }
      } else {
        // Update seller quantity
        const newSellerQty = sellerQty - matchedQty;
        if (newSellerQty > 0) {
          await connection.query(
            "UPDATE pending_orders SET quantity = ? WHERE id = ?",
            [newSellerQty, seller.id]
          );
        } else {
          await connection.query(
            'UPDATE pending_orders SET status = "completed" WHERE id = ?',
            [seller.id]
          );
        }
        // Delete buyer order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [orderId]
        );
      }

      // Clean up completed orders and zero-quantity orders
      await connection.query(
        'DELETE FROM pending_orders WHERE status = "completed" OR quantity = 0'
      );
      await connection.query(
        'DELETE FROM completed_orders WHERE quantity = 0'
      );
    }

    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
};

const addNewSellerOrder = async (seller_qty, seller_price) => {
  const connection = await pool.getConnection();
  try {
    await connection.query("START TRANSACTION");

    // Insert new seller order only if quantity > 0
    if (seller_qty <= 0) {
      throw new Error("Seller quantity must be greater than 0");
    }
    const [result] = await connection.query(
      'INSERT INTO pending_orders (type, quantity, price, status) VALUES ("sell", ?, ?, "pending")',
      [seller_qty, seller_price]
    );
    const orderId = result.insertId;

    // Find matching buyer order
    const [matchedBuyer] = await connection.query(
      'SELECT * FROM pending_orders WHERE type = "buy" AND status = "pending" AND quantity > 0 AND price >= ? ORDER BY price DESC, created_at FOR UPDATE',
      [seller_price]
    );

    if (matchedBuyer.length > 0) {
      const buyer = matchedBuyer[0];
      const buyerQty = buyer.quantity;
      const matchedQty = Math.min(seller_qty, buyerQty);

      // Insert into completed orders only if matched quantity > 0
      if (matchedQty > 0) {
        await connection.query(
          "INSERT INTO completed_orders (quantity, price) VALUES (?, ?)",
          [matchedQty, seller_price]
        );
      }

      if (buyerQty === matchedQty) {
        // Delete buyer order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [buyer.id]
        );
        // Delete seller order if fully matched
        if (seller_qty === matchedQty) {
          await connection.query(
            'UPDATE pending_orders SET status = "completed" WHERE id = ?',
            [orderId]
          );
        } else {
          // Update seller quantity
          const newSellerQty = seller_qty - matchedQty;
          if (newSellerQty > 0) {
            await connection.query(
              "UPDATE pending_orders SET quantity = ? WHERE id = ?",
              [newSellerQty, orderId]
            );
          } else {
            await connection.query(
              'UPDATE pending_orders SET status = "completed" WHERE id = ?',
              [orderId]
            );
          }
        }
      } else if (seller_qty < buyerQty) {
        // Delete seller order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [orderId]
        );
        // Update buyer quantity
        const newBuyerQty = buyerQty - matchedQty;
        if (newBuyerQty > 0) {
          await connection.query(
            "UPDATE pending_orders SET quantity = ? WHERE id = ?",
            [newBuyerQty, buyer.id]
          );
        } else {
          await connection.query(
            'UPDATE pending_orders SET status = "completed" WHERE id = ?',
            [buyer.id]
          );
        }
      } else {
        // Update seller quantity
        const newSellerQty = seller_qty - matchedQty;
        if (newSellerQty > 0) {
          await connection.query(
            "UPDATE pending_orders SET quantity = ? WHERE id = ?",
            [newSellerQty, orderId]
          );
        } else {
          await connection.query(
            'UPDATE pending_orders SET status = "completed" WHERE id = ?',
            [orderId]
          );
        }
        // Delete buyer order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [buyer.id]
        );
      }

      // Clean up completed orders and zero-quantity orders
      await connection.query(
        'DELETE FROM pending_orders WHERE status = "completed" OR quantity = 0'
      );
      await connection.query(
        'DELETE FROM completed_orders WHERE quantity = 0'
      );
    }

    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  getAllBuyerOrders,
  getAllSellerOrders,
  getAllCompletedOrders,
  addNewBuyerOrder,
  addNewSellerOrder,
};