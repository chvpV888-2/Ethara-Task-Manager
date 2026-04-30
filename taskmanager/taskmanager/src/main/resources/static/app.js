// Relative URL use kar rahe hain kyunki frontend backend ke andar hi hai
const API_BASE_URL = "/api";

// ==========================================
// 1. LOGIN LOGIC
// ==========================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Page refresh hone se rokega
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const messageEl = document.getElementById('login-message');

        try {
            messageEl.textContent = "Logging in...";
            messageEl.style.color = "blue";

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.text();

            if (response.ok) {
                // Success! Token save karo aur dashboard par jao
                localStorage.setItem('token', data);
                window.location.href = 'dashboard.html';
            } else {
                messageEl.textContent = "Login Failed: " + data;
                messageEl.style.color = "red";
            }
        } catch (error) {
            console.error("Login Error:", error);
            messageEl.textContent = "Error connecting to server.";
            messageEl.style.color = "red";
        }
    });
}

// ==========================================
// 2. SIGNUP LOGIC
// ==========================================
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Page refresh hone se rokega
        
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const role = document.getElementById('reg-role').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            const data = await response.text();

            if (response.ok) {
                alert("Signup successful! Please login.");
                window.location.href = 'index.html'; // Signup ke baad login par bhej do
            } else {
                alert("Signup Failed: " + data);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Error connecting to server.");
        }
    });
}