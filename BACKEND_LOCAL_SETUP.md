# 🚀 GET Backend Local Setup Guide

This guide will help you get the GET backend up and running on your local machine for development and testing.

## 📋 Prerequisites

Ensure you have the following installed:
- **Java 17 or higher** (OpenJDK 17 recommended)
- **Maven 3.8+**
- **Docker & Docker Compose** (for infrastructure services)
- **Git**

## 🛠️ Step 1: Clone the Repository

```bash
git clone https://github.com/AlphaSoftJB/GET.git
cd GET/backend
```

## 🏗️ Step 2: Start Infrastructure Services

The backend relies on PostgreSQL, Redis, and Kafka. You can start these easily using the provided `docker-compose.yml` in the root directory:

```bash
cd ..
docker-compose up -d
```

This will start:
- **PostgreSQL**: Port 5432
- **Redis**: Port 6379
- **Kafka**: Port 9092

## ⚙️ Step 3: Configure Environment

The backend uses `src/main/resources/application.properties`. For local development, ensure the following properties match your Docker setup:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/get_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.data.redis.host=localhost
spring.kafka.bootstrap-servers=localhost:9092
```

## 🚀 Step 4: Build and Run

From the `backend` directory, run:

```bash
mvn clean install
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.

## ✅ Step 5: Verify the Installation

### 1. Run Tests
Ensure everything is working as intended by running the full test suite:
```bash
mvn test
```

### 2. Health Check
Visit `http://localhost:8080/actuator/health` in your browser. You should see:
```json
{
  "status": "UP"
}
```

### 3. API Documentation
The backend provides a GraphQL playground (if enabled) and REST endpoints. You can test the Auth endpoint using `curl`:

```bash
curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com", "password":"password123", "firstName":"Test", "lastName":"User"}'
```

## 🧪 Advanced Features Testing

- **AI Service**: Automatic expiration prediction logic is active for new inventory items.
- **Blockchain**: Audit trails are simulated and can be viewed in the logs.
- **GraphQL**: Access the schema at `http://localhost:8080/graphql`.

## 🆘 Troubleshooting

- **Database Connection**: Ensure Docker containers are running (`docker ps`).
- **Port Conflicts**: If 8080 is taken, change `server.port` in `application.properties`.
- **Kafka Errors**: Kafka may take a minute to fully initialize after Docker starts.
