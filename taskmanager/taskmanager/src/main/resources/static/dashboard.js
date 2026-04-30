const API_BASE_URL = "/api";
const token = localStorage.getItem('token');

// SECURITY CHECK
if (!token) {
    window.location.href = 'index.html';
}

window.logoutUser = function() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
};

// Global Arrays to map IDs to Names
let usersData = [];
let projectsData = [];

function checkRoleAndAdaptUI() {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || payload.roles || "MEMBER"; 
        
        document.getElementById('userRoleBadge').textContent = `Role: ${role}`;

        if (role.toUpperCase() === 'ADMIN') {
            document.getElementById('adminSection').classList.remove('hidden');
            document.getElementById('taskContainer').style.gridColumn = 'span 1';
        }
    } catch (e) {
        document.getElementById('adminSection').classList.remove('hidden');
    }
}

// DROPDOWN DATA FETCH KARNA
async function loadDropdowns() {
    try {
        // Fetch All Users
        const userRes = await fetch(`${API_BASE_URL}/auth/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
            usersData = await userRes.json();
            const assigneeSelect = document.getElementById('task-assignee-id');
            assigneeSelect.innerHTML = '<option value="">Select Assignee User</option>';
            usersData.forEach(u => {
                assigneeSelect.innerHTML += `<option value="${u.id}">${u.username} (${u.role})</option>`;
            });
        }

        // Fetch All Projects
        const projRes = await fetch(`${API_BASE_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (projRes.ok) {
            projectsData = await projRes.json();
            const projSelect = document.getElementById('task-project-id');
            projSelect.innerHTML = '<option value="">Select Project</option>';
            projectsData.forEach(p => {
                projSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading dropdown data:", error);
    }
}

// FETCH TASKS
async function fetchTasks() {
    const tasksList = document.getElementById('tasksList');
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            logoutUser();
            return;
        }

        const tasks = await response.json();
        
        if (tasks.length === 0) {
            tasksList.innerHTML = "<p>No tasks found.</p>";
            return;
        }

        tasksList.innerHTML = ""; 
        const today = new Date().toISOString().split('T')[0];

        tasks.forEach(task => {
            const isOverdue = task.dueDate && task.dueDate < today;
            
            // Map IDs to Names
            let assignedName = "Unknown User";
            let projectName = "No Project";

            if (task.assignee && task.assignee.username) assignedName = task.assignee.username;
            else {
                const foundUser = usersData.find(u => u.id == task.assigneeId);
                if (foundUser) assignedName = foundUser.username;
            }

            if (task.project && task.project.name) projectName = task.project.name;
            else {
                const foundProj = projectsData.find(p => p.id == task.projectId);
                if (foundProj) projectName = foundProj.name;
            }

            // Fixed "undefined" description bug
            const description = task.description || task.desc || "No description provided.";

            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${isOverdue ? 'overdue' : ''}`;
            taskEl.innerHTML = `
                <h4>${task.title} ${isOverdue ? '<span style="color:red; font-size:12px;">(OVERDUE)</span>' : ''}</h4>
                <p>${description}</p>
                <small><strong>Due Date:</strong> ${task.dueDate || 'N/A'} | <strong>Project:</strong> ${projectName} | <strong>Assigned To:</strong> ${assignedName}</small>
            `;
            tasksList.appendChild(taskEl);
        });

    } catch (error) {
        tasksList.innerHTML = `<p style="color:red;">Error fetching tasks.</p>`;
    }
}

// CREATE PROJECT
document.getElementById('projectForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('proj-name').value;

    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        });

        if (response.ok) {
            alert("Project created!");
            e.target.reset();
            loadDropdowns(); // Dropdown list update karne ke liye
        }
    } catch (error) {
        console.error(error);
    }
});

// ASSIGN TASK
document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value, // Used 'description'
        dueDate: document.getElementById('task-due').value,
        projectId: document.getElementById('task-project-id').value,
        assigneeId: document.getElementById('task-assignee-id').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            alert("Task assigned successfully!");
            e.target.reset();
            fetchTasks(); 
        }
    } catch (error) {
        console.error(error);
    }
});

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', async () => {
    checkRoleAndAdaptUI();
    await loadDropdowns(); // Pehle dropdowns laao
    fetchTasks();          // Phir tasks dikhao proper naam ke sath
});