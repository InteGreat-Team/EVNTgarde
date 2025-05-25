import type React from "react";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import PaginatedTable from "./PaginatedTable";
import StatsCard from "./stats-card";

interface RSVPTrackingProps {
  onBackClick: () => void;
  rsvpCreated?: boolean;
  isCustomerView?: boolean;
}

// Define the guest data interface to share between components
export interface GuestData {
  guestId: string;
  name: string;
  gender: string;
  emailAddress: string;
  contactNumber: string;
  eventStatus: string;
}

// Create mock data that can be shared between components
export const generateGuestData = (rsvpCreated: boolean): GuestData[] => {
  return [
    {
      guestId: "G1002318",
      name: "John Doe",
      gender: "Male",
      emailAddress: "johndoe@gmail.com",
      contactNumber: "+63 917 123 4567",
      eventStatus: rsvpCreated ? "Going" : "Pending",
    },
    {
      guestId: "G1002319",
      name: "Jane Smith",
      gender: "Female",
      emailAddress: "jane.smith@email.com",
      contactNumber: "+63 918 987 6543",
      eventStatus: rsvpCreated ? "Going" : "Pending",
    },
    {
      guestId: "G1002316",
      name: "Robert Jones",
      gender: "Male",
      emailAddress: "robert.jones@test.com",
      contactNumber: "+63 919 222 3333",
      eventStatus: rsvpCreated ? "Pending" : "Pending",
    },
    {
      guestId: "G1002317",
      name: "Mary Brown",
      gender: "Female",
      emailAddress: "mary.brown@sample.com",
      contactNumber: "+63 920 444 5555",
      eventStatus: rsvpCreated ? "Not Going" : "Pending",
    },
    {
      guestId: "G1002315",
      name: "Michael Davis",
      gender: "Male",
      emailAddress: "michael.davis@example.com",
      contactNumber: "+63 921 666 7777",
      eventStatus: rsvpCreated ? "Going" : "Pending",
    },
    {
      guestId: "G1002313",
      name: "Jennifer Wilson",
      gender: "Female",
      emailAddress: "jennifer.wilson@domain.com",
      contactNumber: "+63 922 888 9999",
      eventStatus: rsvpCreated ? "Pending" : "Pending",
    },
    {
      guestId: "G1002320",
      name: "David Garcia",
      gender: "Male",
      emailAddress: "david.garcia@email.com",
      contactNumber: "+63 923 111 2222",
      eventStatus: rsvpCreated ? "Going" : "Pending",
    },
    {
      guestId: "G1002321",
      name: "Linda Rodriguez",
      gender: "Female",
      emailAddress: "linda.rodriguez@test.com",
      contactNumber: "+63 924 333 4444",
      eventStatus: rsvpCreated ? "Pending" : "Pending",
    },
    {
      guestId: "G1002322",
      name: "Christopher Williams",
      gender: "Male",
      emailAddress: "chris.williams@sample.com",
      contactNumber: "+63 925 555 6666",
      eventStatus: rsvpCreated ? "Not Going" : "Pending",
    },
    {
      guestId: "G1002323",
      name: "Angela Garcia",
      gender: "Female",
      emailAddress: "angela.garcia@example.com",
      contactNumber: "+63 926 777 8888",
      eventStatus: rsvpCreated ? "Going" : "Pending",
    },
    {
      guestId: "G1002324",
      name: "Brian Martinez",
      gender: "Male",
      emailAddress: "brian.martinez@domain.com",
      contactNumber: "+63 927 999 0000",
      eventStatus: rsvpCreated ? "Pending" : "Pending",
    },
    {
      guestId: "G1002325",
      name: "Nicole Robinson",
      gender: "Female",
      emailAddress: "nicole.robinson@email.com",
      contactNumber: "+63 928 222 1111",
      eventStatus: rsvpCreated ? "Going" : "Pending",
    },
    {
      guestId: "G1002326",
      name: "Kevin Hernandez",
      gender: "Male",
      emailAddress: "kevin.hernandez@test.com",
      contactNumber: "+63 929 444 3333",
      eventStatus: rsvpCreated ? "Pending" : "Pending",
    },
    {
      guestId: "G1002327",
      name: "Stephanie Lopez",
      gender: "Female",
      emailAddress: "stephanie.lopez@sample.com",
      contactNumber: "+63 930 666 5555",
      eventStatus: rsvpCreated ? "Not Going" : "Pending",
    },
    {
      guestId: "G1002328",
      name: "Jason Young",
      gender: "Male",
      emailAddress: "jason.young@example.com",
      contactNumber: "+63 931 888 7777",
      eventStatus: rsvpCreated ? "Going" : "Pending",
    },
  ];
};

const RSVPTracking: React.FC<RSVPTrackingProps> = ({
  onBackClick,
  rsvpCreated = false,
  isCustomerView = false,
}) => {
  const [guestData, setGuestData] = useState<GuestData[]>([]);
  const [userType, setUserType] = useState<"organizer" | "vendor" | "customer">(
    "organizer"
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Effect to check user type from localStorage
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      const normalizedUserType =
        storedUserType === "individual" ? "customer" : storedUserType;
      setUserType(normalizedUserType as "organizer" | "vendor" | "customer");
    }

    const handleStorageChange = () => {
      const updatedUserType = localStorage.getItem("userType");
      if (updatedUserType) {
        const normalizedUserType =
          updatedUserType === "individual" ? "customer" : updatedUserType;
        setUserType(normalizedUserType as "organizer" | "vendor" | "customer");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Generate guest data based on rsvpCreated prop
  useEffect(() => {
    setGuestData(generateGuestData(rsvpCreated));
  }, [rsvpCreated]);

  // Calculate stats based on actual guest data
  const totalGuests = guestData.length;
  const goingGuests = guestData.filter(
    (guest) => guest.eventStatus === "Going"
  ).length;
  const notGoingGuests = guestData.filter(
    (guest) => guest.eventStatus === "Not Going"
  ).length;
  const pendingGuests = guestData.filter(
    (guest) => guest.eventStatus === "Pending"
  ).length;

  // Determine if we should show customer view
  const showCustomerView = userType === "customer" || isCustomerView;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full min-h-screen flex flex-col mx-auto font-poppins p-4 overflow-x-auto">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={onBackClick}
          className="flex items-center bg-transparent border-none cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-arrow-left w-4 h-4"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
          <span className="ml-2">Back</span>
        </button>
      </div>

      {/* Header with title and search */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {showCustomerView ? "My Invitation" : "Guests"}
          </h2>
          {!showCustomerView && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="text"
                placeholder="Search"
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-[#3262AB] hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                {!rsvpCreated ? "Send Invites" : "Resend Invites"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="TOTAL ATTENDEES" value={totalGuests} type="total" />
          <StatsCard
            title="GOING"
            value={rsvpCreated ? goingGuests : "-"}
            type="going"
          />
          <StatsCard
            title="NOT GOING"
            value={rsvpCreated ? notGoingGuests : "-"}
            type="notGoing"
          />
          <StatsCard title="PENDING" value={pendingGuests} type="pending" />
        </div>

        {/* Table */}
        <div className="mt-4">
          <PaginatedTable
            rsvpCreated={rsvpCreated}
            guestData={guestData}
            isCustomerView={showCustomerView}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default RSVPTracking;
