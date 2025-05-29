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
        .home-button-container {
            text-align: center;
            margin-bottom: 20px;
        }
        .home-button {
            background-color: #007bff;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
</head>
<body>

<h1>Organizer Booking Requests</h1>

NOTE: Unfinished — logins required before viewing booking requests 

<!-- Home Button -->
<div class="home-button-container">
    <a href="vendorhome.html" class="home-button">Home</a>
</div>

<!-- Placeholder Table -->
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
        <tr>
            <td>Sample Event</td>
            <td>2025-04-21</td>
            <td>ORG123</td>
            <td>Pending</td>
            <td>
                <button class="btn accept">Accept</button>
                <button class="btn decline">Decline</button>
            </td>
            <td>
                <button class="btn">Details</button>
            </td>
        </tr>
    </tbody>
</table>

<!-- Event Details Modal -->
<div id="eventModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeModal()">×</span>
        <h2>Event Details</h2>
        <div id="eventDetails">
            <p><strong>Category:</strong> Sample</p>
            <p><strong>Location:</strong> Sample Hall</p>
            <p><strong>Budget:</strong> $1,000.00</p>
            <p><strong>Requirements:</strong> None</p>
            <p><strong>Status:</strong> Pending</p>
            <p><strong>Timestamp:</strong> 2025-04-21 10:00:00</p>
        </div>
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
function closeModal() {
    document.getElementById("eventModal").style.display = "none";
}
function closeConfirm() {
    document.getElementById("confirmModal").style.display = "none";
}
</script>

</body>
</html>
