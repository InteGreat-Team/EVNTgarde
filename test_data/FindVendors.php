<?php
// Database connection
$host = 'localhost';
$dbname = 'eletest';
$user = 'postgres';
$pass = 'admin';
$port = 5433;

$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Fetch records from Vendor_Card table
$query = "SELECT * FROM Vendor_Card";
$stmt = $conn->prepare($query);
$stmt->execute();
$cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Cards</title>
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
    </style>
</head>
<body>

<h1>Vendor Cards</h1>

<!-- Home Button -->
<div class="home-button-container">
    <a href="OrganizerHome.html" class="home-button">Home</a>
</div>

<div class="card-container">
    <?php foreach ($cards as $card): ?>
        <div class="card" onclick="updateHash('<?php echo $card['vendor_card_id']; ?>', '<?php echo $card['vendor_id']; ?>')">
            <div class="card-header">
                Card ID: <?php echo htmlspecialchars($card['vendor_card_id']); ?>
            </div>
            <div class="card-body">
                <p>Vendor ID: <?php echo htmlspecialchars($card['vendor_id']); ?></p>
                <p>Review ID: <?php echo htmlspecialchars($card['review_id']); ?></p>
                <p>Price: <?php echo htmlspecialchars($card['price']); ?></p>
                <p>Currently Booked: <?php echo $card['is_booked'] ? 'Yes' : 'No'; ?></p>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<!-- Modal to display Vendor Account Data -->
<div class="modal" id="vendorModal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('vendorModal').style.display='none'">&times;</span>
        <h2>Vendor Account Data</h2>
        <p id="companyName"></p>
        <p id="vendorEmail"></p>
        <p id="vendorLocation"></p>
        <p id="reviewRating"></p>
    </div>
</div>
<input type="hidden" id="vendorId" value="">

<script>
    let vendorCardId = '';
    let vendorId = '';

    function updateHash(cardId, vendId) {
    console.log("Card Clicked:");
    console.log("Card ID:", cardId);
    console.log("Vendor ID:", vendId);

    vendorCardId = cardId;
    vendorId = vendId;

    window.location.hash = vendorCardId;
    fetchVendorData(vendorCardId);
}

    function fetchVendorData(cardId) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'FetchVendorData.php?card_id=' + cardId, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data) {
                    document.getElementById('companyName').innerText = 'Business Name: ' + data.vendory_business_name;
                    document.getElementById('vendorEmail').innerText = 'Email: ' + data.vendor_email;
                    document.getElementById('vendorLocation').innerText = 'Location: ' + data.vendor_location;
                    document.getElementById('reviewRating').innerText = 'Review Rating: ' + data.vendor_review_rating;
                    document.getElementById('vendorId').value = data.vendor_id;
                    document.getElementById('vendorModal').style.display = 'block';
                }
            }
        };
        xhr.send();
    }

    window.addEventListener('hashchange', function () {
        let cardId = window.location.hash.substring(1);
        if (cardId) {
            fetchVendorData(cardId);
        }
    });

    // Auto-load modal if page has hash
    if (window.location.hash) {
        let cardId = window.location.hash.substring(1);
        if (cardId) {
            fetchVendorData(cardId);
        }
    }
</script>
</body>
</html>
