import type React from "react";
import { useMemo, useState, useEffect } from "react";
import { Car, Plus, Trash2 } from "lucide-react";

interface BudgetItem {
  name: string;
  amount: number;
}

interface ServiceEntry {
  id: number;
  name: string;
  cost: string;
}

interface BudgetBreakdownProps {
  items?: BudgetItem[];
  additionalExpenses?: number; // For any expenses not in the items list
  userRole?: "organizer" | "individual" | "vendor"; // Add userRole prop
  activeStatus?: "Pending" | "Upcoming" | "Past" | "Rejected" |  "Cancelled"; // Add activeStatus prop
}

const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  items = [
    { name: "Artist Transportation", amount: -230 },
    { name: "Artist Transportation", amount: -230 },
    { name: "Artist Transportation", amount: -230 },
    { name: "Artist Transportation", amount: -230 },
    { name: "Artist Transportation", amount: -230 },
    { name: "Artist Transportation", amount: -230 },
    { name: "Artist Transportation", amount: -230 },
  ],
  additionalExpenses = 0, // Base expenses
  userRole = "individual", // Default to individual role
  activeStatus = "Upcoming", // Default to upcoming
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([
    { id: 1, name: "", cost: "" },
  ]);
  const [nextId, setNextId] = useState(2);

  // Check if event is in the past
  const isPastEvent = activeStatus === "Past";
  const isUpcomingEvent = activeStatus === "Upcoming";

  // Check if user can add services (only organizer or vendor and not past event)
  const canAddServices =
    (userRole === "organizer" || userRole === "vendor") && !isPastEvent;

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen || isAddServiceModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isAddServiceModalOpen]);

  // Calculate total expenses from items plus any additional expenses
  const totalExpense = useMemo(() => {
    const itemsTotal = items.reduce((sum, item) => {
      // For expenses (negative amounts), we add their absolute value
      const expenseValue =
        item.amount < 0 ? Math.abs(item.amount) : item.amount;
      return sum + expenseValue;
    }, 0);
    return additionalExpenses + itemsTotal;
  }, [items, additionalExpenses]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Update service entry information
  const updateServiceEntry = (
    id: number,
    field: "name" | "cost",
    value: string
  ) => {
    setServiceEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Add another service entry
  const addServiceEntry = () => {
    setServiceEntries((prev) => [...prev, { id: nextId, name: "", cost: "" }]);
    setNextId((prev) => prev + 1);
  };

  // Remove a service entry
  const removeServiceEntry = (id: number) => {
    // Don't remove if it's the only entry
    if (serviceEntries.length <= 1) return;

    setServiceEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Handle adding services
  const handleAddService = () => {
    // Add validation here if needed
    const validEntries = serviceEntries.filter(
      (entry) => entry.name.trim() && entry.cost.trim()
    );

    if (validEntries.length === 0) {
      alert("Please add at least one valid service");
      return;
    }

    // Here you would process the services and add them to your items list
    console.log("Services to add:", validEntries);

    // Close modal and reset
    setIsAddServiceModalOpen(false);
    setServiceEntries([{ id: 1, name: "", cost: "" }]);
    setNextId(2);
  };

  return (
    <>
      {/* Clickable Card */}
      <div
        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="text-lg font-medium mb-2">Budget Breakdown</h3>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Total Expenses</div>
          <div className="text-xl font-bold text-red-600">
            Php {formatCurrency(totalExpense)}
          </div>
        </div>

        {/* Scrollable container for budget items */}
        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1 rounded-full">
                  <Car size={16} className="text-gray-600" />
                </div>
                <span>{item.name}</span>
              </div>
              <span className="text-red-600 font-medium">
                -{formatCurrency(Math.abs(item.amount))}
              </span>
            </div>
          ))}
        </div>

        {isPastEvent && (
          <div className="mt-2 text-xs text-gray-500 italic">
            This event has already passed. Budget information cannot be
            modified.
          </div>
        )}
      </div>

      {/* Budget Breakdown Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h2 className="text-xl font-bold mb-4">Budget Breakdown</h2>

              {/* Total Expense with Wallet Icon */}
              <div className="bg-gray-100 p-4 mb-4 flex items-start">
                <div className="mr-3 mt-0.5">
                  <WalletIcon />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Expense</div>
                  <div className="text-lg font-bold text-red-600">
                    Php {totalExpense.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* List of expenses */}
              <div className="max-h-[300px] overflow-y-auto mb-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-black rounded-full mr-3 flex items-center justify-center">
                        <Car size={14} className="text-white" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-red-600 font-medium">
                      -{formatCurrency(Math.abs(item.amount))}
                    </span>
                  </div>
                ))}
              </div>

              {isPastEvent && (
                <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-600 mb-4">
                  This event has already passed. Budget information cannot be
                  modified.
                </div>
              )}
            </div>

            {/* Footer with buttons */}
            <div className="flex border-t">
              <button
                className="flex-1 py-3 text-center hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                Back
              </button>
              {canAddServices && (
                <button
                  className="flex-1 py-3 text-center text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsAddServiceModalOpen(true);
                  }}
                >
                  Add Service
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {isAddServiceModalOpen && isUpcomingEvent && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <h2 className="text-xl font-bold mb-4">Add New Service</h2>

              {/* Multiple Service Entries */}
              {serviceEntries.map((entry) => (
                <div key={entry.id} className="mb-6">
                  {/* Service Name Input */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="e.g.: Drones"
                      value={entry.name}
                      onChange={(e) =>
                        updateServiceEntry(entry.id, "name", e.target.value)
                      }
                    />
                  </div>

                  {/* Cost Input */}
                  <div className="mb-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Cost (₱)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="e.g: 10,000"
                      value={entry.cost}
                      onChange={(e) =>
                        updateServiceEntry(entry.id, "cost", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                {/* Add Another Service Button */}
                <button
                  className="flex items-center justify-center w-full p-3 border border-blue-600 text-blue-600 rounded-lg"
                  onClick={addServiceEntry}
                >
                  <Plus size={16} className="mr-2" />
                  Add Another Service
                </button>

                {/* Remove Service Button - only show if there's more than one service */}
                {serviceEntries.length > 1 && (
                  <button
                    className="flex items-center justify-center w-full p-3 border border-red-500 text-red-500 rounded-lg"
                    onClick={() =>
                      removeServiceEntry(
                        serviceEntries[serviceEntries.length - 1].id
                      )
                    }
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remove Service
                  </button>
                )}
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="flex border-t">
              <button
                className="flex-1 py-3 text-center hover:bg-gray-50"
                onClick={() => setIsAddServiceModalOpen(false)}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 text-center text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleAddService}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Custom Wallet Icon component that matches the mockup
const WalletIcon = () => (
  <svg
    width="45"
    height="45"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5 6.5H4.5C3.4 6.5 2.5 7.4 2.5 8.5V17.5C2.5 18.6 3.4 19.5 4.5 19.5H19.5C20.6 19.5 21.5 18.6 21.5 17.5V8.5C21.5 7.4 20.6 6.5 19.5 6.5Z"
      stroke="#333333"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M2.5 10.5H21.5"
      stroke="#333333"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="17.5" cy="15.5" r="1" fill="#333333" />
  </svg>
);

export default BudgetBreakdown;
