import { useState } from "react"
import { VendorCard } from "./Cards/vendor-card"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button, Input } from "../../../../Layout/combined-ui"
import { mockOrganizers } from "../../../../functions/mockData"
import type { Loc } from "../../../../functions/accsEventsCollections"
import { FilterModal, type FilterValues } from "./filter-modal"

const Explore: React.FC = () => {
  const [visibleVendors, setVisibleVendors] = useState(6)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortCriteria, setSortCriteria] = useState("price")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    priceMin: "",
    priceMax: "",
    location: [],
    rating: "",
    industry: [],
  })

  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})

  const formatLocation = (location: Loc): string => {
    if (!location) return "Unknown Location"
    return `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
  }

  const allVendors = [
    ...mockOrganizers.map((organizer) => ({
      id: organizer.organizerId,
      name: organizer.organizationName,
      location: formatLocation(organizer.address),
      price: organizer.price,
      ratings: organizer.rating || 0,
      image: organizer.image || "/images/vendor.jpg",
      timeSlot: Array.isArray(organizer.timeSlot) && organizer.timeSlot.length ? organizer.timeSlot.join(", ") : "No time slots available",
      type: "organizer",
      industry: organizer.industry || "Other",
    })),

    ...bookings.map((booking) => ({
      id: booking.id,
      name: booking.name,
      location: booking.location,
      price: booking.price,
      ratings: booking.ratings,
      image: booking.image,
      timeSlot: booking.timeSlot,
      type: "booking",
      industry: booking.category,
    })),
    ...packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      location: pkg.location,
      price: pkg.price,
      ratings: pkg.ratings,
      image: pkg.image,
      timeSlot: pkg.timeSlot,
      type: "package",
      industry: pkg.category,
    })),
  ]

  // Apply filtering
  const filteredVendors = allVendors
    .filter((vendor) => {
      // Search query filter
      if (!vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Price range filter
      if (activeFilters.priceMin && Number(vendor.price) < Number(activeFilters.priceMin)) {
        return false
      }
      if (activeFilters.priceMax && Number(vendor.price) > Number(activeFilters.priceMax)) {
        return false
      }

      // Location filter
      if (activeFilters.location.length > 0) {
        const vendorLocationLower = vendor.location.toLowerCase()
        const matchesLocation = activeFilters.location.some((loc) => vendorLocationLower.includes(loc.toLowerCase()))
        if (!matchesLocation) return false
      }

      // Rating filter
      if (activeFilters.rating && vendor.ratings < Number(activeFilters.rating)) {
        return false
      }

      // Industry filter
      if (activeFilters.industry.length > 0) {
        const vendorIndustryLower = vendor.industry.toLowerCase()
        const matchesIndustry = activeFilters.industry.some((ind) => vendorIndustryLower.includes(ind.toLowerCase()))
        if (!matchesIndustry) return false
      }

      return true
    })
    .sort((a, b) => {
      let valueA, valueB

      switch (sortCriteria) {
        case "price":
          valueA = a.price
          valueB = b.price
          break
        case "rating":
          valueA = a.ratings
          valueB = b.ratings
          break
        case "location":
          valueA = a.location.toLowerCase()
          valueB = b.location.toLowerCase()
          return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
        default:
          return 0
      }

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA
    })

  // Toggle favorite state for vendors
  const handleToggleFavorite = (id: number, type: string) => {
    setFavorites((prev) => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`], // Unique key per type
    }))
  }

  const handleSeeMore = () => {
    setVisibleVendors((prev) => prev + 6)
  }

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters)
    // Reset to first page when applying new filters
    setVisibleVendors(6)
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search for Vendors..."
            className="border-none bg-gray-100 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-none bg-gray-100" onClick={() => setShowFilterModal(true)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            className="border-none bg-gray-100"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            Sort
          </Button>

          {/* Sort dropdown menu */}
          {showSortDropdown && (
            <div className="absolute right-0 z-10 mt-32 w-48 rounded-md border bg-white shadow-lg">
              <div className="py-1">
                <div className="border-b px-4 py-2 text-sm font-medium">Sort by</div>
                <button
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    sortCriteria === "price" && sortOrder === "asc" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortCriteria("price")
                    setSortOrder("asc")
                    setShowSortDropdown(false)
                  }}
                >
                  Price: Low to High
                </button>
                <button
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    sortCriteria === "price" && sortOrder === "desc" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortCriteria("price")
                    setSortOrder("desc")
                    setShowSortDropdown(false)
                  }}
                >
                  Price: High to Low
                </button>
                <button
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    sortCriteria === "rating" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortCriteria("rating")
                    setSortOrder("desc")
                    setShowSortDropdown(false)
                  }}
                >
                  Rating
                </button>
                <button
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    sortCriteria === "location" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortCriteria("location")
                    setSortOrder("asc")
                    setShowSortDropdown(false)
                  }}
                >
                  Location
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        initialValues={activeFilters}
      />

      {/* Active Filters Display */}
      {(activeFilters.priceMin ||
        activeFilters.priceMax ||
        activeFilters.location.length > 0 ||
        activeFilters.rating ||
        activeFilters.industry.length > 0) && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>

          {activeFilters.priceMin && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">Min: PHP {activeFilters.priceMin}</span>
          )}

          {activeFilters.priceMax && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">Max: PHP {activeFilters.priceMax}</span>
          )}

          {activeFilters.location.map((loc) => (
            <span key={loc} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
              {loc}
            </span>
          ))}

          {activeFilters.rating && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{activeFilters.rating}+ Stars</span>
          )}

          {activeFilters.industry.map((ind) => (
            <span key={ind} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
              {ind}
            </span>
          ))}

          <Button
            variant="ghost"
            className="h-6 px-2 py-0 text-xs text-gray-600"
            onClick={() =>
              setActiveFilters({
                priceMin: "",
                priceMax: "",
                location: [],
                rating: "",
                industry: [],
              })
            }
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.length > 0 ? (
          filteredVendors
            .slice(0, visibleVendors)
            .map((vendor) => (
              <VendorCard
                key={`${vendor.type}-${vendor.id}`}
                id={vendor.id}
                name={vendor.name}
                location={vendor.location}
                price={vendor.price}
                ratings={vendor.ratings}
                image={vendor.image}
                timeSlot={vendor.timeSlot}
                isFavorite={!!favorites[`${vendor.type}-${vendor.id}`]}
                onToggleFavorite={() => handleToggleFavorite(vendor.id, vendor.type)}
                showHireButton={true}
              />
            ))
        ) : (
          <div className="col-span-3 py-10 text-center text-gray-500">
            No vendors found matching your criteria. Try adjusting your filters.
          </div>
        )}
      </div>

      {/* See More Button */}
      {visibleVendors < filteredVendors.length && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSeeMore}
            className="rounded-md border border-gray-300 px-8 py-2"
          >
            See More
          </Button>
        </div>
      )}
    </div>
  )
}

const bookings = [
  {
    id: 1,
    name: "Corporate Gala Night",
    category: "Corporate Event",
    location: "Makati Ballroom",
    timeSlot: "07:00 PM - 11:00 PM",
    price: 15000,
    ratings: 30,
    image: "/images/vendor.jpg",
    isFavorite: false,
  },
  {
    id: 2,
    name: "Beach Wedding",
    category: "Wedding",
    location: "Boracay Beachfront",
    timeSlot: "04:00 PM - 10:00 PM",
    price: 20000,
    ratings: 40,
    image: "/images/vendor.jpg",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Birthday Party",
    category: "Birthday",
    location: "Quezon City",
    timeSlot: "02:00 PM - 06:00 PM",
    price: 8000,
    ratings: 15,
    image: "/images/vendor.jpg",
    isFavorite: false,
  },
]

const packages = [
  {
    id: 11,
    name: "Silver Wedding Package",
    category: "Wedding Package",
    location: "Tagaytay",
    timeSlot: "Full-Day Service",
    price: 50000,
    ratings: 15,
    image: "/images/vendor.jpg",
    isFavorite: false,
  },
  {
    id: 21,
    name: "Corporate VIP Package",
    category: "Corporate Event",
    location: "BGC",
    timeSlot: "Full-Day Service",
    price: 80000,
    ratings: 20,
    image: "/images/vendor.jpg",
    isFavorite: false,
  },
  {
    id: 31,
    name: "Birthday Bash Package",
    category: "Birthday Package",
    location: "Quezon City",
    timeSlot: "Half-Day Service",
    price: 20000,
    ratings: 10,
    image: "/images/vendor.jpg",
    isFavorite: false,
  },
]

export default Explore
