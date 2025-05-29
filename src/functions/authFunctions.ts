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
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return userCredential.user; // This must return the user object with .uid

    // Prepare user data
    const userDocData = {
      uid: user.uid,
      email: email,
      userType: userType,
      ...userData,
      createdAt: new Date().toISOString(),
    };

    // Create user document in Firestore with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Operation timed out")), 10000); // 10 second timeout
    });

    try {
      await Promise.race([
        setDoc(doc(db, "users", user.uid), userDocData),
        timeoutPromise
      ]);
      return user;
    } catch (firestoreError: any) {
      // If Firestore write fails, delete the auth user
      await user.delete();
      if (firestoreError.message === "Operation timed out") {
        throw new Error("Registration timed out. Please try again.");
      }
      throw new Error("Failed to create user profile. Please try again.");
    }
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email is already registered. Please use a different email address.");
    }
    if (error.code === "auth/network-request-failed") {
      throw new Error("Network error. Please check your internet connection and try again.");
    }
    if (error.code === "auth/too-many-requests") {
      throw new Error("Too many attempts. Please try again later.");
    }
    throw new Error(error.message || "Failed to create account. Please try again.");
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
      localStorage.setItem("loginTimestamp", Date.now().toString());

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
    localStorage.setItem("loginTimestamp", Date.now().toString());

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
    localStorage.setItem("loginTimestamp", Date.now().toString());

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
