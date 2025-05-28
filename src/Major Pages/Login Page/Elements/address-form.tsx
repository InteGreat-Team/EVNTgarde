"use client"

import type React from "react"

interface AddressFormProps {
  houseNo: string
  setHouseNo: (value: string) => void
  street: string
  setStreet: (value: string) => void
  barangay: string
  setBarangay: (value: string) => void
  city: string
  setCity: (value: string) => void
  province: string
  setProvince: (value: string) => void
  zipCode: string
  setZipCode: (value: string) => void
  country: string
  setCountry: (value: string) => void
  setCurrentStep: (step: number) => void
  handleBack: () => void
  error: string
  setError: (error: string) => void
  isDarkMode: boolean
}

const AddressForm: React.FC<AddressFormProps> = ({
  houseNo,
  setHouseNo,
  street,
  setStreet,
  barangay,
  setBarangay,
  city,
  setCity,
  province,
  setProvince,
  zipCode,
  setZipCode,
  country,
  setCountry,
  setCurrentStep,
  handleBack,
  error,
  setError,
  isDarkMode,
}) => {
  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault()

    if (!city) {
      setError("City is required")
      return
    }

    const storedData = sessionStorage.getItem("individualRegistration") || "{}"
    const parsedData = JSON.parse(storedData)

    sessionStorage.setItem(
      "individualRegistration",
      JSON.stringify({
        ...parsedData,
        address: {
          houseNo,
          street,
          barangay,
          city,
          province,
          zipCode,
          country,
        },
      }),
    )

    setCurrentStep(3)
  }

  return (
    <>
      <h2 className="text-4xl font-bold text-blue-600 mt-30 mb-6">Sign Up</h2>
      <p className="text-sm text-blue-600 mb-6">Step 2 of 3</p>

      {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</div>}

      <form className="space-y-4" onSubmit={handleAddressNext}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
              House No. (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., 123"
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
              placeholder="e.g., Maple Street"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
                isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
              }`}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            Barangay
          </label>
          <input
            type="text"
            placeholder="e.g., Barangay San Isidro"
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
              isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
            }`}
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            City
          </label>
          <select
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
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
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            Province
          </label>
          <select
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
              isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
            }`}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
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
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            Zip Code
          </label>
          <input
            type="text"
            placeholder="e.g., 1234"
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
              isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
            }`}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            Country
          </label>
          <select
            className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-blue-500 ${
              isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
            }`}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select your country</option>
            <option value="Philippines">Philippines</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Japan">Japan</option>
            <option value="Singapore">Singapore</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-blue-600 bg-white hover:bg-gray-100 dark:text-blue-400 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            className={`flex-1 px-6 py-3 text-white ${
              isDarkMode ? "bg-gray-800 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-300"
            } rounded-xl shadow-lg overflow-hidden font-poppins`}
          >
            Next
          </button>
        </div>

        <p className={`text-center mt-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </>
  )
}

export default AddressForm
