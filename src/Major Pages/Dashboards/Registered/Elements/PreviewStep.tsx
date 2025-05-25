import { StepProps } from "../../../../functions/types";

export function PreviewStep({ eventData }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-[#3061AD] mb-4">Event Details</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <h4 className="text-sm text-gray-500">Name</h4>
            <p className="font-medium">{eventData.name}</p>
          </div>

          <div className="col-span-2">
            <h4 className="text-sm text-gray-500">Overview</h4>
            <p>{eventData.overview}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Date</h4>
            <p>
              {new Date(eventData.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              to{" "}
              {new Date(eventData.endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Time</h4>
            <p>{eventData.startTime} to {eventData.endTime}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Number of Guest</h4>
            <p>{eventData.numberOfGuests}</p>
          </div>

          <div className="col-span-2">
            <h4 className="text-sm text-gray-500">Address</h4>
            <p>{eventData.location}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Type</h4>
            <p>{eventData.eventType}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Attire</h4>
            <p>{eventData.attire}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-[#3061AD] mb-4">Requested Services</h3>
        <ul className="space-y-2">
          {eventData.services.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
          {eventData.customServices.map((service, index) => (
            <li key={`custom-${index}`}>{service}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#3061AD]">Total Event Budget</h3>
        <p className="text-xl font-semibold text-[#3061AD]">{eventData.budget}</p>
      </div>
    </div>
  );
}