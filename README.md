# Chit Chat - A Real-Time Chat Application

This is a simple, real-time web-based chat application built with Node.js, Express, and Socket.IO. It allows multiple users to join a chat room, set a username, and communicate instantly. The application features a clean user interface with both a light and a dark theme.

## Features

-   **Real-Time Messaging**: Instantly send and receive messages with other connected users.
-   **Live User Count**: See the total number of connected clients in real-time.
-   **Typing Indicator**: Know when another user is typing a message.
-   **Custom Usernames**: Users can set their own name, which is saved in the browser's local storage.
-   **Sound Notifications**: Get an audio alert for new incoming messages.
-   **Light & Dark Mode**: Toggle between a light and dark theme for user comfort.
-   **Responsive Design**: The interface is optimized for both desktop and mobile devices.

## Tech Stack

-   **Backend**: Node.js, Express, Socket.IO
-   **Frontend**: HTML, CSS, JavaScript (ES6)
-   **Dependencies**:
    -   `express`: Web application framework for Node.js.
    -   `socket.io`: Enables real-time, bidirectional, event-based communication.
-   **Dev Dependencies**:
    -   `nodemon`: Automatically restarts the server during development.

## How It Works

The application consists of a Node.js server and a static frontend.

-   The **server** (`app.js`) uses Express to serve the `public` directory (containing the HTML, CSS, and client-side JS).
-   It initializes a **Socket.IO** instance to handle WebSocket connections.
-   When a client connects, the server adds their socket ID to a set and broadcasts the updated total number of clients to everyone.
-   When a client sends a message or a "typing" feedback event, the server broadcasts that data to all other connected clients.
-   The **client-side JavaScript** (`public/main.js`) establishes a connection to the server's Socket.IO instance, handles sending messages, and listens for incoming events (like new messages or updated client counts) to update the UI dynamically.

## Installation and Usage

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Kp-Singh09/Chat-app.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd Chat-app
    ```

3.  **Install the dependencies:**
    ```sh
    npm install
    ```

4.  **Start the server:**

    For development (with automatic restarts on file changes):
    ```sh
    npm run dev
    ```

    For production:
    ```sh
    npm start
    ```

5.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3000`. Open multiple tabs or windows to simulate a multi-user chat.
