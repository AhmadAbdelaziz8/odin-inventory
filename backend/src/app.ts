import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import swordRoutes from "./routes/swordRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import materialRoutes from "./routes/materialRoutes";
import originRoutes from "./routes/originRoutes";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/swords", swordRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/origins", originRoutes);

// Root route
app.get("/", (req, res) => {
  // console.log("Root route accessed");
  res.send("Sword Inventory API - Welcome!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
