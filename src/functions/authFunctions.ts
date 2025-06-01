import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db, googleProvider, yahooProvider } from "./firebase";
import { CLOUD_FUNCTIONS, CloudFunctionKey } from "../config/cloudFunctions";

// Function to check if email already exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
};

// Function to check if phone number already exists
export const checkPhoneExists = async (
  phoneNumber: string
): Promise<boolean> => {
  // Skip check if phone number is empty
  if (!phoneNumber) return false;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking phone existence:", error);
    return false;
  }
};

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  userType: string,
  userData: any
): Promise<User | null> => {
  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store Firebase UID in localStorage for dashboard role lookup
    localStorage.setItem("firebaseUid", user.uid);

    // Prepare payload for backend
    let payload: any = { firebaseUid: user.uid, ...userData };
    
    // Normalize userType
    const normalizedUserType = userType.toLowerCase();
    
    if (normalizedUserType === "organizer") {
      payload = {
        organizerId: user.uid,
        organizerCompanyName: userData.companyName,
        organizerEmail: email,
        organizerPassword: password,
        organizerIndustry: userData.industry || "",
        organizerLocation: userData.location || "",
        organizerType: userData.organizerType || "organizer",
        organizerLogoUrl: userData.logoUrl || "",
      };
    } else if (normalizedUserType === "vendor") {
      payload = {
        vendorId: user.uid,
        vendorBusinessName: userData.companyName,
        vendorEmail: email,
        vendorPassword: password,
        vendorType: userData.vendorType || "vendor",
        vendorPhoneNo: userData.phoneNumber || "",
        vendorAddress: userData.address || {},
        vendorBarangay: userData.address?.barangay || "",
        vendorCity: userData.address?.city || "",
        vendorProvince: userData.address?.province || "",
        vendorZipCode: userData.address?.zipCode || "",
        vendorCountry: userData.address?.country || "",
        vendorYearsOfExperience: userData.yearsOfExperience || "",
        services: userData.businessType || "",
        preferences: userData.preferences || [],
      };
    } else if (normalizedUserType === "individual" || normalizedUserType === "customer") {
      // Map to backend's expected fields for customer
      payload = {
        firebaseUid: user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: email,
        password: password,
        phoneNo: userData.phoneNumber || "",
        preferences: userData.preferences || [],
        customerType: userData.userRole || "customer", // must be one of: enthusiast, student, church, customer
      };
    }

    // Use correct function key for each user type
    let functionKey: CloudFunctionKey;
    if (normalizedUserType === "individual" || normalizedUserType === "customer") {
      functionKey = "registerCustomer";
    } else if (normalizedUserType === "vendor") {
      functionKey = "registerVendor";
    } else if (normalizedUserType === "organizer") {
      functionKey = "registerOrganizer";
    } else {
      throw new Error("Unknown user type for registration");
    }
    
    console.log('Registering user with payload:', { ...payload, customerPassword: '[REDACTED]' });
    
    const response = await fetch(CLOUD_FUNCTIONS[functionKey], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Registration failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // If database registration fails, delete the Firebase user
      await user.delete();
      throw new Error(errorData?.message || 'Failed to register user in database');
    }

    return user;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    // Login with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store Firebase UID in localStorage for dashboard role lookup
    localStorage.setItem("firebaseUid", user.uid);

    // Get user role from cloud function
    const response = await fetch(CLOUD_FUNCTIONS.getRole, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid: user.uid
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get user role');
    }

    const data = await response.json();
    return { user, role: data.role };
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

// Social login (Google)
export const signInWithGoogle = async (userType: string) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Sync user data with cloud function
    const response = await fetch(CLOUD_FUNCTIONS.syncUser, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid: user.uid,
        email: user.email,
        userType,
        displayName: user.displayName,
        photoURL: user.photoURL
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync user data');
    }

    return user;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Social login (Yahoo)
export const signInWithYahoo = async (userType: string) => {
  try {
    // Yahoo OAuth implementation would go here
    // For now, we'll use the same sync user flow as Google
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Sync user data with cloud function
    const response = await fetch(CLOUD_FUNCTIONS.syncUser, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid: user.uid,
        email: user.email,
        userType,
        displayName: user.displayName,
        photoURL: user.photoURL
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync user data');
    }

    return user;
  } catch (error: any) {
    console.error('Yahoo sign in error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await auth.signOut();
    if (localStorage.getItem("userType") === "vendor") {
      localStorage.removeItem("vendorType");
    }
    localStorage.removeItem("userType");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTimestamp");
  } catch (error) {
    throw error;
  }
};

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const checkSessionExpiry = () => {
  const loginTimestamp = localStorage.getItem("loginTimestamp");
  if (loginTimestamp) {
    const elapsedTime = Date.now() - Number.parseInt(loginTimestamp, 10);
    if (elapsedTime > SESSION_DURATION) {
      logoutUser();
      return true; // Session expired
    }
  }
  return false; // Session active
};
