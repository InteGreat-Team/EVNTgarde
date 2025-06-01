import { useMemo, useState } from "react"
import { ArrowLeft, FileText, User, Clock } from "lucide-react"

interface FileInfo {
  name: string
  size: string
  type: string
}

interface ServiceInfo {
  name: string
  price: string
  included: boolean
}

interface EventDetailsViewProps {
  event: any
  onBack: () => void
}

export function EventDetailsView({ event, onBack }: EventDetailsViewProps) {
  const [activeTab, setActiveTab] = useState("services")

  const tabs = [
    { id: "services", label: "Services" },
    { id: "venue", label: "Venue Map" },
    { id: "timeline", label: "Timeline" },
  ]

  const budgetNum = useMemo(() => {
    return Number.parseFloat(event.budget?.replace(/[^\d.]/g, "") || "0")
  }, [event.budget])

  const eventServices: ServiceInfo[] = useMemo(() => {
    const allServices = [...(event.services || []), ...(event.customServices || [])]
    const pricePerService =
      budgetNum > 0 && allServices.length > 0
        ? `Php ${((budgetNum * 0.7) / allServices.length).toFixed(0)}`
        : "Php 0"

    return allServices.map((name: string) => ({
      name,
      price: pricePerService,
      included: true,
    }))
  }, [event.services, event.customServices, budgetNum])

  const eventFiles: FileInfo[] =
    event.files?.map((file: File) => ({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.type,
    })) || []

  const calculateBudgetBreakdown = () => {
    if (!budgetNum || eventServices.length === 0) return []

    const baseServiceCost = budgetNum * 0.7
    const additionalCosts = budgetNum * 0.3
    const serviceCost = baseServiceCost / eventServices.length

    const breakdown = [
      ...eventServices.map((s) => ({ name: s.name, amount: `-${serviceCost.toFixed(2)}` })),
      { name: "Venue & Equipment", amount: `-${(additionalCosts * 0.5).toFixed(2)}` },
      { name: "Miscellaneous", amount: `-${(additionalCosts * 0.5).toFixed(2)}` },
    ]

    return breakdown
  }

  const budgetItems = calculateBudgetBreakdown()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          weekday: "long",
        })
  }

  const formatDateCreated = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "services":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Requested Services</h3>
              <p className="text-sm text-gray-600 mb-4">List of requested services by the customer</p>
            </div>
            {eventServices.length > 0 ? (
              <div className="space-y-3">
                {eventServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-blue-600 font-medium">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">{service.price}</div>
                      <div className="text-xs text-gray-500">Inclusive</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No services selected for this event</div>
            )}
          </div>
        )

      case "venue":
        return (
          <div className="space-y-4">
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img src="/placeholder.svg?height=256&width=400" alt="Venue Map" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">{event.location}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Event Type:</span>
                  <div className="font-medium">{event.eventType || "Not specified"}</div>
                </div>
                <div>
                  <span className="text-gray-600">Attire:</span>
                  <div className="font-medium">{event.attire || "Not specified"}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Full Address:</span>
                  <div className="font-medium">{event.location}</div>
                </div>
                <div>
                  <span className="text-gray-600">Expected Guests:</span>
                  <div className="font-medium">{event.guests?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "timeline":
        return (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center max-w-md">
              <p className="text-blue-600 font-medium">
                Your proposal is still under review. Once the organizer accepts it, the event timeline will appear here.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">{event.name?.toUpperCase()}</h1>
              <p className="text-gray-600 mb-1">{event.eventType || "Event"}</p>
              <p className="text-gray-700 mb-4">{event.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Date:</span>
                  <div className="font-medium">
                    {formatDate(event.date)}
                    {event.endDate && event.endDate !== event.date && ` - ${formatDate(event.endDate)}`}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Organizer:</span>
                  <div className="font-medium">{event.organizer || "Organizer Name"}</div>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <div className="font-medium">
                    {event.startTime || "5:30PM"} - {event.endTime || "10:00PM"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Guests:</span>
                  <div className="font-medium">{event.guests?.toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Location:</span>
                  <div className="font-medium">{event.location}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Attached Files */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="font-semibold text-gray-800">Attached Files</h3>
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {eventFiles.length}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Documents and images provided by the customer</p>
              {eventFiles.length > 0 ? (
                <div className="space-y-2">
                  {eventFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">No files attached</div>
              )}
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{event.organizer || "Organizer Name"}</h3>
                  <p className="text-sm text-gray-600">You</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Email</span>
                  <div className="font-medium">{event.organizerEmail || "santo.tomas@gmail.com"}</div>
                </div>
                <div>
                  <span className="text-gray-600">Phone</span>
                  <div className="font-medium">{event.organizerPhone || "0919-683-2398"}</div>
                </div>
              </div>
            </div>

            {/* Hiring Vendors */}
            <div className="bg-gray-800 text-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">Hiring Vendors</h3>
              <p className="text-sm text-gray-300 mb-4">
                You have created this event, please proceed to vendor hiring based on requested services.
              </p>
              <div className="text-sm mb-4">
                <span className="text-gray-400">Date Created</span>
                <div>{formatDateCreated(event.dateCreated || new Date().toISOString())}</div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium">
                Find Vendors
              </button>
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Budget Breakdown</h3>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Total budget</span>
                </div>
                <div className="text-lg font-semibold text-red-600">{event.budget || "Not specified"}</div>
              </div>
              {budgetItems.length > 0 ? (
                <div className="space-y-2">
                  {budgetItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">-</span>
                        </div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm text-red-600">{item.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">No budget breakdown available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
