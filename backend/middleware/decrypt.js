import NodeRSA from "node-rsa";
import fs from "fs";
import { execSync } from "child_process";
import logger from "winston";

const privateKey = new NodeRSA(fs.readFileSync("./keys/private.pem"));

const decryptMiddleware = (req, res, next) => {
  try {
    const encryptedData = req.body.encrypted;
    if (!encryptedData) {
      return res.status(400).json({ error: "No encrypted data provided" });
    }

    try {
      // Primary: Node.js RSA decryption
      req.body = JSON.parse(privateKey.decrypt(encryptedData, "utf8"));
      logger.info("Decryption successful using NodeRSA", {
        timestamp: new Date(),
      });
      next();
    } catch (nodeError) {
      logger.warn("NodeRSA decryption failed, falling back to OpenSSL", {
        error: nodeError.message,
      });

      try {
        // Fallback: OpenSSL decryption
        fs.writeFileSync("encrypted.bin", Buffer.from(encryptedData, "base64"));
        execSync(
          "openssl rsautl -decrypt -inkey ./keys/private.pem -in encrypted.bin -out decrypted.json"
        );
        req.body = JSON.parse(fs.readFileSync("decrypted.json", "utf8"));
        logger.info("Decryption successful using OpenSSL", {
          timestamp: new Date(),
        });
        next();
      } catch (opensslError) {
        logger.error("Decryption failed", { error: opensslError.message });
        return res.status(500).json({ error: "Decryption failed" });
      } finally {
        // Clean up temporary files
        try {
          fs.unlinkSync("encrypted.bin");
          fs.unlinkSync("decrypted.json");
        } catch (e) {
          logger.warn("Cleanup failed", { error: e.message });
        }
      }
    }
  } catch (error) {
    logger.error("Middleware error", { error: error.message });
    next(error);
  }
};

export default decryptMiddleware;
