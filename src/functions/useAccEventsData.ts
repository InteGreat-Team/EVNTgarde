import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Event, Customer, Organizer, Vendor } from "./accsEventsCollections";

type FirestoreRecord<T> = T & { id: string };

const useAccEventsData = () => {
	const [events, setEvents] = useState<FirestoreRecord<Event>[]>([]);
	const [customers, setCustomers] = useState<FirestoreRecord<Customer>[]>([]);
	const [vendors, setVendors] = useState<FirestoreRecord<Vendor>[]>([]);
	const [organizers, setOrganizers] = useState<FirestoreRecord<Organizer>[]>([]);

	useEffect(() => {
		const eventsRef = collection(db, "events");
		const customersRef = collection(db, "customers");
		const vendorsRef = collection(db, "vendors");
		const organizersRef = collection(db, "organizers");

		const eventsQuery = query(eventsRef, orderBy("eventDate", "desc"));
		const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
			const eventData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...(doc.data() as Event),
			}));
			setEvents(eventData);
		});

		const customersQuery = query(customersRef, orderBy("lastName", "asc"));
		const unsubscribeCustomers = onSnapshot(customersQuery, (snapshot) => {
			const customerData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...(doc.data() as Customer),
			}));
			setCustomers(customerData);
		});

		const vendorsQuery = query(vendorsRef, orderBy("vendorName", "asc"));
		const unsubscribeVendors = onSnapshot(vendorsQuery, (snapshot) => {
			const vendorData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...(doc.data() as Vendor),
			}));
			setVendors(vendorData);
		});

		const organizersQuery = query(organizersRef, orderBy("organizationName", "asc"));
		const unsubscribeOrganizers = onSnapshot(organizersQuery, (snapshot) => {
			const organizerData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...(doc.data() as Organizer),
			}));
			setOrganizers(organizerData);
		});

		return () => {
			unsubscribeEvents();
			unsubscribeCustomers();
			unsubscribeVendors();
			unsubscribeOrganizers();
		};
	}, []);

	return { events, customers, vendors, organizers };
};

export default useAccEventsData;
