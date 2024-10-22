import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAb58ZMgo5uzCU0CftgOfepXsA8iZkcptU",
  authDomain: "mma-project-3ab97.firebaseapp.com",
  projectId: "mma-project-3ab97",
  storageBucket: "mma-project-3ab97.appspot.com",
  messagingSenderId: "717418956869",
  appId: "1:717418956869:web:45cba00df058f32d62bb2c",
  measurementId: "G-V5YZNNBNGF",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
