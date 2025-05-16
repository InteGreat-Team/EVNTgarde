import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  type UserCredential,
  signOut,
} from "firebase/auth"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC-eDd0c1NhJiijRIktUKEN-9lFWiZmEYY",
  authDomain: "evntgarde-event-management.firebaseapp.com",
  projectId: "evntgarde-event-management",
  storageBucket: "evntgarde-event-management.firebasestorage.app",
  messagingSenderId: "182453082295",
  appId: "1:182453082295:web:df06367405642777e85532",
  measurementId: "G-324P7YE4EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

// Configure providers
const googleProvider = new GoogleAuthProvider()
const yahooProvider = new OAuthProvider("yahoo.com")

googleProvider.addScope("email")
googleProvider.addScope("profile")

export {
  auth,
  db,
  googleProvider,
  yahooProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  type UserCredential,
  signOut,
}

