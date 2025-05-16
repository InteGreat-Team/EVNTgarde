import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
router.use(express.json());

// Cloud Function URLs
const CLOUD_FUNCTION_URLS = {
  createEvent: 'https://createevent-numtsv52wa-as.a.run.app',
  getAllEvents: 'https://asia-southeast1-evntgarde-event-management.cloudfunctions.net/getAllEvents'
};

// Get all events
router.get('/events', async (req, res) => {
  try {
    const response = await fetch(CLOUD_FUNCTION_URLS.getAllEvents);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create new event
router.post('/events', async (req, res) => {
  try {
    console.log('Creating event via Cloud Function...');
    
    const response = await fetch(CLOUD_FUNCTION_URLS.createEvent, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create event');
    }

    console.log('Event created successfully:', data);
    return res.status(201).json(data);

  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return res.status(500).json({
      error: 'Failed to create event',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;