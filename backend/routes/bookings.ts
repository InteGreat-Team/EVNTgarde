import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Setup PostgreSQL pool connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: { rejectUnauthorized: false },
});

// Valid statuses
const validStatuses = ["Pending", "Upcoming", "Past", "Rejected", "Draft"] as const;
type Status = (typeof validStatuses)[number];

router.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        event_id AS id,
        event_name AS title,
        event_status,
        event_type_id,
        event_desc,
        venue_id,
        organizer_id,
        vendor_id,
        customer_id,
        start_date,
        end_date,
        TO_CHAR(start_datetime, 'Mon DD') AS date,
        TO_CHAR(start_datetime, 'Day') AS day,
        TO_CHAR(start_datetime, 'HH12:MI AM') AS starttime,
        TO_CHAR(end_datetime, 'HH12:MI AM') AS endtime,
        start_datetime,
        end_datetime,
        guests,
        attire,
        budget,
        liking_score
      FROM events
      WHERE event_status IN ('Pending', 'Upcoming', 'Past', 'Rejected', 'Draft')
      ORDER BY start_datetime DESC
    `);

    const bookings = result.rows;
    console.log("✅ Raw bookings count:", bookings.length);

    const groupedData: Record<Status, any[]> = {
      Pending: [],
      Upcoming: [],
      Past: [],
      Rejected: [],
      Draft: [],
    };

    bookings.forEach((event) => {
      const status = event.event_status as Status;

      if (validStatuses.includes(status)) {
        groupedData[status].push({
          id: event.id,
          title: event.title,
          event_status: status,
          event_type_id: event.event_type_id,
          event_desc: event.event_desc,
          venue_id: event.venue_id,
          organizer_id: event.organizer_id,
          vendor_id: event.vendor_id,
          customer: `Customer ${event.customer_id}`,
          location: `Location ${event.venue_id}`,
          guests: `${event.guests} Guests`,
          attire: event.attire,
          budget: event.budget,
          liking_score: event.liking_score,
          start_date: event.start_date,
          end_date: event.end_date,
          date: event.date?.trim() || "Unknown",
          day: event.day?.trim() || "Unknown",
          startTime: event.starttime,
          endTime: event.endtime,
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime,
        });
      }
    });

    console.log("✅ Grouped bookings:", Object.keys(groupedData));
    res.status(200).json(groupedData);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
