require('dotenv').config();
const functions = require('firebase-functions');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors')({ origin: true });

// ... existing code ...

exports.getUserType = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    const { firebaseUid, email } = req.body;

    try {
      // Try Customer
      const customerResult = await pool.query(
        `SELECT customer_type AS "userType"
         FROM Customer_Account_Data
         WHERE customer_id = $1 OR customer_email = $2
         LIMIT 1`,
        [firebaseUid, email]
      );
      if (customerResult.rows.length > 0) {
        return res.json({ userType: customerResult.rows[0].userType });
      }

      // Try Vendor
      const vendorResult = await pool.query(
        `SELECT vendor_type AS "userType"
         FROM Vendor_Account_Data
         WHERE vendor_id = $1 OR vendor_email = $2
         LIMIT 1`,
        [firebaseUid, email]
      );
      if (vendorResult.rows.length > 0) {
        return res.json({
          userType: "vendor",
          vendorType: vendorResult.rows[0].userType,
        });
      }

      // Try Organizer
      const organizerResult = await pool.query(
        `SELECT organizer_type AS "userType"
         FROM Event_Organizer_Account_Data
         WHERE organizer_id = $1 OR organizer_email = $2
         LIMIT 1`,
        [firebaseUid, email]
      );
      if (organizerResult.rows.length > 0) {
        return res.json({ userType: organizerResult.rows[0].userType });
      }

      // Not found
      return res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.error('Error getting user type:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error.message
      });
    }
  });
});

exports.registerCustomer = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // ... existing logic ...
    // (no changes to the logic inside)
    // ...
    // ...
  });
});

exports.registerVendor = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // ... existing logic ...
    // ...
  });
});

exports.registerOrganizer = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // ... existing logic ...
    // ...
  });
});

exports.login = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // ... existing logic ...
    // ...
  });
});

exports.syncUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // ... existing logic ...
    // ...
  });
});

exports.getRole = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // ... existing logic ...
    // ...
  });
});
// ... existing code ... 