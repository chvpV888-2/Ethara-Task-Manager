const API_BASE_URL = "/api";
const token = localStorage.getItem('token');

// SECURITY CHECK
if (!token) {
    window.location.href = 'index.html';
}

// SMOOTH LOGOUT
window.logoutUser = function() {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }, 400); 
};

// Global Arrays & Variables
let usersData = [];
let projectsData = [];
let userRole = "MEMBER";
let currentUsername = "";

function checkRoleAndAdaptUI() {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // 'ROLE_ADMIN' ya 'ADMIN' dono ko handle karne ke liye
        userRole = (payload.role || payload.roles || "MEMBER").toUpperCase().replace('ROLE_', ''); 
        currentUsername = payload.sub || payload.username || ""; 
        
        document.getElementById('userRoleBadge').textContent = `Role: ${userRole} | User: ${currentUsername}`;

        const adminSection = document.getElementById('adminSection');
        const taskContainer = document.getElementById('taskContainer');

        // STRICT CHECK: Agar Admin hai toh dikhao, warna force hide kar do
        if (userRole === 'ADMIN') {
            adminSection.classList.remove('hidden');
            adminSection.style.display = 'block'; // Force Show
            taskContainer.style.gridColumn = 'span 1';
        } else {
            adminSection.classList.add('hidden');
            adminSection.style.display = 'none'; // Force Hide
            taskContainer.style.gridColumn = '1 / -1'; // Pura space le lo
        }
    } catch (e) {
        console.error("Token parsing issue", e);
        // Agar error aaye toh bhi default Member maan kar hide kar do
        document.getElementById('adminSection').style.display = 'none';
    }
}

// DROPDOWN DATA FETCH KARNA
async function loadDropdowns() {
    try {
        const userRes = await fetch(`${API_BASE_URL}/auth/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
            usersData = await userRes.json();
            const assigneeSelect = document.getElementById('task-assignee-id');
            if(assigneeSelect) {
                assigneeSelect.innerHTML = '<option value="">Select Assignee User</option>';
                usersData.forEach(u => {
                    assigneeSelect.innerHTML += `<option value="${u.id}">${u.username} (${u.role})</option>`;
                });
            }
        }

        const projRes = await fetch(`${API_BASE_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (projRes.ok) {
            projectsData = await projRes.json();
            const projSelect = document.getElementById('task-project-id');
            if(projSelect) {
                projSelect.innerHTML = '<option value="">Select Project</option>';
                projectsData.forEach(p => {
                    projSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
                });
            }
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
        tasksList.innerHTML = ""; 
        let taskCount = 0;

        const today = new Date().toISOString().split('T')[0];

        tasks.forEach(task => {
            const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'COMPLETED';
            
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

            // FILTER: Agar Admin nahi hai, toh sirf apne task dekhega
            if (userRole !== 'ADMIN' && assignedName !== currentUsername) {
                return; // Dusre ke task hide kar do
            }
            
            taskCount++;
            const description = task.description || task.desc || "No description provided.";
            const currentStatus = task.status || "PENDING";

            // Status UI Logic: Admin badge dekhega, Member dropdown dekhega
            let statusUI = "";
            if (userRole === 'ADMIN') {
                const badgeColor = currentStatus === 'COMPLETED' ? '#2ecc71' : '#f39c12';
                statusUI = `<span style="background:${badgeColor}; color:white; padding:4px 8px; border-radius:12px; font-size:12px; font-weight:bold;">${currentStatus}</span>`;
            } else {
                statusUI = `
                    <select onchange="updateTaskStatus(${task.id}, this.value)" style="width: auto; padding: 4px; margin-top: 0; font-size: 14px;">
                        <option value="PENDING" ${currentStatus === 'PENDING' ? 'selected' : ''}>Pending</option>
                        <option value="COMPLETED" ${currentStatus === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                    </select>
                `;
            }

            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${isOverdue ? 'overdue' : ''}`;
            taskEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0;">${task.title} ${isOverdue ? '<span style="color:red; font-size:12px;">(OVERDUE)</span>' : ''}</h4>
                    <div>${statusUI}</div>
                </div>
                <p style="margin-top: 10px;">${description}</p>
                <small><strong>Due Date:</strong> ${task.dueDate || 'N/A'} | <strong>Project:</strong> ${projectName} | <strong>Assigned To:</strong> ${assignedName}</small>
            `;
            tasksList.appendChild(taskEl);
        });

        if (taskCount === 0) {
            tasksList.innerHTML = "<p style='color: var(--text-muted);'>No tasks found for you.</p>";
        }

    } catch (error) {
        tasksList.innerHTML = `<p style="color:var(--danger);">Error fetching tasks.</p>`;
    }
}

// UPDATE STATUS FUNCTION (Member Call Karega)
window.updateTaskStatus = async function(taskId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            fetchTasks(); // UI refresh karne ke liye taaki color waghera update ho jaye
        } else {
            alert("Failed to update status");
        }
    } catch (error) {
        console.error("Error updating status:", error);
    }
};

// CREATE PROJECT
document.getElementById('projectForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('proj-name').value;
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });
        if (response.ok) {
            alert("Project created!");
            e.target.reset();
            loadDropdowns();
        }
    } catch (error) { console.error(error); }
});

// ASSIGN TASK
// ASSIGN TASK
const taskForm = document.getElementById('taskForm');
if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Button ko "Assigning..." me badal do taaki pata chale click hua hai
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Assigning...";
        submitBtn.disabled = true;

        // IDs ko zabardasti Number (Integer) mein convert kar rahe hain (parseInt)
        const taskData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-desc').value,
            dueDate: document.getElementById('task-due').value,
            projectId: parseInt(document.getElementById('task-project-id').value),
            assigneeId: parseInt(document.getElementById('task-assignee-id').value)
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
                alert("Task assigned successfully! 🎉");
                e.target.reset();
                fetchTasks(); // Naya task list mein add karne ke liye
            } else {
                // Agar Spring Boot ne mana kar diya, toh exact error dikhayega
                const errorText = await response.text();
                alert("Failed to assign task: " + errorText);
            }
        } catch (error) { 
            console.error("Network Error:", error);
            alert("Network issue! Server se connect nahi ho paya.");
        } finally {
            // Button wapas normal kar do
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', async () => {
    checkRoleAndAdaptUI();
    await loadDropdowns(); 
    fetchTasks();          
});