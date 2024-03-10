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

// reference to database
const database = getDatabase(firebaseApp);

const ctx = document.getElementById('currentChart').getContext('2d');

// initializing chart
const currentChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],  
        datasets: [{
            label: 'Current',
            data: [0],  
            borderColor:'rgba(8, 109, 5, 1)',
            backgroundColor:"rgba(11, 141, 7, 0.4)",
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
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems, data) {
                        // Format the time to hours:minutes:seconds
                        const time = new Date(tooltipItems[0].parsed.x);
                        const hours = time.getHours().toString().padStart(2, '0');
                        const minutes = time.getMinutes().toString().padStart(2, '0');
                        const seconds = time.getSeconds().toString().padStart(2, '0');
                        return `${hours}:${minutes}:${seconds}`;
                    },
                    
                }
            }
        }
    }
});

// Reference to firebase data
const dataRef = ref(database, 'User/Current');


// max. no. of data points to display
const maxDataPoints = 10;

// initial value
get(dataRef).then((snapshot) => {
    const initialValue = snapshot.val();
    console.log('Initial Value:', initialValue);

    // updating chart data with initial value
    currentChart.data.labels = [new Date().getTime()];  
    currentChart.data.datasets[0].data = [initialValue];
    currentChart.update();
}).catch((error) => {
    console.error('Error fetching initial value:', error);
});

// checking changes in data
onValue(dataRef, (snapshot) => {
    const value = snapshot.val();

    if (value !== null) {
        // update chart data
        //const customLabel = 'Power'; // Replace this with your desired label
        const currentTime = new Date().getTime();
        currentChart.data.labels.push(currentTime);
        currentChart.data.datasets[0].data.push(value);


        // remove oldest data points if limit is reached
        while (currentChart.data.labels.length > maxDataPoints) {
            currentChart.data.labels.shift();
            currentChart.data.datasets[0].data.shift();
        }


        // Update chart
        currentChart.update();
    }
});