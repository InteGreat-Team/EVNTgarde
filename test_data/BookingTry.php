<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Book an Event</title>
  <style>
    /* Base modal styling */
    #modal, #confirmModal {
      display: none;
      position: fixed;
      z-index: 10;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.4);
    }
    #modalContent, #confirmModalContent {
      background-color: #fff;
      margin: 10% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 400px;
      border-radius: 10px;
    }

    /* Use :target to show modal */
    #modal:target, #confirmModal:target {
      display: block;
    }

    .closeBtn {
      float: right;
      font-size: 24px;
      cursor: pointer;
    }

    .center {
      text-align: center;
    }
  </style>
</head>
    <body>

    <!-- Button to trigger the form modal -->
    <a href="#modal"><button>Book an Event</button></a>
    <a href="CustomerSaved.php"><button>Saved Events</button></a>
    <!-- Form Modal -->
        <div id="modal">
            <div id="modalContent">
                <a href="#"><span class="closeBtn">&times;</span></a>
                <form id="eventForm" method="POST" action="bookingfunction.php">
                    <h3>Event Booking Form</h3>

                    <label for="event_category">Event Category:</label><br>
                    <select id="event_category" name="event_category" required>
                    <option value="">Select Category</option>
                    <option value="Example1">Example1</option>
                    <option value="Example2">Example2</option>
                    <option value="Example3">Example3</option>
                    <option value="Example4">Example4</option>
                    <option value="other">Other</option>
                    </select><br><br>

                    <label for="event_name">Event Name:</label><br>
                    <input type="text" id="event_name" name="event_name" required><br><br>

                    <label for="event_requirements">Event Requirements:</label><br>
                    <textarea id="event_requirements" name="event_requirements" rows="4" cols="40"></textarea><br><br>

                    <label for="event_date">Event Date and Time:</label><br>
                    <input type="datetime-local" id="event_date" name="event_date" required><br><br>

                    <label for="event_location">Event Location:</label><br>
                    <input type="text" id="event_location" name="event_location" required><br><br>

                    <label for="event_budget">Event Budget (Php):</label><br>
                    <input type="number" id="event_budget" name="event_budget" min="0" step="0.01" required><br><br>

                    <!-- Sorry lol onting javascript lang for preview -->
                    <div class="center">
                        <button type="button" onclick="
                            var cat = document.getElementById('event_category').value;
                            var name = document.getElementById('event_name').value.trim();
                            var req = document.getElementById('event_requirements').value.trim();
                            var date = document.getElementById('event_date').value;
                            var loc = document.getElementById('event_location').value.trim();
                            var budget = document.getElementById('event_budget').value;

                            if (cat && name && date && loc && budget !== '') {
                                // Fill preview spans
                                document.getElementById('preview_category').innerText = cat;
                                document.getElementById('preview_name').innerText = name;
                                document.getElementById('preview_requirements').innerText = req;
                                document.getElementById('preview_date').innerText = date;
                                document.getElementById('preview_location').innerText = loc;
                                document.getElementById('preview_budget').innerText = budget;

                                // Go to confirmModal
                                window.location.href = '#confirmModal';
                            } else {
                                alert('Please fill in all required fields.');
                            }
                            ">
                            Book Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    <!-- Confirmation Modal -->
        <div id="confirmModal">
            <div id="confirmModalContent">
                <a href="#"><span class="closeBtn">&times;</span></a>
                <h3 class="center">Are all the information correct?</h3>

                <!-- Preview Section -->
                <div style="padding: 10px;">
                    <p><strong>Category:</strong> <span id="preview_category"></span></p>
                    <p><strong>Event Name:</strong> <span id="preview_name"></span></p>
                    <p><strong>Requirements:</strong> <span id="preview_requirements"></span></p>
                    <p><strong>Date and Time:</strong> <span id="preview_date"></span></p>
                    <p><strong>Location:</strong> <span id="preview_location"></span></p>
                    <p><strong>Budget:</strong> Php<span id="preview_budget"></span></p>
                </div>

                <div class="center">
                    <button onclick="document.getElementById('eventForm').submit();">Yes</button>
                    <a href="#modal"><button>No, go back</button></a>
                </div>
            </div>
        </div>
    </body>
</html>