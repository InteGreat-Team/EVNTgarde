import React, { useState } from 'react';
import { UploadCloud, UserPlus } from 'lucide-react';

const UserManagement: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'employees' | 'roles'>('employees');

	return (
		<div className="p-6 ml-64">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">User Management</h1>
				<div className="flex gap-3">
					<button className="flex items-center gap-2 border border-[#3061AD] text-[#3061AD] font-medium px-5 py-2 rounded-lg bg-white hover:bg-[#eaf1fa] transition-colors">
						<UploadCloud size={20} />
						Upload Employee List
					</button>
					<button className="flex items-center gap-2 bg-[#3061AD] text-white font-medium px-5 py-2 rounded-lg hover:bg-[#204170] transition-colors">
						<UserPlus size={20} />
						Add Employee
					</button>
				</div>
			</div>
			<div className="w-full max-w-md">
				<div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
					<button
						className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === 'employees' ? 'bg-gray-100' : 'bg-white'}`}
						onClick={() => setActiveTab('employees')}
					>
						Employees
					</button>
					<div className="w-px bg-gray-200" />
					<button
						className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === 'roles' ? 'bg-gray-100' : 'bg-white'}`}
						onClick={() => setActiveTab('roles')}
					>
						Role Management
					</button>
				</div>
			</div>
			<div className="mt-8 bg-white rounded-xl shadow p-8 min-h-[120px]">
				{activeTab === 'employees' && <div>Employees content goes here.</div>}
				{activeTab === 'roles' && <div>Role Management content goes here.</div>}
			</div>
		</div>
	);
};

export default UserManagement;
