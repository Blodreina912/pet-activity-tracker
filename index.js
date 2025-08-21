const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// In-memory data store
let activities = [];
let chatHistory = {}; // Store chat history per pet

app.use(cors()); // Allows requests from the front-end
app.use(express.json()); // Parses JSON bodies

// Serve static files (the front-end)
app.use(express.static('public'));

// API endpoint to log an activity
app.post('/api/log-activity', (req, res) => {
  const { petName, activityType, durationQuantity, dateTime } = req.body;
  if (!petName || !activityType || !durationQuantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newActivity = {
    id: Date.now(),
    petName,
    activityType,
    durationQuantity,
    dateTime: dateTime || new Date().toISOString()
  };
  activities.push(newActivity);
  res.status(201).json({ message: 'Activity logged successfully' });
});

// API endpoint to get today's summary
app.get('/api/summary', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const todaysActivities = activities.filter(activity =>
    activity.dateTime.startsWith(today)
  );

  const summary = todaysActivities.reduce((acc, activity) => {
    const key = activity.activityType;
    acc[key] = (acc[key] || 0) + (key === 'meal' || key === 'medication' ? 1 : Number(activity.durationQuantity));
    return acc;
  }, {});

  res.json(summary);
});

// API endpoint for the AI chatbot
app.post('/api/chat', async (req, res) => {
  const { petName, message } = req.body;

  if (!petName || !message) {
      return res.status(400).json({ error: 'Pet name and message are required' });
  }

  // Retrieve or initialize chat history for the pet
  chatHistory[petName] = chatHistory[petName] || [];
  chatHistory[petName].push({ role: 'user', content: message });

  // Placeholder for AI response logic
  // In a real application, you would call an AI API like Gemini here
  const aiResponse = {
    role: 'assistant',
    content: `Hello, ${petName}'s owner. You said: "${message}". I remember that.`
  };

  chatHistory[petName].push(aiResponse);

  res.json({ reply: aiResponse.content, history: chatHistory[petName] });
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});