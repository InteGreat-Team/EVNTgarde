// BookingDetails.tsx
import { useEffect, useState } from "react";
import AttachedFiles from "./AttachedFiles";
import BudgetBreakdown from "./BudgetBreakdown";
import EventOverview from "./EventOverview";
import Status from "./Status";
import FindActionCard from "./FindActionCard";
import axios from "axios";

type DetailsProps = {
  isModal: boolean;
  onBackClick: () => void;
  activeStatus: "Pending" | "Upcoming" | "Past" | "Rejected" | "Cancelled";
  selectedBooking: any; // ideally you’d type this more strictly
  showStatus?: boolean;
};

/**
 * Parses "Mar 26" + "5:30 PM" into a JavaScript Date object (using the current year).
 */
export function parseBookingDateTime(dateStr: string, timeStr: string): Date {
  const [monthAbbrev, dayPart] = dateStr.trim().split(" ");
  const day = parseInt(dayPart, 10);

  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const monthIdx = monthMap[monthAbbrev];
  if (monthIdx === undefined) {
    throw new Error(`Unrecognized month abbreviation: "${monthAbbrev}"`);
  }

  const [timePart, ampmPart] = timeStr.trim().split(" "); // e.g. ["5:30", "PM"]
  let [hour, minute] = timePart.split(":").map((x) => parseInt(x, 10));
  const isPM = ampmPart.toUpperCase() === "PM";
  const isAM = ampmPart.toUpperCase() === "AM";

  if (isPM && hour < 12) {
    hour += 12;
  }
  if (isAM && hour === 12) {
    hour = 0; // 12:xx AM → 00:xx
  }

  const year = new Date().getFullYear();
  return new Date(year, monthIdx, day, hour, minute, 0);
}

type Booking = {
  id: number;
  date: string; // e.g. "Mar 26"
  day: string; // e.g. "Wednesday"
  title: string;
  startTime: string; // e.g. "5:30 PM"
  endTime: string; // e.g. "10:00 PM"
  customer: string;
  location: string;
  guests: string; // e.g. "1,234 Guests"

  liking_score?: number;
  event_type_id?: number;
  organizer_id?: number;
  venue_id?: number;
  budget?: number;

  guestListStatus?: "Submitted" | "Not Submitted";
  rsvpListStatus?: "Created" | "Not Created";
};

const BookingDetails: React.FC<DetailsProps> = ({
  isModal,
  onBackClick,
  activeStatus,
  selectedBooking,
  showStatus = true,
}) => {
  // Will hold whatever the Python script returns
  const [predictedScore, setPredictedScore] = useState<number | null>(null);

  // 1) Form state that we will send to Python. Notice start_datetime/end_datetime are Date | null
  const [form, setForm] = useState<{
    liking_score: number | null;
    event_type_id: number | null;
    organizer_id: number | null;
    venue_id: number | null;
    budget: number | null;
    start_datetime: Date | null;
    end_datetime: Date | null;
    guests: string;
  }>({
    liking_score: null,
    event_type_id: null,
    organizer_id: null,
    venue_id: null,
    budget: null,
    start_datetime: null,
    end_datetime: null,
    guests: "",
  });

  // 2) When selectedBooking changes, populate form with actual values
  useEffect(() => {
    if (!selectedBooking) return;

    // Convert “Mar 26” + “5:30 PM” → Date object
    const isoStart = parseBookingDateTime(
      selectedBooking.date,
      selectedBooking.startTime
    );
    const isoEnd = parseBookingDateTime(
      selectedBooking.date,
      selectedBooking.endTime
    );

    setForm({
      liking_score: selectedBooking.liking_score ?? null,
      event_type_id: selectedBooking.event_type_id ?? null,
      organizer_id: selectedBooking.organizer_id ?? null,
      venue_id: selectedBooking.venue_id ?? null,
      budget: selectedBooking.budget ?? null,
      start_datetime: isoStart,
      end_datetime: isoEnd,
      guests: selectedBooking.guests,
    });
  }, [selectedBooking]);

  // 3) Fetch userRole from localStorage
  const [userRole, setUserRole] = useState<
    "organizer" | "individual" | "vendor"
  >("individual");
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (
      storedUserType === "organizer" ||
      storedUserType === "individual" ||
      storedUserType === "vendor"
    ) {
      setUserRole(storedUserType as "organizer" | "individual" | "vendor");
    }
  }, []);

  // 4) When the user clicks “Accept” (Predict Liking Score), call this:
  const handleAccept = async () => {
    if (!selectedBooking) return;

    // Ensure start_datetime and end_datetime are not null
    if (!form.start_datetime || !form.end_datetime) {
      console.error("Missing start or end datetime in form");
      return;
    }

    try {
      // Convert Date to ISO string because predict.py uses pandas.to_datetime(...)
      const payload = {
        event_type_id: form.event_type_id,
        organizer_id: form.organizer_id,
        venue_id: form.venue_id,
        budget: form.budget,
        start_datetime: form.start_datetime.toISOString(),
        end_datetime: form.end_datetime.toISOString(),
        guests: form.guests,
      };

      console.log("Sending to backend:", payload);

      const response = await axios.post(
        "http://localhost:5000/submit",
        payload
      );
      const { liking_score } = response.data as { liking_score: number };

      console.log("👀 Predicted liking_score from Python:", liking_score);
      setPredictedScore(liking_score);
    } catch (error) {
      console.error("Submission/Prediction failed:", error);
      alert("Failed to predict liking score.");
    }
  };

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
            <AttachedFiles />
            <BudgetBreakdown userRole={userRole} activeStatus={activeStatus} />
          </div>
        </div>

        {/* Right Column (Organizer Info & Predict Button) */}
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
              // Instead of inlining axios here, call handleAccept()
              onAccept={handleAccept}
              onReject={() => {
                console.log("Booking rejected:", selectedBooking?.id);
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

          {/* 5) Show the predicted score, if available */}
          {predictedScore !== null && (
            <div className="mt-4 p-4 border rounded bg-green-50 text-gray-800">
              <strong>Predicted Liking Score:</strong>{" "}
              {predictedScore.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
