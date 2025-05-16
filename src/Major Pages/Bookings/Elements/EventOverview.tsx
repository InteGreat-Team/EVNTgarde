"use client";

import React from "react";
import { User, MapPin, Clock } from "lucide-react";

// Type for the booking structure - imported from parent component
type Booking = {
  id: number;
  date: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  startDateTime: string;
  endDateTime: string;
  customer: string;
  location: string;
  guests: string;
  eventType: string;
};

interface Activity {
  id: number;
  date: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface TimelineItem {
  id: number;
  time: string;
  activity: string;
}

type BookingDetailsProps = {
  activeStatus: string;
  selectedBooking: Booking;
  userRole?: 'organizer' | 'individual' | 'vendor';
};

// Helper function to convert 12-hour time format to 24-hour format for input value
const convertTo24Hour = (time12h: string): string => {
  // Handle empty input case
  if (!time12h) return '';
  
  const [time, modifier] = time12h.split(' ');
  if (!time || !modifier) return '';

  let [hours, minutes] = time.split(':');
  if (!hours || !minutes) return '';

  let hoursNum = parseInt(hours, 10);
  
  if (modifier === 'PM' && hoursNum < 12) {
    hoursNum += 12;
  }
  if (modifier === 'AM' && hoursNum === 12) {
    hoursNum = 0;
  }
  
  return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
};

// Helper function to format a 24-hour time string to 12-hour format
const formatTo12Hour = (time24h: string): string => {
  // Handle empty input case
  if (!time24h) return '';
  
  const [hours, minutes] = time24h.split(':');
  if (!hours || !minutes) return '';
  
  const hoursNum = parseInt(hours, 10);
  const suffix = hoursNum >= 12 ? 'PM' : 'AM';
  const hour12 = ((hoursNum + 11) % 12 + 1).toString();
  
  return `${hour12}:${minutes} ${suffix}`;
};

// Add a function to check if a status is "upcoming" (case-insensitive)
const isUpcomingStatus = (status: string): boolean => {
  return status.toLowerCase() === "upcoming";
};

// Helper function to format date and time
const formatDateTime = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const BookingDetails: React.FC<BookingDetailsProps> = ({
  activeStatus,
  selectedBooking,
  userRole = 'organizer',
}) => {
  // Sample services
  const services = [
    { id: 1, name: "Catering Services", price: "PHP 560,000" },
    { id: 2, name: "Catering Services", price: "PHP 560,000" },
    { id: 3, name: "Catering Services", price: "PHP 560,000" },
  ];

  // Timeline state
  const [timeline, setTimeline] = React.useState<TimelineItem[]>([]);
  const [timelineActivities, setTimelineActivities] = React.useState<Activity[]>([]);

  // State for showing timeline creator modal
  const [showTimelineModal, setShowTimelineModal] = React.useState(false);
  const [days, setDays] = React.useState<{ id: number; activities: Activity[] }[]>([
    {
      id: 1,
      activities: [{ id: 1, date: '', name: '', startTime: '12:00 AM', endTime: '12:00 AM' }]
    }
  ]);

  // Sample venue details
  const venueDetails = {
    name: "Blessed Pier Giorgio Frassati Building Auditorium",
    floor: "21st Floor, Blessed Pier Giorgio Frassati Building",
    zipCode: "101",
    street: "España Blvd, Sampaloc, Manila, Metro Manila",
    country: "Philippines",
  };

  // Convert number of guests from "1,234 Guests" to just number
  const guestsNumber = selectedBooking.guests.split(" ")[0];

  const addDay = () => {
    const newDayId = days.length + 1;
    setDays([...days, {
      id: newDayId,
      activities: [{ 
        id: 1, 
        date: '', 
        name: '', 
        startTime: '12:00 AM', 
        endTime: '12:00 AM' 
      }]
    }]);
  };

  const addActivity = (dayId: number) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: [...day.activities, {
            id: day.activities.length + 1,
            date: day.activities[0].date, // Copy date from first activity
            name: '',
            startTime: '12:00 AM',
            endTime: '12:00 AM'
          }]
        };
      }
      return day;
    }));
  };

  const deleteActivity = (dayId: number, activityId: number) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        // If this would be the last activity in the day, prevent deletion
        if (day.activities.length <= 1) {
          return day;
        }
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId)
        };
      }
      return day;
    }));
  };

  const validateTime = (startTime: string, endTime: string): boolean => {
    // Convert to 24-hour format for comparison
    const start24 = convertTo24Hour(startTime);
    const end24 = convertTo24Hour(endTime);
    
    if (!start24 || !end24) return false;
    
    return start24 < end24;
  };

  const getMinDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const updateActivity = (dayId: number, activityId: number, field: keyof Activity, value: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        // For "time" fields, do validation
        if ((field === 'startTime' || field === 'endTime') && day.activities.some(a => a.id === activityId)) {
          const activity = day.activities.find(a => a.id === activityId);
          if (!activity) return day;
          
          // Get the new startTime and endTime values for validation
          const newStartTime = field === 'startTime' ? value : activity.startTime;
          
          // If end time is earlier than start time, don't update
          if (field === 'endTime' && !validateTime(newStartTime, value)) {
            return day;
          }
        }
        
        const updatedActivities = day.activities.map(activity => {
          if (activity.id === activityId) {
            if (field === 'date') {
              // Update date for all activities in the day
              return {
                ...activity,
                [field]: value
              };
            }
            return {
              ...activity,
              [field]: value
            };
          }
          if (field === 'date') {
            // Update date for all activities in the day
            return {
              ...activity,
              date: value
            };
          }
          return activity;
        });
        
        // Sort activities by start time
        if (field === 'startTime' || field === 'endTime') {
          updatedActivities.sort((a, b) => {
            const aTime = convertTo24Hour(a.startTime);
            const bTime = convertTo24Hour(b.startTime);
            if (!aTime || !bTime) return 0;
            return aTime.localeCompare(bTime);
          });
        }
        
        return {
          ...day,
          activities: updatedActivities
        };
      }
      return day;
    }));
  };

  const handleSaveTimeline = () => {
    const allActivities = days.flatMap(day => day.activities);
    setTimelineActivities(allActivities);
    
    // Create simplified timeline items for display
    const newTimeline = allActivities.map((activity, index) => ({
      id: index + 1,
      time: `${activity.startTime} - ${activity.endTime}`,
      activity: activity.name
    }));
    
    setTimeline(newTimeline);
    setShowTimelineModal(false);
    // Reset days for next time
    setDays([{
      id: 1,
      activities: [{ id: 1, date: '', name: '', startTime: '12:00 AM', endTime: '12:00 AM' }]
    }]);
  };

  const handleEditTimeline = () => {
    // Group activities by date
    const groupedActivities = timelineActivities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, Activity[]>);

    // Convert grouped activities to days format
    const newDays = Object.entries(groupedActivities).map(([date, activities], index) => ({
      id: index + 1,
      activities: activities.map((activity, actIndex) => ({
        ...activity,
        id: actIndex + 1
      }))
    }));

    setDays(newDays.length > 0 ? newDays : [{
      id: 1,
      activities: [{ id: 1, date: '', name: '', startTime: '12:00 AM', endTime: '12:00 AM' }]
    }]);
    setShowTimelineModal(true);
  };

  const deleteDay = (dayId: number) => {
    setDays(days.filter(day => day.id !== dayId));
  };

  // Update the render condition for edit/create buttons based on role
  const canEditTimeline = userRole === 'organizer';
  console.log("Current user role:", userRole, "Can edit timeline:", canEditTimeline);

  // Conditionally render content based on activeStatus
  const renderContent = () => {
    // Services tab content is the same for all statuses
    const servicesContent = (
      <div className="p-4">
        <p className="text-gray-600 mb-4">
          List of requested services by the customer
        </p>
        {services.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center mb-4 border-b pb-4"
          >
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <User size={20} className="text-gray-500" />
              </div>
              <span>{service.name}</span>
            </div>
            <div>
              <p className="text-blue-600 font-medium">{service.price}</p>
              <p className="text-gray-500 text-sm">Included</p>
            </div>
          </div>
        ))}
      </div>
    );

    // Venue tab content
    const venueContent = (
      <div className="p-4">
        <div className="bg-gray-100 rounded-lg w-full h-48 relative mb-6">
          {/* Map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto text-red-500 mb-2" size={32} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {venueDetails.name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Floor, Building</p>
              <p className="font-medium">{venueDetails.floor}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">ZIP Code</p>
              <p className="font-medium">{venueDetails.zipCode}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">
              Street Address, District, City, Province/State
            </p>
            <p className="font-medium">{venueDetails.street}</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Country</p>
            <p className="font-medium">{venueDetails.country}</p>
          </div>
        </div>
      </div>
    );

    // Timeline tab content varies by status
    const pendingTimelineContent = (
      <div className="p-4 flex flex-col items-center justify-center h-48">
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <Clock className="text-blue-500" size={24} />
        </div>
        {userRole === 'organizer' ? (
          <p className="text-base text-center text-blue-600">
            The event proposal is still awaiting customer's acceptance. Once they confirm, you can create an event timeline here.
          </p>
        ) : userRole === 'individual' ? (
          <p className="text-base text-center">
            Your proposal is still under review. Once you accept it, the organizer can create an event timeline.
          </p>
        ) : (
          <p className="text-base text-center">
            This proposal is still under review. Once accepted, a timeline will be available.
          </p>
        )}
      </div>
    );

    const upcomingTimelineContent = (
      <>
        {timeline.length > 0 ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Event Timeline</h3>
              {canEditTimeline && (
                <button
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-2"
                  onClick={handleEditTimeline}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Timeline
                </button>
              )}
            </div>
            {timeline.map((item) => (
              <div key={item.id} className="flex mb-2">
                <div className="w-1/3 text-blue-600 font-medium">{item.time}</div>
                <div className="w-2/3 bg-blue-50 p-2 rounded">{item.activity}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center justify-center h-48">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Clock className="text-blue-500" size={24} />
            </div>
            
            {isUpcomingStatus(activeStatus) && userRole === 'organizer' ? (
              <>
                <p className="text-base text-center mb-4">
                  Your proposal is now accepted! Create an event timeline now.
                </p>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setShowTimelineModal(true)}
                >
                  Create Event Timeline
                </button>
              </>
            ) : (
              <p className="text-base text-center mb-4 text-blue-600">
                The event proposal is still awaiting customer's acceptance. Once they confirm, you can create an event timeline here.
              </p>
            )}
          </div>
        )}

        {/* Timeline Creator Modal - only show if user is an organizer */}
        {showTimelineModal && canEditTimeline && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowTimelineModal(false)} />
            <div className="relative bg-white rounded-lg w-[500px] max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Add Activity</h2>
                
                {days.map((day) => (
                  <div key={day.id} className="mb-6 border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-blue-600 font-semibold">Day {day.id}</h3>
                      {days.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 text-sm hover:text-red-700"
                          onClick={() => deleteDay(day.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-600 text-sm mb-2">Date</label>
                      <div className="relative bg-gray-100 rounded-md">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 2L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M8 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <input
                          type="date"
                          min={getMinDate()}
                          className="w-full p-2 pl-10 bg-transparent rounded-md appearance-none"
                          value={day.activities[0].date}
                          onChange={(e) => updateActivity(day.id, day.activities[0].id, 'date', e.target.value)}
                        />
                      </div>
                    </div>

                    {day.activities.map((activity) => (
                      <div key={activity.id} className="mb-4 border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-gray-600 text-sm">Activity {activity.id}</label>
                          {day.activities.length > 1 && (
                            <button
                              type="button"
                              className="text-red-500 text-sm hover:text-red-700 flex items-center gap-1"
                              onClick={() => deleteActivity(day.id, activity.id)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-600 text-sm mb-2">Activity Name</label>
                          <input
                            type="text"
                            placeholder="e.g.: Ribbon-Cutting Ceremony (Opening)"
                            className="w-full p-2 bg-gray-100 rounded-md"
                            value={activity.name}
                            onChange={(e) => updateActivity(day.id, activity.id, 'name', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-600 text-sm mb-2">Start Time</label>
                            <div className="relative bg-gray-100 rounded-md">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M12 6L12 12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <input
                                type="time"
                                className="w-full p-2 pl-10 bg-transparent rounded-md appearance-none"
                                value={convertTo24Hour(activity.startTime)}
                                onChange={(e) => {
                                  const timeValue = e.target.value;
                                  if (timeValue) {
                                    const timeString = formatTo12Hour(timeValue);
                                    updateActivity(day.id, activity.id, 'startTime', timeString);
                                  }
                                }}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                                {activity.startTime}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-600 text-sm mb-2">End Time</label>
                            <div className="relative bg-gray-100 rounded-md">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M12 6L12 12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <input
                                type="time"
                                className="w-full p-2 pl-10 bg-transparent rounded-md appearance-none"
                                value={convertTo24Hour(activity.endTime)}
                                onChange={(e) => {
                                  const timeValue = e.target.value;
                                  if (timeValue) {
                                    const timeString = formatTo12Hour(timeValue);
                                    updateActivity(day.id, activity.id, 'endTime', timeString);
                                  }
                                }}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                                {activity.endTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="w-full p-2 border border-dashed border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 mb-4"
                      onClick={() => addActivity(day.id)}
                    >
                      + Activity
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="w-full p-2 border border-dashed border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 mb-6"
                  onClick={addDay}
                >
                  + Add another day
                </button>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setShowTimelineModal(false)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleSaveTimeline}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );

    const pastTimelineContent = (
      <div className="p-4">
        {timeline.map((item) => (
          <div key={item.id} className="flex mb-2">
            <div className="w-1/3 text-blue-600 font-medium">{item.time}</div>
            <div className="w-2/3 bg-blue-50 p-2 rounded">{item.activity}</div>
          </div>
        ))}
      </div>
    );

    // Return the appropriate timeline content based on status
    const timelineContent =
      activeStatus.toLowerCase() === "pending"
        ? pendingTimelineContent
        : isUpcomingStatus(activeStatus)
          ? upcomingTimelineContent
          : pastTimelineContent;

    return {
      servicesContent,
      venueContent,
      timelineContent,
    };
  };

  const { servicesContent, venueContent, timelineContent } = renderContent();

  // State for active tab
  const [activeTab, setActiveTab] = React.useState<
    "Services" | "Venue Map" | "Timeline"
  >("Services");

  return (
    <div className="bg-white h-fit w-full">
      <div className="flex flex-col gap-5 mx-4">
        {/* Event Name and Description Box */}
        <div className="border border-gray-300 rounded-md p-4 mt-5">
          <div className="mb-2">
            <h2 className="text-blue-600 font-bold text-xl">
              {selectedBooking.title}
            </h2>
            <p className="text-gray-500 text-sm">{selectedBooking.eventType}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              This is a placeholder for the description of the event, this one's
              for the boys with the booming system
            </p>
          </div>

          {/* Event Details Box */}
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium text-sm">
                {formatDateTime(selectedBooking.startDateTime)}
              </p>
              {selectedBooking.startDateTime !== selectedBooking.endDateTime && (
                <p className="font-medium text-sm">
                  to {formatDateTime(selectedBooking.endDateTime)}
                </p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-xs">Organizer</p>
              <p className="font-medium text-sm">{selectedBooking.customer}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Time</p>
              <p className="font-medium text-sm">
                {selectedBooking.startTime} - {selectedBooking.endTime}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Guests</p>
              <p className="font-medium text-sm">{guestsNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-medium text-sm">{selectedBooking.location}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Box */}
        <div className="border-b border-gray-300 flex">
          {["Services", "Venue Map", "Timeline"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as "Services" | "Venue Map" | "Timeline")
              }
              className={`flex-1 py-2 border-none bg-transparent cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="border border-gray-300 rounded-md mb-5">
          {activeTab === "Services" && servicesContent}
          {activeTab === "Venue Map" && venueContent}
          {activeTab === "Timeline" && timelineContent}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
