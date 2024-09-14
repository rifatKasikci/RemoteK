# RemoteK

RemoteK is a powerful cross-platform solution that enables users to remotely control and manage their computers, including shutdown and restart commands, through a mobile app. This project leverages Electron, React Native, and NestJS to create a seamless integration between mobile and desktop environments.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
  - [Backend (NestJS)](#backend-nestjs)
  - [Desktop Client (Electron)](#desktop-client-electron)
  - [Mobile App (React Native)](#mobile-app-react-native)
- [Usage](#usage)
  - [Starting the Services](#starting-the-services)
  - [Executing Remote Commands](#executing-remote-commands)
  - [Canceling Remote Commands](#canceling-remote-commands)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview
RemoteK allows users to send commands (shutdown, restart, etc.) from a mobile app to their computer using a message queue system. The desktop app, built using Electron, listens for these commands and executes them on the user's system. The backend, built on NestJS, handles authentication, command validation, and manages communication between the mobile app and the desktop client. The mobile app, built using React Native, provides an intuitive interface for sending commands.

## Features
- **Cross-platform Desktop Control**: Supports shutdown and restart commands on Windows, macOS, and Linux.
- **Mobile Command Center**: Easily manage your computer remotely using the mobile app.
- **Countdown Timer**: The desktop app displays a countdown, allowing users to cancel the command before it’s executed.
- **Secure Communication**: JWT-based authentication for secure communication between the app and the backend.
- **RabbitMQ Integration**: Uses RabbitMQ for reliable and scalable message delivery.
- **React Native Mobile Interface**: User-friendly mobile interface to control the desktop app.

## Technologies Used
- **Electron.js**: Cross-platform desktop app framework.
- **NestJS**: Backend framework for handling authentication, command processing, and RabbitMQ integration.
- **React Native**: Cross-platform mobile app framework for sending commands.
- **RabbitMQ**: Message queue for communication between the mobile app and desktop client.
- **JWT (JsonWebToken)**: Secure token-based authentication.
- **Bootstrap**: Frontend UI framework for the desktop app.

## Architecture
RemoteK is structured as a multi-service application:
- **Backend (NestJS)**: Handles user authentication, manages RabbitMQ queues, and serves as the API for the mobile app.
- **Desktop Client (Electron)**: Listens for messages from the RabbitMQ queue and executes the received commands on the computer.
- **Mobile App (React Native)**: Allows users to authenticate and send commands to their computer.

## Setup & Installation

### Backend (NestJS)
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/remotek-backend.git
    cd remotek-backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables in a `.env` file:
    ```bash
    MONGO_URI=your-mongodb-uri
    RABBITMQ_URL=your-rabbitmq-url
    JWT_SECRET=your-jwt-secret
    ```
4. Start the NestJS server:
    ```bash
    npm run start:dev
    ```

### Desktop Client (Electron)
1. Navigate to the Electron client directory:
    ```bash
    cd remotek-electron
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables in a `.env` file:
    ```bash
    RABBITMQ_URL=your-rabbitmq-url
    API_URL=your-backend-url
    ```
4. Start the Electron app:
    ```bash
    npm start
    ```

### Mobile App (React Native)
1. Navigate to the React Native app directory:
    ```bash
    cd remotek-mobile
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables in a `.env` file:
    ```bash
    EXPO_PUBLIC_API_URL=your-backend-url
    ```
4. Start the mobile app (for Android):
    ```bash
    npm run android
    ```
   For iOS:
    ```bash
    npm run ios
    ```

## Usage

### Starting the Services
- Ensure that RabbitMQ, the backend, desktop client, and mobile app are all running.
- Log in through the mobile app to get the JWT token and communicate with the backend.
- The desktop client listens to commands sent through the RabbitMQ queue.

### Executing Remote Commands
- On the mobile app, select the action (shutdown, restart) to be sent to the desktop client.
- Once a command is sent, the desktop app receives it and starts the countdown timer.

### Canceling Remote Commands
- On the desktop client, a countdown will appear allowing the user to cancel the operation.
- Click "Cancel Command" before the timer ends to stop the shutdown or restart process.

## Configuration
The project uses `.env` files for configuration. Below is an example of the variables needed:

**Backend**
```makefile
RABBITMQ_URL=amqp://localhost
JWT_SECRET=your_jwt_secret
```

## Desktop Client (Electron)
1. **Navigate to the Electron client directory:**
    ```bash
    cd remotek-electron
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables in a `.env` file:**
    ```env
    RABBITMQ_URL=amqp://localhost
    ```
4. **Start the Electron app:**
    ```bash
    npm start
    ```

## Mobile App (React Native)
1. **Navigate to the React Native app directory:**
    ```bash
    cd remotek-mobile
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables in a `.env` file:**
    ```env
    API_URL=http://localhost:3000
    ```
4. **Start the mobile app (for Android):**
    ```bash
    npm run android
    ```
   **For iOS:**
    ```bash
    npm run ios
    ```

## Troubleshooting
- **RabbitMQ Connection Issues**: Ensure RabbitMQ is running and the `RABBITMQ_URL` is set correctly.
- **Command Not Executing**: Check if the desktop client is connected to the correct RabbitMQ queue and if the command is properly formatted.
- **Mobile App Not Connecting**: Verify the API URL in the mobile app’s `.env` file is correct.

## Contributing
We welcome contributions! Please follow these steps:
1. **Fork the repository.**
2. **Create a new branch for your feature or bug fix:**
    ```bash
    git checkout -b feature/my-new-feature
    ```
3. **Commit your changes:**
    ```bash
    git commit -m "Add some feature"
    ```
4. **Push to the branch:**
    ```bash
    git push origin feature/my-new-feature
    ```
5. **Submit a pull request.**

## License
This project is licensed under the MIT License.
