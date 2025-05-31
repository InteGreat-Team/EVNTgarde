import type React from "react";
import { useState } from "react";
import { UploadCloud, UserPlus } from "lucide-react";
import EmployeeTable from "./Elements/EmployeeTable";
import RoleManagement from "./Elements/RoleManagement";
import UploadEmployeeModal from "./Elements/UploadEmployeeModal";
import AddEmployeeModal from "./Elements/AddEmployeeModal";
import DeleteConfirmationModal from "./Elements/DeleteConfirmModal";

interface Employee {
  id: string;
  name: string;
  gender: string;
  sms: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

interface ParsedEmployee {
  name: string;
  gender: string;
  sms: string;
  email: string;
  role: string;
}

const mockEmployees: Employee[] = [
  {
    id: "#EMP01",
    name: "John Doe",
    gender: "Male",
    sms: "+639123456789",
    email: "jd@gmail.com",
    role: "Manager",
    status: "active",
  },
  {
    id: "#EMP02",
    name: "Jane Doe",
    gender: "Female",
    sms: "+639123456789",
    email: "jd1@gmail.com",
    role: "Manager",
    status: "inactive",
  },
  {
    id: "#EMP03",
    name: "Doe Doe",
    gender: "Male",
    sms: "+639123456789",
    email: "dd@gmail.com",
    role: "Staff",
    status: "active",
  },
  {
    id: "#EMP04",
    name: "John John",
    gender: "Male",
    sms: "+639123456789",
    email: "jj@gmail.com",
    role: "Staff",
    status: "active",
  },
  {
    id: "#EMP05",
    name: "Jane Jane",
    gender: "Female",
    sms: "+639123456789",
    email: "jj1@gmail.com",
    role: "Staff",
    status: "inactive",
  },
  {
    id: "#EMP06",
    name: "Jane Jane",
    gender: "Male",
    sms: "+639123456789",
    email: "jd@gmail.com",
    role: "Staff",
    status: "active",
  },
  {
    id: "#EMP07",
    name: "Jane Jane",
    gender: "Female",
    sms: "+639123456789",
    email: "jd1@gmail.com",
    role: "Staff",
    status: "inactive",
  },
  {
    id: "#EMP08",
    name: "Jane Jane",
    gender: "Male",
    sms: "+639123456789",
    email: "dd@gmail.com",
    role: "Staff",
    status: "active",
  },
  {
    id: "#EMP09",
    name: "Jane Jane",
    gender: "Female",
    sms: "+639123456789",
    email: "jj@gmail.com",
    role: "Staff",
    status: "active",
  },
  {
    id: "#EMP10",
    name: "Jane Jane",
    gender: "Female",
    sms: "+639123456789",
    email: "jj1@gmail.com",
    role: "Staff",
    status: "inactive",
  },
  {
    id: "#EMP11",
    name: "John Smith",
    gender: "Male",
    sms: "+639123456789",
    email: "js@gmail.com",
    role: "Staff",
    status: "active",
  },
  {
    id: "#EMP12",
    name: "Sarah Johnson",
    gender: "Female",
    sms: "+639123456789",
    email: "sj@gmail.com",
    role: "Staff",
    status: "active",
  },
];

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"employees" | "roles">(
    "employees"
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const handleFileUpload = (employees: ParsedEmployee[]) => {
    console.log("Employees to upload:", employees);

    // Convert parsed CSV data to Employee objects and add to the list
    const newEmployees: Employee[] = employees.map((emp, index) => ({
      id: `#EMP${String(employees.length + index + 1).padStart(2, "0")}`,
      name: emp.name,
      gender: emp.gender,
      sms: `+63${emp.sms}`,
      email: emp.email,
      role: emp.role,
      status: "active" as "active" | "inactive", // Default to active
    }));

    setEmployees((prev) => [...prev, ...newEmployees]);
    console.log("CSV employees added:", newEmployees);
  };

  const handleAddEmployee = (newEmployee: {
    name: string;
    gender: string;
    sms: string;
    email: string;
    role: string;
    status: string;
  }) => {
    const employee: Employee = {
      id: `#EMP${String(employees.length + 1).padStart(2, "0")}`,
      name: newEmployee.name,
      gender: newEmployee.gender,
      sms: `+63${newEmployee.sms}`,
      email: newEmployee.email,
      role: newEmployee.role,
      status: newEmployee.status as "active" | "inactive",
    };

    setEmployees((prev) => [...prev, employee]);
    console.log("New employee added:", employee);
  };

  const handleEditEmployee = (updatedEmployee: {
    name: string;
    gender: string;
    sms: string;
    email: string;
    role: string;
    status: string;
  }) => {
    if (!editingEmployee) return;

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === editingEmployee.id
          ? {
              ...emp,
              name: updatedEmployee.name,
              gender: updatedEmployee.gender,
              sms: `+63${updatedEmployee.sms}`,
              email: updatedEmployee.email,
              role: updatedEmployee.role,
              status: updatedEmployee.status as "active" | "inactive",
            }
          : emp
      )
    );

    setEditingEmployee(null);
    setIsEditModalOpen(false);
    console.log("Employee updated:", updatedEmployee);
  };

  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return;

    setEmployees((prev) =>
      prev.filter((emp) => emp.id !== employeeToDelete.id)
    );
    setEmployeeToDelete(null);
    setIsDeleteModalOpen(false);
    console.log("Employee deleted:", employeeToDelete);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-6 ml-64">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 border border-[#3061AD] text-[#3061AD] font-medium px-5 py-2 rounded-lg bg-white hover:bg-[#eaf1fa] transition-colors"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadCloud size={20} />
            Upload Employee List
          </button>
          <button
            className="flex items-center gap-2 bg-[#3061AD] text-white font-medium px-5 py-2 rounded-lg hover:bg-[#204170] transition-colors"
            onClick={() => setIsAddEmployeeModalOpen(true)}
          >
            <UserPlus size={20} />
            Add Employee
          </button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
          <button
            className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === "employees" ? "bg-gray-100" : "bg-white"}`}
            onClick={() => setActiveTab("employees")}
          >
            Employees
          </button>
          <div className="w-px bg-gray-200" />
          <button
            className={`flex-1 py-3 text-center font-medium focus:outline-none ${activeTab === "roles" ? "bg-gray-100" : "bg-white"}`}
            onClick={() => setActiveTab("roles")}
          >
            Role Management
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-8">
        {activeTab === "employees" && (
          <EmployeeTable
            employees={employees}
            onEditEmployee={openEditModal}
            onDeleteEmployee={openDeleteModal}
          />
        )}
        {activeTab === "roles" && <RoleManagement />}
      </div>

      <UploadEmployeeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />

      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <AddEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        onAdd={handleEditEmployee}
        isEditMode={true}
        initialData={
          editingEmployee
            ? {
                name: editingEmployee.name,
                gender: editingEmployee.gender,
                sms: editingEmployee.sms.replace("+63", ""),
                email: editingEmployee.email,
                role: editingEmployee.role,
                status: editingEmployee.status,
              }
            : undefined
        }
        title="Edit Employee"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleDeleteEmployee}
        employeeName={employeeToDelete?.name || ""}
      />
    </div>
  );
};

export default UserManagement;
