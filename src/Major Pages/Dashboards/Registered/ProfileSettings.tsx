import React, { useState } from "react";

type ModalProps = {
	open: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmColor?: string;
};

const ConfirmationModal: React.FC<ModalProps> = ({
	open,
	title,
	message,
	confirmLabel,
	cancelLabel = "Cancel",
	onConfirm,
	onCancel,
	confirmColor = "bg-[#0a4975] hover:bg-[#083a5c]",
}) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Blurred backdrop */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
			
			{/* Modal content */}
			<div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
				<div className="mb-2 font-bold text-[#0a4975] text-lg">{title}</div>
				<div className="mb-6 text-sm text-gray-800">{message}</div>
				<div className="flex gap-2">
					<button
						className="flex-1 border border-gray-300 rounded-lg py-2 font-medium bg-white hover:bg-gray-100 transition-colors"
						onClick={onCancel}
					>
						{cancelLabel}
					</button>
					<button
						className={`flex-1 rounded-lg py-2 font-medium text-white ${confirmColor} transition-colors`}
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

const ProfileSettings: React.FC = () => {
	const [activeTab, setActiveTab] = useState("Profile");
	const [profilePic, setProfilePic] = useState<string>("https://placekitten.com/120/120");
	const [showSaveModal, setShowSaveModal] = useState(false);
	const [showRevertModal, setShowRevertModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Password states
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordErrors, setPasswordErrors] = useState({
		current: "",
		new: "",
		confirm: ""
	});

	// Verification states
	const [verificationState, setVerificationState] = useState<'not_uploaded' | 'uploaded' | 'pending' | 'failed' | 'verified'>('not_uploaded');
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

	const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onload = (ev) => {
				if (ev.target && typeof ev.target.result === "string") {
					setProfilePic(ev.target.result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		// Validate passwords before saving
		if (activeTab === "Personal Info") {
			const errors = {
				current: "",
				new: "",
				confirm: ""
			};

			// Validate current password
			if (!currentPassword) {
				errors.current = "Current password is required";
			}

			// Validate new password
			if (newPassword.length < 12) {
				errors.new = "Password should contain at least 12 characters";
			}

			// Validate confirm password
			if (newPassword !== confirmPassword) {
				errors.confirm = "Passwords do not match";
			}

			setPasswordErrors(errors);

			// If there are any errors, don't proceed with save
			if (errors.current || errors.new || errors.confirm) {
				return;
			}

			// Clear password fields after successful save
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setPasswordErrors({
				current: "",
				new: "",
				confirm: ""
			});
		}

		setShowSaveModal(false);
	};

	const handleRevert = () => {
		// Clear password fields and errors when reverting
		if (activeTab === "Personal Info") {
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setPasswordErrors({
				current: "",
				new: "",
				confirm: ""
			});
		}
		setShowRevertModal(false);
	};

	const handleDelete = () => {
		// Delete logic here
		setShowDeleteModal(false);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setUploadedFiles(files);
			setVerificationState('uploaded');
		}
	};

	const handleSubmitVerification = () => {
		setVerificationState('pending');
	};

	const handleDeleteFiles = () => {
		setUploadedFiles([]);
		setVerificationState('not_uploaded');
		setShowDeleteModal(false);
	};

	return (
		<div className="p-6 ml-64">
			<h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
			<p className="text-gray-600 mb-6">Manage your profile and account details</p>

			<div className="w-full max-w-3xl">
				<div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
					<button
						className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === "Profile" ? "bg-gray-100" : "bg-white"}`}
						onClick={() => setActiveTab("Profile")}
					>
						Profile
					</button>
					<div className="w-px bg-gray-200" />
					<button
						className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === "Personal Info" ? "bg-gray-100" : "bg-white"}`}
						onClick={() => setActiveTab("Personal Info")}
					>
						Personal Info
					</button>
					<div className="w-px bg-gray-200" />
					<button
						className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === "Verification" ? "bg-gray-100" : "bg-white"}`}
						onClick={() => setActiveTab("Verification")}
					>
						Verification
					</button>
				</div>
			</div>

			{activeTab === "Profile" && (
				<div className="mt-8 bg-white rounded-xl shadow p-8">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h2 className="text-lg font-semibold">Profile Information</h2>
							<p className="text-xs text-gray-500">Update your profile details and public information</p>
						</div>
						<span className="text-blue-500 font-medium cursor-pointer">Organizer Account</span>
					</div>
					<div className="grid grid-cols-2 gap-6 mb-6">
						<div>
							<label className="block text-xs font-medium text-gray-600 mb-1">Company Name</label>
							<input type="text" className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500" value="Company A" disabled />
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
							<input type="text" className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500" value="Manager" disabled />
						</div>
					</div>
					<div className="grid grid-cols-3 gap-6 mb-6 items-center">
						<div className="col-span-1 flex flex-col items-center">
							<img src={profilePic} alt="Profile" className="w-36 h-36 rounded-full object-cover mb-2" />
							<label className="text-blue-500 text-base font-medium flex items-center gap-1 cursor-pointer py-2">
								Change photo
								<input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
							</label>
						</div>
						<div className="col-span-2 grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
								<input type="text" className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500" value="Santo" disabled />
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
								<input type="text" className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500" value="Tomas" disabled />
							</div>
							<div className="col-span-2">
								<label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
								<input type="text" className="w-full border rounded-md px-3 py-2" value="Santo Tomas" />
							</div>
							<div className="col-span-2">
								<label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
								<textarea className="w-full border rounded-md px-3 py-2" rows={2}>my_email@gmail.com</textarea>
							</div>
						</div>
					</div>
					<div className="mb-4">
						<h3 className="text-blue-700 font-semibold mb-2">Social Media Links</h3>
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" className="w-6 h-6" />
								<input type="text" className="flex-1 border rounded-md px-3 py-2" placeholder="X/Twitter profile URL" />
							</div>
							<div className="flex items-center gap-2">
								<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" className="w-6 h-6" />
								<input type="text" className="flex-1 border rounded-md px-3 py-2" placeholder="Facebook profile URL" />
							</div>
							<div className="flex items-center gap-2">
								<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" className="w-6 h-6" />
								<input type="text" className="flex-1 border rounded-md px-3 py-2" placeholder="Instagram profile URL" />
							</div>
							<div className="flex items-center gap-2">
								<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
								<input type="text" className="flex-1 border rounded-md px-3 py-2" placeholder="LinkedIn profile URL" />
							</div>
							<div className="flex items-center gap-2">
								<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/internetexplorer.svg" alt="Website" className="w-6 h-6" />
								<input type="text" className="flex-1 border rounded-md px-3 py-2" placeholder="Personal website URL" />
							</div>
						</div>
					</div>
					<div className="flex justify-end gap-4 mt-8">
						<button 
							className="px-6 py-2 rounded border border-blue-600 text-blue-600 bg-white font-medium"
							onClick={() => setShowRevertModal(true)}
						>
							Revert Changes
						</button>
						<button 
							className="px-6 py-2 rounded bg-blue-600 text-white font-medium"
							onClick={() => setShowSaveModal(true)}
						>
							Save Changes
						</button>
					</div>
				</div>
			)}

			{activeTab === "Personal Info" && (
				<div className="mt-8 bg-white rounded-xl shadow p-8">
					{/* Change Password Section */}
					<div className="mb-8">
						<h2 className="text-lg font-semibold mb-1">Change Password</h2>
						<p className="text-xs text-gray-500 mb-4">Update and confirm your new password</p>
						<div className="mb-4">
							<label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
							<input 
								type="password" 
								className={`w-full border rounded-md px-3 py-2 ${passwordErrors.current ? 'border-red-500' : ''}`}
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
							/>
							{passwordErrors.current && (
								<span className="text-xs text-red-500">{passwordErrors.current}</span>
							)}
						</div>
						<div className="mb-4">
							<label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
							<input 
								type="password" 
								className={`w-full border rounded-md px-3 py-2 ${passwordErrors.new ? 'border-red-500' : ''}`}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
							{passwordErrors.new && (
								<span className="text-xs text-red-500">{passwordErrors.new}</span>
							)}
						</div>
						<div className="mb-4">
							<label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
							<input 
								type="password" 
								className={`w-full border rounded-md px-3 py-2 ${passwordErrors.confirm ? 'border-red-500' : ''}`}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							{passwordErrors.confirm && (
								<span className="text-xs text-red-500">{passwordErrors.confirm}</span>
							)}
						</div>
					</div>
					{/* Contact Details Section */}
					<div className="mb-8">
						<h2 className="text-lg font-semibold mb-1">Contact Details</h2>
						<p className="text-xs text-gray-500 mb-4">Update your email and phone number</p>
						<div className="mb-4">
							<label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
							<input type="email" className="w-full border rounded-md px-3 py-2" value="my_email@gmail.com" />
						</div>
						<div className="mb-4">
							<label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
							<input type="text" className="w-full border rounded-md px-3 py-2" value="+9123456789" />
						</div>
					</div>
					{/* Address Information Section */}
					<div className="mb-8">
						<h2 className="text-lg font-semibold mb-1">Address Information</h2>
						<p className="text-xs text-gray-500 mb-4">Update your current address</p>
						<div className="grid grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
								<input type="text" className="w-full border rounded-md px-3 py-2" value="Philippines" />
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-600 mb-1">City</label>
								<input type="text" className="w-full border rounded-md px-3 py-2" value="Malolos" />
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-600 mb-1">Province</label>
								<input type="text" className="w-full border rounded-md px-3 py-2" value="Bulacan" />
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-600 mb-1">Barangay</label>
								<input type="text" className="w-full border rounded-md px-3 py-2" value="ABC" />
							</div>
						</div>
						<div className="mb-4">
							<label className="block text-xs font-medium text-gray-600 mb-1">Street</label>
							<input type="text" className="w-full border rounded-md px-3 py-2" value="123 Street" />
						</div>
					</div>
					<div className="flex justify-end gap-4 mt-8">
						<button 
							className="px-6 py-2 rounded border border-blue-600 text-blue-600 bg-white font-medium"
							onClick={() => setShowRevertModal(true)}
						>
							Revert Changes
						</button>
						<button 
							className="px-6 py-2 rounded bg-blue-600 text-white font-medium"
							onClick={() => setShowSaveModal(true)}
						>
							Save Changes
						</button>
					</div>
				</div>
			)}

			{activeTab === "Verification" && (
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
									<input type="file" className="hidden" multiple onChange={handleFileUpload} />
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
														setUploadedFiles(newFiles);
														if (newFiles.length === 0) {
															setVerificationState('not_uploaded');
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
										<input type="file" className="hidden" multiple onChange={handleFileUpload} />
									</label>
								</div>

								<button 
									className="w-full px-6 py-2 rounded bg-blue-600 text-white font-medium"
									onClick={handleSubmitVerification}
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
											onClick={() => setShowDeleteModal(true)}
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
								</div>
								<button 
									className="w-full px-6 py-2 rounded bg-blue-600 text-white font-medium"
									onClick={handleSubmitVerification}
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
			)}

			<ConfirmationModal
				open={showSaveModal}
				title="Save Changes"
				message="Are you sure you want to save changes?"
				confirmLabel="Save Changes"
				onConfirm={handleSave}
				onCancel={() => setShowSaveModal(false)}
			/>
			<ConfirmationModal
				open={showRevertModal}
				title="Revert Changes?"
				message="Are you sure you want to go back? Unsaved changes will be lost."
				confirmLabel="Revert Changes"
				onConfirm={handleRevert}
				onCancel={() => setShowRevertModal(false)}
			/>
			<ConfirmationModal
				open={showDeleteModal}
				title="Delete Files"
				message="Are you sure you want to delete this file?"
				confirmLabel="Delete"
				confirmColor="bg-red-600 hover:bg-red-700"
				onConfirm={handleDeleteFiles}
				onCancel={() => setShowDeleteModal(false)}
			/>
		</div>
	);
};

export default ProfileSettings;
