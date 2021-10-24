import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAlIw5yrnF8fU5j-H7N347nGx59OOzEKjY",
  authDomain: "drive-1e88b.firebaseapp.com",
  projectId: "drive-1e88b",
  storageBucket: "drive-1e88b.appspot.com",
  messagingSenderId: "884275811390",
  appId: "1:884275811390:web:3b7ba7942a6840b327ed6f",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export {auth, provider, db, storage};

