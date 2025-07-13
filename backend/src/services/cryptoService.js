import NodeRSA from "node-rsa";
import fs from "fs";

const publicKey = fs.readFileSync("./keys/public.pem");
const privateKey = new NodeRSA(fs.readFileSync("./keys/private.pem"));

const getPublicKey = () => publicKey.toString();
const encrypt = (data) => {
  const key = new NodeRSA();
  key.importKey(publicKey);
  return key.encrypt(Buffer.from(JSON.stringify(data)), "base64");
};

export { getPublicKey, encrypt };
