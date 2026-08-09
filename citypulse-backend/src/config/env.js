import dotenv from "dotenv";
dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // Fail fast at boot rather than mysteriously later.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: required("MONGO_URI", "mongodb://127.0.0.1:27017/citypulse"),

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  duplicateRadiusMeters: Number(process.env.DUPLICATE_RADIUS_METERS || 100),
};
