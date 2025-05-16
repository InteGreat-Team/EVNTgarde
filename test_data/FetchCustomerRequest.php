<?php
// Database connection
$host = 'localhost';
$dbname = 'eletest';
$user = 'postgres'; 
$pass = 'admin'; 
$port = 5433; 

// Create a connection with the specified port
$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Get event_id from the URL
$event_id = isset($_GET['event_id']) ? $_GET['event_id'] : null;

if ($event_id) {
    // Fetch event details from the database
    $query = "SELECT * FROM Organizer_Booking_Requests WHERE organizer_request_id = :event_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':event_id', $event_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the event as an associative array
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the event details as a JSON response
    echo json_encode($event);
} else {
    echo json_encode([]);
}
?>