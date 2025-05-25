import { Calendar, Clock, Plus, Minus, ChevronDown } from "lucide-react";
import { StepProps } from "../../../../functions/types";

export function EventDetailsStep({ eventData, errors, onInputChange }: StepProps) {
  const incrementGuests = () => {
    onInputChange("numberOfGuests", eventData.numberOfGuests + 1);
  };

  const decrementGuests = () => {
    if (eventData.numberOfGuests > 0) {
      onInputChange("numberOfGuests", eventData.numberOfGuests - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Name
        </label>
        <input
          type="text"
          placeholder="e.g., Annual Business Conference 2025"
          className={`w-full p-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md`}
          value={eventData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">Event name is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Overview
        </label>
        <textarea
          placeholder="Provide an overview of your event. Mention what makes it unique and any important details"
          className={`w-full p-3 border ${errors.overview ? "border-red-500" : "border-gray-300"} rounded-md h-16`}
          value={eventData.overview}
          onChange={(e) => onInputChange("overview", e.target.value)}
        />
        {errors.overview && (
          <p className="text-red-500 text-xs mt-1">Event overview is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="date"
              className={`w-full p-3 border ${errors.startDate ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
              value={eventData.startDate}
              onChange={(e) => onInputChange("startDate", e.target.value)}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">Start date is required</p>
            )}
          </div>
          <span className="text-gray-500">To</span>
          <div className="relative flex-1">
            <input
              type="date"
              className={`w-full p-3 border ${errors.endDate ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
              value={eventData.endDate}
              onChange={(e) => onInputChange("endDate", e.target.value)}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">End date is required</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="time"
              className={`w-full p-3 border ${errors.startTime ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
              value={eventData.startTime}
              onChange={(e) => onInputChange("startTime", e.target.value)}
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1">Start time is required</p>
            )}
          </div>
          <span className="text-gray-500">To</span>
          <div className="relative flex-1">
            <input
              type="time"
              className={`w-full p-3 border ${errors.endTime ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
              value={eventData.endTime}
              onChange={(e) => onInputChange("endTime", e.target.value)}
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            {errors.endTime && (
              <p className="text-red-500 text-xs mt-1">End time is required</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Guests
        </label>
        <div className="flex items-center">
          <button
            className="p-3 border border-gray-300 rounded-l-md"
            onClick={decrementGuests}
          >
            <Minus size={16} />
          </button>
          <input
            type="text"
            className={`flex-1 p-3 border-y ${errors.numberOfGuests ? "border-red-500" : "border-gray-300"} text-center`}
            value={eventData.numberOfGuests || ""}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value) || 0;
              onInputChange("numberOfGuests", value);
            }}
          />
          <button
            className="p-3 border border-gray-300 rounded-r-md"
            onClick={incrementGuests}
          >
            <Plus size={16} />
          </button>
        </div>
        {errors.numberOfGuests && (
          <p className="text-red-500 text-xs mt-1">Number of guests is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Location
        </label>
        <input
          type="text"
          placeholder="Enter Event Location"
          className={`w-full p-3 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded-md`}
          value={eventData.location}
          onChange={(e) => onInputChange("location", e.target.value)}
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">Event location is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Type
        </label>
        <div className="relative">
          <select
            className={`w-full p-3 border ${errors.eventType ? "border-red-500" : "border-gray-300"} rounded-md appearance-none pr-10`}
            value={eventData.eventType}
            onChange={(e) => onInputChange("eventType", e.target.value)}
          >
            <option value="">Choose Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Corporate">Corporate</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Conference">Conference</option>
            <option value="Seminar">Seminar</option>
            <option value="Other">Other</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
        {errors.eventType && (
          <p className="text-red-500 text-xs mt-1">Event type is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attire</label>
        <div className="relative">
          <select
            className={`w-full p-3 border ${errors.attire ? "border-red-500" : "border-gray-300"} rounded-md appearance-none pr-10`}
            value={eventData.attire}
            onChange={(e) => onInputChange("attire", e.target.value)}
          >
            <option value="">Choose an attire</option>
            <option value="Casual">Casual</option>
            <option value="Business Casual">Business Casual</option>
            <option value="Formal">Formal</option>
            <option value="Black Tie">Black Tie</option>
            <option value="White Tie">White Tie</option>
            <option value="Costume">Costume</option>
            <option value="School Uniform">School Uniform</option>
            <option value="Other">Other</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
        {errors.attire && (
          <p className="text-red-500 text-xs mt-1">Attire is required</p>
        )}
      </div>
    </div>
  );
}