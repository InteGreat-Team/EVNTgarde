-- Account Management Group

-- Customer Account Data
CREATE TABLE Customer_Account_Data (
    customer_id VARCHAR PRIMARY KEY,
    customer_first_name VARCHAR,
    customer_middle_name VARCHAR,
    customer_last_name VARCHAR,
    customer_phone_no INTEGER,
    customer_location VARCHAR,
    customer_password VARCHAR NOT NULL,
    customer_system_preferences VARCHAR
);

-- Event Organizer Account Data
CREATE TABLE Event_Organizer_Account_Data (
    organizer_id VARCHAR PRIMARY KEY,
    organizer_company_name VARCHAR,
    organizer_industry VARCHAR,
    organizer_location INTEGER,
    organizer_review_rating VARCHAR,
    organizer_password VARCHAR NOT NULL,
    organizer_system_preferences VARCHAR,
    organizer_logo_url VARCHAR
);

-- Event Organizer Contact Numbers
CREATE TABLE Event_Organizer_Contact_Nums (
    organizer_num VARCHAR PRIMARY KEY,
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id)
);

-- Event Organizer Telephone Numbers
CREATE TABLE Event_Organizer_Tel_Nums (
    organizer_tel_num VARCHAR PRIMARY KEY,
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id)
);

-- Event Organizer Industry
CREATE TABLE Event_Organizer_Industry (
    industry_id VARCHAR PRIMARY KEY,
    industry_name VARCHAR,
    industry_service VARCHAR
);

-- Vendor Account Data
CREATE TABLE Vendor_Account_Data (
    vendor_id VARCHAR PRIMARY KEY,
    vendory_business_name VARCHAR,
    vendor_email VARCHAR,
    vendor_password VARCHAR NOT NULL,
    vendor_location VARCHAR,
    vendor_review_rating DECIMAL,
    vendor_system_preferences VARCHAR,
    vendor_logo_url VARCHAR
);

-- Vendor Services
CREATE TABLE Vendor_Services (
    service_id VARCHAR PRIMARY KEY,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id),
    service_title VARCHAR,
    service_description VARCHAR,
    service_price DECIMAL,
    service_category VARCHAR,
    service_location VARCHAR
);

-- Vendor Contact Numbers
CREATE TABLE Vendor_Contact_Nums (
    vencor_contact_num VARCHAR PRIMARY KEY,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id)
);

-- Vendor Telephone Numbers
CREATE TABLE Vendor_Tel_Nums (
    vencor_telt_num VARCHAR PRIMARY KEY,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id)
);

-- Vendor Social Media
CREATE TABLE Vendor_Socials (
    vendor_social_media_url VARCHAR PRIMARY KEY,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id)
);

-- Vendor Payment Options
CREATE TABLE Vendor_Payment_Options (
    vendor_payment_option_id VARCHAR PRIMARY KEY,
    vendor_payment_option VARCHAR,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id)
);

-- Favorites
CREATE TABLE Favorites (
    favorite_id VARCHAR PRIMARY KEY,
    customer_id VARCHAR REFERENCES Customer_Account_Data(customer_id),
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id),
    favorite_type VARCHAR,
    vendor_card_id VARCHAR,
    organizer_card_id VARCHAR
);

-- Booking Process Group

-- Review Table (defined early as it's referenced by cards)
CREATE TABLE Review (
    review_id VARCHAR PRIMARY KEY,
    review_description VARCHAR,
    rating INTEGER
);

-- Organizer Card
CREATE TABLE Organizer_Card (
    organizer_card_id VARCHAR PRIMARY KEY,
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id), -- EDIT: hindi ko muna ginawang references
    review_id VARCHAR REFERENCES Review(review_id), -- EDIT: hindi ko muna ginawang references
    price VARCHAR,
    is_booked BOOLEAN
);

-- Vendor Card
CREATE TABLE Vendor_Card (
    vendor_card_id VARCHAR PRIMARY KEY,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id),-- EDIT: hindi ko muna ginawang references
    review_id VARCHAR REFERENCES Review(review_id),-- EDIT: hindi ko muna ginawang references
    price VARCHAR,
    is_booked BOOLEAN
);

-- Organizer Booking Requests
CREATE TABLE Organizer_Booking_Requests (
    organizer_request_id Serial PRIMARY KEY,
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id),
    customer_id VARCHAR REFERENCES Customer_Account_Data(customer_id),
    -- request_details VARCHAR,
    event_category VARCHAR,
    event_name VARCHAR,
    event_requirements VARCHAR,
    event_timestamp TIMESTAMP,
    event_location VARCHAR,
    event_budget DECIMAL,
    is_accepted BOOLEAN
);

-- Vendor Booking Requests
CREATE TABLE Vendor_Booking_Requests (
    vendor_request_id VARCHAR PRIMARY KEY,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id),
    event_organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id),
    request_details VARCHAR,
    is_accepted BOOLEAN
);

-- Customer Org Negotiations
CREATE TABLE Customer_Org_Negotiations (
    custorg_negotiation_id VARCHAR PRIMARY KEY,
    customer_id VARCHAR REFERENCES Customer_Account_Data(customer_id),
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id),
    message VARCHAR,
    proposed_amount DECIMAL,
    status INT,
    created_at TIMESTAMP,
    event_venue VARCHAR
);

-- Organizer Vendor Negotiations
CREATE TABLE Organizer_Vendor_Negotiations (
    orgven_negotiation_id VARCHAR PRIMARY KEY,
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id),
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id),
    message VARCHAR,
    proposed_amount DECIMAL,
    status INT,
    created_at TIMESTAMP,
    event_venue VARCHAR
);

-- Notifications
CREATE TABLE Notifications (
    notification_id VARCHAR PRIMARY KEY,
    action_id VARCHAR,
    notification_created_at TIMESTAMP,
    notification_title VARCHAR,
    notification_message VARCHAR,
    notification_is_read BOOLEAN
);

-- Booked Events Group

-- Buildings
CREATE TABLE Buildings (
    building_id VARCHAR PRIMARY KEY,
    building_name VARCHAR,
    floor VARCHAR
);

-- Country
CREATE TABLE Country (
    country_id VARCHAR PRIMARY KEY,
    country_name VARCHAR
);

-- Province
CREATE TABLE Province (
    province_id VARCHAR PRIMARY KEY,
    province_name VARCHAR
);

-- City
CREATE TABLE City (
    city_id VARCHAR PRIMARY KEY,
    city_name VARCHAR,
    province_id VARCHAR REFERENCES Province(province_id),
    country_id VARCHAR REFERENCES Country(country_id)
);

-- Address
CREATE TABLE Address (
    address_id VARCHAR PRIMARY KEY,
    street_address VARCHAR,
    district VARCHAR,
    city_id VARCHAR REFERENCES City(city_id),
    zip_code VARCHAR
);

-- Venue
CREATE TABLE Venue (
    venue_id VARCHAR PRIMARY KEY,
    venue_name VARCHAR,
    building_id VARCHAR REFERENCES Buildings(building_id),
    address_id VARCHAR REFERENCES Address(address_id),
    latitude DECIMAL,
    longitude DECIMAL
);

-- Event Type
CREATE TABLE Event_Type (
    event_type_id VARCHAR PRIMARY KEY,
    event_type_name VARCHAR
);

-- Budget (defined early as it's referenced by Events)
CREATE TABLE Budget (
    budget_id VARCHAR PRIMARY KEY,
    total_budget VARCHAR,
    budget_details VARCHAR,
    event_id VARCHAR
);

-- Events
CREATE TABLE Events (
    event_id VARCHAR PRIMARY KEY,
    event_name VARCHAR,
    event_type_id VARCHAR REFERENCES Event_Type(event_type_id),
    event_desc VARCHAR,
    date DATE,
    venue_id VARCHAR REFERENCES Venue(venue_id),
    budget_id VARCHAR REFERENCES Budget(budget_id),
    organizer_id VARCHAR REFERENCES Event_Organizer_Account_Data(organizer_id),
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id),
    customer_id VARCHAR REFERENCES Customer_Account_Data(customer_id),
    event_status VARCHAR
);

-- Add the foreign key to Budget after Events is created
ALTER TABLE Budget ADD CONSTRAINT fk_budget_event FOREIGN KEY (event_id) REFERENCES Events(event_id);

-- Rejected Events
CREATE TABLE Rejected_Events (
    event_id VARCHAR PRIMARY KEY REFERENCES Events(event_id),
    rejection_reason VARCHAR
);

-- Event Services
CREATE TABLE Event_Services (
    service_id VARCHAR PRIMARY KEY,
    vendor_id VARCHAR REFERENCES Vendor_Account_Data(vendor_id),
    event_id VARCHAR REFERENCES Events(event_id)
);

-- RSVP Tracker
CREATE TABLE RSVP_Tracker (
    rsvp_id VARCHAR PRIMARY KEY,
    event_id VARCHAR REFERENCES Events(event_id),
    customer_id VARCHAR REFERENCES Customer_Account_Data(customer_id),
    status VARCHAR,
    registered_at TIMESTAMP
);

-- Ticket
CREATE TABLE Ticket (
    ticket_id VARCHAR PRIMARY KEY,
    event_id VARCHAR REFERENCES Events(event_id),
    category VARCHAR,
    price DECIMAL,
    available_count INTEGER
);

-- Ticket Sales
CREATE TABLE TicketSales (
    sales_id VARCHAR PRIMARY KEY,
    ticket_id VARCHAR REFERENCES Ticket(ticket_id),
    customer_id VARCHAR REFERENCES Customer_Account_Data(customer_id),
    purchase_date DATE
);

-- Event Summary
CREATE TABLE Event_Summary (
    event_id VARCHAR PRIMARY KEY REFERENCES Events(event_id),
    sales_id VARCHAR REFERENCES TicketSales(sales_id),
    number_of_attendees INTEGER,
    number_of_vendors INTEGER,
    event_date DATE,
    review_id VARCHAR REFERENCES Review(review_id)
);

-- indexes
CREATE INDEX idx_customer_id ON Customer_Account_Data(customer_id);
CREATE INDEX idx_organizer_id ON Event_Organizer_Account_Data(organizer_id);
CREATE INDEX idx_vendor_id ON Vendor_Account_Data(vendor_id);
CREATE INDEX idx_event_id ON Events(event_id);
CREATE INDEX idx_venue_id ON Venue(venue_id);
CREATE INDEX idx_budget_id ON Budget(budget_id);