import { useParams, useNavigate } from "react-router-dom"
import { Star, Share2, ArrowLeft, Phone, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import BookingModal from "./BookingModal"
import { BookingStepsModal } from "./BookingStepsModal"
import { ChevronRight, X } from "lucide-react"
import { organizers } from "../../../../functions/mockData";
import { reviews } from "../../../../functions/types";
import { PackageModalContent } from "../../../Bookings/Elements/components/PackageModalContent";

export default function OrganizerDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const organizer = organizers.find((org) => org.id === Number(id))
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about")
  const [isRateModalOpen, setIsRateModalOpen] = useState(false)
  const [selectedRate, setSelectedRate] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<"organizer" | "individual" | "vendor">("individual")

  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 2

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    if (storedUserType === "organizer" || storedUserType === "individual" || storedUserType === "vendor") {
      setUserRole(storedUserType as "organizer" | "individual" | "vendor")
    }
  }, [])

  if (!organizer) {
    return <p className="text-center text-red-500 font-semibold">Organizer not found. ID: {id}</p>
  }

  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="flex flex-1 flex-col transition-all duration-300 md:ml-64">
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto overflow-hidden">
        <button
          onClick={() => navigate("/dashboard", { state: { activeTab: "explore" } })}
          className="flex items-center text-gray-600 hover:text-[#2B579A] mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <img
          src={organizer.image || "/placeholder.svg"}
          alt={organizer.name}
          className="w-full h-48 sm:h-64 object-cover rounded-lg"
        />

        {/* Organizer Name, Buttons, and Icons */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-dark">{organizer.name}</h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {userRole === "organizer" ? (
              <button
                className="bg-[#2B579A] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-blue-600 transition text-sm sm:text-base"
                onClick={() => setIsBookingModalOpen(true)}
              >
                Book Vendor
              </button>
            ) : userRole === "individual" ? (
              <button
                className="bg-[#2B579A] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-blue-600 transition text-sm sm:text-base"
                onClick={() => setIsBookingModalOpen(true)}
              >
                Book Organizer
              </button>
            ) : null}
            {/* Favorite and Share Icons */}
            <button className="text-dark-600 hover:text-yellow-500">
              <Star className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button className="text-dark-600 hover:text-blue-500">
              <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mt-4">
          <nav className="flex items-end space-x-8 px-4 sm:px-6">
            <button
              onClick={() => {
                setActiveTab("about")
                setCurrentPage(1)
              }}
              className={`py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base ${
                activeTab === "about"
                  ? "border-[#2B579A] text-[#2B579A]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              About
            </button>
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base ${
                  activeTab === "reviews"
                    ? "border-[#2B579A] text-[#2B579A]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews
              </button>
              <span className="ml-2 inline-flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                ))}
                <span className="ml-1 text-xs sm:text-sm">4.8</span>
              </span>
            </div>
          </nav>
        </div>

        <div className="px-4 sm:px-6 py-4">
          {activeTab === "about" ? (
            <>
              <div className="mb-8">
                <p className="text-dark-700 leading-relaxed text-sm sm:text-base mb-6">{organizer.description}</p>

                {/* Contact Details Section */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="w-full lg:w-1/2">
                      {/* Contact Details Section */}
                      <div className="mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-dark-800 mb-2">Contact Details</h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mr-2" />
                            <a
                              href={`tel:${organizer.phone}`}
                              className="text-dark-600 text-sm sm:text-base hover:text-[#2B579A] transition-colors"
                            >
                              {organizer.phone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mr-2" />
                            <a
                              href={`mailto:${organizer.email}`}
                              className="text-dark-600 text-sm sm:text-base hover:text-[#2B579A] transition-colors"
                            >
                              {organizer.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-base sm:text-lg font-semibold text-dark-800 mb-2">Location</h3>
                        <div className="flex flex-col gap-4">
                          <div className="w-full">
                            <p className="text-dark-600 text-sm sm:text-base">{organizer.location}</p>
                            <p className="mt-2 text-dark-700 text-sm sm:text-base">
                              Find the best route to your event location with ease.
                            </p>
                          </div>
                          <div className="w-full lg:w-1/2">
                            <div className="h-48 sm:h-64 bg-gray-300 flex items-center justify-center text-gray-500 rounded-lg">
                              Map Goes Here 🗺️
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-2/5">
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold text-center mb-2">Rates</h3>
                        <p className="text-dark-600 text-sm text-left mb-6">Choose a service for your event</p>

                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setSelectedRate("basic-setup")
                              setIsRateModalOpen(true)
                            }}
                            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-[#2B579A] transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800 text-left">Basic Setup Package</h4>
                              <p className="text-sm text-gray-500 text-left">
                                For small gigs or intimate events, includes standard sound setup and basic lighting for
                                an unforgettable experience.
                              </p>
                              <p className="text-sm text-gray-600 font-medium text-left mt-1">
                                starts at Php 25,000.00
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedRate("full-production")
                              setIsRateModalOpen(true)
                            }}
                            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-[#2B579A] transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800 text-left">Full Production Package</h4>
                              <p className="text-sm text-gray-500 text-left">
                                Perfect for mid-sized events with enhanced sound, lighting setup, LED screens, and crowd
                                coordination.
                              </p>
                              <p className="text-sm text-gray-600 font-medium text-left mt-1">
                                starts at Php 50,000.00
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedRate("headliner")
                              setIsRateModalOpen(true)
                            }}
                            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-[#2B579A] transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800 text-left">Headliner Package</h4>
                              <p className="text-sm text-gray-500 text-left">
                                Designed for major performances with main stage setup, premium sound systems, advanced
                                lighting, and VIP coordination.
                              </p>
                              <p className="text-sm text-gray-600 font-medium text-left mt-1">
                                starts at Php 100,000.00
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedRate("festival")
                              setIsRateModalOpen(true)
                            }}
                            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-[#2B579A] transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800 text-left">Festival Package</h4>
                              <p className="text-sm text-gray-500 text-left">
                                Ultimate festival experience with multiple stages, extensive sound, lighting systems,
                                and comprehensive crowd management.
                              </p>
                              <p className="text-sm text-gray-600 font-medium text-left mt-1">
                                starts at Php 300,000.00
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedRate("custom-experience")
                              setIsRateModalOpen(true)
                            }}
                            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-[#2B579A] transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800 text-left">Custom Experience Package</h4>
                              <p className="text-sm text-gray-500 text-left">
                                Tailored solutions based on your specific needs, venue requirements, and creative vision
                                for truly unique events.
                              </p>
                              <p className="text-sm text-gray-600 font-medium text-left mt-1">
                                starts at Php 75,000.00
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Past Events</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => {
                      const specialty = ["Wedding", "Birthday", "Fellowship"][i]
                      const date = "NOV 22"
                      const location = "Location"
                      const time = "Full-day Service"
                      const price = "PHP 1000"

                      return (
                        <div key={i} className="bg-light rounded-lg shadow-md overflow-hidden">
                          <div className="relative">
                            <img
                              src="../../src/assets/vendor.jpg"
                              alt="Past event"
                              className="w-full h-40 sm:h-48 object-cover"
                            />
                            <button className="absolute top-2 right-2 text-yellow-500 hover:text-gray-600">
                              <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm text-dark">{date}</span>
                            </div>
                            <h3 className="font-semibold mb-2 text-dark text-sm sm:text-base">{specialty}</h3>
                            <p className="text-xs sm:text-sm text-dark">{location}</p>
                            <p className="text-xs sm:text-sm text-dark">{time}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs sm:text-sm text-dark">{price}</span>
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-yellow-500" />
                              <span className="text-xs sm:text-sm text-dark-600 ml-1">10 ratings</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <button className="inline-block bg-white text-gray-800 px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base">
                      See More Events
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                {currentReviews.map((review, index) => (
                  <div key={index} className="w-full p-4 sm:p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h3 className="text-base sm:text-lg font-semibold text-dark ">
                        {review.title || "Verified Customer"}
                      </h3>
                      <span className="text-xs sm:text-sm text-dark mt-1 sm:mt-0">Feb 25, 2025</span>
                    </div>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 sm:mt-4 text-dark  leading-relaxed text-sm sm:text-base">{review.comment}</p>
                    <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-dark ">
                      <span>✔ Organized · ✔ Professional · ✔ Responsive</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{indexOfFirstReview + 1}</span> to{" "}
                    <span className="font-medium">
                      {indexOfLastReview > reviews.length ? reviews.length : indexOfLastReview}
                    </span>{" "}
                    of <span className="font-medium">{reviews.length}</span> reviews
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#2B579A] text-white hover:bg-blue-600"
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number ? "bg-[#2B579A] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#2B579A] text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onContinue={() => {
          setIsBookingModalOpen(false)
          setIsHiringModalOpen(true)
        }}
        organizerName={organizer.name}
      />

      {/* Proceed To Hiring */}
      <BookingStepsModal isOpen={isHiringModalOpen} onClose={() => setIsHiringModalOpen(false)} />

      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl pointer-events-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">
                {selectedRate === "basic-setup"
                  ? "Basic Setup Package"
                  : selectedRate === "full-production"
                    ? "Full Production Package"
                    : selectedRate === "headliner"
                      ? "Headliner Package"
                      : selectedRate === "festival"
                        ? "Festival Package"
                        : "Custom Experience Package"}
              </h2>
              <button onClick={() => setIsRateModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <PackageModalContent
                selectedRate={selectedRate}
                organizerName={organizer.name}
                onCloseModal={() => setIsRateModalOpen(false)}
                onBookVendor={() => {
                  setIsRateModalOpen(false)
                  setIsBookingModalOpen(true)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
