// server/index.js
import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/submit", (req, res) => {
  const {
    event_type_id,
    organizer_id,
    venue_id,
    budget,
    start_datetime,
    end_datetime,
    guests,
  } = req.body;

  // Build the JSON we’ll pass to Python
  const pyInput = {
    event_type_id,
    organizer_id,
    venue_id,
    budget,
    start_datetime,
    end_datetime,
    guests,
  };

  // On Windows, run `python`. On macOS/Linux, run `python3`.
  const pythonExe = process.platform === "win32" ? "python" : "python3";
  const scriptPath = path.join(process.cwd(), "server", "predict.py");
  const py = spawn(pythonExe, [scriptPath, JSON.stringify(pyInput)], {
    cwd: path.join(process.cwd(), "server"),
  });

  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  py.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  py.on("close", (code) => {
    if (code !== 0) {
      console.error("Python exited with code", code);
      console.error("stderr:", stderr);
      return res.status(500).json({ error: "Prediction failed" });
    }
    const predictedStr = stdout.trim();
    const predictedValue = parseFloat(predictedStr);
    if (isNaN(predictedValue)) {
      console.error("Invalid prediction from Python:", predictedStr);
      return res.status(500).json({ error: "Prediction not a number" });
    }
    return res.json({ liking_score: predictedValue });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
