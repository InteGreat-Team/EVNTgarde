import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
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
) => {
  try {
    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      throw new Error(
        "Email is already registered. Please use a different email address."
      );
    }

    // Check if phone number already exists (if provided)
    if (userData.phoneNumber) {
      const phoneExists = await checkPhoneExists(userData.phoneNumber);
      if (phoneExists) {
        throw new Error(
          "Phone number is already registered. Please use a different phone number."
        );
      }
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      userType: userType,
      ...userData,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error(
        "Email is already registered. Please use a different email address."
      );
    }
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();

      console.log("User Data:", userData);
      // Store user type in localStorage
      localStorage.setItem("userType", userData.userType);
      localStorage.setItem("vendorType", userData.vendorType);
      localStorage.setItem("isAuthenticated", "true");

      return {
        user,
        userData,
      };
    } else {
      throw new Error("User data not found");
    }
  } catch (error: any) {
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      throw new Error("Invalid email or password");
    }
    throw error;
  }
};

// Social login (Google)
export const signInWithGoogle = async (userType: string) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        userType: userType,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      });
    }

    // Store user type in localStorage
    localStorage.setItem("userType", userType);
    localStorage.setItem("isAuthenticated", "true");

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Social login (Yahoo)
export const signInWithYahoo = async (userType: string) => {
  try {
    const result = await signInWithPopup(auth, yahooProvider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        userType: userType,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      });
    }

    // Store user type in localStorage
    localStorage.setItem("userType", userType);
    localStorage.setItem("isAuthenticated", "true");

    return user;
  } catch (error) {
    console.error("Error signing in with Yahoo:", error);
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
      logoutUser(); // Fix: Changed from logout() to logoutUser()
      return true; // Session expired
    }
  }
  return false; // Session active
};

// Create superadmin account
export const createSuperadminAccount = async () => {
  try {
    const email = "admin@evntgarde.com";
    const password = "Admin@EVNTgarde2024!";
    
    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      console.log("Superadmin account already exists");
      return null;
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      userType: "superadmin",
      firstName: "System",
      lastName: "Admin",
      createdAt: new Date().toISOString(),
    });

    console.log("Superadmin account created successfully");
    return user;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      console.log("Superadmin account already exists");
      return null;
    }
    console.error("Error creating superadmin account:", error);
    throw error;
  }
};
