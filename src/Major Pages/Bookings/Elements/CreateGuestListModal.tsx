import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Guest {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  sms: string;
}

interface CreateGuestListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (mode: "manual" | "upload") => void;
}

const CreateGuestListModal: React.FC<CreateGuestListModalProps> = ({ isOpen, onClose, onNext }) => {
  const [selectedMode, setSelectedMode] = useState<"manual" | "upload" | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState<Guest>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    sms: "",
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAddGuest = () => {
    if (newGuest.firstName && newGuest.lastName && newGuest.gender && newGuest.email && newGuest.sms) {
      setGuests([...guests, newGuest]);
      setNewGuest({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        sms: "",
      });
    }
  };

  const handleDeleteGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleEditGuest = (index: number) => {
    setEditingIndex(index);
    setNewGuest(guests[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && newGuest.firstName && newGuest.lastName && newGuest.gender && newGuest.email && newGuest.sms) {
      const updatedGuests = [...guests];
      updatedGuests[editingIndex] = newGuest;
      setGuests(updatedGuests);
      setEditingIndex(null);
      setNewGuest({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        sms: "",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewGuest({
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      sms: "",
    });
  };

  const handleCreateList = () => {
    if (isConfirmed && guests.length > 0) {
      onNext(selectedMode as "manual" | "upload");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/40 backdrop-blur-md flex items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Guest List</h2>
        
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${step === 1 ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-700"} flex items-center justify-center font-bold`}>1</div>
              <span className={`text-xs mt-1 font-medium ${step === 1 ? "text-blue-700" : "text-blue-400"}`}>Mode of Creation</span>
            </div>
            <div className="w-12 h-1 bg-blue-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"} flex items-center justify-center font-bold`}>2</div>
              <span className={`text-xs mt-1 font-medium ${step === 2 ? "text-blue-700" : "text-gray-400"}`}>Creating List</span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className="mb-6">
              <p className="mb-4 text-gray-700 font-medium">How will you create the guest list for this event?</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMode === "manual"}
                    onChange={() => setSelectedMode(selectedMode === "manual" ? null : "manual")}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">I'll be manually encoding the guest's information.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMode === "upload"}
                    onChange={() => setSelectedMode(selectedMode === "upload" ? null : "upload")}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">I'll be uploading an Excel/CSV file containing the guest's information.</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                className="flex-1 border border-gray-300 rounded-md py-2 font-medium text-gray-700 bg-white hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 disabled:bg-blue-200"
                onClick={() => selectedMode && setStep(2)}
                disabled={!selectedMode}
              >
                Next
              </button>
            </div>
          </>
        ) : selectedMode === "manual" ? (
          <>
            <div className="max-h-[300px] overflow-y-auto mb-4">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Gender</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Contact</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest, idx) => (
                    <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm">{guest.firstName} {guest.lastName}</td>
                      <td className="px-3 py-2 text-sm">{guest.gender}</td>
                      <td className="px-3 py-2 text-sm">
                        <div>{guest.email}</div>
                        <div className="text-gray-500 text-xs">{guest.sms}</div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button 
                          className="text-gray-500 hover:text-blue-600 mr-2"
                          onClick={() => handleEditGuest(idx)}
                          title="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteGuest(idx)}
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <input 
                className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]" 
                placeholder="First Name"
                value={newGuest.firstName}
                onChange={(e) => setNewGuest({...newGuest, firstName: e.target.value})}
              />
              <input 
                className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]" 
                placeholder="Last Name"
                value={newGuest.lastName}
                onChange={(e) => setNewGuest({...newGuest, lastName: e.target.value})}
              />
              <select 
                className="border rounded px-2 py-1 text-sm flex-1 min-w-[100px]"
                value={newGuest.gender}
                onChange={(e) => setNewGuest({...newGuest, gender: e.target.value})}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input 
                className="border rounded px-2 py-1 text-sm flex-1 min-w-[150px]" 
                placeholder="Email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
              />
              <input 
                className="border rounded px-2 py-1 text-sm flex-1 min-w-[140px]" 
                placeholder="Phone"
                value={newGuest.sms}
                onChange={(e) => setNewGuest({...newGuest, sms: e.target.value})}
              />
              {editingIndex !== null ? (
                <>
                  <button 
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    onClick={handleSaveEdit}
                    disabled={!newGuest.firstName || !newGuest.lastName || !newGuest.gender || !newGuest.email || !newGuest.sms}
                  >
                    Save
                  </button>
                  <button 
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleAddGuest}
                  disabled={!newGuest.firstName || !newGuest.lastName || !newGuest.gender || !newGuest.email || !newGuest.sms}
                >
                  Add
                </button>
              )}
            </div>

            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-blue-600 mr-2" 
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              <span className="text-xs text-gray-600">I confirm that the guest list is accurate and up to date.</span>
            </div>

            <div className="flex gap-4">
              <button
                className="flex-1 border border-gray-300 rounded-md py-2 font-medium text-gray-700 bg-white hover:bg-gray-100"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="flex-1 bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 disabled:bg-blue-200"
                onClick={handleCreateList}
                disabled={!isConfirmed || guests.length === 0}
              >
                Create Guest List
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8" style={{ minHeight: 220 }}>
              <div className="mb-4">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 0l-3 3m3-3l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-xl font-bold mb-2 text-center">UPLOAD CSV FILE</div>
              <div className="text-xs text-gray-500 mb-4 text-center">
                The uploaded CSV should follow this column format:<br />
                <span className="font-semibold">First Name, Last Name, Gender, Email, SMS</span>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">Upload File</button>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 border border-gray-300 rounded-md py-2 font-medium text-gray-700 bg-white hover:bg-gray-100"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="flex-1 bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 disabled:bg-blue-200"
                disabled
              >
                Create Guest List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGuestListModal; 