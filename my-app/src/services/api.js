import axios from "axios";
import NodeRSA from "node-rsa";

const key = new NodeRSA();
const publicKey = process.env.REACT_APP_PUBLIC_KEY?.replace(/\\n/g, '\n');
key.importKey(publicKey);


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
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
