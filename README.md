# RISE UP Business Website

## Setup Instructions

If you are moving this project to a new computer, follow these steps to get it running:

### 1. Install Node.js
Make sure **Node.js** is installed on the new computer. You can download it from [nodejs.org](https://nodejs.org/).

### 2. Install Project Dependencies
Open a terminal in the project folder and run:
```bash
npm install
```
This will install all the necessary libraries (`express`, `sqlite3`, etc.) defined in `package.json`.

### 3. Run the Server
Start the server by running:
```bash
node server.js
```

### 4. Access the Website
Open your web browser and go to:
**[http://localhost:8000](http://localhost:8000)**

> **Important:** Do NOT open the HTML files directly (e.g., by double-clicking them). You MUST access them through the `localhost` link for the feedback features to work.

## Notes
- **Database:** The `feedback.db` file is ignored by Git. A new, empty database will be automatically created when you run the server for the first time on the new machine.
- **Troubleshooting:** If you see errors about missing modules, ensure you ran `npm install`.
