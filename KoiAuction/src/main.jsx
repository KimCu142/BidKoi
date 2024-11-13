import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <ToastContainer />
  </>
);

// Đăng ký service worker cho Firebase Messaging
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log(
        "Service Worker đã đăng ký thành công với scope:",
        registration.scope
      );
    })
    .catch((error) => {
      console.error("Đăng ký Service Worker thất bại:", error);
    });
}
