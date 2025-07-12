const NodeRSA = require('node-rsa');
const fs = require('fs');
const { execSync } = require('child_process');
const logger = require('winston');

const privateKey = new NodeRSA(fs.readFileSync('./keys/private.pem'));

module.exports = (req, res, next) => {
  try {
    const encryptedData = req.body.encrypted;
    if (!encryptedData) {
      return res.status(400).json({ error: 'No encrypted data provided' });
    }

    try {
      // Primary: Node.js RSA decryption
      req.body = JSON.parse(privateKey.decrypt(encryptedData, 'utf8'));
      logger.info('Decryption successful using NodeRSA');
      next();
    } catch (nodeError) {
      logger.warn('NodeRSA decryption failed, falling back to OpenSSL');
      try {
        // Fallback: OpenSSL decryption
        fs.writeFileSync('encrypted.bin', Buffer.from(encryptedData, 'base64'));
        execSync('openssl rsautl -decrypt -inkey ./keys/private.pem -in encrypted.bin -out decrypted.json');
        req.body = JSON.parse(fs.readFileSync('decrypted.json', 'utf8'));
        logger.info('Decryption successful using OpenSSL');
        next();
      } catch (opensslError) {
        logger.error('Decryption failed', { error: opensslError.message });
        res.status(500).json({ error: 'Decryption failed' });
      } finally {
        // Clean up temporary files
        try {
          fs.unlinkSync('encrypted.bin');
          fs.unlinkSync('decrypted.json');
        } catch (e) {}
      }
    }
  } catch (error) {
    logger.error('Middleware error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
};