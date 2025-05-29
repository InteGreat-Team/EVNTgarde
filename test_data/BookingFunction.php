<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // form POST values
    $eventCategory = $_POST['event_category'];
    $eventName = $_POST['event_name'];
    $eventRequirements = $_POST['event_requirements'];
    $eventDate = $_POST['event_date']; 
    $eventLocation = $_POST['event_location'];
    $eventBudget = $_POST['event_budget'];

    // null kc wala pa agad
    $customerId = null; 
    $organizerId = null; 

    // DB connection parameters — update nlng
    $host = "localhost";
    $port = "5433"; 
    $dbname = "eletest";
    $user = "postgres";
    $password = "admin";

    $conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

    if (!$conn) {
        die("Error in connection: " . pg_last_error());
    }

    // SQL query to insert data
    $query = "
        INSERT INTO Organizer_Booking_Requests (
            customer_id,
            organizer_id,
            event_category,
            event_name,
            event_requirements,
            event_timestamp,
            event_location,
            event_budget,
            is_accepted
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL) RETURNING organizer_request_id AS booking_id;
    ";

    $result = pg_query_params($conn, $query, [
        $customerId,
        $organizerId,
        $eventCategory,
        $eventName,
        $eventRequirements,
        $eventDate,
        $eventLocation,
        $eventBudget
    ]);

    if ($result) {
        $row = pg_fetch_assoc($result);
        $bookingId = $row['booking_id']; // Get the serial ID (booking_id)
        
        // Redirect to SuccessfullyBooked.php with the booking ID as a query parameter
        header("Location: SuccessfullyBooked.php?booking_id=" . $bookingId);
        exit(); // Important to stop the script after redirection
    } else {
        echo "Error inserting data: " . pg_last_error($conn);
    }
    pg_close($conn);

} else {
    echo "No form data submitted.";
}
?>