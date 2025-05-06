import React, { useState } from "react";
import { Pencil, Plus, X, Check } from "lucide-react";

interface IncludedItem {
  section: string;
  bullets: string[];
}

interface EventModalProps {
  title: string;
  intro: string;
  fullDetails: string;
  included: IncludedItem[];
  price: string;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  title,
  intro,
  fullDetails,
  included,
  price,
  onClose,
}) => {
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableIntro, setEditableIntro] = useState(intro);
  const [editableFullDetails, setEditableFullDetails] = useState(fullDetails);
  const [editableIncluded, setEditableIncluded] = useState(included);
  const [editablePrice, setEditablePrice] = useState(price);
  const [editablePackageName, setEditablePackageName] = useState("Full Package");

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [isEditingIncluded, setIsEditingIncluded] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const handleSectionChange = (sectionIdx: number, newValue: string) => {
    const updated = [...editableIncluded];
    updated[sectionIdx].section = newValue;
    setEditableIncluded(updated);
  };

  const handleBulletChange = (sectionIdx: number, bulletIdx: number, newValue: string) => {
    const updated = [...editableIncluded];
    updated[sectionIdx].bullets[bulletIdx] = newValue;
    setEditableIncluded(updated);
  };

  const handleAddBullet = (sectionIdx: number) => {
    const updated = [...editableIncluded];
    updated[sectionIdx].bullets.push("");
    setEditableIncluded(updated);
  };

  const handleAddSection = () => {
    setEditableIncluded([...editableIncluded, { section: "", bullets: [""] }]);
  };

  const handleDeleteBullet = (sectionIdx: number, bulletIdx: number) => {
    const updated = [...editableIncluded];
    updated[sectionIdx].bullets.splice(bulletIdx, 1);
    setEditableIncluded(updated);
  };

  const handleDeleteSection = (sectionIdx: number) => {
    const updated = [...editableIncluded];
    updated.splice(sectionIdx, 1);
    setEditableIncluded(updated);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-8 max-w-3xl w-full relative overflow-y-auto max-h-[95vh] min-h-[80vh]">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        {/* HEADER SECTION EDIT */}
        {isEditingHeader ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[15px] font-semibold mb-1">Service Name</label>
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-[15px] font-semibold mb-1">Subtext</label>
              <input
                type="text"
                value={editableIntro}
                onChange={(e) => setEditableIntro(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-[15px] font-semibold mb-1">Message</label>
              <textarea
                value={editableFullDetails}
                onChange={(e) => setEditableFullDetails(e.target.value)}
                rows={4}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingHeader(false)} className="px-4 py-2 bg-gray-300 rounded">Discard</button>
              <button onClick={() => setIsEditingHeader(false)} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center mb-2 group">
              <h2 className="text-3xl font-bold">{editableTitle}</h2>
              <button className="ml-2 hidden group-hover:inline text-blue-600" onClick={() => setIsEditingHeader(true)}>
                <Pencil size={16} />
              </button>
            </div>
            <p className="text-gray-700 mb-2">{editableIntro}</p>
            <p className="text-gray-600 whitespace-pre-line">{editableFullDetails}</p>
          </div>
        )}

        {/* INCLUDED SECTION EDIT */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">What's included:</h3>
            <button onClick={() => setIsEditingIncluded(!isEditingIncluded)} className="text-blue-600">
              <Pencil size={16} />
            </button>
          </div>
          {isEditingIncluded ? (
            <div className="space-y-6">
              {editableIncluded.map((section, sectionIdx) => (
                <div key={sectionIdx} className="grid grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-[15px] font-semibold mb-1">Service Feature/Inclusion</label>
                    <input
                      value={section.section}
                      onChange={(e) => handleSectionChange(sectionIdx, e.target.value)}
                      className="w-full border rounded p-2"
                    />
                    <button
                      className="text-red-600 mt-1"
                      onClick={() => handleDeleteSection(sectionIdx)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold mb-1">Feature List</label>
                    {section.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleBulletChange(sectionIdx, bulletIdx, e.target.value)}
                          className="w-full border rounded p-2"
                        />
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteBullet(sectionIdx, bulletIdx)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handleAddBullet(sectionIdx)}
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddSection}
              >
                + Add Service Feature
              </button>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsEditingIncluded(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={() => setIsEditingIncluded(false)} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
              </div>
            </div>
          ) : (
            editableIncluded.map((section, sectionIdx) => (
              <div key={sectionIdx} className="mb-10">
                <h4 className="font-semibold mb-4">{section.section}</h4>
                <ul className="list-disc pl-13 space-y-2">
                  {section.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="text-gray-700 mb-3">{bullet}</li>

                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* PRICING SECTION */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-semibold">Pricing</h3>
            <button onClick={() => setIsEditingPrice(!isEditingPrice)} className="text-blue-600">
              <Pencil size={16} />
            </button>
          </div>
          {isEditingPrice ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[15px] font-semibold mb-1">Type</label>
                <input
                  type="text"
                  value={editablePackageName}
                  onChange={(e) => setEditablePackageName(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-[15px] font-semibold mb-1">Amount</label>
                <input
                  type="text"
                  value={editablePrice}
                  onChange={(e) => setEditablePrice(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => setIsEditingPrice(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={() => setIsEditingPrice(false)} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">{editablePackageName}</p>
              <p className="text-sm text-gray-600">
                Starts at <span className="font-semibold text-black">{editablePrice}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
