import React from "react";

type VerificationTabProps = {
    verificationState: 'not_uploaded' | 'uploaded' | 'pending' | 'failed' | 'verified';
    uploadedFiles: File[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmitVerification: () => void;
    onDeleteFiles: () => void;
    onShowDeleteModal: () => void;
};

const VerificationTab: React.FC<VerificationTabProps> = ({
    verificationState,
    uploadedFiles,
    onFileUpload,
    onSubmitVerification,
    onDeleteFiles,
    onShowDeleteModal,
}) => {
    return (
        <div className="mt-8 bg-white rounded-xl shadow p-8">
            {/* Account Verification Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-1">Account Verification</h2>
                <p className="text-xs text-gray-500 mb-4">Upload documents to verify your organization or vendor account</p>
                
                {verificationState === 'not_uploaded' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-12 mb-4">
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        <div className="text-xl font-semibold mb-1">UPLOAD FILE</div>
                        <div className="text-xs text-gray-500 mb-4 text-center">Please upload business registration, licenses, or other verification documents</div>
                        <label className="px-6 py-2 rounded border border-blue-600 text-blue-600 bg-white font-medium cursor-pointer">
                            Upload file
                            <input type="file" className="hidden" multiple onChange={onFileUpload} />
                        </label>
                    </div>
                )}

                {verificationState === 'uploaded' && (
                    <div className="space-y-4">
                        {/* Show uploaded files first */}
                        <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="font-medium">{file.name}</span>
                                        </div>
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                                const newFiles = [...uploadedFiles];
                                                newFiles.splice(index, 1);
                                                if (newFiles.length === 0) {
                                                    onDeleteFiles();
                                                }
                                            }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upload container below the files */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-12 mb-4">
                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                            <div className="text-xl font-semibold mb-1">UPLOAD MORE FILES</div>
                            <div className="text-xs text-gray-500 mb-4 text-center">Upload additional verification documents if needed</div>
                            <label className="px-6 py-2 rounded border border-blue-600 text-blue-600 bg-white font-medium cursor-pointer">
                                Upload file
                                <input type="file" className="hidden" multiple onChange={onFileUpload} />
                            </label>
                        </div>

                        <button 
                            className="w-full px-6 py-2 rounded bg-blue-600 text-white font-medium"
                            onClick={onSubmitVerification}
                        >
                            Submit for Verification
                        </button>
                    </div>
                )}

                {verificationState === 'pending' && (
                    <div className="space-y-4">
                        {/* Uploaded files */}
                        <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="font-medium">{file.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Submitted Successfully message */}
                        <div className="text-center mb-6 pt-8">
                            <div className="text-2xl font-semibold text-blue-700 mb-1">Submitted Successfully!</div>
                            <div className="text-sm text-blue-500">Please wait while we verify your account</div>
                        </div>
                    </div>
                )}

                {verificationState === 'failed' && (
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-medium">{uploadedFiles[0]?.name}</span>
                                </div>
                                <button 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={onShowDeleteModal}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button 
                            className="w-full px-6 py-2 rounded bg-blue-600 text-white font-medium"
                            onClick={onSubmitVerification}
                        >
                            Resubmit for Verification
                        </button>
                    </div>
                )}

                {verificationState === 'verified' && (
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-medium">{uploadedFiles[0]?.name}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Status Section */}
            <div className="mb-2">
                <h2 className="text-lg font-semibold mb-1">Account Status</h2>
                {verificationState === 'pending' ? (
                    <div className="border border-blue-400 rounded-lg flex items-center p-6 mt-2 bg-white">
                        <svg className="w-8 h-8 text-blue-500 mr-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                        </svg>
                        <div>
                            <div className="text-blue-700 font-semibold text-lg">Verification Pending</div>
                            <div className="text-gray-700 text-sm">Your account is pending verification. This process takes 1-3 days.</div>
                        </div>
                    </div>
                ) : verificationState === 'verified' ? (
                    <div className="bg-green-500 rounded-lg flex items-center p-6 mt-2">
                        <svg className="w-8 h-8 text-white mr-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <div className="text-white font-semibold text-lg">Account Verified</div>
                            <div className="text-white text-xs">Your account has been successfully verified.</div>
                        </div>
                    </div>
                ) : verificationState === 'failed' ? (
                    <div className="bg-gray-400 rounded-lg flex items-center p-6 mt-2">
                        <svg className="w-8 h-8 text-white mr-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                        </svg>
                        <div>
                            <div className="text-white font-semibold text-lg">Verification Failed</div>
                            <div className="text-white text-xs">Your verification failed. Please upload new documents.</div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-400 rounded-lg flex items-center p-6 mt-2">
                        <svg className="w-8 h-8 text-white mr-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                        </svg>
                        <div>
                            <div className="text-white font-semibold text-lg">Not Verified</div>
                            <div className="text-white text-xs">Your account is not yet verified. Please submit verification documents to proceed.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationTab; 