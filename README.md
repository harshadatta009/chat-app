If you haven't implemented the **online/offline** feature yet, you can exclude or update that section in the `README.md`. Here's the modified version:

---

# Firebase Chat App 🚀

A real-time chat application built with **React**, **TypeScript**, and **Firebase**. This app features one-to-one messaging, user authentication, profile management, and a modern, responsive UI.

---

## Features ✨

- **User Authentication**: Sign up, login, and logout using Firebase Authentication.
- **One-to-One Messaging**: Real-time private chats with other users.
- **Profile Management**: Edit and update user profile information.
- **Responsive UI**: Modern and user-friendly interface built with Bootstrap and Framer Motion.
- **Environment Variables**: Secures Firebase configuration using `.env` file.

---

## Demo 📸

### Users List

(image.png)

### Chat Interface

(image-1.png)

---

## Tech Stack 🛠️

- **Frontend**: React, TypeScript, Bootstrap, Framer Motion
- **Backend**: Firebase Authentication, Firestore
- **Hosting**: Firebase Hosting (optional)

---

## Getting Started 🚀

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Firebase account with a project set up

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/harshadatta009/chat-app.git
   cd firebase-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:

   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## Project Structure 🗂️

```
src/
├── components/          # Reusable UI components (Navbar, Footer, Chat components)
├── pages/               # Pages (Login, Signup, Profile, ChatPage, UsersList)
├── firebase/            # Firebase configuration and utilities
├── hooks/               # Custom React hooks (e.g., useAuth)
├── router/              # React Router setup
└── App.tsx              # Main app component
```

---

## Scripts 📜

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build.

---

## Environment Variables ⚙️

The app uses a `.env` file for secure storage of Firebase credentials. Example:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## Deployment 📦

1. Build the app:

   ```bash
   npm run build
   ```

2. Deploy using Firebase Hosting:
   ```bash
   firebase deploy
   ```

---

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

---

## License 📝

This project is licensed under the [MIT License](LICENSE).

---

## Contact 📧

For any questions or feedback:

- Email: harshadatta99@gmail.com
- GitHub: [@harshadatta009](https://github.com/harshadatta009)

---
