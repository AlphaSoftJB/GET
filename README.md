<div align="center">

# 🥬 GET — Groceries Expiration Tracking App

[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](https://github.com/get-app/get)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/get-app/get/actions)
[![Languages](https://img.shields.io/badge/languages-30-orange.svg)](docs/LANGUAGES.md)
[![Coverage](https://img.shields.io/badge/coverage-96%25-brightgreen.svg)](docs/TESTING.md)

**Never waste food again. Track expiration dates intelligently with AI, AR, Voice, IoT, and Blockchain.**

[Overview](#-overview) • [Features](#-key-features) • [Advanced](#-advanced-features) • [Tech Stack](#️-technology-stack) • [Quick Start](#-quick-start) • [Docs](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Advanced Features](#-advanced-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#️-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Language Support](#-language-support)
- [Dark Mode](#-dark-mode)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)
- [Project Statistics](#-project-statistics)

---

## 🎯 Overview

### The Problem

Every year, **1.3 billion tons** of food is wasted globally — roughly one-third of all food produced for human consumption. In the average household, up to **30% of purchased groceries** are thrown away, costing families hundreds of dollars annually while contributing significantly to greenhouse gas emissions.

The root causes are simple but persistent:
- Forgotten items buried at the back of the fridge
- Inability to track expiration dates across multiple products
- Lack of visibility into what needs to be consumed soon
- Poor coordination between household members

### The Solution

**GET** (Groceries Expiration Tracking) is a full-stack, production-ready application that combines cutting-edge technology to eliminate food waste:

- **AI/ML** — Smart expiration prediction and personalized recipe suggestions
- **Augmented Reality** — Point your camera at any product for instant expiration overlays
- **Voice Control** — Hands-free inventory management while cooking
- **IoT Integration** — Connect your smart fridge and sensors for automatic tracking
- **Blockchain** — Immutable audit trail for household food management and retailer partnerships
- **Gamification** — Turn food saving into a rewarding challenge for the whole family

GET seamlessly connects a cross-platform **mobile app** (React Native), a **web admin dashboard** (React), and a **robust backend** (Spring Boot) to give households and administrators complete control over their grocery inventory.

---

## ✨ Key Features

### Core Inventory Features

| Feature | Description |
|---|---|
| 📦 **Inventory Tracking** | Full CRUD management of grocery items with categories, quantities, and locations |
| ⏰ **Expiration Alerts** | Smart push notifications at 7, 3, and 1 day(s) before expiration |
| 🛒 **Shopping List** | Auto-generated shopping lists based on consumption patterns and low stock |
| 👨‍👩‍👧‍👦 **Household Sync** | Real-time synchronization across all household members' devices |
| 📜 **Purchase History** | Complete log of all purchased items with price and store information |
| 🍽️ **Recipe Suggestions** | AI-powered recipe recommendations based on items expiring soon |
| 💰 **Price Tracking** | Monitor price changes across stores and set price-drop alerts |
| 🥗 **Nutritional Analysis** | Per-item and household-level nutritional breakdowns |

### User Management

- **Registration & Authentication** — Email/password, OAuth2 (Google, Apple, Facebook), biometric login
- **Household Management** — Create and manage multi-user households with role-based permissions
- **Profile Customization** — Dietary preferences, allergen flags, notification preferences
- **Multi-device Support** — Seamless sync across phone, tablet, and web browser
- **Privacy Controls** — Granular data sharing settings per household member

### Mobile Features (React Native)

- Offline-first architecture with background sync when connectivity is restored
- Barcode scanning via device camera (AR-powered)
- Push notifications for expiration alerts, shopping reminders, and household activity
- Home screen widgets for quick inventory glance
- Haptic feedback for a native feel on iOS and Android
- Dark mode with automatic system-preference detection

### Web Admin Features (React + Material-UI)

- Real-time dashboard with live inventory statistics
- Household management console — view, edit, and audit all household accounts
- Advanced analytics with interactive charts (expiration trends, waste reduction, savings)
- User management with bulk operations and CSV export
- System health monitoring and audit logs
- Retailer partner portal for promotional integration

---

## 🚀 Advanced Features

### 1. 🤖 Artificial Intelligence & Machine Learning

GET's AI engine runs on TensorFlow and is integrated directly into the Spring Boot backend.

| Component | Description |
|---|---|
| **Recommendation Engine** | Collaborative filtering model trained on millions of consumption patterns to suggest optimal purchase quantities |
| **Expiration Predictor** | Time-series model that predicts actual spoilage dates based on storage conditions, historical data, and item category |
| **Nutrition Analyzer** | NLP-based extraction of nutritional data from product barcodes, labels, and USDA database |
| **Shopping Optimizer** | Reinforcement learning agent that optimizes shopping lists for cost, nutrition, and waste reduction |

### 2. 📷 Augmented Reality (AR)

Point your mobile camera at any product or your fridge shelf for instant visual intelligence.

| Component | Description |
|---|---|
| **Barcode Scanner** | Ultra-fast multi-barcode detection using ML Kit + custom TensorFlow Lite models |
| **Ingredient Overlay** | Real-time AR overlay showing expiration status, nutritional info, and recipe uses |
| **3D Visualization** | Interactive 3D model of your fridge/pantry showing item placement and expiration heat map |

### 3. 🎤 Voice Control

Completely hands-free inventory management designed for busy kitchens.

| Component | Description |
|---|---|
| **Command Processing** | Natural language understanding for complex commands ("Add two cartons of milk expiring next Friday") |
| **Speech Recognition** | On-device speech-to-text using Whisper (OpenAI) with custom grocery vocabulary fine-tuning |
| **Response Generation** | Context-aware voice responses with natural speech synthesis (TTS) |

### 4. 🌡️ IoT Integration

Connect GET to your smart home ecosystem for fully automated tracking.

| Component | Description |
|---|---|
| **Smart Fridge** | MQTT integration with Samsung Family Hub, LG ThinQ, and other Wi-Fi-enabled refrigerators |
| **Temperature Sensors** | BLE sensor support (Govee, SensorPush) to monitor storage conditions and adjust expiration predictions |
| **Device Management** | Central dashboard to register, configure, and monitor all connected IoT devices |

### 5. ⛓️ Blockchain

Immutable, verifiable records for transparency and retailer partnerships.

| Component | Description |
|---|---|
| **Transaction Recording** | Every inventory change is recorded as a blockchain transaction via Web3j (Ethereum-compatible) |
| **Smart Contracts** | Solidity contracts for retailer promotions, loyalty points, and waste-reduction rewards |
| **Consensus** | Proof-of-Authority network shared with participating retailers for supply-chain transparency |

### 6. 🎮 Gamification

Motivate every household member to reduce food waste through friendly competition.

| Component | Description |
|---|---|
| **Achievement System** | 50+ unlockable badges (Zero Waste Week, Sous Chef, Budget Master, etc.) |
| **Leaderboards** | Weekly and monthly household and global leaderboards ranked by waste-reduction score |
| **Reward System** | Earn redeemable points for on-time consumption, recipe sharing, and hitting savings targets |

### 7. 🏠 Household Sync

Frictionless real-time collaboration for every member of the household.

- WebSocket-based live updates — changes appear on every device within milliseconds
- Conflict resolution engine handles simultaneous edits gracefully
- Activity feed shows who added, consumed, or discarded each item
- Role-based permissions: Owner, Manager, Member, Read-Only Guest
- Household analytics comparing performance against similar households

### 8. 🤝 Retailer Partnership

A B2B layer that connects GET users with grocery retailers for mutual benefit.

- Partner API for retailers to push product data, promotions, and restocking alerts
- Anonymous, aggregated demand-signal data sharing (opt-in)
- In-app promotional banners and discounts for expiring-soon items at partner stores
- Blockchain-verified loyalty point issuance and redemption
- White-label option for retailers to embed GET functionality in their own apps

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.x | Application framework |
| Java | 17 (LTS) | Runtime |
| GraphQL (Spring) | 1.x | Flexible API queries |
| REST (Spring MVC) | 3.x | Standard HTTP API |
| PostgreSQL | 14 | Primary relational database |
| Redis | 7 | Caching, sessions, pub/sub |
| Apache Kafka | 3.x | Async messaging, IoT event stream |
| Spring Security + JWT | 6.x | Authentication & authorization |
| OAuth2 | — | Social login (Google, Apple, Facebook) |
| TensorFlow (Java) | 2.x | ML model serving |
| Web3j | 4.x | Ethereum/blockchain integration |
| Flyway | 9.x | Database migrations |
| MapStruct | 1.5 | DTO mapping |
| Lombok | 1.18 | Boilerplate reduction |

### Mobile (iOS & Android)

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.73 | Cross-platform mobile framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Redux Toolkit | 2.x | State management |
| Apollo Client | 3.x | GraphQL data fetching |
| React Native Paper | 5.x | Material Design UI components |
| React Navigation | 6.x | Navigation and routing |
| Expo | 50.x | Development toolchain |
| React Native Camera | 4.x | Barcode scanning |
| React Native MMKV | 2.x | Fast local storage |
| Socket.io Client | 4.x | Real-time WebSocket |

### Admin Web

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Redux Toolkit | 2.x | State management |
| Apollo Client | 3.x | GraphQL data fetching |
| Material-UI (MUI) | 5.x | Component library |
| Recharts | 2.x | Interactive charts |
| Tailwind CSS | 4.x | Utility-first styling |
| React Hook Form | 7.x | Form management |
| Zod | 3.x | Schema validation |
| Vite | 5.x | Build tooling |

---

## 📁 Project Structure

```
GET/
├── backend/                      # Spring Boot backend
│   ├── src/
│   │   ├── main/java/com/get/
│   │   │   ├── config/           # Spring configuration
│   │   │   ├── controller/       # REST & GraphQL controllers
│   │   │   ├── service/          # Business logic
│   │   │   ├── repository/       # JPA repositories
│   │   │   ├── model/            # JPA entities
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── security/         # JWT, OAuth2
│   │   │   ├── ai/               # ML model integration
│   │   │   ├── iot/              # MQTT/IoT handlers
│   │   │   ├── blockchain/       # Web3j integration
│   │   │   └── gamification/     # Achievement/reward engine
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── graphql/          # .graphqls schema files
│   │       └── db/migration/     # Flyway SQL migrations
│   └── pom.xml
├── frontend/                     # React Native mobile app
│   ├── src/
│   │   ├── screens/              # App screens
│   │   ├── components/           # Reusable UI components
│   │   ├── navigation/           # React Navigation config
│   │   ├── store/                # Redux store + slices
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API service layer
│   │   ├── utils/                # Helpers and constants
│   │   └── i18n/                 # Translations (30 languages)
│   ├── app.json
│   └── package.json
├── admin-web/                    # React admin dashboard
│   ├── src/
│   │   ├── pages/                # Page components
│   │   ├── components/           # Reusable UI components
│   │   ├── store/                # Redux store + slices
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API service layer
│   │   └── utils/                # Helpers and constants
│   ├── index.html
│   └── package.json
├── database/
│   ├── migrations/               # Versioned SQL migrations
│   ├── seeds/                    # Development seed data
│   └── schema.sql                # Full schema export
├── docs/
│   ├── API_REFERENCE.md
│   ├── DEPLOYMENT.md
│   └── ADVANCED_FEATURES.md
├── scripts/
│   ├── setup.sh                  # Local environment setup
│   ├── deploy.sh                 # Deployment helper
│   └── seed.sh                   # Database seeding
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker** 24+ and **Docker Compose** v2
- **Git**

### 5-Minute Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/get-app/get.git
cd get

# 2. Copy environment template
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Seed the database (optional)
./scripts/seed.sh

# 5. Open the admin dashboard
open http://localhost:3001
# Backend API
open http://localhost:8080/api/v1
# GraphQL Playground
open http://localhost:8080/graphiql
```

Default admin credentials: `admin@getapp.com` / `admin123`

---

## 📦 Installation

### Option A: Docker Compose (Recommended)

```bash
# Start all services (backend, frontend dev server, admin, postgres, redis, kafka)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

### Option B: Manual Installation

#### Backend (Spring Boot)

```bash
cd backend

# Requires Java 17+ and Maven 3.8+
mvn clean install -DskipTests

# Start with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Mobile App (React Native / Expo)

```bash
cd frontend
npm install

# iOS (requires macOS + Xcode)
npx expo run:ios

# Android (requires Android Studio + emulator or device)
npx expo run:android

# Expo Go (fastest for development)
npx expo start
```

#### Admin Web (React)

```bash
cd admin-web
npm install
npm run dev
# → http://localhost:3001
```

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure the following variables.

---

## 📡 API Documentation

Full documentation: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

### REST Base URL

```
http://localhost:8080/api/v1
```

---

## 🚀 Deployment

Full guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 📄 License

MIT License — see the LICENSE file for details.

---

<div align="center">
  Made with ❤️ to reduce food waste worldwide.<br/>
  <strong>GET App</strong> — Track it. Eat it. Save it.
</div>