import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase} from "firebase/database";
import { getFirestore } from "firebase/firestore";

/**
 * Add your Firebase project configuration object here.
 *
 * You get this from the Firebase console.
 *
 * Go to your project settings and scroll down to the "Your apps" section.
 *
 * Click on the "Config" radio button and copy the object here.
 *
 * It should look something like this:
 *
 */
const firebaseConfig = {
  apiKey: "AIzaSyDI5w8MZcF5RmMCaPnusshJNSf2DtjYDCg",
  authDomain: "whatsapp-clone-fb1da.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-fb1da-default-rtdb.firebaseio.com",
  projectId: "whatsapp-clone-fb1da",
  storageBucket: "whatsapp-clone-fb1da.appspot.com",
  messagingSenderId: "688799465473",
  appId: "1:688799465473:web:659103a4cf46618a3b4000",
  measurementId: "G-EEV9GM1TLQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { auth, app, storage, database, firestore};
