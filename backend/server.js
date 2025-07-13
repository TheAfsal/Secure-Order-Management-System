import { app, logger } from "./app.js";
import { testConnection } from "./src/config/dbConnection.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  await testConnection(); 
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

startServer();
