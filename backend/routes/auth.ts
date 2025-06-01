import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../db";
import { CustomRequest, CustomResponse } from "../types/express";
import db from "../db";

const router = express.Router();

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNo?: string;
  customerType: string;
  firebaseUid: string;
}

interface VendorRequestBody {
  vendorId: string;
  vendorBusinessName: string;
  vendorEmail: string;
  vendorPassword: string;
  vendorType: string;
  vendorPhoneNo?: string;
  services: string;
  preferences?: string[];
}

interface OrganizerRequestBody {
  organizerId: string;
  organizerCompanyName: string;
  organizerEmail: string;
  organizerPassword: string;
  organizerIndustry: string;
  organizerLocation: string;
  organizerType: string;
  organizerLogoUrl?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface SyncUserRequestBody {
  firebaseUid: string;
  email: string;
  userType: string;
  vendorType?: string;
}

// Utility function to get role_id by role_name
async function getRoleIdByName(roleName: string): Promise<string | null> {
  const result = await db.query<{ role_id: string }>(
    "SELECT role_id FROM role WHERE role_name = $1",
    [roleName]
  );
  return result.rows.length > 0 ? result.rows[0].role_id : null;
}

router.post(
  "/getUserType",
  async (
    req: Request<{}, {}, { firebaseUid?: string; email?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { firebaseUid, email } = req.body;

    try {
      // Try Customer
      const customerResult = await db.query<{
        userType: string;
      }>(
        `SELECT customer_type AS "userType"
         FROM Customer_Account_Data
         WHERE customer_id = $1 OR customer_email = $2
         LIMIT 1`,
        [firebaseUid, email]
      );
      if (customerResult.rows.length > 0) {
        res.json({ userType: customerResult.rows[0].userType });
        return;
      }

      // Try Vendor
      const vendorResult = await db.query<{
        userType: string;
      }>(
        `SELECT vendor_type AS "userType"
         FROM Vendor_Account_Data
         WHERE vendor_id = $1 OR vendor_email = $2
         LIMIT 1`,
        [firebaseUid, email]
      );
      if (vendorResult.rows.length > 0) {
        res.json({
          userType: "vendor",
          vendorType: vendorResult.rows[0].userType,
        });
        return;
      }

      // Try Organizer
      const organizerResult = await db.query<{
        userType: string;
      }>(
        `SELECT organizer_type AS "userType"
         FROM Event_Organizer_Account_Data
         WHERE organizer_id = $1 OR organizer_email = $2
         LIMIT 1`,
        [firebaseUid, email]
      );
      if (organizerResult.rows.length > 0) {
        res.json({ userType: organizerResult.rows[0].userType });
        return;
      }

      // Not found
      res.status(404).json({ message: "User not found" });
    } catch (err: any) {
      // Unexpected error → pass to Express error handler
      next(err);
    }
  }
);

router.post(
  "/registerCustomer",
  async (
    req: Request<{}, {}, {
      firebaseUid: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNo: string;
      preferences: string;
      customerType: string; // This should match a role_name in the role table
    }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {
      firebaseUid,
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      preferences,
      customerType,
    } = req.body;

    if (!firebaseUid || !firstName || !lastName || !email || !password || !customerType) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    try {
      // Accept customerType as either a specific subrole (enthusiast, student, church) or 'customer'.
      // Map all subroles to 'customer' for role_id, but store the subrole in customer_type.
      let roleName = "customer";
      const validCustomerTypes = ["enthusiast", "student", "church", "customer"];
      if (!validCustomerTypes.includes(customerType)) {
        res.status(400).json({ success: false, message: "Invalid customer type" });
        return;
      }
      const roleId = await getRoleIdByName(roleName);
      if (!roleId) {
        res.status(400).json({ success: false, message: "Role not found" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        `INSERT INTO customer_account_data
           (customer_id, customer_first_name, customer_last_name,
            customer_email, customer_password, customer_phone_no,
            preferences, customer_type, role_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          firebaseUid,
          firstName,
          lastName,
          email,
          hashedPassword,
          phoneNo,
          preferences,
          customerType, // Store subrole here
          roleId,
        ]
      );
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === "23505") {
        res.status(400).json({ success: false, message: "Email already registered." });
      } else {
        next(err);
      }
    }
  }
);

// Register Vendor
router.post(
  "/registerVendor",
  async (req: CustomRequest<VendorRequestBody>, res: CustomResponse) => {
    const {
      vendorId,
      vendorBusinessName,
      vendorEmail,
      vendorPassword,
      vendorType,
      vendorPhoneNo,
      services,
      preferences,
    } = req.body;

    if (!vendorId || !vendorBusinessName || !vendorEmail || !vendorPassword || !vendorType) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    try {
      const roleId = await getRoleIdByName("vendor");
      if (!roleId) {
        res.status(400).json({ success: false, message: "Invalid vendor role" });
        return;
      }
      const hashedPassword = await bcrypt.hash(vendorPassword, 10);
      const result = await pool.query(
        `INSERT INTO Vendor_Account_Data 
          (vendor_id, vendor_business_name, vendor_email, vendor_password, vendor_type, vendor_phone_no, services, preferences, role_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING vendor_id`,
        [
          vendorId,
          vendorBusinessName,
          vendorEmail,
          hashedPassword,
          vendorType,
          vendorPhoneNo || null,
          services,
          JSON.stringify(preferences || []),
          roleId,
        ]
      );
      res.status(201).json({ success: true, vendorId: result.rows[0].vendor_id });
    } catch (error: any) {
      if (error.code === "23505") {
        res.status(400).json({ success: false, message: "Email already registered." });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }
);

// Register Organizer
router.post(
  "/registerOrganizer",
  async (req: CustomRequest<OrganizerRequestBody>, res: CustomResponse) => {
    const {
      organizerId,
      organizerCompanyName,
      organizerEmail,
      organizerPassword,
      organizerIndustry,
      organizerLocation,
      organizerType,
      organizerLogoUrl,
    } = req.body;

    if (!organizerId || !organizerCompanyName || !organizerEmail || !organizerPassword || !organizerType) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    try {
      const roleId = await getRoleIdByName("organizer");
      if (!roleId) {
        res.status(400).json({ success: false, message: "Invalid organizer role" });
        return;
      }
      const hashedPassword = await bcrypt.hash(organizerPassword, 10);
      const result = await pool.query(
        `INSERT INTO Event_Organizer_Account_Data 
          (Organizer_ID, Organizer_Company_Name, Organizer_Industry, Organizer_Location, Organizer_Email, Organizer_Review_Rating, Organizer_Password, Organizer_Logo_Url, Organizer_Type, role_id)
         VALUES ($1, $2, $3, $4, $5, NULL, $6, $7, $8, $9)
         RETURNING Organizer_ID`,
        [
          organizerId,
          organizerCompanyName,
          organizerIndustry,
          organizerLocation || null,
          organizerEmail,
          hashedPassword,
          organizerLogoUrl || null,
          organizerType || null,
          roleId,
        ]
      );
      res.status(201).json({ success: true, organizerId: result.rows[0].organizer_id });
    } catch (error: any) {
      if (error.code === "23505") {
        res.status(400).json({ success: false, message: "Email already registered." });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }
);

// Login endpoint
router.post(
  "/loginCustomer",
  async (
    req: CustomRequest<LoginRequestBody>,
    res: CustomResponse
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Try Customer login
      const customerResult = await pool.query(
        `SELECT * FROM Customer_Account_Data WHERE Customer_Email = $1`,
        [email]
      );
      if (customerResult.rows.length > 0) {
        const customer = customerResult.rows[0];
        const isMatch = await bcrypt.compare(
          password,
          customer.customer_password
        );
        if (!isMatch) {
          res
            .status(401)
            .json({ success: false, message: "Invalid email or password." });
          return;
        }
        res.status(200).json({
          success: true,
          user: {
            id: customer.customer_id,
            email: customer.customer_email,
            userType: customer.customer_type,
            firstName: customer.customer_first_name,
            lastName: customer.customer_last_name,
          },
        });
        return;
      }

      // Try Vendor login
      const vendorResult = await pool.query(
        `SELECT * FROM Vendor_Account_Data WHERE Vendor_Email = $1`,
        [email]
      );
      if (vendorResult.rows.length > 0) {
        const vendor = vendorResult.rows[0];
        const isMatch = await bcrypt.compare(password, vendor.vendor_password);
        if (!isMatch) {
          res
            .status(401)
            .json({ success: false, message: "Invalid email or password." });
          return;
        }
        res.status(200).json({
          success: true,
          user: {
            id: vendor.vendor_id,
            email: vendor.vendor_email,
            userType: "vendor",
            businessName: vendor.vendor_business_name,
            location: vendor.vendor_location,
            reviewRating: vendor.vendor_review_rating,
            logoUrl: vendor.vendor_logo_url,
          },
        });
        return;
      }

      // Try Organizer login
      const organizerResult = await pool.query(
        `SELECT * FROM Event_Organizer_Account_Data WHERE Organizer_Email = $1`,
        [email]
      );
      if (organizerResult.rows.length > 0) {
        const organizer = organizerResult.rows[0];
        const isMatch = await bcrypt.compare(
          password,
          organizer.organizer_password
        );
        if (!isMatch) {
          res
            .status(401)
            .json({ success: false, message: "Invalid email or password." });
          return;
        }

        res.status(200).json({
          success: true,
          user: {
            id: organizer.organizer_id,
            email: organizer.organizer_email,
            userType: organizer.organizer_type,
            companyName: organizer.organizer_company_name,
            location: organizer.organizer_location,
            industry: organizer.organizer_industry,
            logoUrl: organizer.organizer_logo_url,
            reviewRating: organizer.organizer_review_rating,
          },
        });
        return;
      }

      // If no match found
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.post(
  "/syncUser",
  async (
    req: CustomRequest<SyncUserRequestBody>,
    res: CustomResponse,
    next: NextFunction
  ): Promise<void> => {
    console.log("Received sync request headers:", req.headers);
    console.log("Received sync request body:", req.body);

    const { firebaseUid, email, userType, vendorType } = req.body;

    if (!firebaseUid || !email || !userType) {
      console.log("Missing required fields:", { firebaseUid, email, userType });
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: firebaseUid, email, and userType are required",
      });
      return;
    }

    try {
      let userExists = false;
      let userId: string | null = null;

      // CUSTOMER
      console.log("Checking Customer_Account_Data for email:", email);
      const customerResult = await pool.query<{ customer_id: string }>(
        "SELECT customer_id FROM Customer_Account_Data WHERE customer_email = $1",
        [email]
      );
      if (customerResult.rows.length) {
        userExists = true;
        userId = customerResult.rows[0].customer_id;
        console.log("Found existing customer:", userId);
      }

      // VENDOR
      console.log("Checking Vendor_Account_Data for email:", email);
      const vendorResult = await pool.query<{ vendor_id: string }>(
        "SELECT vendor_id FROM Vendor_Account_Data WHERE vendor_email = $1",
        [email]
      );
      if (vendorResult.rows.length) {
        userExists = true;
        userId = vendorResult.rows[0].vendor_id;
        console.log("Found existing vendor:", userId);
      }

      // ORGANIZER
      console.log("Checking Event_Organizer_Account_Data for email:", email);
      const organizerResult = await pool.query<{ organizer_id: string }>(
        "SELECT organizer_id FROM Event_Organizer_Account_Data WHERE organizer_email = $1",
        [email]
      );
      if (organizerResult.rows.length) {
        userExists = true;
        userId = organizerResult.rows[0].organizer_id;
        console.log("Found existing organizer:", userId);
      }

      // CREATE NEW IF NOT FOUND
      if (!userExists) {
        console.log("Creating new user of type:", userType);
        switch (userType) {
          case "individual":
            await pool.query(
              `INSERT INTO Customer_Account_Data
               (customer_id, customer_email, customer_type,
                customer_first_name, customer_last_name)
               VALUES ($1,$2,$3,$4,$5)`,
              [firebaseUid, email, userType, "New", "User"]
            );
            break;
          case "vendor":
            await pool.query(
              `INSERT INTO Vendor_Account_Data
               (vendor_id, vendor_email, vendor_type, vendor_business_name)
               VALUES ($1,$2,$3,$4)`,
              [firebaseUid, email, vendorType ?? "general", "New Business"]
            );
            break;
          case "organizer":
            await pool.query(
              `INSERT INTO Event_Organizer_Account_Data
               (organizer_id, organizer_email, organizer_type, organizer_company_name)
               VALUES ($1,$2,$3,$4)`,
              [firebaseUid, email, userType, "New Company"]
            );
            break;
          default:
            res.status(400).json({
              success: false,
              message: `Invalid user type: ${userType}`,
            });
            return;
        }
        console.log("Successfully created new user");
      }

      // SUCCESS RESPONSE
      res.status(200).json({
        success: true,
        message: "User data synced successfully",
        userId: firebaseUid,
      });

    } catch (err: any) {
      console.error("Error syncing user data:", err);
      // If it's a DB constraint error you already handled, re-check here
      if (err.code === "23505") {
        res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      } else if (err.code === "23502") {
        res.status(400).json({
          success: false,
          message: "Required fields are missing",
        });
      } else {
        next(err);  // unexpected error → Express error middleware
      }
    }
  }
);

router.post(
  "/getRole",
  async (
    req: Request<{}, {}, { firebaseUid: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { firebaseUid } = req.body;

    try {
      const result = await db.query<{ role_id: string }>(
        `SELECT r.role_id
         FROM role r
         JOIN Customer_Account_Data c ON c.role_id = r.role_id
         WHERE c.customer_id = $1
         UNION
         SELECT r.role_id
         FROM role r
         JOIN Vendor_Account_Data v ON v.role_id = r.role_id
         WHERE v.vendor_id = $1
         UNION
         SELECT r.role_id
         FROM role r
         JOIN Event_Organizer_Account_Data e ON e.role_id = r.role_id
         WHERE e.organizer_id = $1
         LIMIT 1`,
        [firebaseUid]
      );

      if (result.rows.length > 0) {
        res.json({ roleId: result.rows[0].role_id });
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
