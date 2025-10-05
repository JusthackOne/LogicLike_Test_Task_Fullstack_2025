import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER || "app",
    password: process.env.DB_PASSWORD || "app",
    database: process.env.DB_NAME || "app",
    url: process.env.DATABASE_URL || undefined,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};
