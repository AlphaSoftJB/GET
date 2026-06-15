# 🚀 GET Backend Local Setup Guide (Linux)

This guide will help you get the GET backend up and running on your Linux machine (Ubuntu/Debian/Fedora/Arch).

## 📋 Prerequisites

Ensure you have the following installed. Here are the commands for **Ubuntu/Debian**:

### 1. Java 17 (OpenJDK)
```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

### 2. Maven
```bash
sudo apt install maven
mvn -version
```

### 3. Docker & Docker Compose
Follow the official [Docker Installation Guide for Linux](https://docs.docker.com/desktop/install/linux-install/).
**Important:** Ensure your user is in the `docker` group to run commands without `sudo`:
```bash
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect
```

### 4. Git
```bash
sudo apt install git
```

## 🛠️ Step 1: Clone the Repository

```bash
git clone https://github.com/AlphaSoftJB/GET.git
cd GET/backend
```

## 🏗️ Step 2: Start Infrastructure Services

The backend relies on PostgreSQL, Redis, and Kafka. Start them using Docker Compose from the project root:

```bash
cd ..
docker-compose up -d
```

Verify they are running:
```bash
docker ps
```

## ⚙️ Step 3: Configure Environment

The backend uses `src/main/resources/application.properties`. For local development, the defaults are set to work with the Docker containers. If you need to change them:

```bash
nano backend/src/main/resources/application.properties
```

## 🚀 Step 4: Build and Run

From the `backend` directory:

```bash
mvn clean install
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.

## ✅ Step 5: Verify the Installation

### 1. Run Tests
```bash
mvn test
```

### 2. Health Check
```bash
curl -i http://localhost:8080/actuator/health
```

### 3. Test Registration API
```bash
curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"linux@example.com", "password":"password123", "firstName":"Linux", "lastName":"User"}'
```

## 🧪 Advanced Features

- **AI Service**: Uses TensorFlow Java for predictions.
- **GraphQL**: Explore the API at `http://localhost:8080/graphql`.
- **Logs**: Monitor real-time logs with `tail -f logs/app.log` (if configured) or the console output.

## 🆘 Troubleshooting (Linux Specific)

- **Port 8080 already in use**: Find the process and kill it:
  ```bash
  sudo lsof -i :8080
  kill -9 <PID>
  ```
- **Docker Permission Denied**: If you get permission errors, either use `sudo docker-compose` or fix the group permissions as shown in the Prerequisites.
- **Memory Issues**: Kafka and AI services can be memory-intensive. Ensure you have at least 4GB of free RAM.
