# Order Matching System

## Overview

The **Order Matching System** is a full-stack application for real-time trading order management and matching. It consists of a **Node.js/Express** backend with a MySQL database, a **React/Next.js** frontend for a responsive user interface, and an **Android mobile app** wrapper built with Kotlin and Capacitor. The system allows users to place buy and sell orders, view pending and completed orders, and automatically matches orders based on price and quantity. RSA encryption is used for secure data transmission between the frontend and backend. The application is designed for deployment in a cloud environment (e.g., AWS, GCP, Azure) for scalability and reliability.

## Features

- **Real-Time Order Management**: Create, view, and match buy/sell orders instantly.
- **Secure Communication**: RSA encryption for secure payload transmission between frontend and backend.
- **Responsive UI**: Built with React/Next.js and Tailwind CSS for a modern interface.
- **Order Matching**: Backend logic matches orders with transaction locking for data consistency.
- **Mobile Support**: Android app with WebView and custom splash screen using Capacitor.
- **Error Handling**: Global error handler middleware ensures consistent API responses.
- **Cloud-Ready**: Optimized for cloud deployment with MySQL and scalable architecture.

## Project Structure

```
OrderMatchingSystem/
├── backend/                        # Node.js/Express backend
│   ├── config/
│   │   └── .env                   # Environment variables (database, port, RSA key)
│   ├── controllers/
│   │   └── orderController.js     # Logic for order placement and matching
│   ├── routes/
│   │   └── orderRoutes.js         # API routes for orders
│   ├── utils/
│   │   ├── encryption.js          # RSA decryption logic
│   │   └── dbLocking.js           # MySQL transaction locking utility
│   ├── database.js                # MySQL connection pool
│   ├── server.js                  # Express app entry point
│   └── package.json
├── frontend/                       # React/Next.js frontend
│   ├── public/
│   │   └── logo.png               # Static assets
│   ├── src/              # Frontend environment variables
│   │   ├── components/
│   │   │   └── CompletedOrdersTable.jsx     
│   │   │   └── Loader.jsx     
│   │   │   └── NewOrderForm.jsx     
│   │   │   └── PendingOrderForm.jsx     
│   │   ├── config/
│   │   │   └── config.js            
│   │   └── services/
│   │   |   └── api.js               
│   │   |   └── orderService.js      
│   │   ├── components/
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── mobile-app/                     # Android app (Kotlin/Capacitor)
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/
│   │   │   │   │   └── com/example/ordermatchingmobile/
│   │   │   │   │       └── MainActivity.kt  # WebView setup
│   │   │   │   ├── res/
│   │   │   │   │   ├── drawable/
│   │   │   │   │   │   └── splash_screen.xml  # Splash screen
│   │   │   │   │   ├── layout/
│   │   │   │   │   └── values/
│   │   └── build.gradle
├── .gitignore
└── README.md                      # Project documentation
```

## Prerequisites

- **Node.js**: v24.4.0 or higher
- **npm**: v10.x or higher
- **MySQL**: Hosted on a cloud provider (e.g., AWS RDS, Google Cloud SQL)
- **Android Studio**: For Android app development
- **OpenSSL**: For RSA key generation (optional, for development)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/TheAfsal/Secure-Order-Management-System
```

### 2. Backend Setup

1. **Navigate to Backend**:
   ```bash
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `backend/config/.env` file with the following:

   ```env
   # Server Config
   PORT=4000

   # MySQL Database Config
   MYSQL_HOST=your-cloud-db-host
   MYSQL_PORT=3306
   MYSQL_USER=your-db-user
   MYSQL_PASSWORD=your-db-password
   MYSQL_DB=trading_db

   # Allowed Origin
   FRONTEND_URL=http://localhost:3000

   # RSA Private Key (replace with your private key)
   PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...YOUR...KEY...DATA...\n-----END PRIVATE KEY-----"
   ```

   Replace `your-cloud-db-host`, `your-db-user`, and `your-db-password` with your cloud MySQL credentials.

4. **Set Up MySQL Database**:
   Create the database schema:

   ```sql
   CREATE DATABASE trading_db;
   USE trading_db;

   CREATE TABLE pending_orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       type ENUM('buy', 'sell') NOT NULL,
       quantity INT NOT NULL CHECK (quantity > 0),
       price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
       status ENUM('pending', 'completed') DEFAULT 'pending',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE completed_orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       quantity INT NOT NULL CHECK (quantity > 0),
       price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
       matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       buyer_order_id INT,
       seller_order_id INT,
       FOREIGN KEY (buyer_order_id) REFERENCES pending_orders(id) ON DELETE SET NULL,
       FOREIGN KEY (seller_order_id) REFERENCES pending_orders(id) ON DELETE SET NULL
   );
   ```

   Run the SQL in your MySQL client (e.g., MySQL Workbench or `mysql` CLI).

5. **Start the Backend**:
   ```bash
   node server.js
   ```
   The API will be available at `http://localhost:4000`.

### 3. Frontend Setup

1. **Navigate to Frontend**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `frontend/src/config/.env` file:

   ```env
   REACT_APP_API_URL=http://localhost:4000
   REACT_APP_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...YOUR...KEY...DATA...\n-----END PUBLIC KEY-----"
   ```

   Replace the public key with your RSA public key.

4. **Start the Frontend**:
   ```bash
   npm start
   ```
   The React/Next.js app will be available at `http://localhost:3000`.

### 5. Cloud Deployment

- **Backend**: Deploy to AWS Elastic Beanstalk, GCP App Engine, or Azure App Service. Update `backend/config/.env` with production database credentials and set `NODE_ENV=production`.
- **Frontend**: Deploy the `frontend/build/` folder to Netlify, Vercel, or AWS S3. Update `REACT_APP_API_URL` with the backend production URL.
- **Database**: Use a managed MySQL instance (e.g., AWS RDS, Google Cloud SQL). Ensure secure connections (e.g., SSL) and configure backups.
- **Monitoring**: Set up logging (e.g., AWS CloudWatch) for the global error handler in `backend/middleware/errorHandler.js`.

## Usage

1. **Web App**:

   - Open `http://localhost:3000` (or production URL).
   - Use the order form to create buy/sell orders.
   - View pending orders (buyers/sellers) and completed orders in real-time.

2. **Mobile App**:

   - Launch the Android app.
   - Observe the splash screen (`splash_screen.xml`).
   - Interact with the WebView-based UI.

3. **API Endpoints**:
   - `GET /api/orders/buyers`: Fetch pending buyer orders.
   - `GET /api/orders/sellers`: Fetch pending seller orders.
   - `GET /api/orders/completed`: Fetch completed orders.
   - `POST /api/orders/buyers`: Create a buyer order (body: `{ "buyer_qty": 10, "buyer_price": 100 }`).
   - `POST /api/orders/sellers`: Create a seller order (body: `{ "seller_qty": 10, "seller_price": 100 }`).

## Security

- **RSA Encryption**: Payloads are encrypted using RSA public/private keys (`frontend/utils/rsaEncrypt.js`, `backend/utils/encryption.js`).
- **CORS**: Configured to allow requests only from `FRONTEND_URL` (set in `backend/config/.env`).
- **Database**: Transaction locking (`backend/utils/dbLocking.js`) ensures data consistency during order matching.

## Error Handling

- **Backend**: Global error handler middleware (`backend/middleware/errorHandler.js`) logs errors and returns JSON responses (e.g., `{ "success": false, "error": "Message" }`).
- **Frontend**: Displays error messages for failed API calls (e.g., invalid quantity).

## Testing

- **Backend**: Test API endpoints with Postman or `curl`.
- **Frontend**: Verify order creation and real-time updates in the browser.
- **Mobile**: Test on Android emulator/device via Android Studio.
- **Database**: Query `pending_orders` and `completed_orders` tables to verify data.

## Troubleshooting

- **API Errors**: Check server logs or cloud logging service (e.g., AWS CloudWatch).
- **Database Issues**: Verify `MYSQL_HOST`, `MYSQL_USER`, and `MYSQL_PASSWORD` in `backend/config/.env`.
- **Mobile App**: Debug WebView using `chrome://inspect` in Chrome (Android).
- **Encryption**: Ensure RSA public/private keys match between frontend and backend.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
