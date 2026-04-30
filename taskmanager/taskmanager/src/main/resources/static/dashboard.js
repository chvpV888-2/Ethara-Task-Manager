const API_BASE_URL = "/api";
const token = localStorage.getItem('token');

// 1. SECURITY CHECK: Agar token nahi hai toh bhaga do
if (!token) {
    window.location.href = 'index.html';
}

// 2. LOGOUT FUNCTION: Ye function globally set kiya hai taaki button chal sake
window.logoutUser = function() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
};

// 3. ROLE CHECK (RBAC): Token padh ke pata lagana ki user Admin hai ya Member
function checkRoleAndAdaptUI() {
    try {
        // Token ka data nikalna
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || payload.roles || "MEMBER"; 
        
        document.getElementById('userRoleBadge').textContent = `Role: ${role}`;

        // Agar Admin hai toh form dikhao
        if (role.toUpperCase() === 'ADMIN') {
            document.getElementById('adminSection').classList.remove('hidden');
            document.getElementById('taskContainer').style.gridColumn = 'span 1'; // Grid ko adjust karo
        }
    } catch (e) {
        console.error("Token read nahi ho paya", e);
        // Fallback: Agar token samajh na aaye toh sab dikha do taaki UI break na ho
        document.getElementById('adminSection').classList.remove('hidden');
    }
}

// 4. FETCH TASKS: Tasks backend se mangwana
async function fetchTasks() {
    const tasksList = document.getElementById('tasksList');
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // <-- JWT FIX
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Session expired. Please login again.");
            logoutUser();
            return;
        }

        const tasks = await response.json();
        
        if (tasks.length === 0) {
            tasksList.innerHTML = "<p>You have no tasks assigned yet.</p>";
            return;
        }

        tasksList.innerHTML = ""; // Purana "loading" text hatao
        const today = new Date().toISOString().split('T')[0];

        tasks.forEach(task => {
            // Overdue Tracking Logic
            const isOverdue = task.dueDate && task.dueDate < today;
            
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${isOverdue ? 'overdue' : ''}`;
            taskEl.innerHTML = `
                <h4>${task.title} ${isOverdue ? '<span style="color:red; font-size:12px;">(OVERDUE)</span>' : ''}</h4>
                <p>${task.description}</p>
                <small><strong>Due Date:</strong> ${task.dueDate} | <strong>Project ID:</strong> ${task.projectId || 'N/A'}</small>
            `;
            tasksList.appendChild(taskEl);
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        tasksList.innerHTML = `<p style="color:red;">Error connecting to server to fetch tasks.</p>`;
    }
}

// 5. CREATE PROJECT (Admin Only)
document.getElementById('projectForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('proj-name').value;

    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // <-- JWT FIX
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        });

        if (response.ok) {
            alert("Project created successfully!");
            e.target.reset(); // Form clear karo
        } else {
            alert("Failed to create project.");
        }
    } catch (error) {
        console.error(error);
    }
});

// 6. ASSIGN TASK (Admin Only)
document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Yahan tumhare DB ke columns ke hisaab se data set kiya hai
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value,
        dueDate: document.getElementById('task-due').value,
        projectId: document.getElementById('task-project-id').value,
        assigneeId: document.getElementById('task-assignee-id').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // <-- JWT FIX
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            alert("Task assigned successfully!");
            e.target.reset(); // Form clear karo
            fetchTasks(); // Naya task turant list mein dikhane ke liye reload
        } else {
            alert("Failed to assign task.");
        }
    } catch (error) {
        console.error(error);
    }
});

// PAGE LOAD HOTE HI KYA KYA CHALANA HAI
document.addEventListener('DOMContentLoaded', () => {
    checkRoleAndAdaptUI();
    fetchTasks();
});