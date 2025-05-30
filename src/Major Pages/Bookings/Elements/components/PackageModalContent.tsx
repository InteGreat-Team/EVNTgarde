interface PackageModalContentProps {
  selectedRate: string | null
  organizerName: string
  onCloseModal: () => void
  onBookVendor: () => void
}

export function PackageModalContent({
  selectedRate,
  organizerName,
  onCloseModal,
  onBookVendor,
}: PackageModalContentProps) {
  if (selectedRate === "basic-setup") {
    return (
      <div>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-2/3">
            <h3 className="text-lg font-medium mb-2">Your stage. Your crowd. Our sound.</h3>
            <p className="text-gray-700 mb-4">
              At <span className="font-semibold">{organizerName}</span>, we provide reliable and budget-friendly concert
              setup services perfect for small events, bar gigs, or local community shows. This package is designed to
              give you all the essentials to run a smooth live performance—from the first mic check to the last encore.
            </p>
            <p className="text-gray-700">
              Whether you're hosting an indie band night or a mini open-air show, we'll handle the production side while
              you take the spotlight.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Basic Setup Package"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Product Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Sound Equipment</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>2-Way Speakers</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Basic Mixer</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Vocal Microphones</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Lighting Setup</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>LED Par Lights</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Static Spotlights</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Basic Truss System</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Stage Elements</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Platform Setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Drum Riser</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Cable Mats</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Services and Amenities Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Technical Crew</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>1 Sound Technician</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>1 Light Operator</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Setup & Teardown Team</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Logistics Support</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Equipment Delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>On-Site Setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Power Supply Coordination</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Others</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Basic Backdrop</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Standby Microphones</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>1 Hour Soundcheck Session</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Pricing</h3>
            <p className="text-gray-700 text-lg">
              Starts at <span className="font-semibold">PHP 25,000</span>
            </p>
          </div>
          <button
            onClick={onBookVendor}
            className="bg-[#2B579A] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition w-full md:w-auto text-center"
          >
            Book Vendor
          </button>
        </div>
      </div>
    )
  }

  if (selectedRate === "full-production") {
    return (
      <div>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-2/3">
            <h3 className="text-lg font-medium mb-2">Professional production for mid-sized events.</h3>
            <p className="text-gray-700 mb-4">
              At <span className="font-semibold">{organizerName}</span>, our Full Production Package delivers enhanced
              sound and lighting solutions perfect for mid-sized events that require professional quality and reliable
              performance.
            </p>
            <p className="text-gray-700">
              From corporate functions to medium-sized concerts, this package ensures your event has the technical
              excellence and production value to impress your audience.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Full Production Package"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Product Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Sound Equipment</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Full Range Speaker System</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Digital Mixing Console</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Wireless & Wired Microphones</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Stage Monitors</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Lighting Setup</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Moving Head Lights</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>LED Wash Lights</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>DMX Controller</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Fog Machine</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Visual Elements</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>LED Screen (6x8 ft)</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Video Switcher</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Content Management</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Services and Amenities Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Technical Crew</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Sound Engineer</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Lighting Designer</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Video Technician</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Stage Manager</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Logistics Support</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Equipment Transport</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Professional Installation</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Technical Support</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Power Management</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Additional Services</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Event Coordination</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>2 Hour Rehearsal Time</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Basic Recording</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Pricing</h3>
            <p className="text-gray-700 text-lg">
              Starts at <span className="font-semibold">PHP 50,000</span>
            </p>
          </div>
          <button
            onClick={onBookVendor}
            className="bg-[#2B579A] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition w-full md:w-auto text-center"
          >
            Book Vendor
          </button>
        </div>
      </div>
    )
  }

  if (selectedRate === "headliner") {
    return (
      <div>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-2/3">
            <h3 className="text-lg font-medium mb-2">Premium production for headline performances.</h3>
            <p className="text-gray-700 mb-4">
              At <span className="font-semibold">{organizerName}</span>, our Headliner Package delivers top-tier
              production quality for major performances and headline acts that demand excellence.
            </p>
            <p className="text-gray-700">
              This comprehensive package includes premium sound systems, advanced lighting design, and professional crew
              to ensure your headline performance creates an unforgettable experience.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Headliner Package"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Product Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Premium Sound</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Line Array Speaker System</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Subwoofer Array</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Professional Digital Console</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Complete Microphone Package</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>In-Ear Monitoring System</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Advanced Lighting</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Intelligent Moving Fixtures</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>LED Video Walls</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Laser Systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Atmospheric Effects</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Custom Light Programming</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Stage Production</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Custom Stage Design</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Truss Structure</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Stage Risers</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Backdrop & Scenic Elements</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>VIP Area Setup</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Services and Amenities Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Expert Crew</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Lead Sound Engineer</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Lighting Director</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Video Director</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Production Manager</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Premium Support</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Artist Liaison Services</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>VIP Coordination</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Security Coordination</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Backstage Management</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Additional Services</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Live Streaming Setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Professional Recording</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>4 Hour Rehearsal Time</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Pricing</h3>
            <p className="text-gray-700 text-lg">
              Starts at <span className="font-semibold">PHP 100,000</span>
            </p>
          </div>
          <button
            onClick={onBookVendor}
            className="bg-[#2B579A] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition w-full md:w-auto text-center"
          >
            Book Vendor
          </button>
        </div>
      </div>
    )
  }

  if (selectedRate === "festival") {
    return (
      <div>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-2/3">
            <h3 className="text-lg font-medium mb-2">Complete festival production solution.</h3>
            <p className="text-gray-700 mb-4">
              At <span className="font-semibold">{organizerName}</span>, our Festival Package provides comprehensive
              production services for large-scale events with multiple stages, extensive sound and lighting
              requirements, and complex logistics.
            </p>
            <p className="text-gray-700">
              This all-inclusive package handles every technical aspect of your festival, allowing you to focus on
              creating an amazing experience for your attendees.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Festival Package"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Product Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Multiple Stage Setup</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Main Stage Production</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Secondary Stage Setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>DJ Booth/Small Stage</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Backstage Areas</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Festival Infrastructure</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Power Distribution</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Site Lighting</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Audio Distribution Network</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Communication Systems</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Crowd Management</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Barrier Systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>VIP Area Management</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Stage Access Control</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Security Coordination</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Services and Amenities Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Festival Management</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Festival Director</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Stage Managers (Multiple)</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Technical Directors</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Operations Team</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Logistics & Safety</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Site Coordination</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Safety Management</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Emergency Response</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Weather Contingency</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Media & Documentation</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Multi-Camera Recording</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Live Streaming (All Stages)</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Photography Services</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Social Media Integration</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Pricing</h3>
            <p className="text-gray-700 text-lg">
              Starts at <span className="font-semibold">PHP 300,000</span>
            </p>
          </div>
          <button
            onClick={onBookVendor}
            className="bg-[#2B579A] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition w-full md:w-auto text-center"
          >
            Book Vendor
          </button>
        </div>
      </div>
    )
  }

  if (selectedRate === "custom-experience") {
    return (
      <div>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-2/3">
            <h3 className="text-lg font-medium mb-2">Tailored solutions for unique events.</h3>
            <p className="text-gray-700 mb-4">
              At <span className="font-semibold">{organizerName}</span>, our Custom Experience Package is designed for
              clients with specific requirements that don't fit into standard packages. We work closely with you to
              create a tailored solution that perfectly matches your vision and venue.
            </p>
            <p className="text-gray-700">
              Whether you need specialized equipment, unique staging, or creative production elements, our team will
              craft a custom package that delivers exactly what you need.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Custom Experience Package"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Product Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Customized Equipment</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Tailored Sound System</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Custom Lighting Design</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Specialized Visual Elements</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Venue-Specific Solutions</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Creative Services</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Production Design</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Content Creation</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Custom Programming</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Technical Direction</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Specialized Support</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Dedicated Project Manager</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Technical Consultations</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Site Visits & Planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Custom Crew Configuration</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Services and Amenities Inclusions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Consultation & Planning</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Initial Consultation</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Concept Development</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Technical Planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Budget Optimization</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Implementation</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Custom Installation</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Testing & Optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Rehearsal Support</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Live Event Support</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Post-Event</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Performance Analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Content Delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Equipment Breakdown</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Follow-up Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Pricing</h3>
            <p className="text-gray-700 text-lg">
              Starts at <span className="font-semibold">PHP 75,000</span>
            </p>
          </div>
          <button
            onClick={onBookVendor}
            className="bg-[#2B579A] text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition w-full md:w-auto text-center"
          >
            Book Vendor
          </button>
        </div>
      </div>
    )
  }

  return null
}
