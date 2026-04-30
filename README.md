====================================================
🚀 ETHARA AI - FULL-STACK TASK MANAGER
====================================================

A secure, enterprise-ready task management application built with a Java Spring Boot backend and a Vanilla JavaScript frontend. This project was developed as part of the Ethara AI Full-Stack Technical Assessment.

🌐 LIVE DEMO & LINKS
- Live Application: https://ethara-task-manager-production.up.railway.app

🔑 TEST CREDENTIALS (RBAC Evaluation)
To evaluate the application and Role-Based Access Control, please use:
- Admin Username: admin
- Admin Password: admin
*(Note: You can also create a new "Member" account directly from the Signup page to test the restricted view).*

🛠️ TECH STACK
- Backend: Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security (JWT)
- Database: MySQL (Relational structure with Tasks, Projects, and Users)
- Frontend: HTML5, CSS3 (Modern UI/UX with CSS Variables & Animations), Vanilla JavaScript (ES6+)
- Authentication: Stateless JWT-based Authentication

✨ KEY FEATURES
1. Role-Based Access Control (RBAC): UI dynamically adapts based on User Role. Admins can create projects and assign tasks; Members only see their assigned tasks.
2. Dynamic Task Status Tracking: Members can update the status of their tasks (Pending -> Completed), which instantly reflects on the Admin's dashboard via colored badges.
3. Relational Data Management: Real-time fetching of Projects and Users to auto-populate assignment dropdowns securely.
4. Overdue Tracking: Automatic visual highlighting (red borders/tags) for tasks past their due date.
5. Premium UI/UX: Fully responsive dashboard with modern typography (Inter), soft shadow cards, hover effects, and smooth fade-out logout transitions.
6. Secure Authentication: Signup and Login with encrypted passwords and stateless JWT issuance.

📡 API ENDPOINTS
| Method | Endpoint              | Description                                      |AuthRequired
| :---   | :---                  | :---                                             | :---    
| POST   | /api/auth/register    | Register a new user                              | No
| POST   | /api/auth/login       | Authenticate and receive JWT                     | No    
| GET    | /api/auth/users       | Fetch all registered users for assignment        | Yes(Bearer)
| POST   | /api/projects         | Create a new project (Admin Only)                | Yes(Bearer)
| GET    | /api/projects         | Fetch all available projects                     | Yes(Bearer)
| POST   | /api/tasks            | Create and assign a new task (Admin Only)        | Yes(Bearer)
| GET    | /api/tasks            | Fetch tasks (Auto-filtered for logged-in Member) | Yes(Bearer)
| PUT    | /api/tasks/{id}/status| Update a task's status (Pending/Completed)       | Yes(Bearer)

⚙️ LOCAL SETUP INSTRUCTIONS
1. Database: Create a MySQL database named `taskmanager`.
2. Backend Configuration: Update `application.properties` with your MySQL credentials and set `spring.jpa.hibernate.ddl-auto=update`.
3. Run Application: Execute `./mvnw spring-boot:run` in the root directory.
4. Access Frontend: The frontend is served directly by Spring Boot. Simply open `http://localhost:8080/index.html` in your browser.
====================================================