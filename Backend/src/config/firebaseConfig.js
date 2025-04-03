// src/firebase/firebaseConfig.js (hoặc bất kỳ tên file nào bạn muốn)

import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics" // Bạn có thể bỏ nếu không dùng analytics
import dotenv from 'dotenv'

// Load .env
dotenv.config()

// Firebase config từ biến môi trường
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Nếu bạn dùng analytics, có thể enable như sau:
// const analytics = getAnalytics(firebaseApp)

export default firebaseApp
