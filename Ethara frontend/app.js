// The address of our Java backend
const API_BASE_URL = "https://ethara-task-manager-production.up.railway.app";

// This function runs when the user clicks the "Log In" button
async function login(event) {
    event.preventDefault(); // Stops the page from refreshing automatically

    // 1. Grab the text the user typed into the boxes
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
        // 2. Knock on the Spring Boot login door
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        // 3. Did the Bouncer let us in?
        if (response.ok) {
            // Yes! Grab the VIP Badge (JWT) from the server's response
            const token = await response.text(); 
            
            // Save the badge into the browser's permanent memory (localStorage)
            localStorage.setItem('jwt_token', token);
            
            // Redirect the user to the dashboard
            window.location.href = "dashboard.html"; 
        } else {
            // No! Show the error message
            document.getElementById('error-message').style.display = "block";
        }
    } catch (error) {
        console.error("Connection error:", error);
        alert("Cannot connect to the server. Is Spring Boot running?");
    }
}