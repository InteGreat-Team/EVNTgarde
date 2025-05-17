import React, { useRef, useState } from "react"; 

const AttachedFiles: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	const file = e.target.files?.[0];
	if (file) {
	  const isDuplicate = uploadedFiles.some(
		(f) => f.name === file.name && f.size === file.size
	  );
  
	  if (!isDuplicate) {
		setUploadedFiles((prev) => [...prev, file]);
	  } else {
		alert("This file is already uploaded.");
	  }
  
	  e.target.value = ""; 
	}
  };
  
  const handleDelete = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index)); 
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Attached Files</h3>
          <p className="text-sm text-gray-500">Documents and images provided by the customer</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {uploadedFiles.length}
        </span>
      </div>

      <div className="space-y-3">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(index)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-transparent text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
        onClick={handleUploadClick}
      >
        <div className="bg-blue-600 rounded-full p-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span>Upload File</span>
      </button>
    </div>
  );
};

export default AttachedFiles;
