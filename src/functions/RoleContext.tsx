import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { CLOUD_FUNCTIONS } from "../config/cloudFunctions"; // Import your Cloud Functions config

// Define your RoleId type if it's not already globally defined
type RoleId = string; // Assuming roleId is a string like "1", "2", "3"

// 1. Define the shape of your context data
interface RoleContextType {
  roleId: RoleId | null;
  // Function to explicitly refresh/update the role (e.g., after login/logout)
  refreshRole: () => Promise<void>;
  isLoading: boolean; // Indicates if the role is currently being loaded/fetched
  error: string | null; // To store any fetching errors
}

// 2. Create the Context object
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// 3. Create the Provider Component
interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [roleId, setRoleId] = useState<RoleId | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading
  const [error, setError] = useState<string | null>(null); // State for error

  // --- Your getRoleIdFromAuth logic, now moved into the provider ---
  const getRoleIdFromAuth = useCallback(async (): Promise<RoleId> => {
    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading true when fetching starts
    try {
      const firebaseUid =
        localStorage.getItem("firebaseUid") || localStorage.getItem("userId"); // Assuming Firebase UID is stored here
      console.log(
        "RoleContext is sending firebaseUid to getRole:",
        firebaseUid
      );

      if (!firebaseUid) {
        // If no UID, it means user is not authenticated or session expired.
        // We can just set roleId to null and not throw an error,
        // as this might be the expected state for a logged-out user.
        setRoleId(null);
        localStorage.removeItem("roleId"); // Ensure localStorage is also cleared
        return "" as RoleId; // Return null if no UID
      }

      const response = await fetch(CLOUD_FUNCTIONS.getRole, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid,
        }),
      });

      const data = await response.json();
      console.log("RoleContext getRole response:", data);

      if (!response.ok || !data.roleId) {
        const errorMessage =
          data.message || "Failed to get user role from backend";
        throw new Error(errorMessage);
      }

      // Successfully fetched role
      localStorage.setItem("roleId", data.roleId); // Update localStorage
      setRoleId(data.roleId as RoleId);
      return data.roleId as RoleId;
    } catch (err: any) {
      console.error("Error getting role ID in RoleContext:", err);
      // If there's an error fetching role, assume unauthenticated or unknown role
      setRoleId(null);
      localStorage.removeItem("roleId"); // Clear invalid role from localStorage
      setError(err.message || "Failed to fetch role.");
      throw err; // Re-throw to propagate if needed for specific error handling elsewhere
    } finally {
      setIsLoading(false); // Set loading false when fetching completes (success or failure)
    }
  }, []); // Dependencies of useCallback - none needed here if it's self-contained

  // Effect to fetch role on initial mount
  useEffect(() => {
    // Only attempt to fetch if localStorage indicates a user *might* be logged in
    // This prevents unnecessary calls for truly unauthenticated users on first load
    const isAuthenticatedFromStorage =
      localStorage.getItem("isAuthenticated") === "true";
    const storedFirebaseUid =
      localStorage.getItem("firebaseUid") || localStorage.getItem("userId");

    if (isAuthenticatedFromStorage && storedFirebaseUid) {
      getRoleIdFromAuth();
    } else {
      // If not authenticated or no UID, set loading to false immediately
      setIsLoading(false);
      setRoleId(null);
      localStorage.removeItem("roleId");
    }
  }, [getRoleIdFromAuth]); // getRoleIdFromAuth is a dependency, but it's useCallback'd

  // The refreshRole function exposed to consumers
  const refreshRole = useCallback(async () => {
    await getRoleIdFromAuth();
  }, [getRoleIdFromAuth]);

  // The value that will be supplied to any components consuming this context
  const contextValue: RoleContextType = {
    roleId,
    refreshRole,
    isLoading,
    error,
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}{" "}
      {/* Children will be rendered, loading handled by isLoading state */}
    </RoleContext.Provider>
  );
};

// 4. Create a custom hook for easy consumption
export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
