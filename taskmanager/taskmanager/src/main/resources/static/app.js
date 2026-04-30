// Humne frontend ko backend ke saath merge kiya hai, 
// isliye pura URL dene ki zaroorat nahi hai.
const API_BASE_URL = "/api"; 

// LOGIN LOGIC
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        if (response.ok) {
            const token = await response.text(); 
            localStorage.setItem('jwt_token', token);
            window.location.href = "dashboard.html"; 
        } else {
            document.getElementById('error-message').style.display = "block";
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Server connection failed.");
    }
});

// SIGNUP LOGIC (Naya User/Member banane ke liye)
document.getElementById('signupForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const usernameInput = document.getElementById('reg-username').value;
    const passwordInput = document.getElementById('reg-password').value;
    const roleInput = document.getElementById('reg-role').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: usernameInput, 
                password: passwordInput,
                role: roleInput 
            })
        });

        if (response.ok) {
            alert("Registration Successful! Please Login.");
            window.location.href = "index.html"; 
        } else {
            alert("Registration failed. User might already exist.");
        }
    } catch (error) {
        console.error("Signup error:", error);
    }
});