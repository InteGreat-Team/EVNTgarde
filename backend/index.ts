import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import eventsRoutes from "./routes/events";
import reviewRoutes from "./routes/reviews";
import uploadImages from "./routes/uploadImage";
import bookingsRoutes from "./routes/bookings";

const app = express();

//Allow both 5173 and 5174 (frontend ports)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

//Enable CORS with correct origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

//Body parsing
app.use(express.json());

//Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  next();
});

//Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

//Test
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({ message: "Test endpoint working" });
});

//Routes
app.use("/api", authRoutes);
app.use("/api", eventsRoutes);
app.use("/api", reviewRoutes);
app.use("/api", uploadImages);
app.use("/api", bookingsRoutes);

//Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
    });

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? err : undefined,
    });
  }
);

//404 fallback
app.use((req: express.Request, res: express.Response) => {
  console.log("404 Not Found:", req.method, req.path);
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.path}`,
  });
});

const PORT = process.env.PORT || 5000;

//Start the server
const server = app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`✅ CORS enabled for ${allowedOrigins.join(", ")}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

//Server errors
server.on("error", (error: any) => {
  console.error("Server error:", error);
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  }
});
