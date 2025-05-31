// src/routes/insertVenueData.ts
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

router.post("/insert-venue-components", async (req, res) => {
  const {
    buildingName,
    floor,
    zipCode,
    streetAddress,
    district,
    city,
    province,
    country,
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert or find country
    const countryRes = await client.query(
      "INSERT INTO country (country_name) VALUES ($1) ON CONFLICT (country_name) DO UPDATE SET country_name = EXCLUDED.country_name RETURNING country_id",
      [country.trim()]
    );
    const countryId = countryRes.rows[0].country_id;

    // Insert or find province
    const provinceRes = await client.query(
      "INSERT INTO province (province_name, country_id) VALUES ($1, $2) ON CONFLICT (province_name, country_id) DO UPDATE SET province_name = EXCLUDED.province_name RETURNING province_id",
      [province.trim(), countryId]
    );
    const provinceId = provinceRes.rows[0].province_id;

    // Insert or find city
    const cityRes = await client.query(
      "INSERT INTO city (city_name, province_id, country_id) VALUES ($1, $2, $3) ON CONFLICT (city_name, province_id, country_id) DO UPDATE SET city_name = EXCLUDED.city_name RETURNING city_id",
      [city.trim(), provinceId, countryId]
    );
    const cityId = cityRes.rows[0].city_id;

    // Insert address
    const addressRes = await client.query(
      `INSERT INTO address (street_address, district, zip_code, city_id)
       VALUES ($1, $2, $3, $4) RETURNING address_id`,
      [streetAddress.trim(), district.trim(), zipCode.trim(), cityId]
    );
    const addressId = addressRes.rows[0].address_id;

    // Insert building
    await client.query(
      `INSERT INTO buildings (building_name, floor, address_id)
       VALUES ($1, $2, $3)`,
      [buildingName.trim(), floor.trim(), addressId]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "✅ Data inserted successfully" });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("❌ Error inserting data:", err);
    res.status(500).json({ error: "Insertion failed", details: err.message });
  } finally {
    client.release();
  }
});

export default router;
