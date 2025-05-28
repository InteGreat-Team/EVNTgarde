import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: {
    rejectUnauthorized: false,
  },
});

router.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        event_id AS id,
        event_name AS title,
        event_status,
        TO_CHAR(start_date, 'Mon DD') AS date,
        TO_CHAR(start_date, 'Day') AS day,
        TO_CHAR(start_time, 'HH12:MI AM') AS "startTime",
        TO_CHAR(end_time, 'HH12:MI AM') AS "endTime",
        customer_id AS customer,
        location,
        guests,
        attire,
        additional_services,
        services,
        budget,
        event_type_name,
        event_desc,
        event_type_id,
        organizer_id,
        vendor_id,
        venue_id
      FROM events
      WHERE event_status IN ('pending', 'upcoming', 'past', 'rejected');
    `);


    const bookings = result.rows.map((row) => ({
      ...row,
      guests: `${row.guests} Guests`,
    }));

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
