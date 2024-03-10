import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';
import { getDatabase, ref, get, onValue } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js';

// Firebase config
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

// Reference to the database
const database = getDatabase(firebaseApp);

const ctx = document.getElementById('anomalyscore').getContext('2d');

// Initializing chart
const anomalyscore = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],  
        datasets: [{
            label: 'Anomaly Score',
            data: [],  // Empty initially
            backgroundColor: 'rgba(176, 11, 11, 0.55)',
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            tension: 0.5
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',  // 'linear' for time series
                position: 'bottom',
                ticks: {
                    callback: function (value, index, values) {
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

// Reference to firebase data
const dataRef = ref(database, 'AnomalyScore/anomaly');

// Max. number of data points to display
const maxDataPoints = 4;

// Fetch initial value
get(dataRef).then((snapshot) => {
    const initialData = snapshot.val();
    console.log('Initial Data:', initialData);

    if (initialData !== null) {
        // Populate chart with initial data
        anomalyscore.data.labels = Object.keys(initialData);
        anomalyscore.data.datasets[0].data = Object.values(initialData);

        // Update chart
        anomalyscore.update();
    }
}).catch((error) => {
    console.error('Error fetching initial data:', error);
});

// Listen for changes in data
onValue(dataRef, (snapshot) => {
    const newData = snapshot.val();

    if (newData !== null) {
        // Populate chart with new data
        anomalyscore.data.labels = Object.keys(newData);
        anomalyscore.data.datasets[0].data = Object.values(newData);

        // Update chart
        anomalyscore.update();
    }
});