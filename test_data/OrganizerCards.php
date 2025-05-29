<?php
// Database connection
$host = 'localhost';
$dbname = 'eletest';
$user = 'postgres';
$pass = 'admin';
$port = 5433;

$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Fetch records from Organizer_Card table
$query = "SELECT * FROM Organizer_Card";
$stmt = $conn->prepare($query);
$stmt->execute();
$cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organizer Cards</title>
    <style>
        .card-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: space-around;
        }
        .card {
            width: 250px;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            transition: transform 0.2s;
            cursor: pointer;
        }
        .card:hover {
            transform: scale(1.05);
        }
        .card-header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .card-body {
            font-size: 16px;
            margin-bottom: 15px;
        }
        .card-footer {
            font-size: 14px;
            text-align: right;
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
        .book-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            margin-top: 15px;
            border-radius: 5px;
            cursor: pointer;
        }
        .book-button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>

<h1>Organizer Cards</h1>

<!-- Home Button -->
<div class="home-button-container">
    <a href="bookingtry.php" class="home-button">Home</a>
</div>

<div class="card-container">
    <?php foreach ($cards as $card): ?>
        <div class="card" onclick="updateHash('<?php echo $card['organizer_card_id']; ?>', '<?php echo $card['organizer_card_id']; ?>')">
            <div class="card-header">
                Card ID: <?php echo htmlspecialchars($card['organizer_card_id']); ?>
            </div>
            <div class="card-body">
                <p>Organizer ID: <?php echo htmlspecialchars($card['organizer_id']); ?></p>
                <p>Review ID: <?php echo htmlspecialchars($card['review_id']); ?></p>
                <p>Price: <?php echo htmlspecialchars($card['price']); ?></p>
                <p>Currently Booked: <?php echo $card['is_booked'] ? 'Yes' : 'No'; ?></p>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<!-- Modal to display Event Organizer Account Data -->
<div class="modal" id="eventModal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('eventModal').style.display='none'">&times;</span>
        <h2>Event Organizer Account Data</h2>
        <p id="companyName"></p>
        <p id="industry"></p>
        <p id="location"></p>
        <p id="reviewRating"></p>
        <button class="book-button" onclick="confirmBooking()">Book</button>
    </div>
</div>
<input type="hidden" id="organizerId" value="">

<script>
    let organizerCardId = ''; 
    let organizerId = ''; 
    let requestId = '';

    function updateHash(cardId, orgId, reqId) {
        // Save the organizer card id to display data
        organizerCardId = cardId;
        organizerId = orgId; 
        requestId = reqId;  

        const currentHash = window.location.hash.substring(1).split('#')[0]; // first ID
        window.location.hash = currentHash + '#' + organizerCardId;

        // Fetch the organizer data using the card ID for display
        fetchOrganizerData(organizerCardId);
    }

   // Function to fetch the organizer data based on cardId and set the organizer_id in a hidden input field
    function fetchOrganizerData(cardId) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'FetchOrganizerData.php?card_id=' + cardId, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data) {
                    // Display the organizer data based on card ID
                    document.getElementById('companyName').innerText = 'Company Name: ' + data.organizer_company_name;
                    document.getElementById('industry').innerText = 'Industry: ' + data.organizer_industry;
                    document.getElementById('location').innerText = 'Location: ' + data.organizer_location;
                    document.getElementById('reviewRating').innerText = 'Review Rating: ' + data.organizer_review_rating;

                    // Set the organizer_id in the hidden input field
                    document.getElementById('organizerId').value = data.organizer_id;

                    // Show the modal
                    document.getElementById('eventModal').style.display = 'block';
                }
            }
        };
        xhr.send();
    }

    // Function to handle the booking confirmation
    function confirmBooking() {
        if (confirm("Are you sure you want to book this organizer?")) {
            // Ensure the requestId and organizerId are fetched from the URL hash and hidden input when Book button is clicked
            const hashParts = window.location.hash.substring(1).split('#');
            if (hashParts.length === 2) {
                // Fetch the requestId from the hash
                requestId = hashParts[0];

                // Fetch the organizerId from the hidden input field
                organizerId = document.getElementById('organizerId').value;

                // Log the data to the console for debugging
                console.log('Posting data to BookOrganizer.php');
                console.log('Request ID:', requestId);
                console.log('Organizer ID:', organizerId);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'BookOrganizer.php', true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        alert('Organizer successfully booked!');
                        // Redirect to customersaved.php after booking
                        window.location.href = 'customersaved.php?event_id=' + requestId;
                    } else {
                        alert('Booking failed.');
                    }
                };
                xhr.send('request_id=' + encodeURIComponent(requestId) + '&organizer_id=' + encodeURIComponent(organizerId));
            } else {
                alert('Invalid URL hash format.');
            }
        }
    }
    window.addEventListener('hashchange', function () {
        let hashParts = window.location.hash.substring(1).split('#');
        if (hashParts.length === 2) {
            fetchOrganizerData(hashParts[1]);  // Fetch based on card ID (second part of hash)
        }
    });

    // On page load, check if a hash is present and fetch data
    if (window.location.hash) {
        let hashParts = window.location.hash.substring(1).split('#');
        if (hashParts.length === 2) {
            fetchOrganizerData(hashParts[1]);  // Fetch based on card ID
        }
    }
</script>
</body>
</html>