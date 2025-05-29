<?php
// Database connection
$host = 'localhost';
$dbname = 'eletest';
$user = 'postgres';
$pass = 'admin';
$port = 5433;

$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Get the card_id from the query string
$card_id = $_GET['card_id'] ?? '';

if ($card_id) {
    // Get vendor_id from Vendor_Card table
    $cardQuery = "SELECT vendor_id FROM Vendor_Card WHERE vendor_card_id = :card_id";
    $cardStmt = $conn->prepare($cardQuery);
    $cardStmt->bindParam(':card_id', $card_id, PDO::PARAM_STR);
    $cardStmt->execute();
    $cardData = $cardStmt->fetch(PDO::FETCH_ASSOC);

    if ($cardData && isset($cardData['vendor_id'])) {
        $vendor_id = $cardData['vendor_id'];

        // Fetch vendor account data using vendor_id
        $vendorQuery = "SELECT * FROM Vendor_Account_Data WHERE vendor_id = :vendor_id";
        $vendorStmt = $conn->prepare($vendorQuery);
        $vendorStmt->bindParam(':vendor_id', $vendor_id, PDO::PARAM_STR);
        $vendorStmt->execute();
        $vendorData = $vendorStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($vendorData ?: []);
    } else {
        echo json_encode([]);
    }
}
?>