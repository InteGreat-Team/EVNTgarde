import React from "react";

type ProfileTabProps = {
    profilePic: string;
    onProfilePicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onRevert: () => void;
};

const ProfileTab: React.FC<ProfileTabProps> = ({
    profilePic,
    onProfilePicChange,
    onSave,
    onRevert,
}) => {
    return (
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
                        <input type="file" accept="image/*" className="hidden" onChange={onProfilePicChange} />
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

export default ProfileTab; 