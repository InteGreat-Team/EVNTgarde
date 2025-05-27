import { useParams, useNavigate } from "react-router-dom";
import { Star, Share2, ArrowLeft, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import BookingModal from "./BookingModal";
import { BookingStepsModal } from "./BookingStepsModal";
import { mockOrganizers } from "../../../../functions/mockData";
import { ChevronRight, X } from "lucide-react";

const organizersFromMock = mockOrganizers.map((org) => ({
  phone: org.phone || "+1 (555) 123-4567",
  email: org.email || "contact@organization.com",
  id: org.organizerId,
  name: org.organizationName,
  category: org.industry || "Event Organizer",
  location: org.address
    ? `${org.address.address}, ${org.address.city}, ${org.address.state} ${org.address.zipCode}`
    : "Unknown Location",
  timeSlot:
    org.timeSlot && org.timeSlot.length
      ? org.timeSlot.join(", ")
      : "Flexible Hours",
  price: org.price,
  ratings: org.rating || 0,
  image: org.image || "/images/vendor.jpg",
  isFavorite: false,
  details: [
    "Professional event planning",
    "Customized services",
    "Experienced staff",
  ],
  description:
    org.description ||
    `${org.organizationName} is a professional event organizing company specializing in creating memorable experiences for clients.`,
}));

const organizers = [
  ...organizersFromMock,
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
    phone: "+63 912 345 6789",
    email: "silverwedding@example.com",
    details: [
      "Professional wedding planning",
      "Customized decor and setup",
      "Luxury bridal suite access",
    ],
    description:
      "The Silver Wedding Package offers a premium experience with full-day services, ensuring every detail is handled perfectly. Ideal for couples looking for an elegant yet budget-friendly wedding experience.",
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
    phone: "+63 912 345 6789",
    email: "silverwedding@example.com",
    details: [
      "Exclusive venue access",
      "Catering and refreshments",
      "Professional event coordination",
    ],
    description:
      "Our Corporate VIP Package is designed for high-profile business events, offering top-notch services to ensure a seamless and professional experience.",
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
    phone: "+63 912 345 6789",
    email: "silverwedding@example.com",
    details: [
      "Themed decorations",
      "Fun activities for kids",
      "Custom cake options",
    ],
    description:
      "Perfect for all ages, the Birthday Bash Package offers exciting entertainment and beautiful decorations to create unforgettable birthday memories.",
  },
  {
    id: 41,
    name: "Platinum Wedding Package",
    category: "Wedding Package",
    location: "Palawan",
    timeSlot: "Full-Day Service",
    price: 100000,
    ratings: 35,
    image: "/images/vendor.jpg",
    isFavorite: false,
    phone: "+63 912 345 6789",
    email: "silverwedding@example.com",
    details: [
      "Luxury beachside venue",
      "Exclusive wedding planner",
      "5-star catering services",
    ],
    description:
      "The Platinum Wedding Package provides the ultimate dream wedding experience, with a breathtaking location and world-class services.",
  },
  {
    id: 51,
    name: "Corporate Team Building Package",
    category: "Corporate Event",
    location: "Batangas",
    timeSlot: "Full-Day Service",
    price: 60000,
    ratings: 25,
    image: "/images/vendor.jpg",
    isFavorite: false,
    phone: "+63 912 345 6789",
    email: "silverwedding@example.com",
    details: [
      "Outdoor adventure activities",
      "Leadership workshops",
      "Custom team challenges",
    ],
    description:
      "Boost your team's morale and productivity with our engaging Corporate Team Building Package, designed to foster collaboration and leadership.",
  },
  {
    id: 61,
    name: "Birthday Party Package",
    category: "Birthday Package",
    location: "Makati",
    timeSlot: "Half-Day Service",
    price: 15000,
    ratings: 12,
    image: "/images/vendor.jpg",
    isFavorite: false,
    phone: "+63 912 345 6789",
    email: "silverwedding@example.com",
    details: [
      "Party hosts and entertainers",
      "Personalized gift bags",
      "Music and lighting setup",
    ],
    description:
      "Celebrate in style with our Birthday Party Package, featuring entertainment, decor, and fun-filled surprises tailored for your special day.",
  },
];

const reviews = [
  {
    title: "John Doe",
    rating: 5,
    comment: "Amazing service! Everything was well-organized.",
  },
  {
    title: "Jane Smith",
    rating: 4,
    comment: "Great experience, but there's room for improvement.",
  },
  {
    title: "Johnny Doe",
    rating: 4,
    comment: "Amazing service! Everything was well-organized.",
  },
  {
    title: "Jane Smith",
    rating: 3,
    comment: "Great experience, but there's room for improvement.",
  },
  {
    title: "Johnny Seen",
    rating: 4,
    comment: "Amazing service! Everything was well-organized.",
  },
  {
    title: "Jade Smith",
    rating: 3,
    comment: "Great experience, but there's room for improvement.",
  },
];

export default function OrganizerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const organizer = organizers.find((org) => org.id === Number(id));
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<
    "organizer" | "individual" | "vendor"
  >("individual");

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (!organizer) {
    return (
      <p className="text-center text-red-500 font-semibold">
        Organizer not found. ID: {id}
      </p>
    );
  }

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-1 flex-col transition-all duration-300 md:ml-64">
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto overflow-hidden">
        <button
          onClick={() =>
            navigate("/dashboard", { state: { activeTab: "explore" } })
          }
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
          <h1 className="text-xl sm:text-2xl font-bold text-dark">
            {organizer.name}
          </h1>
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
                setActiveTab("about");
                setCurrentPage(1);
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
                  <Star
                    key={i}
                    className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400"
                  />
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
                <p className="text-dark-700 leading-relaxed text-sm sm:text-base mb-6">
                  {organizer.description}
                </p>

                {/* Contact Details Section - Added this */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="w-full lg:w-1/2">
                      {/* Contact Details Section */}
                      <div className="mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-dark-800 mb-2">
                          Contact Details
                        </h3>
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
                        <h3 className="text-base sm:text-lg font-semibold text-dark-800 mb-2">
                          Location
                        </h3>
                        <div className="flex flex-col gap-4">
                          <div className="w-full">
                            <p className="text-dark-600 text-sm sm:text-base">
                              {organizer.location}
                            </p>
                            <p className="mt-2 text-dark-700 text-sm sm:text-base">
                              Find the best route to your event location with
                              ease.
                            </p>
                          </div>
                          <div className="w-full lg:w-1/2">
                            {" "}
                            {/* Changed to half width on large screens */}
                            <div className="h-48 sm:h-64 bg-gray-300 flex items-center justify-center text-gray-500 rounded-lg">
                              Map Goes Here 🗺️
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-2/5">
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold text-center mb-2">
                          Rates
                        </h3>
                        <p className="text-dark-600 text-sm text-left mb-6">
                          Choose a service for your event
                        </p>

                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setSelectedRate("per-person");
                              setIsRateModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between bg-white border border-gray-200  rounded-lg p-3 hover:border-[#2B579A] transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800">
                                Per Person Rate
                              </h4>
                              <p className="text-sm text-gray-500 ">
                                starts at Php 500
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedRate("package-deal");
                              setIsRateModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-[#2B579A] transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800  text-left">
                                Package Deal
                              </h4>
                              <p className="text-sm text-gray-500 ">
                                starts at Php 99,999
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedRate("hourly");
                              setIsRateModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between bg-white  border border-gray-200 rounded-lg p-3 hover:border-[#2B579A]  transition-colors"
                          >
                            <div>
                              <h4 className="font-medium text-dark-800 text-left">
                                Hourly Rate
                              </h4>
                              <p className="text-sm text-gray-500 ">
                                starts at Php 10,000
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
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                    Past Events
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => {
                      const specialty = ["Wedding", "Birthday", "Fellowship"][
                        i
                      ];
                      const date = "NOV 22";
                      const location = "Location";
                      const time = "Full-day Service";
                      const price = "PHP 1000";

                      return (
                        <div
                          key={i}
                          className="bg-light rounded-lg shadow-md overflow-hidden"
                        >
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
                              <span className="text-xs sm:text-sm text-dark">
                                {date}
                              </span>
                            </div>
                            <h3 className="font-semibold mb-2 text-dark text-sm sm:text-base">
                              {specialty}
                            </h3>
                            <p className="text-xs sm:text-sm text-dark">
                              {location}
                            </p>
                            <p className="text-xs sm:text-sm text-dark">
                              {time}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs sm:text-sm text-dark">
                                {price}
                              </span>
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-yellow-500" />
                              <span className="text-xs sm:text-sm text-dark-600 ml-1">
                                10 ratings
                              </span>
                            </div>
                          </div>
                        </div>
                      );
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
                  <div
                    key={index}
                    className="w-full p-4 sm:p-6 rounded-lg shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h3 className="text-base sm:text-lg font-semibold text-dark ">
                        {review.title || "Verified Customer"}
                      </h3>
                      <span className="text-xs sm:text-sm text-dark mt-1 sm:mt-0">
                        Feb 25, 2025
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 sm:mt-4 text-dark  leading-relaxed text-sm sm:text-base">
                      {review.comment}
                    </p>
                    <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-dark ">
                      <span>
                        ✔ Organized · ✔ Professional · ✔ Responsive
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstReview + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {indexOfLastReview > reviews.length
                        ? reviews.length
                        : indexOfLastReview}
                    </span>{" "}
                    of <span className="font-medium">{reviews.length}</span>{" "}
                    reviews
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#2B579A] text-white hover:bg-blue-600"
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === number
                            ? "bg-[#2B579A] text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
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
          setIsBookingModalOpen(false);
          setIsHiringModalOpen(true);
        }}
        organizerName={organizer.name}
      />

      {/* Proceed To Hiring */}
      <BookingStepsModal
        isOpen={isHiringModalOpen}
        onClose={() => setIsHiringModalOpen(false)}
      />

      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl pointer-events-auto">
            <div className="sticky top-0 bg-white  z-10 flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedRate === "per-person"
                  ? "Per Person Rate"
                  : selectedRate === "package-deal"
                    ? "Package Deal"
                    : "Hourly Rate"}
              </h2>
              <button
                onClick={() => setIsRateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {selectedRate === "per-person" && (
                <div>
                  <div className="mb-4 border border-gray-200  rounded-lg p-4">
                    <h3 className="font-medium mb-1">Wedding Planning</h3>
                    <p className="text-sm text-gray-600  mb-4">
                      Let us handle every detail, so you can fully savor your
                      special day.
                    </p>

                    <p className="text-sm text-gray-600 mb-4">
                      At <span className="font-semibold">Eventify</span>, we
                      understand that planning a wedding can be both exciting
                      and overwhelming. Our Full Wedding Planning service is
                      designed to take the stress out of the process, allowing
                      you to relax and enjoy every moment leading up to and on
                      your wedding day.
                    </p>

                    <p className="text-sm text-gray-600  mb-4">
                      From the initial concept to the final farewell, we
                      meticulously manage every detail to create a celebration
                      that perfectly reflects your unique style and vision.
                    </p>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">
                        Initial Consultation & Vision Development:
                      </h4>
                      <ul className="list-disc pl-13 space-y-2 text-sm text-gray-600 ">
                        <li>
                          In-depth discussions to understand your vision,
                          preferences, style, and budget.
                        </li>
                        <li>
                          Conceptualization of the wedding theme, color palette,
                          and overall aesthetic.
                        </li>
                        <li>
                          Development of a detailed wedding plan and timeline.
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Budget Management:</h4>
                      <ul className="list-disc pl-13 space-y-2 text-sm text-gray-600 ">
                        <li>Creation of a realistic and detailed budget.</li>
                        <li>
                          Tracking expenses and ensuring adherence to the
                          agreed-upon budget.
                        </li>
                        <li>
                          Negotiation with vendors to secure the best possible
                          rates.
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">
                        Venue Sourcing & Management:
                      </h4>
                      <ul className="list-disc pl-13 space-y-2 text-sm text-gray-600 ">
                        <li>
                          Scheduling and accompanying you on venue visits.
                        </li>
                        <li>Negotiating and managing venue contracts.</li>
                        <li>
                          Liaising with the venue coordinator throughout the
                          planning process.
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Full Package</h4>
                        <p className="text-sm">Starts at PHP 90,000</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <button
                      onClick={() => setSelectedRate("package-deal")}
                      className="w-full flex items-center justify-between bg-white  border-gray-200  rounded-lg p-4 hover:border-[#2B579A] transition-colors"
                    >
                      <h4 className="font-medium text-dark-800">
                        Package Deal
                      </h4>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <button
                      onClick={() => setSelectedRate("hourly")}
                      className="w-full flex items-center justify-between bg-white border-gray-200 rounded-lg p-4 hover:border-[#2B579A] transition-colors"
                    >
                      <h4 className="font-medium text-dark-800 ">
                        Hourly Rate
                      </h4>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {selectedRate === "package-deal" && (
                <div>
                  <div className="mb-4 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-1">
                      All-Inclusive Event Package
                    </h3>
                    <p className="text-sm text-gray-600  mb-4">
                      A comprehensive solution for your event needs with
                      everything included.
                    </p>

                    <p className="text-sm text-gray-600  mb-4">
                      Our Package Deal offers a complete event planning and
                      execution service that covers all aspects of your event.
                      From venue selection to catering, entertainment, and
                      decor, we handle everything so you can focus on enjoying
                      your special occasion.
                    </p>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">What's Included:</h4>
                      <ul className="list-disc pl-13 space-y-2 text-sm text-gray-600 ">
                        <li>Full event planning and coordination</li>
                        <li>Venue selection and booking</li>
                        <li>Catering services with customized menu</li>
                        <li>Decor and styling based on your theme</li>
                        <li>Entertainment and music coordination</li>
                        <li>Photography and videography services</li>
                        <li>Guest management and RSVP tracking</li>
                        <li>Day-of coordination and supervision</li>
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Complete Package</h4>
                        <p className="text-sm">Starts at PHP 99,999</p>
                      </div>
                      {/* <button
                        onClick={() => {
                          setIsRateModalOpen(false);
                          setIsBookingModalOpen(true);
                        }}
                        className="bg-[#2B579A] text-white py-3 rounded-lg hover:bg-blue-600 transition"
                      >
                        Book Vendor
                      </button> */}
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <button
                      onClick={() => setSelectedRate("per-person")}
                      className="w-full flex items-center justify-between bg-white  border border-gray-200  rounded-lg p-4 hover:border-[#2B579A]  transition-colors"
                    >
                      <h4 className="font-medium text-dark-800">
                        Per Person Rate
                      </h4>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <button
                      onClick={() => setSelectedRate("hourly")}
                      className="w-full flex items-center justify-between bg-white  border border-gray-200  rounded-lg p-4 hover:border-[#2B579A]  transition-colors"
                    >
                      <h4 className="font-medium text-dark-800 ">
                        Hourly Rate
                      </h4>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {selectedRate === "hourly" && (
                <div>
                  <div className="mb-4 border border-gray-200  rounded-lg p-4">
                    <h3 className="font-medium mb-1">
                      Flexible Hourly Services
                    </h3>
                    <p className="text-sm text-gray-600  mb-4">
                      Professional event support charged by the hour for maximum
                      flexibility.
                    </p>

                    <p className="text-sm text-gray-600  mb-4">
                      Our Hourly Rate option is perfect for clients who need
                      specific services or consultation for a limited time. This
                      flexible arrangement allows you to access our expertise
                      without committing to a full package.
                    </p>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">
                        Services Available Hourly:
                      </h4>
                      <ul className="list-disc pl-13 space-y-2 text-sm text-gray-600 ">
                        <li>Event consultation and advice</li>
                        <li>On-site coordination and management</li>
                        <li>Vendor liaison and negotiation</li>
                        <li>Timeline and logistics planning</li>
                        <li>Crisis management and problem-solving</li>
                        <li>Setup and teardown supervision</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Booking Terms:</h4>
                      <ul className="list-disc pl-13 space-y-2 text-sm text-gray-600 ">
                        <li>Minimum booking of 4 hours</li>
                        <li>24-hour cancellation policy</li>
                        <li>
                          Travel fees may apply for locations outside city
                          limits
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Professional Service</h4>
                        <p className="text-sm">PHP 10,000 per hour</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <button
                      onClick={() => setSelectedRate("per-person")}
                      className="w-full flex items-center justify-between bg-white  border border-gray-200  rounded-lg p-4 hover:border-[#2B579A] transition-colors"
                    >
                      <h4 className="font-medium text-dark-800">
                        Per Person Rate
                      </h4>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>

                    <button
                      onClick={() => setSelectedRate("package-deal")}
                      className="w-full flex items-center justify-between bg-white  border border-gray-200  rounded-lg p-4 hover:border-[#2B579A]  transition-colors"
                    >
                      <h4 className="font-medium text-dark-800 ">
                        Package Deal
                      </h4>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
