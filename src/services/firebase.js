import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyDEvgAtsxyLzlcJL08Wyva3tTHhepT_Cm8",
  authDomain: "database-sc.firebaseapp.com",
  databaseURL: "https://database-sc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "database-sc",
  storageBucket: "database-sc.appspot.com",
  messagingSenderId: "793281305958",
  appId: "1:793281305958:web:76676725032d79c83bfca7"
}

firebase.initializeApp(config);
const db = firebase.database().ref('todo/');

export default db;