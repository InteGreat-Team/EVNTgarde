<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Booking Successful</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f0f8ff;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .container {
        text-align: center;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      h1 {
        color: #28a745;
        margin-bottom: 20px;
      }

      a button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
      }

      a button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Booking Successfully Submitted!</h1>
      <a href="OrganizerCards.php"><button>Next</button></a>
    </div>
  </body>
</html>
<?php
// Fetch the booking ID from the URL query parameter
if (isset($_GET['booking_id'])) {
    $bookingId = $_GET['booking_id'];

    // Redirect to OrganizerCards.php with the booking_id as part of the URL hash
    header("Location: OrganizerCards.php#".$bookingId);
    exit();
} else {
    echo "No booking ID received.";
}
?>
