import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from "./config/db";
import app from "./app";
const PORT = 5000;
connectDB().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1); // Exit the process if the database connection fails
});
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
