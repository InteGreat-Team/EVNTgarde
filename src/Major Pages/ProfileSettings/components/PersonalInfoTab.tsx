import React from "react";

type PasswordErrors = {
    current: string;
    new: string;
    confirm: string;
};

type PersonalInfoTabProps = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    passwordErrors: PasswordErrors;
    onCurrentPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onRevert: () => void;
};

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
    currentPassword,
    newPassword,
    confirmPassword,
    passwordErrors,
    onCurrentPasswordChange,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onSave,
    onRevert,
}) => {
    return (
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
                        onChange={onCurrentPasswordChange}
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
                        onChange={onNewPasswordChange}
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
                        onChange={onConfirmPasswordChange}
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
                    onClick={onRevert}
                >
                    Revert Changes
                </button>
                <button 
                    className="px-6 py-2 rounded bg-blue-600 text-white font-medium"
                    onClick={onSave}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default PersonalInfoTab; 