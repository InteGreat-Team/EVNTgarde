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
  ssl: { rejectUnauthorized: false },
});

const validStatuses = ["Pending", "Upcoming", "Past", "Rejected", "Draft"] as const;
type Status = (typeof validStatuses)[number];

router.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.event_id AS id,
        e.event_name AS title,
        e.event_status,
        e.event_type_id,
        et.event_type_name AS event_type,
        e.event_desc,
        e.venue_id,
        e.organizer_id,
        e.customer_id,
        e.start_date,
        e.end_date,
        TO_CHAR(e.start_datetime, 'Mon DD') AS date,
        TO_CHAR(e.start_datetime, 'Day') AS day,
        TO_CHAR(e.start_datetime, 'HH12:MI AM') AS starttime,
        TO_CHAR(e.end_datetime, 'HH12:MI AM') AS endtime,
        e.start_datetime,
        e.end_datetime,
        e.guests,
        e.attire,
        e.budget,
        e.liking_score,
        e.revenue,
        e.services
      FROM events e
      LEFT JOIN event_type et ON e.event_type_id = et.event_type_id
      WHERE e.event_status IN ('Pending', 'Upcoming', 'Past', 'Rejected', 'Draft')
      ORDER BY e.start_datetime DESC
    `);

    const bookings = result.rows;

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
          eventType: event.event_type || "",
          eventDesc: event.event_desc || "",
          services: event.services || "", // raw string passed to frontend
        });
      }
    });

    res.status(200).json(groupedData);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
