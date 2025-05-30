import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/OrganizerLogo.png";
import { useTheme } from "../../functions/ThemeContext";

const RoleSelection: React.FC = () => {
	const navigate = useNavigate();
	const { isDarkMode } = useTheme();
	const [selectedRole, setSelectedRole] = useState<string | null>(null);

	const handleRoleChange = (role: string) => {
		setSelectedRole(role);
	};

	const handleGetStarted = () => {
		if (selectedRole === "organizer") {
			navigate("/register/organizer");
		} else if (selectedRole === "individual") {
			navigate("/register/individual");
		} else if (selectedRole === "vendor") {
			navigate("/register/vendor");
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-gray-300 font-[Poppins]">
			<div
				className={`flex w-[1440px] h-[650px] ${
					isDarkMode ? "bg-gray-800" : "bg-blue-600"
				} rounded-xl shadow-lg overflow-hidden font-poppins`}
			>
				{/* Left Side - Logo & Text */}
				<div
					className={`w-2/5 ${
						isDarkMode ? "bg-gray-800" : "bg-blue-600"
					} text-white flex flex-col items-center justify-center text-center p-8`}
				>
					<img
						src={Logo || "/placeholder.svg"}
						className="w-52 mb-6"
						alt="Logo"
					/>
					<p className="text-lg font-medium">
						Discover tailored events services.
					</p>
					<p className="text-lg font-medium">
						Sign up for personalized services today!
					</p>
				</div>

				{/* Right Side - Role Selection */}
				<div
					className={`w-3/5 ${
						isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
					} p-10 flex flex-col justify-center rounded-l-[50px] shadow-md`}
				>
					<h2
						className={`text-4xl font-bold ${
							isDarkMode ? "text-white" : "text-gray-800"
						} mb-6`}
					>
						Sign Up
					</h2>

					<div className="mb-6">
						<p
							className={`text-lg ${
								isDarkMode ? "text-white" : "text-gray-700"
							}`}
						>
							What brings you here today?
						</p>
						<p
							className={`text-sm ${
								isDarkMode ? "text-gray-300" : "text-gray-500"
							}`}
						>
							Select the option that best describes your role.
						</p>
					</div>

					<div className="space-y-4 mb-8">
						<label
							className={`flex items-start p-4 border rounded-lg cursor-pointer ${
								selectedRole === "individual"
									? "border-blue-500 bg-gray-500 dark:bg-blue-900/30"
									: "border-gray-300 dark:border-gray-600"
							}`}
						>
							<input
								type="radio"
								name="role"
								className="mt-1 mr-3"
								checked={selectedRole === "individual"}
								onChange={() => handleRoleChange("individual")}
							/>
							<div>
								<p className="font-medium">
									I'm planning an event and need help organizing it
								</p>
							</div>
						</label>

						<label
							className={`flex items-start p-4 border rounded-lg cursor-pointer ${
								selectedRole === "organizer"
									? "border-blue-500 bg-gray-500 dark:bg-blue-900/30"
									: "border-gray-300 dark:border-gray-600"
							}`}
						>
							<input
								type="radio"
								name="role"
								className="mt-1 mr-3"
								checked={selectedRole === "organizer"}
								onChange={() => handleRoleChange("organizer")}
							/>
							<div>
								<p className="font-medium">
									I'm an event organizer looking for vendors and suppliers
								</p>
							</div>
						</label>

						<label
							className={`flex items-start p-4 border rounded-lg cursor-pointer ${
								selectedRole === "vendor"
									? "border-blue-500 bg-gray-500 dark:bg-blue-900/30"
									: "border-gray-300 dark:border-gray-600"
							}`}
						>
							<input
								type="radio"
								name="role"
								className="mt-1 mr-3"
								checked={selectedRole === "vendor"}
								onChange={() => handleRoleChange("vendor")}
							/>
							<div>
								<p className="font-medium">
									I'm a vendor looking to market my business
								</p>
							</div>
						</label>
					</div>

					<button
						onClick={handleGetStarted}
						disabled={!selectedRole}
						className={`w-full py-3 rounded-lg font-semibold text-white ${
							isDarkMode
								? selectedRole
									? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
									: "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
								: selectedRole
								? "bg-blue-600 border-gray-300 text-gray-500 hover:bg-blue-300"
								: "bg-blue-600 hover:bg-blue-300 border-gray-300 text-gray-400 cursor-not-allowed"
						}`}
					>
						Get Started
					</button>

					<p
						className={`text-center mt-4 ${
							isDarkMode ? "text-white" : "text-gray-700"
						}`}
					>
						Already have an account?{" "}
						<a href="/login" className="text-blue-600 hover:underline">
							Log in
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RoleSelection;
