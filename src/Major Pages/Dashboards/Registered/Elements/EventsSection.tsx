import type React from "react"
import { useState } from "react"
import EventManagement from "./EventManagement"
import ServiceInclusion from "./ServiceInclusion"
import EventCarousel from "./EventCarousel"
import { AddServiceModal } from "./AddServiceModal"

type ManagementView = "none" | "events" | "services"

const EventSection: React.FC = () => {
  const [view, setView] = useState<ManagementView>("none")
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (view === "events") {
    return (
      <>
        <EventManagement onBack={() => setView("none")} onAdd={() => setIsModalOpen(true)} />
        {isModalOpen && <AddServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </>
    )
  }

  if (view === "services") {
    return (
      <>
        <ServiceInclusion onBack={() => setView("none")} onAdd={() => setIsModalOpen(true)} />
        {isModalOpen && <AddServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </>
    )
  }

  return (
    <>
      <EventCarousel onManageEvents={() => setView("events")} onManageServices={() => setView("services")} />
      {isModalOpen && <AddServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default EventSection
