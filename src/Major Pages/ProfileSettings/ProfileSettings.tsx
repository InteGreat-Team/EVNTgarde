import React, { useState } from "react";
import ConfirmationModal from "./components/ConfirmationModal";
import ProfileTab from "./components/ProfileTab";
import PersonalInfoTab from "./components/PersonalInfoTab";
import VerificationTab from "./components/VerificationTab";

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

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
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
				<ProfileTab
					profilePic={profilePic}
					onProfilePicChange={handleProfilePicChange}
					onSave={() => setShowSaveModal(true)}
					onRevert={() => setShowRevertModal(true)}
				/>
			)}

			{activeTab === "Personal Info" && (
				<PersonalInfoTab
					currentPassword={currentPassword}
					newPassword={newPassword}
					confirmPassword={confirmPassword}
					passwordErrors={passwordErrors}
					onCurrentPasswordChange={(e) => setCurrentPassword(e.target.value)}
					onNewPasswordChange={(e) => setNewPassword(e.target.value)}
					onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
					onSave={() => setShowSaveModal(true)}
					onRevert={() => setShowRevertModal(true)}
				/>
			)}

			{activeTab === "Verification" && (
				<VerificationTab
					verificationState={verificationState}
					uploadedFiles={uploadedFiles}
					onFileUpload={handleFileUpload}
					onSubmitVerification={handleSubmitVerification}
					onDeleteFiles={handleDeleteFiles}
					onShowDeleteModal={() => setShowDeleteModal(true)}
				/>
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
