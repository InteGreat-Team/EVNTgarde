import type React from "react"
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, signInWithGoogle, signInWithYahoo } from "../../functions/authFunctions";
import { createUserAccount } from "../../functions/userAccount";
import { useTheme } from "../../functions/ThemeContext";
import AuthLayout from "../Dashboards/Registered/Elements/AuthLayout";
import type { VendorFormData, FormFieldProps, SelectOption } from "../../functions/types";
import VendorDetailsStep from "../Dashboards/Registered/Elements/VendorDetailsStep";

const InputField: React.FC<FormFieldProps & { isDarkMode: boolean }> = ({
  label, type = "text", placeholder, value,  onChange, required = false, children, isDarkMode,
}) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>{label}</label>
    {children || (
      <input type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
          isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    )}
  </div>
)

const SelectField: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  required?: boolean
  isDarkMode: boolean
}> = ({ label, value, onChange, options, required = false, isDarkMode }) => (
  <InputField label={label} value={value} onChange={onChange} required={required} isDarkMode={isDarkMode}>
    <select className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className={isDarkMode ? "text-white" : "text-gray-800"}>
          {option.label}
        </option>
      ))}
    </select>
  </InputField>
)

const ButtonGroup: React.FC<{
  onBack: () => void
  onNext?: () => void
  nextText?: string
  nextDisabled?: boolean
  currentStep: number
  isLoading: boolean
  isDarkMode: boolean
}> = ({ onBack, onNext, nextText = "Next", nextDisabled = false, currentStep, isLoading, isDarkMode }) => (
  <div className="flex justify-center items-center gap-4">
    <button type="button"
      onClick={onBack}
      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
    >
      {currentStep === 1 ? "Start Over" : "Back"}
    </button>
    <button type={onNext ? "button" : "submit"}
      onClick={onNext}
      disabled={nextDisabled}
      className={`flex-1 px-6 py-3 text-white ${
        isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-300"
      } rounded-xl shadow-lg font-poppins flex items-center justify-center`}
    >
      {isLoading && (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />)}
      {nextText}
    </button>
  </div>
)

const PasswordField: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  showPassword: boolean
  onToggleVisibility: () => void
  error?: string
  isDarkMode: boolean
}> = ({ label, value, onChange, placeholder, showPassword, onToggleVisibility, error, isDarkMode }) => (
  <div className="mb-4">
    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>{label}</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md text-sm ${
          error ? "border-red-500" : ""
        } ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={onToggleVisibility}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {error && <p className={`text-sm mt-1 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>{error}</p>}
  </div>
)

const VendorRegistration = ({ step = 1 }: { step: number }) => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [currentStep, setCurrentStep] = useState(step)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasSelectedVendorType, setHasSelectedVendorType] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState<VendorFormData>({
    vendorType: "", vendorName: "", businessOffering: "",
    gender: "", phoneNumber: "", email: "", password: "", confirmPassword: "", address: 
    { buildingId: "", street: "", barangay: "", city: "", province: "", zipCode: "", country: ""},
    termsAccepted: false,
  })

  const cityOptions: SelectOption[] = [
    { value: "", label: "Select your city" },
    { value: "manila", label: "Manila" },
    { value: "quezon-city", label: "Quezon City" },
    { value: "cebu", label: "Cebu" },
    { value: "davao", label: "Davao" },
    { value: "other", label: "Other" },
  ]

  const provinceOptions: SelectOption[] = [
    { value: "", label: "Select your province" },
    { value: "metro-manila", label: "Metro Manila" },
    { value: "cebu", label: "Cebu" },
    { value: "davao", label: "Davao" },
    { value: "other", label: "Other" },
  ]

  const countryOptions: SelectOption[] = [
    { value: "", label: "Select your country" },
    { value: "philippines", label: "Philippines" },
    { value: "other", label: "Other" },
  ]

  useEffect(() => setCurrentStep(step), [step])

  useEffect(() => {
    if (currentStep === 3) {
      const storedData = sessionStorage.getItem("vendorRegistration")
      if (storedData) {
        const data = JSON.parse(storedData)
        setFormData((prev) => ({ ...prev, ...data }))
      }
    }
  }, [currentStep])

  const validatePassword = (pass: string): string => {
    if (pass.length < 12) return "Password must be at least 12 characters long."
    if (!/[A-Z]/.test(pass)) return "Password must include at least one uppercase letter."
    if (!/\d/.test(pass)) return "Password must include at least one number."
    if (!/[!@#$%^&*_]/.test(pass)) return "Password must include at least one special character (!@#$%^&*_)."
    return ""
  }

  const passwordError = validatePassword(formData.password)
  const confirmPasswordError =
    formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match." : ""

  const updateFormData = useCallback((updates: Partial<VendorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateAddress = useCallback((field: keyof VendorFormData["address"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }))
  }, [])

  const handleSocialSignUp = async (provider: "google" | "yahoo") => {
    setIsLoading(true)
    setError("")
    try {
      await (provider === "google" ? signInWithGoogle("vendor") : signInWithYahoo("vendor"))
      navigate("/vendor")
    } catch (err: any) {
      setError(`Failed to sign up with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetStarted = () => {
    if (!formData.vendorType) {
      setError("Please select a vendor type.")
      return
    }
    setHasSelectedVendorType(true)
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.vendorType || !formData.vendorName || !formData.businessOffering) {
      setError("Business name and services offered are required")
      return
    }
    if (formData.vendorType === "solo" && !formData.gender) {
      setError("Please select your gender")
      return
    }
    setError("")
    sessionStorage.setItem("vendorRegistration", JSON.stringify(formData))
    navigate("/register/vendor/step3")
  }

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    const { street, barangay, city, province, country } = formData.address
    if (!street || !barangay || !city || !province || !country) {
      setError("Please fill in all required address fields")
      return
    }
    setError("")
    sessionStorage.setItem("vendorRegistration", JSON.stringify(formData))
    setCurrentStep(4)
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return
    }
    if (passwordError || confirmPasswordError) {
      setError(passwordError || confirmPasswordError)
      return
    }
    setIsLoading(true)
    try {
      const userData = createUserAccount("vendor", formData.email, {
        vendorType: formData.vendorType,
        businessName: formData.vendorName,
        services: formData.businessOffering,
        phoneNumber: formData.phoneNumber ? `+63${formData.phoneNumber}` : "",
        gender: formData.gender,
        address: formData.address,
      })
      await registerUser(formData.email, formData.password, "vendor", userData)
      sessionStorage.removeItem("vendorRegistration")
      navigate("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    const routes = ["/role-selection", "/register/vendor", "/register/vendor/step2"]
    navigate(routes[currentStep - 1] || routes[0])
  }

  const renderStep = () => {
    if (currentStep === 1) {
      if (!hasSelectedVendorType) {
        return (
          <>
            <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Are you a solo vendor or part of a company?</h3>
              <p className="text-lg mb-6">This helps us understand how to showcase your offerings.</p>
              <div className="space-y-4">
                {[
                  { value: "solo", label: "Solo Vendor" },
                  { value: "company", label: "Company Vendor" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer ${
                      formData.vendorType === type.value
                        ? "border-blue-500 bg-gray-500 dark:bg-blue-900/30"
                        : "border-gray-300 dark:border-gray-600"
                    }`}     >
                    <input
                      type="radio"
                      name="vendorType"
                      className="mt-1 mr-3"
                      checked={formData.vendorType === type.value}
                      onChange={() => updateFormData({ vendorType: type.value as "solo" | "company" })}
                    /><p className="font-medium">I'm a {type.label.toLowerCase()}</p></label>
                ))}
              </div>
            </div>
            <ButtonGroup
              onBack={handleBack}
              onNext={handleGetStarted}
              nextText="Get Started"
              currentStep={currentStep}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
            />
          </>
        )
      }
      return (
        <>
          <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">You're a {formData.vendorType} vendor!</h3>
            <p className="text-lg mb-6">  Perfect Pick! Showcase your services/business to organizers. We'll help you get set up right away. </p>
          </div>
          <ButtonGroup
            onBack={handleBack}
            onNext={() => navigate("/register/vendor/step2")}
            nextText="Proceed"
            currentStep={currentStep}
            isLoading={isLoading}
            isDarkMode={isDarkMode}/>
        </>
      )
    }

    if (currentStep === 2) {
      return (
        <VendorDetailsStep
          formData={formData}
          currentStep={currentStep}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          onUpdateFormData={updateFormData}
          onSocialSignUp={handleSocialSignUp}
          onNext={handleNext}
          onBack={handleBack} />
      )}

    if (currentStep === 3) {
      return (
        <>
          <h2 className="text-4xl font-bold mt-4 mb-6">Sign Up</h2>
          <p className="text-xl text-gray-500 mb-6">Step 2 of 3</p>
          <form className="space-y-6" onSubmit={handleNextStep2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Building ID (optional)"
                placeholder="e.g., 123"
                value={formData.address.buildingId}
                onChange={(value) => updateAddress("buildingId", value)}
                isDarkMode={isDarkMode} />
              <InputField
                label="Street"
                placeholder="e.g., Mabini Street"
                value={formData.address.street}
                onChange={(value) => updateAddress("street", value)}
                required
                isDarkMode={isDarkMode}  />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Barangay"
                placeholder="e.g., Barangay San Isidro"
                value={formData.address.barangay}
                onChange={(value) => updateAddress("barangay", value)}
                required
                isDarkMode={isDarkMode}  />
              <SelectField
                label="City"
                value={formData.address.city}
                onChange={(value) => updateAddress("city", value)}
                options={cityOptions}
                required
                isDarkMode={isDarkMode}  />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Province"
                value={formData.address.province}
                onChange={(value) => updateAddress("province", value)}
                options={provinceOptions}
                required
                isDarkMode={isDarkMode} />
                
              <InputField
                label="Zip Code"
                placeholder="e.g., 1100"
                value={formData.address.zipCode}
                onChange={(value) => updateAddress("zipCode", value.replace(/\D/g, ""))}
                required
                isDarkMode={isDarkMode} />
            </div>

            <SelectField
              label="Country"
              value={formData.address.country}
              onChange={(value) => updateAddress("country", value)}
              options={countryOptions}
              required
              isDarkMode={isDarkMode} />

            <ButtonGroup onBack={handleBack} currentStep={currentStep} isLoading={isLoading} isDarkMode={isDarkMode} />
          </form>
        </>
      )
    }

    return ( <>
        <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
        <p className="text-xl text-gray-500 mb-6">Step 3 of 3</p>

        <form onSubmit={handleCreateAccount}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              Phone Number (optional) </label>
            <div className="flex items-center border rounded-md">
              <span className={`px-3 py-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>+63</span>
              <input type="text"
                placeholder="000 0000 000"
                className={`w-full px-4 py-2 rounded-md focus:outline-none ${
                  isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300" }`}
                value={formData.phoneNumber}
                onChange={(e) => updateFormData({ phoneNumber: e.target.value.replace(/\D/g, "") })} />
            </div>
          </div>

          <InputField
            label="Business Email Address"
            type="email"
            placeholder="business@example.com"
            value={formData.email}
            onChange={(value) => updateFormData({ email: value })}
            required
            isDarkMode={isDarkMode} />

          <PasswordField
            label="Enter Password"
            value={formData.password}
            onChange={(value) => updateFormData({ password: value })}
            placeholder="Enter password"
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
            error={passwordError && formData.password ? passwordError : undefined}
            isDarkMode={isDarkMode}/>

          <PasswordField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => updateFormData({ confirmPassword: value })}
            placeholder="Confirm password"
            showPassword={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            error={confirmPasswordError && formData.confirmPassword ? confirmPasswordError : undefined}
            isDarkMode={isDarkMode} />

          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2"
                checked={formData.termsAccepted}
                onChange={(e) => updateFormData({ termsAccepted: e.target.checked })} />
              <span className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"}`}> I agree with{" "}
                <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:underline"> EVNTgarde's Terms and Conditions</button>
              </span>
            </label>
          </div>

          <ButtonGroup
            onBack={handleBack}
            nextText="Create Account"
            nextDisabled={isLoading}
            currentStep={currentStep}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
          /></form></>
    )}

  return (
    <AuthLayout>
      {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}
      {renderStep()}
      <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline"> Log in </a></p>
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-brightness-50">
          <div className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6`} >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Terms and Conditions</h2>
            <div className="mb-6 overflow-y-auto pr-4">
              <p className="mb-4"> By using our platform, you agree to these Terms and Conditions. Please read them carefully.</p>
              <ol className="list-decimal space-y-4 pl-6">
                <li><span className="font-medium">Acceptance of Terms</span> By accessing or using EVNTgarde, you agree to be bound by these Terms and our Privacy Policy.</li>
                <li><span className="font-medium">User Roles and Responsibilities</span> All users must provide accurate information and fulfill their commitments.  </li>
                <li><span className="font-medium">Account Registration</span> You must provide accurate information andkeep your account secure. </li>
                <li><span className="font-medium">Payments and Fees</span> Payments are processed through secure third-party providers.</li>
              </ol>
            </div>
            <div className="flex justify-between mt-auto">
              <button
                type="button" onClick={() => setShowTermsModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 w-full mr-2">
                Close</button>
              <button
                type="button" onClick={() => {
                  updateFormData({ termsAccepted: true })
                  setShowTermsModal(false)
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full ml-2" > Accept</button>
             </div>
          </div>
        </div>
      )}
    </AuthLayout>
  )}

export default VendorRegistration;