<?php
// data conn
$host = 'localhost';
$dbname = 'eletest';
$user = 'postgres';
$pass = 'admin';
$port = 5433;

$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// almost the same as FetchCustomerRequest.php but view to ng organizer, though maybe baka mapag isa nalang..
if (isset($_GET['event_id'])) {
    $eventId = $_GET['event_id'];

    $query = "SELECT * FROM Organizer_Booking_Requests WHERE organizer_request_id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $eventId, PDO::PARAM_INT);
    $stmt->execute();
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($event);
}
?>