import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";

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
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const messaging = getMessaging(app);

export { storage, messaging };
