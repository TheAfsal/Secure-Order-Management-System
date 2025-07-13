import axios from "axios";
import NodeRSA from "node-rsa";
import publicKeyPem from "../assets/public.pem";

const key = new NodeRSA();
key.importKey(publicKeyPem);

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.method === "post" && config.data) {
    console.log("Encrypting data:", config.data);
    config.data = {
      encrypted: key.encrypt(
        Buffer.from(JSON.stringify(config.data)),
        "base64"
      ),
    };
    console.log("Encrypted data:", config.data);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
