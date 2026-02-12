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

## 🛠️ Tech Stack

- **Language**: Java 8
- **Framework**: Spring Boot 2.7.x
- **Database**: MySQL (database-per-service)
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Inter-Service Communication**: OpenFeign
- **Security**: Spring Security + JWT
- **Build**: Maven Multi-Module

## 🚀 How to Run

### Prerequisites
- Java 8+
- Maven 3.x
- MySQL 8.x

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
```

### Eureka Dashboard
Visit [http://localhost:8761](http://localhost:8761) to see registered services.

## 📡 API Endpoints (via Gateway at `localhost:8080`)

| Service | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Customers | `/api/customers/**`, `/api/leads/**`, `/api/activities/**`, `/api/notes/**` |
| Sales | `/api/deals/**`, `/api/opportunities/**`, `/api/followups/**` |
| Marketing | `/api/campaigns/**`, `/api/campaigns/templates` |
| Support | `/api/tickets/**`, `/api/tickets/{id}/responses` |
| Analytics | `/api/analytics/dashboard`, `/api/analytics/reports/**` |

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
