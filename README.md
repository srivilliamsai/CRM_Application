# CRM Application — Microservices Architecture

Enterprise-level Customer Relationship Management system built with **Java 8** and **Spring Boot 2.7.x**.

## 🏗️ Architecture

| # | Service | Port | Description |
|---|---|---|---|
| 1 | **Discovery Server** | `8761` | Eureka Service Registry |
| 2 | **API Gateway** | `8080` | Single entry point, routing |
| 3 | **Auth Service** | `8081` | Users, Roles, JWT Security |
| 4 | **Customer Service** | `8082` | Leads, Contacts, Activities, Notes |
| 5 | **Sales Service** | `8083` | Deals, Opportunities, Followups |
| 6 | **Marketing Service** | `8084` | Campaigns, Templates, Segments |
| 7 | **Support Service** | `8085` | Tickets, Threaded Responses |
| 8 | **Analytics Service** | `8086` | Dashboard, Reports |
| 9 | **Workflow Service** | `8087` | Workflow Rules, Event-Driven Automation |
| 10 | **Integration Service** | `8088` | Email, Webhooks, External APIs |
| 11 | **Notification Service** | `8089` | In-app alerts, Email templates |
| 12 | **Frontend App** | `5173` | React + Vite UI |

## ✨ Key Features
- **Microservices Architecture**: Independently deployable services.
- **Service Discovery**: Automatic registration with Eureka.
- **API Gateway**: Centralized routing and cross-cutting concerns.
- **Role-Based Access Control**: Secure endpoints with JWT.
- **Customer Assignment**: Assign Leads/Customers to Sales Reps with instant notifications.
- **In-App Notifications**: Real-time alerts for assignments and updates.
- **Dashboard Analytics**: Visual insights into sales performance.

## 🛠️ Tech Stack

- **Backend**: Java 8, Spring Boot 2.7.x
- **Frontend**: React, Vite, TailwindCSS
- **Database**: MySQL (database-per-service)
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Inter-Service Communication**: OpenFeign
- **Security**: Spring Security + JWT
- **Build**: Maven Multi-Module
- **Code Quality**: SpotBugs (FindBugs), SonarQube

## 🚀 How to Run

### Prerequisites
- Java 8+
- Maven 3.x
- MySQL 8.x
- Node.js 16+ (for Frontend)

### Start Order
```bash
# 1. Build all modules
mvn clean install -DskipTests

# 2. Start infrastructure first
java -jar discovery-server/target/*.jar
java -jar api-gateway/target/*.jar

# 3. Start services
java -jar auth-service/target/*.jar
java -jar customer-service/target/*.jar
java -jar sales-service/target/*.jar
java -jar marketing-service/target/*.jar
java -jar support-service/target/*.jar
java -jar analytics-service/target/*.jar
java -jar workflow-service/target/*.jar
java -jar integration-service/target/*.jar
java -jar notification-service/target/*.jar

# 4. Start Frontend
cd frontend
npm install
npm run dev
```

### Eureka Dashboard
Visit [http://localhost:8761](http://localhost:8761) to see registered services.

## 🔍 Code Quality Tools

This project uses **SpotBugs** and **SonarQube** for static code analysis.

### SpotBugs (FindBugs)
```bash
# Run SpotBugs analysis across all services
mvn clean install

# Run SpotBugs on a specific service
mvn spotbugs:check -pl auth-service -am

# Open SpotBugs GUI for detailed bug visualization
mvn spotbugs:gui -pl auth-service
```

### SonarQube
```bash
# Start SonarQube using Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Run analysis (after SonarQube is running at http://localhost:9000)
mvn clean verify sonar:sonar -Dsonar.host.url=http://localhost:9000
```

> **Current Status**: All 11 services pass SpotBugs with **0 bugs, 0 errors**.

## 📡 API Endpoints (via Gateway at `localhost:8080`)

| Service | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Customers | `/api/customers/**`, `/api/leads/**`, `/api/activities/**`, `/api/notes/**` |
| Sales | `/api/deals/**`, `/api/opportunities/**`, `/api/followups/**` |
| Marketing | `/api/campaigns/**`, `/api/campaigns/templates` |
| Support | `/api/tickets/**`, `/api/tickets/{id}/responses` |
| Analytics | `/api/analytics/dashboard`, `/api/analytics/reports/**` |
| Notifications | `/api/notifications/**`, `/api/notifications/mark-read/**` |

## 📂 Standard Package Structure
```
com.crm.{serviceName}
├── config/         # Security, App config
├── controller/     # REST Endpoints
├── service/        # Business Logic
├── repository/     # Data Access (JPA)
├── entity/         # JPA Entities
├── dto/            # Request/Response objects
├── client/         # Feign Clients
└── exception/      # Exception Handling
```
