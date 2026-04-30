const API_BASE_URL = "https://ethara-task-manager-production.up.railway.app/api";

// 1. This runs the exact second the page loads
window.onload = function() {
    const token = localStorage.getItem('jwt_token');
    
    // Security Check: If no badge, kick them back to login!
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // Role Check: Un-hide the Admin Section if they are an ADMIN
    const role = getRoleFromToken(token);
    if (role === 'ADMIN') {
        document.getElementById('admin-section').style.display = "block";
    }

    // Finally, go get the tasks!
    fetchTasks();
};

// --- HELPER FUNCTION: Reads the Role from the JWT ---
function getRoleFromToken(token) {
    try {
        // JWTs are base64 encoded. This splits the token and decodes the payload to read the "role" we saved earlier!
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        return 'MEMBER';
    }
}

// --- FETCH TASKS FROM SPRING BOOT ---
async function fetchTasks() {
    const token = localStorage.getItem('jwt_token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Show the VIP Badge to the server!
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            alert("Session expired. Please log in again.");
            logout();
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// --- PAINT TASKS ON THE SCREEN ---
function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ""; // Clear the "Loading..." text

    if (tasks.length === 0) {
        taskList.innerHTML = "<p>No tasks found.</p>";
        return;
    }

    // Get today's date so we can check if tasks are overdue!
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
        // Check if overdue
        const isOverdue = task.dueDate < today && task.status !== 'COMPLETED';
        const cssClass = isOverdue ? "task-card overdue" : "task-card on-time";

        // Build the HTML box for the task
        const taskBox = document.createElement('div');
        taskBox.className = cssClass;
        taskBox.innerHTML = `
            <h4>${task.title}</h4>
            <p><strong>Status:</strong> ${task.status}</p>
            <p><strong>Due Date:</strong> <span style="color: ${isOverdue ? 'red' : 'black'}">${task.dueDate}</span></p>
            <p><strong>Project ID:</strong> ${task.project.id} | <strong>Assignee ID:</strong> ${task.assignee.id}</p>
        `;
        
        taskList.appendChild(taskBox);
    });
}

// --- CREATE A NEW TASK (ADMIN ONLY) ---
// --- Inside your dashboard.js ---
async function createTask(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('jwt_token');
    const title = document.getElementById('task-title').value;
    const dueDate = document.getElementById('task-date').value;

    // Grab the dynamic IDs from the new input fields
    const projectId = document.getElementById('project-id-input').value;
    const assigneeId = document.getElementById('assignee-id-input').value;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                dueDate: dueDate,
                projectId: parseInt(projectId), // Ensure it's sent as a number
                assigneeId: parseInt(assigneeId)
            })
        });

        if (response.ok) {
            alert("Task Created Successfully!");
            document.getElementById('task-title').value = "";
            document.getElementById('task-date').value = "";
            fetchTasks(); 
        } else {
            const errorData = await response.json();
            console.error("Server rejected task:", errorData);
            alert("Failed to create task. Check if Project/User ID exists.");
        }
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

// --- LOGOUT FUNCTION ---
function logout() {
    localStorage.removeItem('jwt_token'); // Shred the VIP Badge
    window.location.href = "index.html"; // Kick them to the login screen
}