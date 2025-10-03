/* import dotenv from "dotenv";
dotenv.config();

import app from "./app";

if (process.env.NODE_ENV !== "test") {
  import("./config/db")
    .then(({ connectDB }) => {
      connectDB().catch((err) => {
        console.error("❌ Failed to connect to the database:", err);
        process.exit(1);
      });
    })
    .catch((err) => {
      console.error("❌ Could not load DB config:", err);
      process.exit(1);
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
*/
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
