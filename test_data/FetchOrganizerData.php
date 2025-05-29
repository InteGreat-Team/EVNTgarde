<?php
// Database connection
$host = 'localhost';
$dbname = 'eletest'; 
$user = 'postgres'; 
$pass = 'admin';
$port = 5433;

// Create a connection with the specified port
$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Get the card_id from the query string
$card_id = $_GET['card_id'] ?? '';

if ($card_id) {
    // Fetch organizer account data based on the card_id
    $query = "SELECT * FROM Event_Organizer_Account_Data WHERE organizer_id = (SELECT organizer_id FROM Organizer_Card WHERE organizer_card_id = :card_id)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':card_id', $card_id, PDO::PARAM_STR);
    $stmt->execute();
    $accountData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($accountData) {
        echo json_encode($accountData);
    } else {
        echo json_encode([]);
    }
}
?>