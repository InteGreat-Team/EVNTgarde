"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X, Send } from "lucide-react";

interface TableData {
  guestId: string;
  name: string;
  gender: string;
  emailAddress: string;
  contactNumber: string;
  eventStatus: string;
}

interface PaginatedTableProps {
  rsvpCreated: boolean;
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({ rsvpCreated }) => {
  const initialData: TableData[] = [
    {
      guestId: "G1002318",
      name: "John Doe",
      gender: "Male",
      emailAddress: "johndoe@gmail.com",
      contactNumber: "+63 917 123 4567",
      eventStatus: "Pending",
    },
    {
      guestId: "G1002319",
      name: "Jane Smith",
      gender: "Female",
      emailAddress: "jane.smith@email.com",
      contactNumber: "+63 918 987 6543",
      eventStatus: "Going",
    },
    {
      guestId: "G1002316",
      name: "Robert Jones",
      gender: "Male",
      emailAddress: "robert.jones@test.com",
      contactNumber: "+63 919 222 3333",
      eventStatus: "Pending",
    },
    {
      guestId: "G1002317",
      name: "Mary Brown",
      gender: "Female",
      emailAddress: "mary.brown@sample.com",
      contactNumber: "+63 920 444 5555",
      eventStatus: "Not Going",
    },
    {
      guestId: "G1002315",
      name: "Michael Davis",
      gender: "Male",
      emailAddress: "michael.davis@example.com",
      contactNumber: "+63 921 666 7777",
      eventStatus: "Going",
    },
    {
      guestId: "G1002313",
      name: "Jennifer Wilson",
      gender: "Female",
      emailAddress: "jennifer.wilson@domain.com",
      contactNumber: "+63 922 888 9999",
      eventStatus: "Pending",
    },
    {
      guestId: "G1002320",
      name: "David Garcia",
      gender: "Male",
      emailAddress: "david.garcia@email.com",
      contactNumber: "+63 923 111 2222",
      eventStatus: "Going",
    },
    {
      guestId: "G1002321",
      name: "Linda Rodriguez",
      gender: "Female",
      emailAddress: "linda.rodriguez@test.com",
      contactNumber: "+63 924 333 4444",
      eventStatus: "Pending",
    },
    {
      guestId: "G1002322",
      name: "Christopher Williams",
      gender: "Male",
      emailAddress: "chris.williams@sample.com",
      contactNumber: "+63 925 555 6666",
      eventStatus: "Not Going",
    },
    {
      guestId: "G1002323",
      name: "Angela Garcia",
      gender: "Female",
      emailAddress: "angela.garcia@example.com",
      contactNumber: "+63 926 777 8888",
      eventStatus: "Going",
    },
    {
      guestId: "G1002324",
      name: "Brian Martinez",
      gender: "Male",
      emailAddress: "brian.martinez@domain.com",
      contactNumber: "+63 927 999 0000",
      eventStatus: "Pending",
    },
    {
      guestId: "G1002325",
      name: "Nicole Robinson",
      gender: "Female",
      emailAddress: "nicole.robinson@email.com",
      contactNumber: "+63 928 222 1111",
      eventStatus: "Going",
    },
    {
      guestId: "G1002326",
      name: "Kevin Hernandez",
      gender: "Male",
      emailAddress: "kevin.hernandez@test.com",
      contactNumber: "+63 929 444 3333",
      eventStatus: "Pending",
    },
    {
      guestId: "G1002327",
      name: "Stephanie Lopez",
      gender: "Female",
      emailAddress: "stephanie.lopez@sample.com",
      contactNumber: "+63 930 666 5555",
      eventStatus: "Not Going",
    },
    {
      guestId: "G1002328",
      name: "Jason Young",
      gender: "Male",
      emailAddress: "jason.young@example.com",
      contactNumber: "+63 931 888 7777",
      eventStatus: "Going",
    },
  ];

  const data = rsvpCreated
    ? initialData
    : initialData.map((guest) => ({ ...guest, eventStatus: "Pending" }));

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Going":
        return "bg-green-100 text-green-600";
      case "Not Going":
        return "bg-red-100 text-red-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Going":
        return <Check className="w-4 h-4 text-green-500 mr-1" />;
      case "Not Going":
        return <X className="w-4 h-4 text-red-500 mr-1" />;
      case "Pending":
        return <Send className="w-4 h-4 text-yellow-500 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {!rsvpCreated && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((guest) => (
              <tr key={guest.guestId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {guest.guestId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {guest.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {guest.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {guest.emailAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {guest.contactNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                      guest.eventStatus
                    )}`}
                  >
                    {getStatusIcon(guest.eventStatus)}
                    {guest.eventStatus}
                  </span>
                </td>
                {!rsvpCreated && guest.eventStatus === "Pending" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="inline-flex items-center px-3 py-1 border border-yellow-500 text-yellow-600 rounded hover:bg-yellow-50 transition"
                      onClick={() => alert(`Send invite to ${guest.name}`)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send Invite
                    </button>
                  </td>
                )}
                {!rsvpCreated && guest.eventStatus !== "Pending" && <td></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;
