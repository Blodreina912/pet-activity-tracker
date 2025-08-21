document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');

    // State management
    let activitiesData = {};
    let chatHistory = [];
    const walkPromptTime = 18; // 6 PM local time

    const render = () => {
        // Main container for the app
        root.innerHTML = `
            <h1>🐾 Pet Tracker</h1>

            <section>
                <h2>Log an Activity</h2>
                <form id="activity-form">
                    <label for="pet-name">Pet Name:</label>
                    <input type="text" id="pet-name" required>
                    <label for="activity-type">Activity Type:</label>
                    <select id="activity-type" required>
                        <option value="walk">Walk</option>
                        <option value="meal">Meal</option>
                        <option value="medication">Medication</option>
                    </select>
                    <label for="duration-quantity">Duration (mins) / Quantity (count):</label>
                    <input type="number" id="duration-quantity" required>
                    <button type="submit">Log</button>
                </form>
            </section>

            <hr>

            <section>
                <h2>Today's Summary</h2>
                <div id="summary-dashboard">
                    <p>Fetching summary...</p>
                </div>
            </section>

            <hr>

            <section>
                <h2>Pet AI Chatbot</h2>
                <div id="chat-window" style="height: 200px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px;"></div>
                <form id="chat-form">
                    <input type="text" id="chat-input" placeholder="Talk to the AI about your pet..." required>
                    <button type="submit">Send</button>
                </form>
            </section>
        `;

        // Event Listeners for forms
        document.getElementById('activity-form').addEventListener('submit', handleActivitySubmit);
        document.getElementById('chat-form').addEventListener('submit', handleChatSubmit);

        fetchSummary();
        checkWalkPrompt();
    };

    const handleActivitySubmit = async (e) => {
        e.preventDefault();
        const petName = document.getElementById('pet-name').value;
        const activityType = document.getElementById('activity-type').value;
        const durationQuantity = document.getElementById('duration-quantity').value;

        const response = await fetch('/api/log-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petName, activityType, durationQuantity: Number(durationQuantity) })
        });
        const result = await response.json();
        console.log(result.message);

        // Refresh the summary
        fetchSummary();
    };

    const fetchSummary = async () => {
        const response = await fetch('/api/summary');
        activitiesData = await response.json();
        renderSummary();
    };

    const renderSummary = () => {
        const dashboard = document.getElementById('summary-dashboard');
        dashboard.innerHTML = `
            <div class="data-vis">
                <strong>Walks:</strong> ${activitiesData.walk || 0} min 
            </div>
            <div class="data-vis">
                <strong>Meals:</strong> ${activitiesData.meal || 0}
            </div>
            <div class="data-vis">
                <strong>Medications:</strong> ${activitiesData.medication || 0}
            </div>
        `;
        // Add a progress bar or ring visualization here
        // Example for a simple bar:
        if (activitiesData.walk > 0) {
            dashboard.innerHTML += `
                <div style="height: 10px; background: #eee; border-radius: 5px;">
                    <div style="width: ${Math.min(activitiesData.walk, 60)}%; height: 100%; background: #4CAF50; border-radius: 5px; transition: width 0.5s;"></div>
                </div>
            `;
        }
    };

    const checkWalkPrompt = () => {
        const now = new Date();
        if (now.getHours() >= walkPromptTime && (!activitiesData.walk || activitiesData.walk === 0)) {
            setTimeout(() => {
                alert("Rex still needs exercise today!"); // Simple alert for the UX prompt
            }, 5000); // 5-second delay for demonstration
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        const petName = document.getElementById('pet-name').value || 'My Pet'; // Default pet name
        const message = document.getElementById('chat-input').value;

        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
        document.getElementById('chat-input').value = '';

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petName, message, history: chatHistory })
        });
        const result = await response.json();
        chatHistory = result.history;
        chatWindow.innerHTML += `<div><strong>AI:</strong> ${result.reply}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // Initial render
    render();
});