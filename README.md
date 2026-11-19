# Project Management Tool (PMTool)

A full-stack Agile Project Management application built with **Spring Boot**, **React**, **Redux**, and **MySQL**. This tool allows users to create projects, manage project backlogs, and track individual project tasks across workflow stages.

## 🚀 Features

* **Project Management:** Create, view, update, and delete projects with unique project identifiers, descriptions, and estimated start/end dates.
* **Project Backlog & Task Tracking:** Automatically initializes a dedicated backlog for every created project to organize and track project tasks.
* **Form Validation & Error Handling:** Real-time field-level validation feedback on the frontend powered by Spring Boot's Jakarta/Javax validation and global exception handling (`@ControllerAdvice`).
* **Centralized State Management:** Uses Redux to manage application state, asynchronous API calls via Axios, and backend validation error payloads.
* **RESTful API Architecture:** Clean separation of concerns across Controller, Service, and Spring Data JPA Repository layers.

## 🛠️ Tech Stack

### Backend
* **Java 8 & Spring Boot 2.7**
* **Spring Web & Spring Data JPA (Hibernate)**
* **MySQL 8.0** (Database persistence)
* **Maven** (Dependency management)

### Frontend
* **React** (Component-based UI)
* **Redux & Redux Thunk** (Global state management)
* **React Router** (Client-side routing)
* **Axios** (HTTP client)
* **Bootstrap 4 & Classnames** (Responsive styling and conditional validation UI)

## ⚙️ Getting Started

### Prerequisites
* Java JDK 8 or higher
* Node.js & npm
* MySQL Server 8.0

### 1. Database Setup
1. Start your local MySQL server.
2. Create a new schema named `ppmtool`:
   ```sql
   CREATE DATABASE ppmtool;
   ```
3. Configure your database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ppmtool?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   ```

### 2. Run the Backend
Navigate to the backend project folder and run:
```bash
mvn spring-boot:run
```
The Spring Boot server will start on `http://localhost:8080`.

### 3. Run the Frontend
Navigate to the frontend React directory, install dependencies, and start the development server:
```bash
npm install
npm run dev
```
Guide How-To-Use:

Register your USER via register page,choose:
    -fullName
    -email(UserName)
    -password
    -confirmPassword
Then Login with that USER.

then create your Project or Project List,
add Project Tasks.
then manageing your Projects progress will become way Easier. 
have fun.

