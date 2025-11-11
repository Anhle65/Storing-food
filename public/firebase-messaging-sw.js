import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../src/config/firebase";
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
export const messaging = getMessaging(app);

// Retrieve FCM token
getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_CLOUD_MESSAGE }).then((currentToken) => {
    if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log('FCM registration token retrieved successfully:', currentToken);
        return currentToken
    } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
});
export const requestPermission = async () => {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        console.log("Notification permission granted.");

        // Get FCM token for this device/browser
        const token = await getToken(messaging, {
            vapidKey: "YOUR_WEB_PUSH_CERTIFICATE_KEY_PAIR",
        });
        console.log("FCM token:", token);

        // TODO: store token in Firestore under this user’s document
        return token;
    } else {
        console.warn("Permission not granted for notifications");
    }
};
window.requestPermission = requestPermission;
onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    // You can show a custom in-app alert or notification
});