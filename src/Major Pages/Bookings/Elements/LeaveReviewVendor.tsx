import React, { useState } from "react"
import { X, Star, UploadCloud } from "lucide-react"

interface LeaveReviewVendorProps {
  onClose: () => void
}

const LeaveReviewVendor: React.FC<LeaveReviewVendorProps> = ({ onClose }) => {
  const [ratings, setRatings] = useState({
    quality: 0,
    professionalism: 0,
    timeliness: 0,
    costEffectiveness: 0,
    satisfaction: 0,
  })
  const [feedback, setFeedback] = useState("")

  const handleRating = (field: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/40 backdrop-blur-md flex items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="bg-white rounded-md w-full max-w-2xl p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6">Rate Your Vendor</h1>

        <div className="space-y-6">
          {[
            { label: "Service/Output Quality", key: "quality" },
            { label: "Professionalism and Courtesy", key: "professionalism" },
            { label: "Timeliness and Delivery", key: "timeliness" },
            { label: "Cost-Effectiveness", key: "costEffectiveness" },
            { label: "Overall Satisfaction", key: "satisfaction" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-1">
              <p className="text-slate-800 text-[15px]">{item.label}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    stroke="#d1d5db"
                    fill={ratings[item.key as keyof typeof ratings] >= star ? "#facc15" : "none"}
                    strokeWidth={1.5}
                    className="cursor-pointer"
                    onClick={() => handleRating(item.key as keyof typeof ratings, star)}
                  />
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-slate-800 mb-2 font-semibold">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about the vendor's performance. What worked well? What could be improved?"
              className="w-full border border-gray-300 bg-gray-50 rounded-md px-4 py-3 text-sm"
              rows={4}
            />
            <p className="text-sm text-right text-slate-400 mt-1">
              {feedback.trim().split(/\s+/).filter(Boolean).length}/15 words
            </p>
          </div>

          <div>
            <p className="text-slate-800 mb-2">
              Got documentation or photos? Upload here! <span className="text-sm text-slate-500">(optional)</span>
            </p>
            <div className="w-full border border-dashed border-gray-300 bg-gray-50 rounded-md p-6 text-center">
              <input
                type="file"
                multiple
                className="hidden"
                id="vendorFileUpload"
              />
              <label htmlFor="vendorFileUpload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 mb-2 text-blue-800" />
                  <span className="text-sm font-medium text-black">
                    Browse and choose files to upload
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    Help us keep a record of your vendor experience.
                  </span>
                  <div className="mt-4">
                    <div className="w-8 h-8 bg-blue-800 rounded-md flex items-center justify-center">
                      <span className="text-white text-xl leading-none">+</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={onClose}
              className="w-full border border-red-400 text-red-500 font-medium rounded-md px-4 py-2 hover:bg-red-50"
            >
              Cancel
            </button>
            <button
              className="w-full bg-blue-700 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-800"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveReviewVendor
