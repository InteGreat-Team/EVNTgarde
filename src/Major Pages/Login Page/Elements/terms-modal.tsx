import type React from "react"

interface TermsModalProps {
  onClose: () => void
  onAccept: () => void
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose, onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">Terms and Conditions</h2>
          <p className="text-sm text-gray-700 text-center">
            By using our platform, you agree to these Terms and Conditions. Please read them carefully.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto text-sm text-gray-800 space-y-4">
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <strong>Acceptance of Terms</strong> By accessing or using EVNTgarde, you agree to be bound by these Terms
              and our Privacy Policy. If you do not agree, please do not use our services.
            </li>

            <li>
              <strong>User Roles and Responsibilities</strong>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Clients: Responsible for providing accurate event details and timely payments.</li>
                <li>Organizers: Must communicate requirements clearly and honor commitments.</li>
                <li>Vendors: Must deliver services as described and adhere to agreed timelines.</li>
              </ul>
            </li>

            <li>
              <strong>Account Registration</strong> You must provide accurate information and keep your account secure.
              You are responsible for all activities under your account.
            </li>

            <li>
              <strong>Payments and Fees</strong> Payments are processed through secure third-party providers. Service
              fees may apply and will be disclosed before confirmation.
            </li>

            <li>
              <strong>Cancellations and Refunds</strong> Cancellation policies vary by vendor. Refund eligibility is
              subject to individual service agreements.
            </li>

            <li>
              <strong>Prohibited Activities</strong> Users may not:
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Misrepresent services or credentials</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Abuse or harass other users</li>
              </ul>
            </li>

            <li>
              <strong>Limitation of Liability</strong> EVNTgarde is not liable for disputes between users or issues with
              third-party services. We provide the platform, but service agreements are between users.
            </li>

            <li>
              <strong>Changes to Terms</strong> We may update these Terms from time to time. Continued use of the
              platform means you accept the revised Terms.
            </li>

            <li>
              <strong>Contact Us</strong> For questions or concerns, contact us at evntgarde@gmail.com.
            </li>
          </ol>

          <p className="mt-4">
            By using EVNTgarde, you acknowledge that you have read, understood, and agree to be bound by these Terms and
            Conditions.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsModal
