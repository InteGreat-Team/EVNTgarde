<?php
// Database connection
$host = 'localhost';
$dbname = 'eletest';
$user = 'postgres';
$pass = 'admin';
$port = 5433;

$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Get the request_id and organizer_id from the POST data
$requestId = $_POST['request_id'];  
$organizerId = $_POST['organizer_id']; 

// Check if the request exists in the organizer_booking_requests table
$check = $conn->prepare("SELECT * FROM organizer_booking_requests WHERE organizer_request_id = ?");
$check->execute([$requestId]);

if ($check->rowCount() > 0) {
    // Update the organizer_id in the booking request matching the request_id
    $update = $conn->prepare("UPDATE organizer_booking_requests SET organizer_id = ? WHERE organizer_request_id = ?");
    $update->execute([$organizerId, $requestId]);

    echo "Success"; 
} else {
    http_response_code(400);  // Bad Request if the request_id does not match
    echo "Request ID not found.";
}
?>