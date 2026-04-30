====================================================
🚀 ETHARA AI - FULL-STACK TASK MANAGER
====================================================

A secure, enterprise-ready task management application built with a Java Spring Boot backend and a Vanilla JavaScript frontend. This project was developed as part of the Ethara AI Full-Stack Technical Assessment.

🌐 LIVE DEMO & LINKS
- Live Application: https://ethara-task-manager-production.up.railway.app

🔑 TEST CREDENTIALS (RBAC Evaluation)
To evaluate the application and Role-Based Access Control, please use:
- Admin Username: [admin@ethara.com]
- Admin Password: [supersecretpassword123]
*Note: You can also create a new "Member" account directly from the Signup page to test the restricted view.*

🛠️ TECH STACK
- Backend: Java 17, Spring Boot 3.x, Spring Security (JWT)
- Database: MySQL (Relational structure with Tasks, Projects, and Users)
- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
- Authentication: Stateless JWT-based Authentication

✨ KEY FEATURES
1. Role-Based Access Control (RBAC): UI dynamically adapts based on User Role (Admin vs. Member).
2. Secure Authentication: Signup and Login with encrypted passwords and JWT issuance.
3. Relational Dashboard: Real-time fetching of tasks linked to specific projects and assignees.
4. Overdue Tracking: Automatic visual highlighting for tasks past their due date.
5. CORS Management: Securely configured to handle requests between different local or hosted origins.

📡 API ENDPOINTS
| Method |     Endpoint        |       Description              | Auth Required|
| :---   |     :---            |          :---                  |      :---    |
| POST   | /api/auth/register  | Register a new user            |      No      |
| POST   | /api/auth/login     | Authenticate and receive JWT   |      No      |
| POST   | /api/projects       | Create a new project (Admin)   | Yes (Bearer) |
| GET    | /api/tasks          | Fetch all assigned tasks       | Yes (Bearer) |
| POST   | /api/tasks          | Create and assign a new task   | Yes (Bearer) |

⚙️ LOCAL SETUP INSTRUCTIONS
1. Database: Create a MySQL database named 'taskmanager'.
2. Backend configuration: Update 'application.properties' with your MySQL credentials.
3. Run Application: Execute './mvnw spring-boot:run' in the root directory.
4. Access Frontend: The frontend is served directly by Spring Boot. Simply open 'http://localhost:8080/index.html' in your browser.
====================================================