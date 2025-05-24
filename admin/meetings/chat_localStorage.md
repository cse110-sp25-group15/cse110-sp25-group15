# Chat Using `localStorage`

## Objective

Implement a simple chat feature for the UCSD Marketplace project using **only JavaScript**
Complexity Level: Low-Medium

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Storage Mechanism:** `localStorage`


## Overview

This solution simulates a chat system by:
- Saving messages as JSON in `localStorage`.
- Displaying messages in a chat window.
- Polling `localStorage` every 2–3 seconds to check for new messages.
- Supporting multiple users (simulated by opening different tabs and choosing different usernames).


## How It Works (Step-by-Step)

1. **Each Message is a JavaScript Object**

   - Contains sender, message content, and timestamp.

2. **All Messages are Stored in `localStorage`**

   - Keep one shared array of messages:  
     ```js
     localStorage.setItem('chat_ucsd', JSON.stringify([...]))
     ```

3. **The Chat Box Loads Messages from `localStorage`**

   - On page load and then every few seconds, we:
     - Check `localStorage`
     - Parse the messages
     - Update the DOM with any new ones

4. **We Use `setInterval()` to Poll for New Messages**

   - Every 2–3 seconds, the script re-reads `localStorage` and updates the display.

5. **Users Can Simulate Chat by Opening Multiple Tabs**

   - If two people use the chat in different browser tabs:
     - Messages sent from Tab A show up in Tab B on the next polling cycle.
     - No page refresh needed.



## Features

| Feature                    | Supported? | Description                                                   |
|----------------------------|------------|---------------------------------------------------------------|
| Simulated real-time chat   | Yes          | Achieved through regular polling of `localStorage`.           |
| Multiple users             | Yes          | Simulated by opening the site in different browser tabs.      |
| Message timestamps         | Yes          | Each message shows when it was sent.                          |
| Persistent messages        | Yes          | Messages persist until manually cleared from `localStorage`.  |
| Easy to test and demo      | Yes          | Great for live demos with no setup.                           |



## Limitations

- No cross-device or true real-time communication (only within the same browser).
- Not scalable as it is intended for demonstration or local simulation only.
- Not secure as all data is stored in plain text in the browser.

## Testing

1. Open the site in two tabs.
2. Choose different usernames in each tab.
3. Type and send messages — they should appear in both tabs within a few seconds.
4. Refresh either tab — messages persist due to `localStorage`.



