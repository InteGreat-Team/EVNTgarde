import { useState, useEffect } from "react"
import { BlockDatesModal } from "./block-dates-modal"
import { EditDatesModal } from "./edit-dates-modal"
import { ViewDatesModal } from "./view-dates-modal" // We'll create this component

// Update the CalendarDay interface to include a "isTaken" property
interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  hasEvent: boolean
  isBlocked?: boolean
  isTaken?: boolean
}

// Add a takenDates prop to the CalendarCardProps interface
interface CalendarCardProps {
  initialMonth?: string
  initialYear?: number
  onEditDates?: () => void
  takenDates?: string[]
  userType?: string // Add userType prop
}

// Helper function to get the number of days in a month
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get the day of week for the first day of the month (0 = Sunday, 6 = Saturday)
function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay()
}

// Map month number to month name
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Update the CalendarCard function to accept and use takenDates
export function CalendarCard({
  initialMonth = new Date().toLocaleString("en-US", { month: "long" }), // Get current month name
  initialYear = new Date().getFullYear(), // Get current year
  takenDates = [], // Default to empty array
  userType = "organizer", // Default to organizer
}: CalendarCardProps) {
  // Convert initial month name to month index (0-11)
  const initialMonthIndex = monthNames.findIndex((m) => m === initialMonth)

  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    initialMonthIndex !== -1 ? initialMonthIndex : new Date().getMonth(),
  ) // Default to current month if not found
  const [currentYear, setCurrentYear] = useState(initialYear)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [currentUserType, setCurrentUserType] = useState(userType)
  
  // Effect to check user type from localStorage
  useEffect(() => {
    // Get user type from localStorage if available
    const storedUserType = localStorage.getItem("userType")
    if (storedUserType) {
      // Convert "individual" to "customer" for consistency
      const normalizedUserType = storedUserType === "individual" ? "customer" : storedUserType
      setCurrentUserType(normalizedUserType)
    }

    // Listen for changes to localStorage
    const handleStorageChange = () => {
      const updatedUserType = localStorage.getItem("userType")
      if (updatedUserType) {
        const normalizedUserType = updatedUserType === "individual" ? "customer" : updatedUserType
        setCurrentUserType(normalizedUserType)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Update the useEffect to pass takenDates to generateCalendarDays
  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentMonthIndex, currentYear, blockedDates, takenDates))
  }, [currentMonthIndex, currentYear, blockedDates, takenDates])

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      // If January, go to December of previous year
      setCurrentMonthIndex(11)
      setCurrentYear(currentYear - 1)
    } else {
      // Otherwise, go to previous month
      setCurrentMonthIndex(currentMonthIndex - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      // If December, go to January of next year
      setCurrentMonthIndex(0)
      setCurrentYear(currentYear + 1)
    } else {
      // Otherwise, go to next month
      setCurrentMonthIndex(currentMonthIndex + 1)
    }
  }

  const handleBlockDates = () => {
    setIsBlockModalOpen(true)
  }

  const handleEditDates = () => {
    if (blockedDates.length > 0) {
      setIsEditModalOpen(true)
    }
  }

  const handleViewDates = () => {
    setIsViewModalOpen(true)
  }

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
  }

  const handleConfirmDates = (dates: string[]) => {
    setBlockedDates(dates)
    setIsBlockModalOpen(false)
  }

  const handleUpdateDates = (dates: string[]) => {
    setBlockedDates(dates)
    setIsEditModalOpen(false)
  }

  // Conditional rendering function for calendar buttons
  const renderCalendarButtons = () => {
    if (currentUserType === "customer") {
      return (
        <button
          className="bg-[#3061AD] text-white px-4 py-2.5 rounded-md text-sm w-full hover:opacity-90"
          onClick={handleViewDates}
        >
          View Dates
        </button>
      )
    } else {
      // For organizer and vendor
      return (
        <>
          <button
            className="text-white px-4 py-2.5 rounded-md text-sm w-full hover:opacity-90"
            onClick={handleBlockDates}
            style={{ backgroundColor: "#3061AD" }}
          >
            Block Dates
          </button>
          <button
            className={`bg-white text-gray-800 px-4 py-2.5 rounded-md text-sm w-full border ${
              blockedDates.length > 0
                ? "border-gray-300 hover:bg-gray-50 cursor-pointer"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleEditDates}
            disabled={blockedDates.length === 0}
          >
            Edit Dates
          </button>
        </>
      )
    }
  }

  return (
    <>
      <div className="bg-white rounded-md shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium">
            {monthNames[currentMonthIndex]} {currentYear}
          </div>
          <div className="flex">
            <button className="p-1 hover:opacity-80" onClick={handlePrevMonth} style={{ color: "#3061AD" }}>
              ←
            </button>
            <button className="p-1 hover:opacity-80" onClick={handleNextMonth} style={{ color: "#3061AD" }}>
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs mb-2">
          <div className="text-gray-500">SUN</div>
          <div className="text-gray-500">MON</div>
          <div className="text-gray-500">TUE</div>
          <div className="text-gray-500">WED</div>
          <div className="text-gray-500">THU</div>
          <div className="text-gray-500">FRI</div>
          <div className="text-gray-500">SAT</div>
        </div>

        {/* Update the calendar day rendering to apply the taken date color */}
        <div className="grid grid-cols-7 gap-1 text-sm">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center
                ${day.isCurrentMonth ? "" : "text-gray-300"}
                ${day.hasEvent ? "font-bold" : ""}
                ${day.isToday ? "text-white" : ""}
              `}
              style={
                day.isToday
                  ? { backgroundColor: "#3061AD" }
                  : day.isTaken
                    ? { backgroundColor: "#B4CAEB80" }
                    : day.isBlocked
                      ? { backgroundColor: "#CACACA" }
                      : {}
              }
            >
              {day.date}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">{renderCalendarButtons()}</div>
      </div>

      <BlockDatesModal
        isOpen={isBlockModalOpen}
        onClose={handleCloseBlockModal}
        onConfirm={handleConfirmDates}
        initialMonth={currentMonthIndex}
        initialYear={currentYear}
        blockedDates={blockedDates}
        takenDates={takenDates}
      />

      <EditDatesModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateDates}
        initialMonth={currentMonthIndex}
        initialYear={currentYear}
        blockedDates={blockedDates}
        takenDates={takenDates}
      />

      {/* View Dates Modal for customers */}
      {currentUserType === "customer" && (
        <ViewDatesModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          initialMonth={currentMonthIndex}
          initialYear={currentYear}
          blockedDates={blockedDates}
          takenDates={takenDates}
        />
      )}
    </>
  )
}

// Update the generateCalendarDays function to handle takenDates
function generateCalendarDays(
  monthIndex: number,
  year: number,
  blockedDates: string[],
  takenDates: string[] = [],
): CalendarDay[] {
  const days: CalendarDay[] = []
  const daysInMonth = getDaysInMonth(monthIndex, year)
  const firstDayOfMonth = getFirstDayOfMonth(monthIndex, year)
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const monthName = monthNames[monthIndex]

  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1
    const prevMonthYear = monthIndex === 0 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevMonthIndex, prevMonthYear)
    const prevMonthDay = daysInPrevMonth - firstDayOfMonth + i + 1

    days.push({
      date: prevMonthDay,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: false,
      isBlocked: false,
      isTaken: false,
    })
  }

  // Add the actual days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === currentDay && monthIndex === currentMonth && year === currentYear
    const dateString = `${monthName} ${day}, ${year}`
    const isBlocked = blockedDates.includes(dateString)
    const isTaken = takenDates.includes(dateString)

    days.push({
      date: day,
      isCurrentMonth: true,
      isToday,
      hasEvent: false, // You can implement event detection logic here
      isBlocked,
      isTaken,
    })
  }

  // Add empty cells for days after the last day of the month
  const totalCells = 42 // 6 rows of 7 days
  const remainingCells = totalCells - days.length

  if (remainingCells > 0 && remainingCells < 7) {
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false,
        isBlocked: false,
        isTaken: false,
      })
    }
  }

  return days
}
