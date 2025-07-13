import { pool } from "../config/dbConnection.js";

const getAllBuyerOrders = async () => {
  const [orders] = await pool.query(
    'SELECT * FROM pending_orders WHERE type = "buy" AND status = "pending" ORDER BY price DESC, created_at'
  );
  return orders;
};

const getAllSellerOrders = async () => {
  const [orders] = await pool.query(
    'SELECT * FROM pending_orders WHERE type = "sell" AND status = "pending" ORDER BY price ASC, created_at'
  );
  return orders;
};

const getAllCompletedOrders = async () => {
  const [orders] = await pool.query(
    "SELECT * FROM completed_orders ORDER BY created_at DESC"
  );
  return orders;
};

const addNewBuyerOrder = async (buyer_qty, buyer_price) => {
  const connection = await pool.getConnection();
  try {
    await connection.query("START TRANSACTION");

    // Insert new buyer order
    const [result] = await connection.query(
      'INSERT INTO pending_orders (type, quantity, price, status) VALUES ("buy", ?, ?, "pending")',
      [buyer_qty, buyer_price]
    );
    const orderId = result.insertId;

    // Find matching seller order
    const [matchedSeller] = await connection.query(
      'SELECT * FROM pending_orders WHERE type = "sell" AND status = "pending" AND price <= ? ORDER BY price ASC, created_at FOR UPDATE',
      [buyer_price]
    );

    if (matchedSeller.length > 0) {
      const seller = matchedSeller[0];
      const sellerQty = seller.quantity;
      const matchedQty = Math.min(buyer_qty, sellerQty);

      // Insert into completed orders
      await connection.query(
        "INSERT INTO completed_orders (quantity, price) VALUES (?, ?)",
        [matchedQty, buyer_price]
      );

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
          await connection.query(
            "UPDATE pending_orders SET quantity = ? WHERE id = ?",
            [buyer_qty - matchedQty, orderId]
          );
        }
      } else if (sellerQty < buyer_qty) {
        // Delete seller order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [seller.id]
        );
        // Update buyer quantity
        await connection.query(
          "UPDATE pending_orders SET quantity = ? WHERE id = ?",
          [buyer_qty - matchedQty, orderId]
        );
      } else {
        // Update seller quantity
        await connection.query(
          "UPDATE pending_orders SET quantity = ? WHERE id = ?",
          [sellerQty - matchedQty, seller.id]
        );
        // Delete buyer order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [orderId]
        );
      }

      // Clean up completed orders
      await connection.query(
        'DELETE FROM pending_orders WHERE status = "completed"'
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

    // Insert new seller order
    const [result] = await connection.query(
      'INSERT INTO pending_orders (type, quantity, price, status) VALUES ("sell", ?, ?, "pending")',
      [seller_qty, seller_price]
    );
    const orderId = result.insertId;

    // Find matching buyer order
    const [matchedBuyer] = await connection.query(
      'SELECT * FROM pending_orders WHERE type = "buy" AND status = "pending" AND price >= ? ORDER BY price DESC, created_at FOR UPDATE',
      [seller_price]
    );

    if (matchedBuyer.length > 0) {
      const buyer = matchedBuyer[0];
      const buyerQty = buyer.quantity;
      const matchedQty = Math.min(seller_qty, buyerQty);

      // Insert into completed orders
      await connection.query(
        "INSERT INTO completed_orders (quantity, price) VALUES (?, ?)",
        [matchedQty, seller_price]
      );

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
          await connection.query(
            "UPDATE pending_orders SET quantity = ? WHERE id = ?",
            [seller_qty - matchedQty, orderId]
          );
        }
      } else if (seller_qty < buyerQty) {
        // Delete seller order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [orderId]
        );
        // Update buyer quantity
        await connection.query(
          "UPDATE pending_orders SET quantity = ? WHERE id = ?",
          [buyerQty - matchedQty, buyer.id]
        );
      } else {
        // Update seller quantity
        await connection.query(
          "UPDATE pending_orders SET quantity = ? WHERE id = ?",
          [seller_qty - matchedQty, orderId]
        );
        // Delete buyer order
        await connection.query(
          'UPDATE pending_orders SET status = "completed" WHERE id = ?',
          [buyer.id]
        );
      }

      // Clean up completed orders
      await connection.query(
        'DELETE FROM pending_orders from pending_orders WHERE status = "completed"'
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
