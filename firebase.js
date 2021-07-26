/** @format */
import firebase from "firebase";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBaCZQ6NjlwoCFA5FmrBHj-mPFaUSMpY6A",
  authDomain: "chatapp-next.firebaseapp.com",
  projectId: "chatapp-next",
  storageBucket: "chatapp-next.appspot.com",
  messagingSenderId: "457206091517",
  appId: "1:457206091517:web:0407e4dceffdadf0f7b894",
  measurementId: "G-T1B9RRNL4J",
};
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { storage, db, auth, provider };
