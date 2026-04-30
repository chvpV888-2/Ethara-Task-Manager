🚀 Ethara AI - Full-Stack Task Manager
A secure, enterprise-ready task management application built with a Java Spring Boot backend and a Vanilla JavaScript frontend. This project was developed as part of the Ethara AI Full-Stack Technical Assessment.

🛠️ Tech Stack
Backend: Java 17, Spring Boot 3.x, Spring Security (JWT)
Database: MySQL (Relational structure with Tasks, Projects, and Users)
Frontend: HTML5, CSS3, JavaScript (ES6+)
Authentication: Stateless JWT-based Authentication

✨ Key Features
Role-Based Access Control (RBAC): UI dynamically adapts based on User Role (Admin vs. Member).
Secure Authentication: Signup and Login with encrypted passwords and JWT issuance.
Relational Dashboard: Real-time fetching of tasks linked to specific projects and assignees.
Overdue Tracking: Automatic visual highlighting for tasks past their due date.
CORS Management: Securely configured to handle requests between different local or hosted origins.

📡 API Endpoints
| Method |     Endpoint        |      Description              | Auth Required|
| :---   |     :---            |         :---                  |      :---    |
| `POST` | `/api/auth/register`|  Register a new user          |       No     |
| `POST` | `/api/auth/login`   |  Authenticate and receive JWT |       No     |
| `POST` | `/api/projects`     |  Create a new project (Admin) | Yes (Bearer) |
| `GET`  | `/api/tasks`        |  Fetch all assigned tasks     | Yes (Bearer) |
| `POST` | `/api/tasks`        |  Create and assign a new task | Yes (Bearer) |

⚙️ Local Setup Instructions
Database: Create a MySQL database named taskmanager.
Backend: Update application.properties with your MySQL credentials and run ./mvnw spring-boot:run.
Frontend: Open the Ethara-Frontend folder in VS Code and launch via Live Server (Port 5500).