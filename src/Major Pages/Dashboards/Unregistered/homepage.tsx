import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
//import { searchAndFilterItems } from "../../../functions/search";
//import { ThemeToggle } from "../Registered/Elements/theme-toggle";
import { ThemeToggle } from "../../../functions/ThemeToogle";
import { useTheme } from "@/functions/ThemeContext";
import { Button, Input } from "../../../Layout/combined-ui";

const Homepage: React.FC = () => {
	//const [searchQuery, setSearchQuery] = useState("");
	//const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	//const [showFilterMenu, setShowFilterMenu] = useState(false);
	const navigate = useNavigate();
	const handleNavigation = (path: string) => () => navigate(path);
	const handleExternalLink = (url: string) => () => window.open(url, "_blank");
	const [activeTab, setActiveTab] = useState("about");

	/*
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.closest("a") &&
        !["About", "Register"].includes(target.textContent?.trim() || "")
      ) {
        event.preventDefault();
        navigate("/login");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);
  */


	// Sample items
	const createItems = (section: string, index: number) => {
		let name = "";
		let specialty = "";
		const date = "NOV 22";
		const location = "Location";
		const time = "Full-day Service";
		let price = "";

		if (section === "Organizers") {
			specialty = [
				"Wedding",
				"Birthday",
				"Fellowship",
				"Baptism",
				"Community Development",
				"Fun Run",
			][index];
			name = specialty;
			price = "PHP 1000";
		} else {
			specialty = [
				"Florist",
				"Caterer",
				"Photographer",
				"Decorators",
				"Tech Provider",
				"Transportation Rentals",
			][index];
			name = specialty;
			price = "PHP 500-2000";
		}

		return {
			name,
			specialty,
			date,
			location,
			time,
			price,
			image: "../../src/assets/vendor.jpg",
		};
	};

	// Generate all items
	const organizers = Array.from({ length: 6 }).map((_, i) =>
		createItems("Organizers", i)
	);
	const vendors = Array.from({ length: 6 }).map((_, i) =>
		createItems("Vendors", i)
	);

	const { isDarkMode } = useTheme();

	return (
		<>
			<div id="about-us" />
			{/* Header */}
			<header
				className={`sticky top-0 z-50 w-full text-white transition-colors ${
					isDarkMode ? "bg-[#1E3A6D]" : "bg-[#2B579A]"
				}`}
			>
				<div className="w-full px-8 flex h-14 items-center justify-between">
					{/* Left section - Logo */}
					<div className="flex-1">
						<Link to="/" className="flex items-center gap-2">
							<img
								src="../../src/assets/OrganizerLogo.png"
								alt="Logo"
								className="h-8 w-auto object-contain"
							/>
						</Link>
					</div>

					{/* Center section - Navigation */}
					<nav className="hidden md:flex flex-1 justify-center">
						<ul className="flex items-center space-x-8">
							<li>
								<button
									onClick={() =>
										document
											.getElementById("about-us")
											?.scrollIntoView({ behavior: "smooth" })
									}
									className="relative text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full"
								>
									About Us
								</button>
							</li>
							<li>
								<button
									onClick={() =>
										document
											.getElementById("organizers")
											?.scrollIntoView({ behavior: "smooth" })
									}
									className="relative text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full"
								>
									Organizers
								</button>
							</li>
							<li>
								<button
									onClick={() =>
										document
											.getElementById("vendors")
											?.scrollIntoView({ behavior: "smooth" })
									}
									className="relative text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full"
								>
									Vendors
								</button>
							</li>
						</ul>
					</nav>

					{/* Right section - User actions */}
					<div className="flex-1 flex items-center justify-end gap-4">
						<ThemeToggle />
						<a
							href="/login"
							className="relative text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full"
						>
							Log in
						</a>
						<a
							href="/role-selection"
							className="relative text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full"
						>
							Register
						</a>
					</div>
				</div>
			</header>

			<main
				className={`w-full ${
					isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
				}`}
			>
				{/* Welcome Banner Section */}
				<section className="relative overflow-hidden bg-gray-900">
					<div className="absolute inset-0">
						<img
							src="../../src/assets/banner.jpg"
							alt="Concert background"
							className="h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/60"></div>
					</div>
					<div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
						<div className="flex flex-col sm:flex-row items-center justify-center">
							<div className="mb-8 sm:mb-0 sm:mr-8 flex-shrink-0">
								<img
									src="../../src/assets/OrganizerLogo.png"
									alt="Event Logo"
									className="h-65 sm:h-64 lg:h-[250px] w-auto object-contain"
								/>
							</div>
							<div className="text-center sm:text-left flex flex-col justify-center self-center">
								<h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
									Welcome to Your Event Management Hub
								</h1>
								<p className="mt-6 max-w-lg text-lg text-gray-300 sm:mx-auto md:mt-8 md:max-w-xl md:text-xl lg:mx-0">
									Discover tailored events services and manage everything from
									one central dashboard.
								</p>
							</div>
						</div>
					</div>
				</section>
				{/* Search & Filter Section */}
				<div
					className={`relative z-10 py-12 ${
						isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
					}`}
				>
					<div className="max-w-9/10 mx-auto px-4 w-full">
						<h2 className="text-4xl font-bold text-left mb-4">
							Why choose us?
						</h2>
						<p
							className={`mb-8 text-left ${
								isDarkMode ? "text-gray-300" : "text-gray-500"
							}`}
						>
							Let us help you create moments that matter, effortlessly.
						</p>

						{/* Tab Navigation */}
						<div className="flex justify-center border-b mb-8">
							<button
								className={`flex-1 max-w-[calc(100%/3)] px-8 py-4 mx-1 rounded-t-3xl border-b-2 border-transparent hover:border-gray-400 ${
									activeTab === "about"
										? `text-white border-b-transparent ${
												isDarkMode ? "bg-[#1E3A6D]" : "bg-[#2B579A]"
										  }`
										: `border-b-transparent ${
												isDarkMode
													? "bg-gray-800 text-gray-300 hover:bg-gray-700"
													: "bg-gray-50 text-gray-600 hover:bg-blue-100"
										  }`
								}`}
								onClick={() => setActiveTab("about")}
							>
								About Us
							</button>

							<button
								className={`flex-1 max-w-[calc(100%/3)] px-8 py-4 mx-1 rounded-t-3xl border-b-2 border-transparent hover:border-gray-400 ${
									activeTab === "mission"
										? `text-white border-b-transparent ${
												isDarkMode ? "bg-[#1E3A6D]" : "bg-[#2B579A]"
										  }`
										: `border-b-transparent ${
												isDarkMode
													? "bg-gray-800 text-gray-300 hover:bg-gray-700"
													: "bg-gray-50 text-gray-600 hover:bg-blue-100"
										  }`
								}`}
								onClick={() => setActiveTab("mission")}
							>
								Mission
							</button>

							<button
								className={`flex-1 max-w-[calc(100%/3)] px-8 py-4 mx-1 rounded-t-3xl border-b-2 border-transparent hover:border-gray-400 ${
									activeTab === "vision"
										? `text-white border-b-transparent ${
												isDarkMode ? "bg-[#1E3A6D]" : "bg-[#2B579A]"
										  }`
										: `border-b-transparent ${
												isDarkMode
													? "bg-gray-800 text-gray-300 hover:bg-gray-700"
													: "bg-gray-50 text-gray-600 hover:bg-blue-100"
										  }`
								}`}
								onClick={() => setActiveTab("vision")}
							>
								Vision
							</button>
						</div>

						{/* Tab Content */}
						<div
							className={`p-8 rounded-lg shadow-lg border ${
								isDarkMode
									? "bg-gray-900 border-gray-700"
									: "bg-white border border-gray-200"
							}`}
						>
							{activeTab === "about" && (
								<p
									className={`text-xl leading-relaxed ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									EVNTgarde makes event planning effortless. We connect you with
									trusted suppliers and organizers — from caterers to
									coordinators — so you can bring your vision to life without
									the hassle. Whether it’s a wedding, party, or corporate event,
									we help you create unforgettable moments, stress-free.
								</p>
							)}

							{activeTab === "mission" && (
								<p
									className={`text-xl leading-relaxed ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									To simplify event planning by seamlessly connecting business
									and individuals with trusted suppliers, empowering them to
									create memorable experiences with ease and confidence.
								</p>
							)}

							{activeTab === "vision" && (
								<p
									className={`text-xl leading-relaxed ${
										isDarkMode ? "text-gray-300" : "text-gray-700"
									}`}
								>
									To be the leading platform for event services, revolutionizing
									the way people plan and organize events by fostering a
									vibrant, reliable, and accessible ecosystem for event
									professionals.
								</p>
							)}
						</div>
					</div>
				</div>

				<div id="organizers">
					<br /> <br />
				</div>

				{/* Organizers Section */}
				<section
					className={`w-screen max-w-9/10 mx-auto py-12 px-4 bg-opacity-100${
						isDarkMode ? "bg-gray-800" : "bg-white"
					}`}
				>
					<div className="mb-12">
						{/* Flex container to keep both groups on the same line */}
						<div className="flex justify-between items-center flex-wrap gap-4">
							{/* Left Section: Heading and Subtitle */}
							<div>
								<h2 className="text-4xl font-bold mb-2">Event Organizers</h2>
								<p
									className={`transition-colors duration-300 ${
										isDarkMode ? "text-gray-300" : "text-gray-500"
									}`}
								>
									Easily connect with event organizers for your needs
								</p>
							</div>

							{/* Right Section: Search, Filter, and Sort */}
							<div className="flex items-center gap-4">
								{/* Search Bar */}
								<div className="relative w-72">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										placeholder="Search for Organizers..."
										className="placeholder-gray-700 dark:placeholder-gray-400 pl-10"
									/>
								</div>

								{/* Sorting Dropdown */}
								<select className="border p-2 rounded"></select>

								{/* Toggle Ascending/Descending */}
								<Button variant="outline" className="w-full sm:w-auto">
									<SlidersHorizontal className="mr-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{organizers.map((organizer, i) => (
							<div
								key={i}
								className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
							>
								<div className="relative">
									<img
										src={organizer.image || "/placeholder.svg"}
										alt={organizer.name}
										className="w-full h-50 object-cover"
									/>
								</div>
								<div className="p-4">
									<h3 className="font-semibold mb-2 text-gray-600">
										{organizer.name}
									</h3>
									<p className="text-sm text-gray-600">{organizer.location}</p>
									<p className="text-sm text-gray-600">{organizer.time}</p>
								</div>
							</div>
						))}
					</div>
					<div className="mt-8 text-center">
						<Button variant="outline" className="px-20 py-8 text-md">
							See More
						</Button>
					</div>
				</section>

				<div id="vendors">
					<br /> <br />
				</div>

				{/* Vendors Section */}
				<section
					className={`w-screen max-w-9/10 mx-auto py-12 px-4 bg-opacity-100${
						isDarkMode ? "bg-gray-800" : "bg-white"
					}`}
				>
					<div className="mb-12">
						{/* Flex container to keep both groups on the same line */}
						<div className="flex justify-between items-center flex-wrap gap-4">
							{/* Left Section: Heading and Subtitle */}
							<div>
								<h2 className="text-4xl font-bold mb-2">Event Vendors</h2>
								<p
									className={`transition-colors duration-300 ${
										isDarkMode ? "text-gray-300" : "text-gray-500"
									}`}
								>
									Source supplies or services efficiently
								</p>
							</div>

							{/* Right Section: Search, Filter, and Sort */}
							<div className="flex items-center gap-4">
								{/* Search Bar */}
								<div className="relative w-72">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										placeholder="Search for Organizers..."
										className="placeholder-gray-700 dark:placeholder-gray-400 pl-10"
									/>
								</div>

								{/* Sorting Dropdown */}
								<select className="border p-2 rounded"></select>

								{/* Toggle Ascending/Descending */}
								<Button variant="outline" className="w-full sm:w-auto">
									<SlidersHorizontal className="mr-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{vendors.map((vendor, i) => (
							<div
								key={i}
								className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
							>
								<div className="relative">
									<img
										src={vendor.image || "/placeholder.svg"}
										alt={vendor.name}
										className="w-full h-50 object-cover"
									/>
								</div>
								<div className="p-4">
									<h3 className="font-semibold mb-2 text-gray-600">
										{vendor.name}
									</h3>
									<p className="text-sm text-gray-600">{vendor.location}</p>
									<p className="text-sm text-gray-600">{vendor.time}</p>
								</div>
							</div>
						))}
					</div>
					<div className="mt-8 text-center">
						<Button variant="outline" className="px-20 py-8 text-md">
							See More
						</Button>
					</div>
				</section>

				{/* Footer */}
				<footer className="bg-[#2B579A] text-white dark:bg-[rgb(30,58,109)] py-8">
					<div className="container mx-auto pl-4 pr-8">
						<div className="flex flex-wrap">
							<div className="w-full md:w-1/3 mb-8 md:mb-0 pr-8">
								<img
									src="../../src/assets/OrganizerLogo.png"
									alt="Logo"
									className="h-28 w-auto mb-4"
								/>
								<span className="text-sm font-bold tracking-wide text-gray-200 block">
									Your next successful event starts here
								</span>
							</div>

							<div className="w-full md:w-2/3 flex flex-wrap">
								{/* Company Info */}
								<div className="w-1/2 sm:w-1/3 mb-6 pr-4">
									<h4 className="font-semibold mb-4 text-base">Company Info</h4>
									<ul className="space-y-2">
										<li>
											<button
												onClick={handleNavigation("/about")}
												className="hover:underline text-sm text-left"
											>
												About Us
											</button>
										</li>
										<li>
											<button
												onClick={handleNavigation("/login")}
												className="hover:underline text-sm text-left"
											>
												Book now
											</button>
										</li>
									</ul>
								</div>

								{/* Categories */}
								<div className="w-1/2 sm:w-1/3 mb-6 pr-4">
									<h4 className="font-semibold mb-4 text-base">Categories</h4>
									<ul className="space-y-2">
										<li>
											<button
												onClick={handleNavigation("/categories/concerts")}
												className="hover:underline text-sm text-left"
											>
												Concerts & Gigs
											</button>
										</li>
										<li>
											<button
												onClick={handleNavigation("/categories/festivals")}
												className="hover:underline text-sm text-left"
											>
												Festivals & Lifestyle
											</button>
										</li>
										<li>
											<button
												onClick={handleNavigation("/categories/business")}
												className="hover:underline text-sm text-left"
											>
												Business & Networking
											</button>
										</li>
										<li>
											<button
												onClick={handleNavigation("/categories/food")}
												className="hover:underline text-sm text-left"
											>
												Food & Drinks
											</button>
										</li>
										<li>
											<button
												onClick={handleNavigation("/categories/arts")}
												className="hover:underline text-sm text-left"
											>
												Performing Arts
											</button>
										</li>
										<li>
											<button
												onClick={handleNavigation("/categories/workshops")}
												className="hover:underline text-sm text-left"
											>
												Workshops & Classes
											</button>
										</li>
									</ul>
								</div>

								{/* Follow Us */}
								<div className="w-1/2 sm:w-1/3 mb-6">
									<h4 className="font-semibold mb-4 text-base">Follow Us</h4>
									<ul className="space-y-2">
										<li>
											<button
												onClick={handleExternalLink("https://facebook.com")}
												className="hover:underline text-sm text-left"
											>
												Facebook
											</button>
										</li>
										<li>
											<button
												onClick={handleExternalLink("https://instagram.com")}
												className="hover:underline text-sm text-left"
											>
												Instagram
											</button>
										</li>
										<li>
											<button
												onClick={handleExternalLink("https://twitter.com")}
												className="hover:underline text-sm text-left"
											>
												Twitter
											</button>
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Footer Copyright Section */}
						<div className="mt-8 border-t border-blue-500 pt-6 text-center text-sm">
							© {new Date().getFullYear()} Platform. All rights reserved.
						</div>
					</div>
				</footer>
			</main>
		</>
	);
};

export default Homepage;
