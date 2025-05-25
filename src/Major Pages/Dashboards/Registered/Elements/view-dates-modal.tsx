import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ViewDatesModalProps {
  isOpen: boolean
  onClose: () => void
  initialMonth?: number // Month index (0-11)
  initialYear?: number
  blockedDates: string[] // Already blocked dates
  takenDates?: string[] // Already taken dates
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

export function ViewDatesModal({
  isOpen,
  onClose,
  initialMonth = new Date().getMonth(), // Default to current month index
  initialYear = new Date().getFullYear(), // Default to current year
  blockedDates = [],
  takenDates = [],
}: ViewDatesModalProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialMonth)
  const [currentYear, setCurrentYear] = useState(initialYear)

  // Reset the month and year when the modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMonthIndex(initialMonth)
      setCurrentYear(initialYear)
    }
  }, [isOpen, initialMonth, initialYear])

  // Add ESC key handler
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

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

  // Generate calendar days
  const days = []
  const daysInMonth = getDaysInMonth(currentMonthIndex, currentYear)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonthIndex, currentYear)

  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>)
  }

  // Add the actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${monthNames[currentMonthIndex]} ${day}, ${currentYear}`
    const isBlocked = blockedDates.includes(dateString)
    const isTaken = takenDates.includes(dateString)
    const currentDate = new Date()
    const isToday =
      day === currentDate.getDate() &&
      currentMonthIndex === currentDate.getMonth() &&
      currentYear === currentDate.getFullYear()

    // Apply appropriate background color
    let style = {}

    if (isToday) {
      style = { backgroundColor: "#3061AD", color: "white" }
    } else if (isBlocked) {
      style = { backgroundColor: "#CACACA" } // Gray for blocked dates
    } else if (isTaken) {
      style = { backgroundColor: "#B4CAEB80" } // Light blue with transparency for taken dates
    }

    days.push(
      <div key={day} className="h-10 w-10 flex items-center justify-center" style={style}>
        {day}
      </div>,
    )
  }

  // Add empty cells for days after the last day of the month to complete the grid
  const totalCellsInGrid = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7
  const remainingCells = totalCellsInGrid - (firstDayOfMonth + daysInMonth)

  for (let i = 0; i < remainingCells; i++) {
    days.push(<div key={`empty-end-${i}`} className="h-10"></div>)
  }

  // Combine all dates for display
  const allDates = [...takenDates, ...blockedDates].sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4"
        style={{ border: "2px solid #3061AD" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">
                  {monthNames[currentMonthIndex]} {currentYear}
                </h3>
              </div>

              <div className="flex">
                <button onClick={handlePrevMonth} style={{ color: "#3061AD" }} className="p-1 hover:opacity-80">
                  <span className="sr-only">Previous month</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button onClick={handleNextMonth} style={{ color: "#3061AD" }} className="p-1 hover:opacity-80">
                  <span className="sr-only">Next month</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
              <div className="text-gray-500">SUN</div>
              <div className="text-gray-500">MON</div>
              <div className="text-gray-500">TUE</div>
              <div className="text-gray-500">WED</div>
              <div className="text-gray-500">THU</div>
              <div className="text-gray-500">FRI</div>
              <div className="text-gray-500">SAT</div>
            </div>

            <div className="grid grid-cols-7 gap-1">{days}</div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#3061AD" }}></div>
                <span className="text-xs text-gray-600">Today</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#B4CAEB80" }}></div>
                <span className="text-xs text-gray-600">Taken</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#CACACA" }}></div>
                <span className="text-xs text-gray-600">Unavailable</span>
              </div>
            </div>
          </div>

          {/* Dates List Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Event Dates</h2>
            <p className="text-gray-700 mb-4">These dates are either booked or unavailable:</p>

            {/* Dates List */}
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {allDates.length === 0 ? (
                <p className="text-gray-500 italic">No event dates</p>
              ) : (
                allDates.map((date) => (
                  <div key={date} className="flex items-center justify-between border rounded-lg p-3">
                    <span>{date}</span>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: takenDates.includes(date) ? "#B4CAEB80" : "#CACACA",
                        color: "#333",
                      }}
                    >
                      {takenDates.includes(date) ? "Booked" : "Unavailable"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full md:w-auto text-white py-3 px-6 rounded-lg hover:opacity-90"
            style={{ backgroundColor: "#3061AD" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
