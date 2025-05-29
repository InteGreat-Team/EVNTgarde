<?php
// Database connection
$host = 'localhost'; // Replace with your host
$dbname = 'eletest'; // Replace with your database name
$user = 'postgres'; // Replace with your username
$pass = 'admin'; // Replace with your password
$port = 5433; // Specify the port number

// Create a connection with the specified port
$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Fetch records from Organizer_Booking_Requests table
$query = "SELECT * FROM Organizer_Booking_Requests";
$stmt = $conn->prepare($query);
$stmt->execute();
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Events</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        h1 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        .btn {
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            text-align: center;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
            padding-top: 60px;
        }
        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }
        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    </style>
</head>
<body>

    <h1>Saved Events</h1>
    <div style="text-align: center; margin-bottom: 20px;">
        <a href="BookingTry.php">
            <button class="btn">Home</button>
        </a>
    </div>
    <table>
        <thead>
            <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Organizer ID</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($events as $event): ?>
                <tr>
                    <td><?php echo htmlspecialchars($event['event_name']); ?></td>
                    <td><?php echo htmlspecialchars($event['event_timestamp']); ?></td>
                    <td>
                        <?php if (empty($event['organizer_id'])): ?>
                            <a href="organizercards.php#<?php echo $event['organizer_request_id']; ?>">
                                <button class="btn">Go to Organizer Cards</button>
                            </a>
                        <?php else: ?>
                            <span><?php echo htmlspecialchars($event['organizer_id']); ?></span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <!-- Show the 'Show Details' button and pass the event_id -->
                        <button class="btn" onclick="openModal(<?php echo $event['organizer_request_id']; ?>)">Show Details</button>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <!-- Modal -->
    <div id="eventModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Event Details</h2>
            <div id="eventDetails"></div>
        </div>
    </div>

    <script>
        function openModal(eventId) {
            var modal = document.getElementById("eventModal");
            var eventDetails = document.getElementById("eventDetails");

            // Update the URL with event_id (for bookmarking)
            history.pushState(null, null, "?event_id=" + eventId);

            // Fetch the event details dynamically using the event_id (AJAX)
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "FetchCustomerRequest.php?event_id=" + eventId, true);
            xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //console.log(xhr.responseText); // Log the raw response
                try {
                    var event = JSON.parse(xhr.responseText);

                    // Ensure event_budget is a valid number
                    var budget = parseFloat(event.event_budget);
                    if (isNaN(budget)) {
                        budget = 0; 
                    }

                    var details = `
                        <p><strong>Category:</strong> ${event.event_category}</p>
                        <p><strong>Location:</strong> ${event.event_location}</p>
                        <p><strong>Budget:</strong> $${budget.toFixed(2)}</p>
                        <p><strong>Requirements:</strong> ${event.event_requirements}</p>
                       <p><strong>Status:</strong> ${event.is_accepted === false ? 'Declined' : (event.is_accepted ? 'Accepted' : 'Pending' )}</p>
                        <p><strong>Timestamp:</strong> ${event.event_timestamp}</p>
                    `;
                    eventDetails.innerHTML = details;
                    modal.style.display = "block";
                } catch (e) {
                    console.error("JSON parse error: ", e);
                }
            }
        };
            xhr.send();
        }

        function closeModal() {
            var modal = document.getElementById("eventModal");
            modal.style.display = "none";
        }
    </script>

</body>
</html>
