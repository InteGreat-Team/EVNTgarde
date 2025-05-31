import React from "react";

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({ isOpen, onClose, onUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-800/40 backdrop-blur-md flex items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative animate-fade-in">
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
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
              <span className="text-xs mt-1 font-medium text-blue-700">Creating List</span>
            </div>
          </div>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center mb-6">
          <div className="mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-2">UPLOAD CSV FILE</p>
          <p className="text-xs text-gray-500 mb-4 text-center">
            The uploaded CSV should follow this column format:<br />
            <span className="font-medium">First Name, Last Name, Gender, Email, SMS</span>
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload File
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex gap-4">
          <button
            className="flex-1 border border-gray-300 rounded-md py-2 font-medium text-gray-700 bg-white hover:bg-gray-100"
            onClick={onClose}
          >
            Back
          </button>
          <button
            className="flex-1 bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700"
            // You can add a handler for creating the guest list after upload
          >
            Create Guest List
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSVModal;