export type Loc = {
    venueName?: string; // Only for Events
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  export interface Event {
    title: string;
    description: string;
    eventDate: string;
    location: string;
    organizerId: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    guestCount: number;
    budget: {
      min: number;
      max: number;
    };
    requirements: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Customer {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    preferences: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Vendor {
    vendorName: string;
    vendorType: "solo" | "company";
    email: string;
    phoneNumber: string;
    service: string;
    industry: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Organizer {
    organizationName: string;
    email: string;
    phoneNumber: string;
    industry: string;
    events: string[]; // Array of event IDs
    createdAt: string;
    updatedAt: string;
  }
  