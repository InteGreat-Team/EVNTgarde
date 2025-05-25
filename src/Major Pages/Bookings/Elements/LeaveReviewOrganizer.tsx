// LeaveReviewOrganizer.tsx
import React, { useState } from "react";
import { X, Star, UploadCloud, ChevronDown, ChevronUp } from "lucide-react";

interface LeaveReviewOrganizerProps {
  onClose: () => void;
  mode: "client" | "vendor";
}

const LeaveReviewOrganizer: React.FC<LeaveReviewOrganizerProps> = ({
  onClose,
  mode,
}) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    communication: 0,
    prepared: 0,
    professional: 0,
    price: 0,
  });
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [expandedVendor, setExpandedVendor] = useState("Vendor B");

  const handleRating = (field: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"];

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/40 backdrop-blur-md flex items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="bg-white rounded-md w-full max-w-2xl p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6">
          {mode === "client" ? "Vendor Review" : "Customer Review"}
        </h1>

        <div className="space-y-6">
          {mode === "vendor" ? (
            [
              {
                label: "How would you rate the customer overall?",
                key: "overall",
              },
              {
                label: "Clear and prompt communication?",
                key: "communication",
              },
              { label: "On time and prepared?", key: "prepared" },
              { label: "Professional and respectful?", key: "professional" },
              { label: "Worth the price?", key: "price" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-1"
              >
                <p className="text-slate-800 text-[15px]">{item.label}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      stroke="#d1d5db"
                      fill={
                        ratings[item.key as keyof typeof ratings] >= star
                          ? "#facc15"
                          : "none"
                      }
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      onClick={() =>
                        handleRating(item.key as keyof typeof ratings, star)
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div
                  key={vendor}
                  className={`border border-gray-300 rounded-md ${expandedVendor === vendor ? "pb-4" : "pb-0"}`}
                >
                  <div
                    className="flex justify-between items-center cursor-pointer px-4 py-3"
                    onClick={() =>
                      setExpandedVendor((prev) =>
                        prev === vendor ? "" : vendor
                      )
                    }
                  >
                    <p className="text-slate-800 font-medium">{vendor}</p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          stroke="#d1d5db"
                          fill={ratings.overall >= star ? "#facc15" : "none"}
                          strokeWidth={1.5}
                        />
                      ))}
                      {expandedVendor === vendor ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </div>
                  </div>

                  {expandedVendor === vendor && (
                    <div className="px-6 py-4 space-y-4">
                      {[
                        {
                          label: "Clear and prompt communication?",
                          key: "communication",
                        },
                        { label: "On time and prepared?", key: "prepared" },
                        {
                          label: "Professional and respectful?",
                          key: "professional",
                        },
                        { label: "Worth the price?", key: "price" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between py-1"
                        >
                          <p className="text-slate-800 text-[15px]">
                            {item.label}
                          </p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={24}
                                stroke="#d1d5db"
                                fill={
                                  ratings[item.key as keyof typeof ratings] >=
                                  star
                                    ? "#facc15"
                                    : "none"
                                }
                                strokeWidth={1.5}
                                className="cursor-pointer"
                                onClick={() =>
                                  handleRating(
                                    item.key as keyof typeof ratings,
                                    star
                                  )
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ))}

                      <div>
                        <label className="block text-slate-800 mb-2 font-semibold">
                          Share Your Experience
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Best Event Supplier Ever!"
                          className="w-full border border-gray-300 bg-gray-50 rounded-md px-4 py-2 mb-3 text-sm"
                        />
                        <textarea
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          placeholder="Share your experience with the vendor — what went well, any challenges, and highlights you'd like to mention."
                          className="w-full border border-gray-300 bg-gray-50 rounded-md px-4 py-3 text-sm"
                          rows={4}
                        />
                        <p className="text-sm text-right text-slate-400 mt-1">
                          {
                            experience.trim().split(/\s+/).filter(Boolean)
                              .length
                          }
                          /15 words
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-800 mb-2">
                          Got any event pictures? Upload them here!{" "}
                          <span className="text-sm text-slate-500">
                            (optional)
                          </span>
                        </p>
                        <div className="w-full border border-dashed border-gray-300 bg-gray-50 rounded-md p-6 text-center">
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            id={`fileUpload-${vendor}`}
                          />
                          <label
                            htmlFor={`fileUpload-${vendor}`}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col items-center">
                              <UploadCloud className="w-8 h-8 mb-2 text-blue-800" />
                              <span className="text-sm font-medium text-black">
                                Browse and choose the files you want to upload
                                from your device
                              </span>
                              <span className="text-xs text-slate-500 mt-1">
                                We'd love to see the moments you captured—upload
                                your favorite shot here!
                              </span>
                              <div className="mt-4">
                                <div className="w-8 h-8 bg-blue-800 rounded-md flex items-center justify-center">
                                  <span className="text-white text-xl leading-none">
                                    +
                                  </span>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {mode === "vendor" && (
            <div className="space-y-4">
              <label className="block text-slate-800 mb-2 font-semibold">
                Share Your Experience
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Best Customer Ever!"
                className="w-full border border-gray-300 bg-gray-50 rounded-md px-4 py-2 mb-3 text-sm"
              />
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Share your experience with the customer — what went well, any challenges, and highlights you'd like to mention."
                className="w-full border border-gray-300 bg-gray-50 rounded-md px-4 py-3 text-sm"
                rows={4}
              />
              <p className="text-sm text-right text-slate-400 mt-1">
                {experience.trim().split(/\s+/).filter(Boolean).length}/15 words
              </p>

              <div>
                <p className="text-slate-800 mb-2">
                  Got any event pictures? Upload them here!{" "}
                  <span className="text-sm text-slate-500">(optional)</span>
                </p>
                <div className="w-full border border-dashed border-gray-300 bg-gray-50 rounded-md p-6 text-center">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="fileUpload"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-8 h-8 mb-2 text-blue-800" />
                      <span className="text-sm font-medium text-black">
                        Browse and choose the files you want to upload from your
                        device
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        We'd love to see the moments you captured—upload your
                        favorite shot here!
                      </span>
                      <div className="mt-4">
                        <div className="w-8 h-8 bg-blue-800 rounded-md flex items-center justify-center">
                          <span className="text-white text-xl leading-none">
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={onClose}
              className="w-full border border-red-400 text-red-500 font-medium rounded-md px-4 py-2 hover:bg-red-50"
            >
              Cancel
            </button>
            <button className="w-full bg-blue-700 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-800">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewOrganizer;
