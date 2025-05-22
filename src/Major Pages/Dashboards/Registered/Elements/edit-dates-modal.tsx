import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"

interface EditDatesModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (dates: string[]) => void
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

export function EditDatesModal({
  isOpen,
  onClose,
  onUpdate,
  initialMonth = new Date().getMonth(), // Default to current month index
  initialYear = new Date().getFullYear(), // Default to current year
  blockedDates = [],
  takenDates = [],
}: EditDatesModalProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialMonth)
  const [currentYear, setCurrentYear] = useState(initialYear)

  // Initialize selected dates with already blocked dates when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMonthIndex(initialMonth)
      setCurrentYear(initialYear)
      setSelectedDates([...blockedDates])
    }
  }, [isOpen, initialMonth, initialYear, blockedDates])

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

  const handleDateClick = (day: number) => {
    const dateString = `${monthNames[currentMonthIndex]} ${day}, ${currentYear}`

    // Only allow removing dates that are already blocked
    // Don't allow adding new dates
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter((date) => date !== dateString))
    }
    // Removed the else clause that would add new dates
  }

  const handleRemoveDate = (dateToRemove: string) => {
    setSelectedDates(selectedDates.filter((date) => date !== dateToRemove))
  }

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

  // Update the calendar day rendering to show taken dates
  // Add the actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${monthNames[currentMonthIndex]} ${day}, ${currentYear}`
    const isSelected = selectedDates.includes(dateString)
    const isTaken = takenDates.includes(dateString)

    // Apply appropriate background color
    let style = {}
    let cursorStyle = "cursor-default" // Default to non-clickable

    if (isSelected) {
      style = { backgroundColor: "#CACACA" } // Gray for blocked dates
      cursorStyle = "cursor-pointer" // Clickable only if it's a blocked date
    } else if (isTaken) {
      style = { backgroundColor: "#B4CAEB80" } // Light blue with transparency for taken dates
    }

    days.push(
      <div
        key={day}
        className={`h-10 w-10 flex items-center justify-center ${cursorStyle} ${isSelected ? "hover:bg-gray-300" : ""}`}
        onClick={() => handleDateClick(day)}
        style={style}
      >
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
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#B4CAEB80" }}></div>
                <span className="text-xs text-gray-600">Taken</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#CACACA" }}></div>
                <span className="text-xs text-gray-600">Blocked</span>
              </div>
            </div>
          </div>

          {/* Selection Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Edit Blocked Dates</h2>
            <p className="text-gray-700 mb-4">Click on blocked dates to remove them:</p>

            {/* Selected Dates List */}
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {selectedDates.length === 0 ? (
                <p className="text-gray-500 italic">No blocked dates</p>
              ) : (
                selectedDates.map((date) => (
                  <div key={date} className="flex items-center justify-between border rounded-lg p-3">
                    <span>{date}</span>
                    <button onClick={() => handleRemoveDate(date)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-6">
          <button
            onClick={() => onUpdate(selectedDates)}
            className="w-full md:w-auto text-white py-3 px-6 rounded-lg hover:opacity-90"
            style={{ backgroundColor: "#3061AD" }}
          >
            Update Dates
          </button>
        </div>
      </div>
    </div>
  )
}
