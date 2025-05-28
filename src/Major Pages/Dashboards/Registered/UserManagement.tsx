import React, { useState } from 'react';
import { UploadCloud, UserPlus, X } from 'lucide-react';
import Papa from 'papaparse';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'roles'>('employees');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fileError, setFileError] = useState('');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addError, setAddError] = useState('');
  const [smsError, setSmsError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', gender: '', sms: '', email: '', role: '', status: '' });

  const expectedHeaders = ['Name', 'Gender', 'SMS', 'Email', 'Role'];
  const rowsPerPage = 5;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields;
          const missingHeaders = expectedHeaders.filter(h => !headers?.includes(h));
          if (missingHeaders.length > 0) {
            setFileError(`Missing required columns: ${missingHeaders.join(', ')}`);
          } else {
            setFileError('');
            setPreviewData(results.data);
            setCurrentPage(1);
          }
        },
        error: (error) => {
          setFileError(`Error parsing file: ${error.message}`);
        },
      });
    }
  };

  const handleConfirmUpload = () => {
    setUploadedData(previewData);
    setShowUploadModal(false);
    setPreviewData([]);
  };

  const handleAddEmployee = () => {
    let valid = true;
    setAddError('');
    setSmsError('');
    setEmailError('');

    if (!newEmployee.name || !newEmployee.gender || !newEmployee.sms || !newEmployee.email || !newEmployee.role || !newEmployee.status) {
      setAddError('Please fill in all fields.');
      valid = false;
    }

    const smsDigitsOnly = newEmployee.sms.replace(/\D/g, '');
    if (smsDigitsOnly.length !== 11) {
      setSmsError('Contact number must be exactly 11 digits.');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmployee.email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!valid) return;

    setNewEmployee({ name: '', gender: '', sms: '', email: '', role: '', status: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 ml-64 relative">
      <div className={`absolute inset-0 z-40 transition ${showUploadModal || showAddModal ? 'backdrop-blur-sm' : 'pointer-events-none backdrop-blur-0 bg-transparent'}`}></div>
      <div className="relative z-50">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-[#3061AD] text-[#3061AD] font-medium px-5 py-2 rounded-lg bg-white hover:bg-[#eaf1fa] transition-colors" onClick={() => setShowUploadModal(true)}>
              <UploadCloud size={20} /> Upload Employee List
            </button>
            <button className="flex items-center gap-2 bg-[#3061AD] text-white font-medium px-5 py-2 rounded-lg hover:bg-[#204170] transition-colors" onClick={() => setShowAddModal(true)}>
              <UserPlus size={20} /> Add Employee
            </button>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            <button className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === 'employees' ? 'bg-gray-100' : 'bg-white'}`} onClick={() => setActiveTab('employees')}>
              Employees
            </button>
            <div className="w-px bg-gray-200" />
            <button className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === 'roles' ? 'bg-gray-100' : 'bg-white'}`} onClick={() => setActiveTab('roles')}>
              Role Management
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-8 min-h-[120px]">
          {activeTab === 'employees' && (
            <div>
              {uploadedData.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-4">Uploaded Employees:</h3>
                  <ul className="space-y-2">
                    {uploadedData.map((emp, idx) => (
                      <li key={idx} className="border p-3 rounded-lg">
                        {emp.Name} - {emp.Role}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No employee data uploaded.</p>
              )}
            </div>
          )}
          {activeTab === 'roles' && <div>Role Management content goes here.</div>}
        </div>

        {(showUploadModal || showAddModal) && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className={`bg-white rounded-xl shadow-lg w-full ${showAddModal ? 'max-w-md' : 'max-w-3xl'} h-auto p-10 border border-gray-200 relative animate-fadeIn flex flex-col`}>
              <button onClick={() => { setShowUploadModal(false); setShowAddModal(false); setPreviewData([]); }} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>

              {showUploadModal && (
                <>
                  <h2 className="text-2xl font-bold text-center mb-6 text-[#3061AD]">Upload Employee List</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <UploadCloud size={50} className="mx-auto mb-3" />
                    <p className="font-semibold text-lg">UPLOAD CSV FILE</p>
                    <p className="text-sm text-gray-500 mb-5">The uploaded CSV should follow this column format: Name, Gender, SMS, Email, Role</p>
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="fileInput" />
                    <label htmlFor="fileInput" className="inline-block px-8 py-2 bg-[#3061AD] text-white rounded-lg cursor-pointer hover:bg-[#204170]">Browse Files</label>
                    {fileError && <p className="text-red-500 text-sm mt-3">{fileError}</p>}
                  </div>

                  {previewData.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Preview Employees</h3>
                      <div className="overflow-x-auto max-h-[300px]">
                        <table className="min-w-full text-sm text-left border">
                          <thead className="bg-gray-100">
                            <tr>
                              {expectedHeaders.map((header) => (
                                <th key={header} className="px-3 py-2 border">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData
                              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                              .map((emp, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-3 py-1 border">{emp.Name}</td>
                                  <td className="px-3 py-1 border">{emp.Gender}</td>
                                  <td className="px-3 py-1 border">{emp.SMS}</td>
                                  <td className="px-3 py-1 border">{emp.Email}</td>
                                  <td className="px-3 py-1 border">{emp.Role}</td>
                                </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {previewData.length > rowsPerPage && (
                        <div className="flex justify-between items-center mt-4">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-1 border rounded disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <span className="text-sm">
                            Page {currentPage} of {Math.ceil(previewData.length / rowsPerPage)}
                          </span>
                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(previewData.length / rowsPerPage)))}
                            disabled={currentPage === Math.ceil(previewData.length / rowsPerPage)}
                            className="px-4 py-1 border rounded disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => { setShowUploadModal(false); setPreviewData([]); }} className="px-8 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
                    <button onClick={handleConfirmUpload} className="px-8 py-2 bg-[#3061AD] text-white rounded-lg hover:bg-[#204170]">Upload</button>
                  </div>
                </>
              )}

              {showAddModal && (
                <>
                  <h2 className="text-2xl font-bold text-center mb-6 text-[#3061AD]">Add Employee</h2>
                  <form className="space-y-4 flex-1 overflow-y-auto" onSubmit={(e) => { e.preventDefault(); handleAddEmployee(); }}>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input type="text" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Enter Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1"><input type="radio" name="gender" checked={newEmployee.gender === 'Male'} onChange={() => setNewEmployee({ ...newEmployee, gender: 'Male' })} /> Male</label>
                        <label className="flex items-center gap-1"><input type="radio" name="gender" checked={newEmployee.gender === 'Female'} onChange={() => setNewEmployee({ ...newEmployee, gender: 'Female' })} /> Female</label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">SMS</label>
                      <input type="text" value={newEmployee.sms} onChange={(e) => setNewEmployee({ ...newEmployee, sms: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="+63 000 0000 000" />
                      {smsError && <p className="text-red-500 text-sm mt-1">{smsError}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Enter Email" />
                      {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1"><input type="radio" name="role" checked={newEmployee.role === 'Manager'} onChange={() => setNewEmployee({ ...newEmployee, role: 'Manager' })} /> Manager</label>
                        <label className="flex items-center gap-1"><input type="radio" name="role" checked={newEmployee.role === 'Staff'} onChange={() => setNewEmployee({ ...newEmployee, role: 'Staff' })} /> Staff</label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1"><input type="radio" name="status" checked={newEmployee.status === 'Active'} onChange={() => setNewEmployee({ ...newEmployee, status: 'Active' })} /> Active</label>
                        <label className="flex items-center gap-1"><input type="radio" name="status" checked={newEmployee.status === 'Inactive'} onChange={() => setNewEmployee({ ...newEmployee, status: 'Inactive' })} /> Inactive</label>
                      </div>
                    </div>
                    {addError && <p className="text-red-500 text-sm mt-2">{addError}</p>}
                  </form>
                  <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => setShowAddModal(false)} className="px-8 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
                    <button onClick={handleAddEmployee} className="px-8 py-2 bg-[#3061AD] text-white rounded-lg hover:bg-[#204170]">Add</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
