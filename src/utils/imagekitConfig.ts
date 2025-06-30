import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = {
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
};

// Check if any required env vars are missing
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

const imageKit = new ImageKit({
  privateKey: requiredEnvVars.privateKey!,
  publicKey: requiredEnvVars.publicKey!,
  urlEndpoint: requiredEnvVars.urlEndpoint!,
});

export default imageKit;
