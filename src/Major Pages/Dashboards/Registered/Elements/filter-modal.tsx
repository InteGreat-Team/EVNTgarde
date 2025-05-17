import { useState } from "react"
import { Button } from "../../../../Layout/combined-ui"
import { Input } from "../../../../Layout/combined-ui"
import { X } from "lucide-react"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterValues) => void
  initialValues?: FilterValues
}

export interface FilterValues {
  priceMin: string
  priceMax: string
  location: string[]
  rating: string
  industry: string[]
}

export function FilterModal({ isOpen, onClose, onApply, initialValues }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterValues>(
    initialValues || {
      priceMin: "",
      priceMax: "",
      location: [],
      rating: "",
      industry: [],
    },
  )

  if (!isOpen) return null

  const handleInputChange = (field: keyof FilterValues, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full p-0">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Price</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Minimum Price"
                value={filters.priceMin}
                onChange={(e) => handleInputChange("priceMin", e.target.value)}
                className="flex-1"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Maximum Price"
                value={filters.priceMax}
                onChange={(e) => handleInputChange("priceMax", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Location</label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none"
                value={filters.location[0] || ""}
                onChange={(e) => handleInputChange("location", e.target.value ? [e.target.value] : [])}
              >
                <option value="">Choose Location (Select 1 or more)</option>
                <option value="Makati">Makati</option>
                <option value="BGC">BGC</option>
                <option value="Quezon City">Quezon City</option>
                <option value="Tagaytay">Tagaytay</option>
                <option value="Boracay">Boracay</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Rating</label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none"
                value={filters.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
              >
                <option value="">Select Rating</option>
                <option value="5">5 Stars & Above</option>
                <option value="4">4 Stars & Above</option>
                <option value="3">3 Stars & Above</option>
                <option value="2">2 Stars & Above</option>
                <option value="1">1 Star & Above</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Industry</label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none"
                value={filters.industry[0] || ""}
                onChange={(e) => handleInputChange("industry", e.target.value ? [e.target.value] : [])}
              >
                <option value="">Choose Industry</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Birthday">Birthday</option>
                <option value="Concert">Concert</option>
                <option value="Conference">Conference</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
