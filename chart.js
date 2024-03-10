import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';
import { getDatabase, ref, get, onValue } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js';

//firebase config
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
const firebaseApp = initializeApp(firebaseConfig);

//reference to database
const database = getDatabase(firebaseApp);

// get canvas context
const ctx = document.getElementById('myChar').getContext('2d');

// initialize chart
const myChar = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],  
        datasets: [
            {
                label: 'Power',
                data: [],
                borderColor: 'purple',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Current',
                data: [],
                borderColor: 'green',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Energy',
                data: [],
                borderColor: 'orange',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Voltage',
                data: [],
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }
        ]
    },
    options: {
        scales: {
            x: {
                type: 'linear',  
                position: 'bottom',
                ticks: {
                    callback: function (value, index, values) {
                        // timestamp 
                        return new Date(value).toLocaleTimeString();
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

// reference to firebase data
const dataRef1 = ref(database, 'Power/power');
const dataRef2 = ref(database, 'Current/current');
const dataRef3 = ref(database, 'Energy/energy');
const dataRef4 = ref(database, 'Voltage/voltage');

// Max data points
const maxDataPoints = 10;

// Function to handle data updates for each dataset
function handleDataUpdate(dataRef, datasetIndex, borderColor) {
    onValue(dataRef, (snapshot) => {
        const value = snapshot.val();

        if (value !== null) {
            // Updating chart data for specific dataset
            //const currentTime = 'po';
            myChar.data.labels.push("");
            myChar.data.datasets[datasetIndex].data.push(value);

            // remove oldest data pts.if limit reached
            while (myChar.data.labels.length > maxDataPoints) {
                myChar.data.labels.shift();
                myChar.data.datasets[datasetIndex].data.shift();
            }

            // Update chart
            myChar.update();
        }
    });
}

//data updates for each dataset
handleDataUpdate(dataRef1, 0, 'purple');
handleDataUpdate(dataRef2, 1, 'green');
handleDataUpdate(dataRef3, 2, 'orange');
handleDataUpdate(dataRef4, 3, 'blue');
