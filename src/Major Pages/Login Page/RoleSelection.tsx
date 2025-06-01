import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/OrganizerLogo.png";
import { useTheme } from "../../functions/ThemeContext";

// Allowed role keys
const roleKeys = ["individual", "organizer", "vendor"] as const;
type RoleKey = typeof roleKeys[number];

const RoleSelection: React.FC = () => {
	const navigate = useNavigate();
	const { isDarkMode } = useTheme();
	const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);

	// Role mapping based on your role table
	const roleMap: Record<RoleKey, { role_id: string; role_name: string }> = {
		individual: { role_id: "1", role_name: "customer" },
		organizer: { role_id: "2", role_name: "organizer" },
		vendor: { role_id: "3", role_name: "vendor" },
	};

	const handleRoleChange = (role: RoleKey) => {
		setSelectedRole(role);
		// Store role_id and role_name in sessionStorage for use in registration
		if (roleMap[role]) {
			sessionStorage.setItem(
				"selectedRole",
				JSON.stringify({
					role_id: roleMap[role].role_id,
					role_name: roleMap[role].role_name,
				})
			);
		}
	};

	const handleGetStarted = () => {
		if (!selectedRole) return;
		// Also store in registration session for prefill
		const roleInfo = roleMap[selectedRole];
		if (roleInfo) {
			// For individual registration
			if (selectedRole === "individual") {
				sessionStorage.setItem(
					"individualRegistration",
					JSON.stringify({ userRole: roleInfo.role_name, role_id: roleInfo.role_id })
				);
				navigate("/register/individual");
			} else if (selectedRole === "organizer") {
				sessionStorage.setItem(
					"organizerRegistrationData",
					JSON.stringify({ userRole: roleInfo.role_name, role_id: roleInfo.role_id })
				);
				navigate("/register/organizer");
			} else if (selectedRole === "vendor") {
				sessionStorage.setItem(
					"vendorRegistration",
					JSON.stringify({ userRole: roleInfo.role_name, role_id: roleInfo.role_id })
				);
				navigate("/register/vendor");
			}
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
						className="max-w-xs mb-4"
						alt="Logo"
					/>
					<p className="text-lg font-medium mb-2">
						Discover tailored events services.
					</p>
					<p className="text-lg font-medium mb-2">
						Sign up for personalized services today!
					</p>
				</div>

				{/* Right Side - Role Selection */}
				<div
					className={`w-3/5 ${
						isDarkMode ? "bg-black" : "bg-white"
					} p-10 flex flex-col justify-center rounded-l-[50px] shadow-md`}
				>
					<h2
						className={`text-4xl font-bold ${
							isDarkMode ? "text-white" : "text-blue-600"
						} mb-4`}
					>
						Choose Your Role
					</h2>
					<p className={`text-lg mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
						Select the role that best describes you
					</p>

					<div className="space-y-4">
						{roleKeys.map((role) => (
							<div
								key={role}
								className={`p-4 border rounded-lg cursor-pointer transition-all ${
									selectedRole === role
										? isDarkMode
											? "border-blue-500 bg-blue-900/20"
											: "border-blue-500 bg-blue-50"
										: isDarkMode
											? "border-gray-700 hover:border-gray-500"
											: "border-gray-300 hover:border-gray-400"
								}`}
								onClick={() => handleRoleChange(role)}
							>
								<div className="font-medium capitalize">{role}</div>
							</div>
						))}
					</div>

					<div className="mt-8">
						<button
							onClick={handleGetStarted}
							disabled={!selectedRole}
							className={`w-full py-3 rounded-lg text-white font-medium ${
								!selectedRole
									? "bg-gray-400 cursor-not-allowed"
									: isDarkMode
										? "bg-blue-600 hover:bg-blue-700"
										: "bg-blue-600 hover:bg-blue-700"
							}`}
						>
							Get Started
						</button>
					</div>

					<p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
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
