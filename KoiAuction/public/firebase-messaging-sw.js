// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object.
const firebaseConfig = {
  apiKey: "AIzaSyDeTU69iHYEgKOJy6d_QUVQ85uI545R7Ew",
  authDomain: "bidkoi-16827.firebaseapp.com",
  projectId: "bidkoi-16827",
  storageBucket: "bidkoi-16827.appspot.com",
  messagingSenderId: "1046938018364",
  appId: "1:1046938018364:web:5b171d7676d864d13cd939",
  measurementId: "G-4NHQ74L9LE",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body || "Background Message body.",
    icon: payload.notification?.icon || "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
