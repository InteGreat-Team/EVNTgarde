import { Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/OrganizerLogo.png";
import { registerUser, signInWithGoogle, signInWithYahoo } from "../../functions/authFunctions";
import { useTheme } from "../../functions/ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";
import { createUserAccount } from "../../functions/userAccount";

type VendorType = "Solo Vendor" | "Company Vendor" | "";

const VendorRegistration: React.FC<{ step: number }> = ({ step = 1 }): React.ReactElement => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(step);
	const { isDarkMode } = useTheme();
	const [showTerms, setShowTerms] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);

	// Step 1 - Vendor Type
	const [vendorType, setVendorType] = useState<VendorType>("");

	// Step 2 - Company Details
	const [companyName, setCompanyName] = useState("");
	const [businessType, setBusinessType] = useState("");
	const [yearsOfExperience, setYearsOfExperience] = useState("");

	// Step 3 - Address Details
	const [houseNo, setHouseNo] = useState("");
	const [street, setStreet] = useState("");
	const [barangay, setBarangay] = useState("");
	const [city, setCity] = useState("");
	const [province, setProvince] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [country, setCountry] = useState("Philippines");

	// Step 4 - Contact and Password
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Form validation errors
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		setCurrentStep(step);
	}, [step]);

	// Password validation
	useEffect(() => {
		const validatePassword = (pass: string): string => {
			if (pass.length < 8) return "Password must be at least 8 characters long.";
			if (!/[A-Z]/.test(pass)) return "Password must include at least one uppercase letter.";
			if (!/\d/.test(pass)) return "Password must include at least one number.";
			if (!/[!@#$%^&*_]/.test(pass)) return "Password must include at least one special character (!@#$%^&*_).";
			return "";
		};

		setPasswordError(validatePassword(password));
	}, [password]);

	// Confirm password validation
	useEffect(() => {
		if (confirmPassword && password !== confirmPassword) {
			setConfirmPasswordError("Passwords do not match.");
		} else {
			setConfirmPasswordError("");
		}
	}, [password, confirmPassword]);

	// Phone number validation
	useEffect(() => {
		if (phoneNumber && phoneNumber.length !== 10) {
			setPhoneError("Phone number must be 10 digits (excluding the +63 prefix).");
		} else {
			setPhoneError("");
		}
	}, [phoneNumber]);

	const handleGetStarted = (): void => {
		if (!vendorType) return;
		setCurrentStep(2);
	};

	const handleNext = (e: React.FormEvent): void => {
		e.preventDefault();
		if (!companyName || !businessType || !yearsOfExperience) {
			setErrors({
				companyName: !companyName ? "Company name is required" : "",
				businessType: !businessType ? "Business type is required" : "",
				yearsOfExperience: !yearsOfExperience ? "Years of experience is required" : "",
			});
			return;
		}
		setCurrentStep(3);
	};

	const handleNextStep2 = (e: React.FormEvent): void => {
		e.preventDefault();
		if (!street || !barangay || !city || !province || !zipCode) {
			setErrors({
				street: !street ? "Street is required" : "",
				barangay: !barangay ? "Barangay is required" : "",
				city: !city ? "City is required" : "",
				province: !province ? "Province is required" : "",
				zipCode: !zipCode ? "Zip code is required" : "",
			});
			return;
		}
		setCurrentStep(4);
	};

	const handleBack = (): void => {
		if (currentStep === 1) {
			navigate("/role-selection");
		} else if (currentStep === 2) {
			setCurrentStep(1);
		} else if (currentStep === 3) {
			setCurrentStep(2);
		} else {
			setCurrentStep(3);
		}
	};

	const handleCreateAccount = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();

		if (!validateStep()) {
			return;
		}

		setIsLoading(true);

		try {
			// Create user account with all collected data
			const userData = createUserAccount("vendor", email, {
				vendorType,
				companyName,
				businessType,
				yearsOfExperience,
				address: {
					houseNo,
					street,
					barangay,
					city,
					province,
					zipCode,
					country,
				},
				phoneNumber: phoneNumber ? `+63${phoneNumber}` : "",
				userType: "vendor"
			});

			// Register user with Firebase and cloud function
			const firebaseUser = await registerUser(email, password, "vendor", userData);
			
			if (!firebaseUser) {
				throw new Error("Registration failed: No Firebase user returned.");
			}

			// Clear session storage
			sessionStorage.removeItem("vendorRegistration");
			navigate("/login");
		} catch (err: any) {
			setErrors({ general: err.message || "Failed to create account. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignUp = async (): Promise<void> => {
		setIsLoading(true);
		setErrors({});
		try {
			await signInWithGoogle("vendor");
			navigate("/vendor");
		} catch (err: any) {
			setErrors({ general: "Failed to sign up with Google. Please try again." });
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleYahooSignUp = async (): Promise<void> => {
		setIsLoading(true);
		setErrors({});
		try {
			await signInWithYahoo("vendor");
			navigate("/vendor");
		} catch (err: any) {
			setErrors({ general: "Failed to sign up with Yahoo. Please try again." });
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const openTermsModal = (): void => {
		setShowTerms(true);
	};

	const closeTermsModal = (): void => {
		setShowTerms(false);
	};

	const acceptTerms = (): void => {
		setTermsAccepted(true);
		closeTermsModal();
	};

	const validateStep = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (currentStep === 1) {
			if (!vendorType) {
				newErrors.vendorType = "Please select a vendor type";
			}
		} else if (currentStep === 2) {
			if (!companyName) {
				newErrors.companyName = "Company name is required";
			}
			if (!businessType) {
				newErrors.businessType = "Business type is required";
			}
			if (!yearsOfExperience) {
				newErrors.yearsOfExperience = "Years of experience is required";
			}
		} else if (currentStep === 3) {
			if (!street) {
				newErrors.street = "Street is required";
			}
			if (!barangay) {
				newErrors.barangay = "Barangay is required";
			}
			if (!city) {
				newErrors.city = "City is required";
			}
			if (!province) {
				newErrors.province = "Province is required";
			}
			if (!zipCode) {
				newErrors.zipCode = "Zip code is required";
			}
		} else if (currentStep === 4) {
			if (!phoneNumber) {
				newErrors.phoneNumber = "Phone number is required";
			} else if (phoneError) {
				newErrors.phoneNumber = phoneError;
			}
			if (!email) {
				newErrors.email = "Email is required";
			}
			if (!password) {
				newErrors.password = "Password is required";
			} else if (passwordError) {
				newErrors.password = passwordError;
			}
			if (!confirmPassword) {
				newErrors.confirmPassword = "Please confirm your password";
			} else if (confirmPasswordError) {
				newErrors.confirmPassword = confirmPasswordError;
			}
			if (!termsAccepted) {
				newErrors.terms = "You must accept the Terms and Conditions";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
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
					<img src={Logo || "/placeholder.svg"} className="max-w-xs mb-4" alt="Logo" />
					<p className="text-lg font-medium mb-2">Discover tailored events services.</p>
					<p className="text-lg font-medium mb-2">Sign up for personalized services today!</p>
				</div>

				{/* Right Side - Form */}
				<div
					className={`w-3/5 ${
						isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"
					} p-12 flex flex-col justify-center rounded-l-[50px] shadow-md relative overflow-y-auto`}
				>
					{/* Step 1: Vendor Type Selection */}
					{currentStep === 1 && (
						<>
							<h2 className="text-4xl font-bold mb-6">Sign Up</h2>
							<p className="text-lg mb-6">
								What type of vendor are you?
								<br />
								<span className="text-sm text-gray-500">
									This helps us tailor our services to your needs.
								</span>
							</p>

							{errors.vendorType && <p className="text-red-500 text-sm mb-2">{errors.vendorType}</p>}

							<div className="space-y-4 mb-8">
								<div
									className={`p-4 border rounded-lg cursor-pointer transition-all ${
										vendorType === "Solo Vendor"
											? isDarkMode
												? "border-blue-500 bg-blue-900/20"
												: "border-blue-500 bg-blue-50"
											: isDarkMode
												? "border-gray-700 hover:border-gray-500"
												: "border-gray-300 hover:border-gray-400"
									}`}
									onClick={() => setVendorType("Solo Vendor")}
								>
									<div className="font-medium">Solo Vendor</div>
									<p className="text-sm text-gray-500 mt-1">
										You operate as an individual or small business
									</p>
								</div>

								<div
									className={`p-4 border rounded-lg cursor-pointer transition-all ${
										vendorType === "Company Vendor"
											? isDarkMode
												? "border-blue-500 bg-blue-900/20"
												: "border-blue-500 bg-blue-50"
											: isDarkMode
												? "border-gray-700 hover:border-gray-500"
												: "border-gray-300 hover:border-gray-400"
									}`}
									onClick={() => setVendorType("Company Vendor")}
								>
									<div className="font-medium">Company Vendor</div>
									<p className="text-sm text-gray-500 mt-1">
										You represent a larger organization or company
									</p>
								</div>
							</div>

							<div className="flex justify-between mt-auto">
								<button
									type="button"
									onClick={handleBack}
									className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
								>
									Back
								</button>
								<button
									type="button"
									onClick={handleGetStarted}
									className={`px-6 py-3 text-white rounded-lg ${
										isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
									}`}
									disabled={!vendorType}
								>
									Next
								</button>
							</div>
						</>
					)}

					{/* Step 2: Company Details */}
					{currentStep === 2 && (
						<>
							<h2 className="text-4xl font-bold mb-6">Sign Up</h2>
							<p className="text-lg mb-2">Step 1 of 3</p>

							{errors.general && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{errors.general}</div>}

							<div className="flex items-center justify-center gap-4 mb-4">
								<button
									type="button"
									onClick={handleGoogleSignUp}
									className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border w-full 
										${
											isDarkMode
												? "bg-black border-gray-600 text-white hover:bg-gray-700"
												: "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
										}`}
									disabled={isLoading}
								>
									<FcGoogle size={20} />
									<span className="font-medium">Sign up with Google</span>
								</button>
								<button
									type="button"
									onClick={handleYahooSignUp}
									className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border w-full
										${
											isDarkMode
												? "bg-black border-gray-600 text-white hover:bg-gray-900"
												: "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
										}`}
									disabled={isLoading}
								>
									<AiFillYahoo size={20} className="text-purple-600" />
									<span className="font-medium">Sign up with Yahoo</span>
								</button>
							</div>

							<div className="relative flex items-center py-2 mb-4">
								<div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}></div>
								<span className={`flex-shrink mx-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>OR</span>
								<div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}></div>
							</div>

							<form className="space-y-4" onSubmit={handleNext}>
								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Company Name
									</label>
									<input
										type="text"
										placeholder="ABC Events"
										className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
											errors.companyName ? "border-red-500" : ""
										} ${
											isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
										}`}
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										required
									/>
									{errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Business Type
									</label>
									<select
										className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											errors.businessType ? "border-red-500" : ""
										} ${
											isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
										}`}
										value={businessType}
										onChange={(e) => setBusinessType(e.target.value)}
										required
									>
										<option value="">Select your business type</option>
										<option value="catering">Catering</option>
										<option value="venue">Venue</option>
										<option value="decoration">Decoration</option>
										<option value="photography">Photography</option>
										<option value="entertainment">Entertainment</option>
										<option value="other">Other</option>
									</select>
									{errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Years of Experience
									</label>
									<select
										className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											errors.yearsOfExperience ? "border-red-500" : ""
										} ${
											isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
										}`}
										value={yearsOfExperience}
										onChange={(e) => setYearsOfExperience(e.target.value)}
										required
									>
										<option value="">Select years of experience</option>
										<option value="0-1">0-1 years</option>
										<option value="1-3">1-3 years</option>
										<option value="3-5">3-5 years</option>
										<option value="5-10">5-10 years</option>
										<option value="10+">10+ years</option>
									</select>
									{errors.yearsOfExperience && (
										<p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>
									)}
								</div>

								<div className="flex justify-between mt-6">
									<button
										type="button"
										onClick={handleBack}
										className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
									>
										Back
									</button>
									<button
										type="submit"
										className={`px-6 py-3 text-white rounded-lg ${
											isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
										}`}
									>
										Next
									</button>
								</div>
							</form>
						</>
					)}

					{/* Step 3: Address Details */}
					{currentStep === 3 && (
						<>
							<h2 className="text-4xl font-bold mb-6">Sign Up</h2>
							<p className="text-lg mb-2">Step 2 of 3</p>

							{errors.general && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{errors.general}</div>}

							<form className="space-y-4" onSubmit={handleNextStep2}>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
											House No. (Optional)
										</label>
										<input
											type="text"
											placeholder="123"
											className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
												isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
											}`}
											value={houseNo}
											onChange={(e) => setHouseNo(e.target.value)}
										/>
									</div>
									<div>
										<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
											Street
										</label>
										<input
											type="text"
											placeholder="Main Street"
											className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
												errors.street ? "border-red-500" : ""
											} ${
												isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
											}`}
											value={street}
											onChange={(e) => setStreet(e.target.value)}
											required
										/>
										{errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
									</div>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Barangay
									</label>
									<input
										type="text"
										placeholder="San Lorenzo"
										className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
											errors.barangay ? "border-red-500" : ""
										} ${
											isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
										}`}
										value={barangay}
										onChange={(e) => setBarangay(e.target.value)}
										required
									/>
									{errors.barangay && <p className="text-red-500 text-sm mt-1">{errors.barangay}</p>}
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										City
									</label>
									<select
										className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											errors.city ? "border-red-500" : ""
										} ${
											isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
										}`}
										value={city}
										onChange={(e) => setCity(e.target.value)}
										required
									>
										<option value="">Select your city</option>
										<option value="Manila">Manila</option>
										<option value="Quezon City">Quezon City</option>
										<option value="Davao City">Davao City</option>
										<option value="Cebu City">Cebu City</option>
										<option value="Makati">Makati</option>
										<option value="Taguig">Taguig</option>
										<option value="Pasig">Pasig</option>
										<option value="Cagayan de Oro">Cagayan de Oro</option>
										<option value="Parañaque">Parañaque</option>
										<option value="Caloocan">Caloocan</option>
										<option value="Iloilo City">Iloilo City</option>
										<option value="Valenzuela">Valenzuela</option>
										<option value="Las Piñas">Las Piñas</option>
										<option value="Pasay">Pasay</option>
										<option value="Muntinlupa">Muntinlupa</option>
										<option value="Other">Other</option>
									</select>
									{errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
											Province
										</label>
										<select
											className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
												errors.province ? "border-red-500" : ""
											} ${
												isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
											}`}
											value={province}
											onChange={(e) => setProvince(e.target.value)}
											required
										>
											<option value="">Select your province</option>
											<option value="Metro Manila">Metro Manila</option>
											<option value="Cavite">Cavite</option>
											<option value="Laguna">Laguna</option>
											<option value="Batangas">Batangas</option>
											<option value="Rizal">Rizal</option>
											<option value="Bulacan">Bulacan</option>
											<option value="Pampanga">Pampanga</option>
											<option value="Cebu">Cebu</option>
											<option value="Davao del Sur">Davao del Sur</option>
											<option value="Iloilo">Iloilo</option>
											<option value="Negros Occidental">Negros Occidental</option>
											<option value="Pangasinan">Pangasinan</option>
											<option value="Bataan">Bataan</option>
											<option value="Zambales">Zambales</option>
											<option value="Nueva Ecija">Nueva Ecija</option>
											<option value="Tarlac">Tarlac</option>
											<option value="Other">Other</option>
										</select>
										{errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
									</div>
									<div>
										<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
											Zip Code
										</label>
										<input
											type="text"
											placeholder="1000"
											className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
												errors.zipCode ? "border-red-500" : ""
											} ${
												isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
											}`}
											value={zipCode}
											onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
											required
										/>
										{errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
									</div>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Country
									</label>
									<select
										className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
										}`}
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										required
										disabled
									>
										<option value="Philippines">Philippines</option>
									</select>
								</div>

								<div className="flex justify-between mt-6">
									<button
										type="button"
										onClick={handleBack}
										className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
									>
										Back
									</button>
									<button
										type="submit"
										className={`px-6 py-3 text-white rounded-lg ${
											isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
										}`}
									>
										Next
									</button>
								</div>
							</form>
						</>
					)}

					{/* Step 4: Contact and Password */}
					{currentStep === 4 && (
						<>
							<h2 className="text-4xl font-bold mb-6">Sign Up</h2>
							<p className="text-lg mb-2">Step 3 of 3</p>

							{errors.general && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{errors.general}</div>}

							<form onSubmit={handleCreateAccount} className="space-y-4">
								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Phone Number (required)
									</label>
									<div className="flex items-center border rounded-md">
										<span className={`px-3 py-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>+63</span>
										<input
											type="text"
											placeholder="9XX XXX XXXX"
											className={`w-full px-4 py-2 rounded-md focus:outline-none ${
												errors.phoneNumber ? "border-red-500" : ""
											} ${
												isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
											}`}
											value={phoneNumber}
											onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
											required
										/>
									</div>
									{errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Company Email Address
									</label>
									<input
										type="email"
										placeholder="company@example.com"
										className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
											errors.email ? "border-red-500" : ""
										} ${
											isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
										}`}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Enter Password
									</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											placeholder="Enter password"
											className={`w-full px-4 py-2 border rounded-md text-sm ${
												errors.password ? "border-red-500" : ""
											} ${
												isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
											}`}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
									{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
										Confirm Password
									</label>
									<div className="relative">
										<input
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Confirm password"
											className={`w-full px-4 py-2 border rounded-md text-sm ${
												errors.confirmPassword ? "border-red-500" : ""
											} ${
												isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
											}`}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										>
											{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
									{errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
								</div>

								<div className="flex items-center mt-4">
									<input
										id="terms"
										type="checkbox"
										className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										checked={termsAccepted}
										onChange={(e) => setTermsAccepted(e.target.checked)}
										required
									/>
									<label htmlFor="terms" className="ml-2 text-sm">
										I agree with the{" "}
										<button type="button" className="text-blue-600 hover:underline" onClick={openTermsModal}>
											Terms and Conditions
										</button>
									</label>
								</div>
								{errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

								<div className="flex justify-between mt-6">
									<button
										type="button"
										onClick={handleBack}
										className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
									>
										Back
									</button>
									<button
										type="submit"
										className={`px-6 py-3 text-white rounded-lg ${
											isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
										}`}
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
										) : (
											"Create Account"
										)}
									</button>
								</div>
							</form>
						</>
					)}

					{/* Terms and Conditions Modal */}
					{showTerms && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div
								className={`w-full max-w-2xl p-6 rounded-lg shadow-lg ${
									isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
								}`}
							>
								<h2 className="text-2xl font-bold mb-4 text-blue-600">Terms and Conditions</h2>

								<div className="max-h-96 overflow-y-auto mb-6 pr-2">
									<p className="mb-4">
										By using our platform, you agree to these Terms and Conditions. Please read them carefully.
									</p>

									<ol className="list-decimal pl-5 space-y-4">
										<li>
											<p className="font-medium">Acceptance of Terms</p>
											<p>
												By accessing or using EVNTgarde, you agree to be bound by these Terms and our Privacy Policy. If
												you do not agree, please do not use our services.
											</p>
										</li>

										<li>
											<p className="font-medium">User Roles and Responsibilities</p>
											<ul className="list-disc pl-5 mt-2">
												<li>Clients: Responsible for providing accurate event details and timely payments.</li>
												<li>Organizers: Must communicate requirements clearly and honor commitments.</li>
												<li>Vendors: Must deliver services as described and adhere to agreed timelines.</li>
											</ul>
										</li>

										<li>
											<p className="font-medium">Account Registration</p>
											<p>
												You must provide accurate information and keep your account secure. You are responsible for all
												activities under your account.
											</p>
										</li>

										<li>
											<p className="font-medium">Payments and Fees</p>
											<p>
												Payments are processed through secure third-party providers. Service fees may apply and will be
												disclosed before confirmation.
											</p>
										</li>
									</ol>
								</div>

								<div className="flex justify-between">
									<button
										onClick={closeTermsModal}
										className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
									>
										Close
									</button>
									<button
										onClick={acceptTerms}
										className={`px-6 py-2 text-white rounded-lg ${
											isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
										}`}
									>
										Accept
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VendorRegistration;