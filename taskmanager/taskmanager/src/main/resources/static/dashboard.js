const API_BASE_URL = "/api";
const token = localStorage.getItem('token');

// AGAR TOKEN NAHI HAI TOH LOGIN PAR BHEJ DO
if (!token) {
    window.location.href = 'index.html';
}

// LOGOUT BUTTON LOGIC
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// DATA FETCH KARNE KA FUNCTION (Yahan token use hota hai!)
async function fetchTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // <-- YEH SABSE ZAROORI LINE HAI
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            // Agar backend bole "Tum kaun?", toh token delete karo aur login pe bhejo
            console.error("Token invalid ya expire ho gaya hai!");
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        const data = await response.json();
        console.log("Tasks Fetched:", data);
        // TODO: Yahan apne tasks ko UI mein dikhane ka logic daalo
        
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// JAB PAGE LOAD HO TOH TASKS LAO
document.addEventListener('DOMContentLoaded', fetchTasks);