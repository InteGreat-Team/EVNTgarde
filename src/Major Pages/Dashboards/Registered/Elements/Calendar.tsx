import React, { useState, useEffect } from "react";
import { CalendarCard } from "./calendar-card";

type userType = "organizer" | "vendor" | "customer";

const Calendar: React.FC = () => {
  const [userRole, setUserRole] = useState<userType>("organizer");

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

  return (
    <div className="w-full">
      <CalendarCard initialMonth="April" initialYear={2025} userType={userRole} />
    </div>
  );
};

export default Calendar; 