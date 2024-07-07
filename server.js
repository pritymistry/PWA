const express = require('express');
const webPush = require('web-push');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Replace these with your actual VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();
const publicVapidKey = vapidKeys.publicKey;
const privateVapidKey =  vapidKeys.privateKey;

webPush.setVapidDetails('mailto:pritymis78@gmail.com', publicVapidKey, privateVapidKey);

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'news-pwa')));

let subscriptions = [];

app.post('/subscribe', async(req, res) => {
    const subscription = req.body;
    // console.log('Received subscription:', subscription);
    subscriptions.push(subscription);
    res.status(201).json({});

    const payload = JSON.stringify({
        title: 'Push Notification',
        body: 'hey, see what is happening in the world today!',
    });
    try {
        await webPush.sendNotification(subscription, payload);
        console.log('Push notification sent successfully');
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log("Public Key: ", publicVapidKey);
    console.log("Private Key: ",privateVapidKey);
});
