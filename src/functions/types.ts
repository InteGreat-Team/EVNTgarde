export interface UserData {
    firstName?: string
    lastName?: string
    companyName?: string
    email: string
    phone?: string
    userType: "customer" | "organizer" | "vendor"
    industry?: string
    preferences?: string[]
    vendorType?: "solo" | "company"
    service?: string
  }
  
  export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface RegistrationData extends LoginCredentials {
    userData: UserData
  }
  
  export type RequestStatus = "pending" | "accepted" | "rejected" | "negotiating"

export interface CustomerRequest {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  organization: string
  title: string
  description: string
  location: string
  eventDates: {
    start: string
    end: string
  }
  guestCount: string
  budget: {
    min: number
    max: number
  }
  requirements: string
  status: RequestStatus
  createdAt?: Date
  updatedAt?: Date
  dates: { start: Date; end: Date }[]
  schedule: { date: Date; title: string; description: string; startTime: string; endTime: string }[]
  guestDetails: { expectedCount: string; targetAudience: string }
  serviceRequirements: {
    serviceType: string
    foodStyle: string
    quantity: string
    specification: string
    specialRequirements: string
  }
  customerId: string
}

export interface BudgetProposal {
  id: string
  requestId: string
  services: {
    description: string
    amount: number
  }[]
  totalAmount: number
  description: string
  status: "pending" | "accepted" | "rejected"
  createdAt?: Date
  proposedBy?: "customer" | "organizer"
}

export interface Notification {
  id: string
  userId: string
  userType: "customer" | "organizer"
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  relatedToRequestId?: string
}

export interface User {
  id: string
  type: "customer" | "organizer"
  name: string
  email: string
}
export interface CustomerRegistrationData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNo?: number;
  location?: string;
  password: string;
  customerType: string;
}