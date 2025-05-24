# Real-Time Chat Using WebSocket API

## Objective

Implement a real-time messaging system using:
- JavaScript on the frontend (no frameworks or libraries)
- A **WebSocket server** to enable real-time communication between devices on the same local network
- This allows multiple users on different devices to chat live


## Tech Stack

| Layer       | Tech                      |
|-------------|---------------------------|
| **Frontend**| HTML, CSS, JavaScript |
| **Backend** | Node.js + WebSocket (standard ws module) |


## Overview

1. One machine must run a WebSocket server.
2. All users must be connected to the same local Wi-Fi network.
3. All users must open the same HTML file that connects to the host via WebSocket.
4. Browsers communicate through the WebSocket server for live chat.


## How It Works

1. The server listens on a port (e.g., `8080`) for WebSocket connections.
2. When a user sends a message from their browser, it is sent to the server.
3. The server broadcasts that message to all other connected clients.
4. Every client updates their UI in real time using the `WebSocket` API.



## Key Features

| Feature                         | Supported? | Description                                                  |
|----------------------------------|------------|--------------------------------------------------------------|
| Cross-device communication      | Yes          | Chat between any devices on the same network                 |
| Real-time messaging              | Yes          | Instant delivery via WebSocket, no polling required          |
| No frameworks/libraries frontend| Yes          | Pure vanilla JS, HTML, CSS                                   |
| Easy to run and test            | Yes         | Lightweight and fast to set up                               |



## Limitations

| Limitation                      | Impact                                                        |
|--------------------------------|---------------------------------------------------------------|
| Server needed                | Requires Node.js installed on one device                      |
| LAN-only                     | Only works across devices on the same Wi-Fi (no public IPs)   |
| No persistence               | Messages not stored unless backend is extended                |
