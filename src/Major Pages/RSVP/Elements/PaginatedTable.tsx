"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Check, X, Send } from "lucide-react"
import type { GuestData } from "./rsvp-tracking"

interface PaginatedTableProps {
  rsvpCreated?: boolean
  guestData: GuestData[]
  isCustomerView?: boolean
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({
  rsvpCreated = false,
  guestData = [],
  isCustomerView = false,
}) => {
  const [data, setData] = useState<GuestData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(6)

  // Update data when guestData changes
  useEffect(() => {
    setData(guestData)
  }, [guestData])

  // No filtering, just use the data directly
  const filteredData = data

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Going":
        return "bg-green-100 text-green-600"
      case "Not Going":
        return "bg-red-100 text-red-600"
      case "Pending":
        return "bg-yellow-100 text-yellow-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Get status icon based on status value
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Going":
        return <Check className="w-4 h-4 text-green-500 mr-1" />
      case "Not Going":
        return <X className="w-4 h-4 text-red-500 mr-1" />
      case "Pending":
        return <Send className="w-4 h-4 text-yellow-500 mr-1" />
      default:
        return null
    }
  }

  // Render action column based on status
  const renderActionColumn = (status: string) => {
    if (!rsvpCreated) {
      return <button className="text-blue-500 hover:text-blue-700">Send Invite</button>
    } else {
      return status === "Pending" ? <button className="text-blue-500 hover:text-blue-700">Resend Invite</button> : null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Guest ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Gender
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center"
                  >
                    Event Status
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </th>
                  {!isCustomerView && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.guestId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.emailAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          row.eventStatus,
                        )}`}
                      >
                        {getStatusIcon(row.eventStatus)}
                        <span>{row.eventStatus}</span>
                      </div>
                    </td>
                    {!isCustomerView && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {renderActionColumn(row.eventStatus)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastRow, filteredData.length)}</span> of{" "}
            <span className="font-medium">{filteredData.length}</span> results
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="hidden md:flex space-x-2">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              // Show pages around current page
              let pageNum = i + 1
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i
                }
                if (currentPage > totalPages - 2) {
                  pageNum = totalPages - 4 + i
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <span className="md:hidden text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaginatedTable
