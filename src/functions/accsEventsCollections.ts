export type Loc = {
  venueName?: string; // Only for Events
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export type Event = {
  eventId: string;
  eventName: string;
  eventDescription: string;
  organizerId: string;
  vendorsIds: string[];
  eventDate: Date;
  location: Loc;
  categories: string[];
  attendeeIds: string[];
  created_at: Date;
};

export type Customer = {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  address: Loc;
  registeredEvents: string[];
  favoriteEvents: string[];
  created_at: Date;
};

export type Organizer = {
  description: string;
  industry: string;
  phone: string;
  organizerId: number;
  organizationName: string;
  contactPerson: string;
  image: string;
  email: string;
  phoneNum: string;
  address: Loc;
  price: number;
  eventsOrganized: string[];
  website: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  rating: number;
  created_at: Date;
  availability: {
    startDate: Date;
    endDate: Date;
  };
  timeSlot: string[];
  certifications: string[];
};

export type Vendor = {
  vendorId: string;
  vendorName: string;
  servicesProvided: string[];
  contactPerson: string;
  email: string;
  phoneNum: string;
  address: Loc;
  eventsParticipated: string[];
  ratings: number;
  availability: {
    startDate: Date;
    endDate: Date;
  };
  created_at: Date;
  certifications: string[];
};

