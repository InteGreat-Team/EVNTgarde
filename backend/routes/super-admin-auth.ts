import express, { type NextFunction, type Request, type Response } from "express"
import pool from "../db"

const router = express.Router()

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`Super Admin Route Hit: ${req.method} ${req.path}`)
  console.log('Full URL:', req.originalUrl)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  next()
})

// Super Admin Quick Login (simplified - just check if super admin exists)
router.post("/superAdminQuickLogin", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Super admin quick login attempt")

    // Simple query to get the super admin account
    const adminResult = await pool.query(
      `SELECT admin_id, admin_email, admin_name, admin_permissions
       FROM super_admin_account_data
       WHERE admin_id = 'super_admin_001'
       LIMIT 1`,
    )

    console.log("Query result:", adminResult.rows)

    if (adminResult.rows.length === 0) {
      console.log("No super admin account found")
      res.status(404).json({
        success: false,
        message: "Super admin account not found",
      })
      return
    }

    const admin = adminResult.rows[0]
    console.log("Found admin:", admin)

    // Update last login timestamp (optional, ignore if column doesn't exist)
    try {
      await pool.query(
        `UPDATE super_admin_account_data 
         SET last_login_timestamp = NOW() 
         WHERE admin_id = $1`,
        [admin.admin_id],
      )
    } catch (updateErr) {
      console.log("Could not update last login (column may not exist):", updateErr)
      // Continue anyway
    }

    // Log admin action (optional, ignore if table doesn't exist)
    try {
      await pool.query(
        `INSERT INTO admin_actions (admin_id, action_type, action_details, timestamp)
         VALUES ($1, $2, $3, NOW())`,
        [admin.admin_id, "quick_login", "Super admin quick login successful"],
      )
    } catch (logErr) {
      console.log("Could not log admin action (table may not exist):", logErr)
      // Continue anyway
    }

    res.status(200).json({
      success: true,
      userType: "super_admin",
      adminId: admin.admin_id,
      adminEmail: admin.admin_email,
      adminName: admin.admin_name || "System Administrator",
      permissions: admin.admin_permissions || "full_access",
      message: "Super admin quick login successful",
    })
  } catch (err: any) {
    console.error("Super admin quick login error:", err)
    res.status(500).json({
      success: false,
      message: "Database error: " + err.message,
    })
  }
})

// Super Admin Login with Firebase UID
router.post(
  "/superAdminLogin",
  async (
    req: Request<{}, {}, { firebaseUid?: string; email?: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { firebaseUid, email } = req.body

    try {
      // Check super admin credentials in the database
      const adminResult = await pool.query(
        `SELECT admin_id, admin_email, admin_name, admin_permissions
         FROM super_admin_account_data
         WHERE admin_email = $1 AND is_active = true
         LIMIT 1`,
        [email],
      )

      if (adminResult.rows.length === 0) {
        // Not a super admin, return 404 so regular login can proceed
        res.status(404).json({
          success: false,
          message: "Not a super admin account",
        })
        return
      }

      const admin = adminResult.rows[0]

      // Update last login
      try {
        await pool.query(
          `UPDATE super_admin_account_data 
           SET last_login_timestamp = NOW() 
           WHERE admin_id = $1`,
          [admin.admin_id],
        )
      } catch (updateErr) {
        console.log("Could not update last login:", updateErr)
      }

      // Log admin action
      try {
        await pool.query(
          `INSERT INTO admin_actions (admin_id, action_type, action_details, timestamp)
           VALUES ($1, $2, $3, NOW())`,
          [admin.admin_id, "login", "Super admin login successful"],
        )
      } catch (logErr) {
        console.log("Could not log admin action:", logErr)
      }

      res.status(200).json({
        success: true,
        userType: "super_admin",
        adminId: admin.admin_id,
        adminEmail: admin.admin_email,
        adminName: admin.admin_name,
        permissions: admin.admin_permissions,
        message: "Super admin authenticated successfully",
      })
    } catch (err: any) {
      console.error("Super admin login error:", err)
      next(err)
    }
  },
)

// Get all user verification requests
router.get("/verification-requests", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = req.headers.authorization?.replace("Bearer ", "")
    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized" })
      return
    }

    const result = await pool.query(`
        SELECT 
          uvr.verification_id,
          uvr.user_id,
          uvr.user_type,
          uvr.documents_submitted,
          uvr.status,
          uvr.admin_notes,
          uvr.reviewed_by,
          uvr.reviewed_at,
          CASE 
            WHEN uvr.user_type = 'individual' THEN cad.customer_email
            WHEN uvr.user_type = 'vendor' THEN vad.vendor_email
            WHEN uvr.user_type = 'organizer' THEN eoad.organizer_email
          END as email,
          CASE 
            WHEN uvr.user_type = 'individual' THEN CONCAT(cad.customer_first_name, ' ', cad.customer_last_name)
            WHEN uvr.user_type = 'vendor' THEN vad.vendor_business_name
            WHEN uvr.user_type = 'organizer' THEN eoad.organizer_company_name
          END as name
        FROM user_verification_requests uvr
        LEFT JOIN Customer_Account_Data cad ON uvr.user_id = cad.customer_id AND uvr.user_type = 'individual'
        LEFT JOIN Vendor_Account_Data vad ON uvr.user_id = vad.vendor_id AND uvr.user_type = 'vendor'
        LEFT JOIN Event_Organizer_Account_Data eoad ON uvr.user_id = eoad.organizer_id AND uvr.user_type = 'organizer'
        ORDER BY uvr.reviewed_at DESC NULLS FIRST
      `)

    res.json({
      success: true,
      requests: result.rows,
    })
  } catch (err: any) {
    console.error("Error fetching verification requests:", err)
    next(err)
  }
})

// Handle user verification
router.post("/handle-verification", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { verificationId, action, adminNotes } = req.body
    const adminId = req.headers.authorization?.replace("Bearer ", "")

    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized" })
      return
    }

    const status = action === "approve" ? "approved" : "rejected"

    // Update verification request
    await pool.query(
      `UPDATE user_verification_requests 
         SET status = $1, reviewed_by = $2, reviewed_at = NOW(), admin_notes = $3
         WHERE verification_id = $4`,
      [status, adminId, adminNotes || "", verificationId],
    )

    // Log admin action
    try {
      await pool.query(
        `INSERT INTO admin_actions (admin_id, action_type, target_id, action_details, timestamp)
           VALUES ($1, $2, $3, $4, NOW())`,
        [adminId, "user_verification", verificationId, `User verification ${action}ed`],
      )
    } catch (logErr) {
      console.log("Could not log admin action:", logErr)
    }

    res.json({
      success: true,
      message: `Verification request ${action}ed successfully`,
    })
  } catch (err: any) {
    console.error("Error handling verification:", err)
    next(err)
  }
})

// Get pending event cancellations
router.get("/cancellation-requests", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = req.headers.authorization?.replace("Bearer ", "")
    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized" })
      return
    }

    const result = await pool.query(`
        SELECT 
          ecr.cancellation_id,
          ecr.event_id,
          ecr.requested_by,
          ecr.reason,
          ecr.status,
          ecr.refund_amount,
          ecr.penalty_amount,
          ecr.admin_notes,
          e.event_name,
          e.start_date,
          e.end_date,
          cad.customer_email as customer_email,
          eoad.organizer_email as organizer_email
        FROM event_cancellation_requests ecr
        JOIN events e ON ecr.event_id = e.event_id
        LEFT JOIN Customer_Account_Data cad ON e.customer_id = cad.customer_id
        LEFT JOIN Event_Organizer_Account_Data eoad ON e.organizer_id = eoad.organizer_id
        WHERE ecr.status = 'pending'
        ORDER BY ecr.cancellation_id DESC
      `)

    res.json({
      success: true,
      requests: result.rows,
    })
  } catch (err: any) {
    console.error("Error fetching cancellation requests:", err)
    next(err)
  }
})

// Handle event cancellation
router.post("/handle-cancellation", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cancellationId, action, adminNotes, refundAmount, penaltyAmount } = req.body
    const adminId = req.headers.authorization?.replace("Bearer ", "")

    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized" })
      return
    }

    const status = action === "approve" ? "approved" : "rejected"

    // Update cancellation request
    await pool.query(
      `UPDATE event_cancellation_requests 
         SET status = $1, admin_notes = $2, refund_amount = $3, penalty_amount = $4
         WHERE cancellation_id = $5`,
      [status, adminNotes || "", refundAmount || 0, penaltyAmount || 0, cancellationId],
    )

    // If approved, update event status
    if (action === "approve") {
      await pool.query(
        `UPDATE events 
           SET event_status = 'cancelled'
           WHERE event_id = (SELECT event_id FROM event_cancellation_requests WHERE cancellation_id = $1)`,
        [cancellationId],
      )
    }

    // Log admin action
    try {
      await pool.query(
        `INSERT INTO admin_actions (admin_id, action_type, target_id, action_details, timestamp)
           VALUES ($1, $2, $3, $4, NOW())`,
        [adminId, "event_cancellation", cancellationId, `Event cancellation ${action}ed`],
      )
    } catch (logErr) {
      console.log("Could not log admin action:", logErr)
    }

    res.json({
      success: true,
      message: `Cancellation request ${action}ed successfully`,
    })
  } catch (err: any) {
    console.error("Error handling cancellation:", err)
    next(err)
  }
})

// Get all users for verification
router.get("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verify super admin authorization
    const adminId = req.headers.authorization?.replace("Bearer ", "")
    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized" })
      return
    }

    // Fetch users from all tables
    const customers = await pool.query(`
        SELECT 
          customer_id as id,
          customer_email as email,
          customer_first_name as "firstName",
          customer_last_name as "lastName",
          'individual' as "userType",
          COALESCE(is_verified, false) as "isVerified",
          COALESCE(verification_status, 'pending') as status,
          created_at as "createdAt"
        FROM Customer_Account_Data
        ORDER BY created_at DESC
      `)

    const vendors = await pool.query(`
        SELECT 
          vendor_id as id,
          vendor_email as email,
          vendor_business_name as "businessName",
          'vendor' as "userType",
          COALESCE(is_verified, false) as "isVerified",
          COALESCE(verification_status, 'pending') as status,
          created_at as "createdAt"
        FROM Vendor_Account_Data
        ORDER BY created_at DESC
      `)

    const organizers = await pool.query(`
        SELECT 
          organizer_id as id,
          organizer_email as email,
          organizer_company_name as "companyName",
          'organizer' as "userType",
          COALESCE(is_verified, false) as "isVerified",
          COALESCE(verification_status, 'pending') as status,
          created_at as "createdAt"
        FROM Event_Organizer_Account_Data
        ORDER BY created_at DESC
      `)

    const allUsers = [...customers.rows, ...vendors.rows, ...organizers.rows]

    res.json({
      success: true,
      users: allUsers,
    })
  } catch (err: any) {
    console.error("Error fetching users:", err)
    next(err)
  }
})

// Verify user
router.post("/verify-user", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, action } = req.body
    const adminId = req.headers.authorization?.replace("Bearer ", "")

    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized" })
      return
    }

    const isVerified = action === "approve"
    const status = action === "approve" ? "approved" : "rejected"

    // Update user verification status in all relevant tables
    await pool.query(
      `
        UPDATE Customer_Account_Data 
        SET is_verified = $1, verification_status = $2, verified_at = NOW()
        WHERE customer_id = $3
      `,
      [isVerified, status, userId],
    )

    await pool.query(
      `
        UPDATE Vendor_Account_Data 
        SET is_verified = $1, verification_status = $2, verified_at = NOW()
        WHERE vendor_id = $3
      `,
      [isVerified, status, userId],
    )

    await pool.query(
      `
        UPDATE Event_Organizer_Account_Data 
        SET is_verified = $1, verification_status = $2, verified_at = NOW()
        WHERE organizer_id = $3
      `,
      [isVerified, status, userId],
    )

    res.json({
      success: true,
      message: `User ${action}d successfully`,
    })
  } catch (err: any) {
    console.error("Error verifying user:", err)
    next(err)
  }
})

export default router