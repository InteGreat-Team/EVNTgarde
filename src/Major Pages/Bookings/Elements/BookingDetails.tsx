import { useEffect, useState } from "react";
import AttachedFiles from "./AttachedFiles";
import BudgetBreakdown from "./BudgetBreakdown";
import EventOverview from "./EventOverview";
import Status from "./Status";
import FindActionCard from "./FindActionCard";

type DetailsProps = {
  isModal: boolean;
  onBackClick: () => void;
  activeStatus: "Pending" | "Upcoming" | "Past" | "Rejected" |  "Cancelled";
  selectedBooking: any;
  showStatus?: boolean;
};

const BookingDetails: React.FC<DetailsProps> = ({
  isModal,
  onBackClick,
  activeStatus,
  selectedBooking,
  showStatus = true,
}) => {
  // Get user type from localStorage
  const [userRole, setUserRole] = useState<
    "organizer" | "individual" | "vendor"
  >("individual");

  useEffect(() => {
    // Read user type from localStorage
    const storedUserType = localStorage.getItem("userType");
    if (
      storedUserType === "organizer" ||
      storedUserType === "individual" ||
      storedUserType === "vendor"
    ) {
      setUserRole(storedUserType as "organizer" | "individual" | "vendor");
    }
  }, []);

  return (
    <div
      className="flex flex-col mx-auto font-poppins"
      style={
        isModal ? {} : { width: "calc(100vw - 21rem)", marginLeft: "16rem" }
      }
    >
      {/* Back Button */}
      <div className="mb-5 font-poppins">
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
          <span className="ml-2">{isModal ? "Close" : "Back"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[45%_27%_28%] gap-5 font-poppins">
        <EventOverview
          activeStatus={activeStatus}
          selectedBooking={selectedBooking}
          userRole={userRole}
        />

        {/* Middle Column (Attached Files & Budget) */}
        <div className="bg-white h-fit w-full">
          <div className="flex flex-col gap-5 pr-5 p-5 font-poppins">
            {/* Attached Files Box */}
            <AttachedFiles />

            {/* Budget Breakdown Box */}
            <BudgetBreakdown userRole={userRole} activeStatus={activeStatus} />
          </div>
        </div>

        {/* Right Column (Organizer Info & Get in Touch) */}
        <div className="font-poppins">
          {showStatus ? (
            <Status
              activeStatus={activeStatus}
              selectedBooking={selectedBooking}
              userRole={userRole}
              customer={{
                name: selectedBooking?.customer || "Customer Name",
                email: "customer@example.com",
                phone: "123-456-7890",
              }}
              onAccept={() => {
                // Handle accept action
                console.log("Booking accepted:", selectedBooking?.id);
                // Add your accept booking logic here
              }}
              onReject={() => {
                // Handle reject action
                console.log("Booking rejected:", selectedBooking?.id);
                // Add your reject booking logic here
              }}
            />
          ) : userRole === "organizer" ? (
            <FindActionCard
              title="Hiring Vendors"
              description="Please proceed to vendor hiring based on requested services."
              buttonText="Find Vendors"
              onButtonClick={() => {
                alert("Find Vendors clicked!");
              }}
            />
          ) : (
            <FindActionCard
              title="No Organizer"
              description="Book an organizer to finalize creating an event."
              buttonText="Find Organizer"
              onButtonClick={() => {
                alert("Find Organizer clicked!");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
