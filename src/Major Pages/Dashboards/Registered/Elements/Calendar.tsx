import React, { useState, useEffect } from "react";
import { CalendarCard } from "./calendar-card";

type userType = "organizer" | "vendor" | "customer";

const Calendar: React.FC = () => {
  const [userType, setUserRole] = useState<userType>("organizer");

  useEffect(() => {
    const storedRole = localStorage.getItem("userType");
    if (storedRole === "organizer" || storedRole === "vendor" || storedRole === "customer") {
      setUserRole(storedRole);
    } else if (storedRole === "individual") {
      setUserRole("customer");
    } else {
      setUserRole("organizer");
    }
  }, []);

  const takenDates = [
    "April 10, 2025",
    "April 11, 2025",
    "April 15, 2025",
    "April 16, 2025",
    "April 22, 2025",
  ];

  return (
    <div className="w-full">
      <CalendarCard initialMonth="April" initialYear={2025} takenDates={takenDates} />
    </div>
  );
};

export default Calendar; 