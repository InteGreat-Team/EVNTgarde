<?php
// Database connection
$host = 'localhost';
$dbname = 'eletest';
$user = 'postgres';
$pass = 'admin';
$port = 5433;
$conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);

// Handle Accept/Decline POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['request_id'], $_POST['is_accepted'])) {
    $requestId = $_POST['request_id'];
    $isAccepted = filter_var($_POST['is_accepted'], FILTER_VALIDATE_BOOLEAN);

    $query = "UPDATE Organizer_Booking_Requests SET is_accepted = :accepted WHERE organizer_request_id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':accepted', $isAccepted, PDO::PARAM_BOOL);
    $stmt->bindParam(':id', $requestId, PDO::PARAM_INT);
    $stmt->execute();
    echo "Status updated";
    exit;
}

// Fetch requests with organizer_id NOT NULL and is_accepted IS NULL or TRUE (hide declined)
$query = "SELECT * FROM Organizer_Booking_Requests WHERE organizer_id IS NOT NULL AND (is_accepted IS NULL OR is_accepted = TRUE) ORDER BY event_timestamp DESC";
$stmt = $conn->prepare($query);
$stmt->execute();
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Organizer Booking Requests</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; }
        th { background-color: #f4f4f4; }
        .btn { padding: 6px 12px; margin: 2px; border: none; cursor: pointer; }
        .accept { background-color: #28a745; color: white; }
        .decline { background-color: #dc3545; color: white; }
        .modal, .confirm-modal { display: none; position: fixed; z-index: 10; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .modal-content, .confirm-content { background: white; margin: 10% auto; padding: 20px; width: 60%; }
        .close { float: right; font-size: 20px; cursor: pointer; }
        .confirm-buttons { text-align: right; }
        .confirm-buttons button { margin-left: 10px; }
    </style>
</head>
<body>

<h1>Organizer Booking Requests</h1>
<!-- Home Button -->
<div class="home-button-container">
    <a href="organizerhome.html" class="home-button">Home</a>
</div>

<table>
    <thead>
        <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Organizer ID</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($events as $event): ?>
            <tr>
                <td><?= htmlspecialchars($event['event_name']) ?></td>
                <td><?= htmlspecialchars($event['event_timestamp']) ?></td>
                <td><?= htmlspecialchars($event['organizer_id']) ?></td>
                <td><?= $event['is_accepted'] ? 'Accepted' : 'Pending' ?></td>
                <td>
                    <?php if ($event['is_accepted'] === null): ?>
                        <button class="btn accept" onclick="confirmAction(<?= $event['organizer_request_id'] ?>, true)">Accept</button>
                        <button class="btn decline" onclick="confirmAction(<?= $event['organizer_request_id'] ?>, false)">Decline</button>
                    <?php else: ?>
                        <em>-</em>
                    <?php endif; ?>
                </td>
                <td>
                    <button class="btn" onclick="openModal(<?= $event['organizer_request_id'] ?>)">Details</button>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<!-- Event Details Modal -->
<div id="eventModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal()">×</span>
        <h2>Event Details</h2>
        <div id="eventDetails">Loading...</div>
    </div>
</div>

<!-- Confirm Action Modal -->
<div id="confirmModal" class="confirm-modal">
    <div class="confirm-content">
        <h3>Are you sure?</h3>
        <p>This action cannot be undone.</p>
        <div class="confirm-buttons">
            <button class="btn" onclick="closeConfirm()">Cancel</button>
            <button class="btn accept" id="confirmAccept">Yes</button>
        </div>
    </div>
</div>

<script>
let pendingAction = { id: null, accept: null };

function confirmAction(requestId, isAccepted) {
    pendingAction.id = requestId;
    pendingAction.accept = isAccepted;
    document.getElementById('confirmAccept').textContent = isAccepted ? "Accept" : "Decline";
    document.getElementById('confirmAccept').className = isAccepted ? "btn accept" : "btn decline";
    document.getElementById("confirmModal").style.display = "block";
}

function closeConfirm() {
    document.getElementById("confirmModal").style.display = "none";
}

document.getElementById("confirmAccept").onclick = function () {
    const formData = new FormData();
    formData.append("request_id", pendingAction.id);
    formData.append("is_accepted", pendingAction.accept);

    fetch("OrganizerBookings.php", {
        method: "POST",
        body: formData
    }).then(res => res.text())
      .then(() => location.reload());
};

// Details modal
function openModal(eventId) {
    const modal = document.getElementById("eventModal");
    const details = document.getElementById("eventDetails");

    fetch("FetchOrganizerBookings.php?event_id=" + eventId)
        .then(res => res.json())
        .then(data => {
            const budget = parseFloat(data.event_budget) || 0;
            details.innerHTML = `
                <p><strong>Category:</strong> ${data.event_category}</p>
                <p><strong>Location:</strong> ${data.event_location}</p>
                <p><strong>Budget:</strong> $${budget.toFixed(2)}</p>
                <p><strong>Requirements:</strong> ${data.event_requirements}</p>
                <p><strong>Status:</strong> ${data.is_accepted ? 'Accepted' : 'Pending'}</p>
                <p><strong>Timestamp:</strong> ${data.event_timestamp}</p>
            `;
            modal.style.display = "block";
        })
        .catch(() => {
            details.innerHTML = "Failed to load event details.";
        });
}

function closeModal() {
    document.getElementById("eventModal").style.display = "none";
}
</script>

</body>
</html>
