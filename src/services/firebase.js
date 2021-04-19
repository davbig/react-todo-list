import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyASiLo_OTebZdBl6v5XqPsFioZTQUNEGJ4",
  authDomain: "sc-tutorial-f6035.firebaseapp.com",
  databaseURL: "https://sc-tutorial-f6035-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sc-tutorial-f6035",
  storageBucket: "sc-tutorial-f6035.appspot.com",
  messagingSenderId: "17552733411",
  appId: "1:17552733411:web:430ac4663ca06d6986c1d6"
}

firebase.initializeApp(config);
const db = firebase.database().ref('todo/');

export default db;