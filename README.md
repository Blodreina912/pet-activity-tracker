Pet Activity Tracker
This is a responsive micro-application designed to help pet owners log their pet's activities and see a summary of the day.

Tech Stack
The application is built using React for the front-end and Node.js/Express for the back-end. I chose this stack because of my familiarity with JavaScript, its extensive community support, and its suitability for building a small, scalable API-based application.
How to Run
Clone the repository: git clone [your-repo-link]

Navigate to the back-end folder: cd pet-tracker-backend

Install back-end dependencies: npm install

Start the back-end server: node server.js

Navigate to the front-end folder: cd ../pet-tracker-frontend

Install front-end dependencies: npm install

Start the front-end application: npm start

Trade-offs
In-Memory Data: All data is stored in memory, which means it will be lost when the server restarts. This was a core requirement of the challenge  and is suitable for a simple micro-app, but it's not a solution for production.

AI Chatbot: The AI chatbot is a basic proof-of-concept, as a full-fledged contextual memory system would require a more robust, persistent back-end and a dedicated AI service.

No Authentication: There is no user authentication, as the focus was on the core features and in-memory data storage.
