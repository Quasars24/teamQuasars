import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';
import { getDatabase, ref, get, onValue } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js';
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgDR2vriErfaOSrC7QChEvV2yexqeFAMU",
    authDomain: "quasars-be893.firebaseapp.com",
    databaseURL: "https://quasars-be893-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quasars-be893",
    storageBucket: "quasars-be893.appspot.com",
    messagingSenderId: "667170242653",
    appId: "1:667170242653:web:05324cfd8e846235520db4",
    measurementId: "G-FJZ8CMCPTC"
};

// Initialize Firebase
const firebaseApp= initializeApp(firebaseConfig);

// Reference to firebase database
const database = getDatabase(firebaseApp);

// reference to "User" node
const userRef = ref(database, 'User');

// fetch data from Firebase and populate the table
onValue(userRef, (snapshot) => {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // clear existing rows
    console.log('Data changed:', snapshot.val()); //to check data changes

if (snapshot.exists()) {
    const data = snapshot.val();
    
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];

            // creating a new row in table
            const row = tableBody.insertRow(tableBody.rows.length);

            // creating cells for the row
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);

            // setting the cell values
            cell1.innerHTML = key;
            cell2.innerHTML = value;
        }
    }
} else {
    console.log("No data available");
}
});