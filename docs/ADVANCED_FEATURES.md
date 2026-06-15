# GET — Advanced Features Documentation

This document describes the advanced and experimental features of the Groceries Expiration Tracking (GET) application.

---

## 1. AI/ML Features

### 1.1 Expiration Prediction Model

GET uses a gradient-boosted regression model (XGBoost) to predict the actual remaining usability of food items.

**API:** `GET /api/inventory/{id}/expiry-prediction`

```json
{
  "predicted_usable_until": "2026-06-13",
  "confidence": 0.84,
  "model_version": "2026-06-01-v3"
}
```

### 1.2 Food Recognition from Camera

On-device MobileNetV3 classifier + cloud EfficientNet-B4 fallback.

**API:** `POST /api/ml/recognize-food` (multipart/form-data)

### 1.3 Waste Analytics

Metrics: Waste Rate, Money Wasted, CO₂ Equivalent, Top Wasted Categories.

---

## 2. AR Features

- iOS: ARKit + Vision for text recognition
- Android: ARCore + ML Kit Text Recognition v2
- Color-coded expiry overlays: green (>7d), amber (3-7d), red (<3d)

---

## 3. Voice Interface

Supported commands: add item, check expiry, list expiring, mark consumed, add to shopping list, waste summary, set reminder, search inventory.

Alexa and Google Assistant integrations available.

---

## 4. IoT Integration

Supported devices: Govee H5100, SwitchBot Meter Plus, Xiaomi LYWSD03MMC, ESP32+DHT22, Aqara Temperature Sensor.

MQTT topic schema: `get/households/{household_id}/sensors/{sensor_id}/temperature`

---

## 5. Blockchain Audit Trail

Hyperledger Fabric or EVM-compatible chain. Every inventory change recorded on-chain.

```solidity
contract InventoryAudit {
    event AuditEntry(bytes32 indexed householdId, bytes32 indexed resourceId,
        string action, bytes32 payloadHash, string ipfsCid, uint256 timestamp);
}
```

---

## 6. Gamification

10 levels (Fresh Start → Expiry Legend), 20+ badges, household and global leaderboards.

Points: +5 consume before expiry, +15 use item ≤2 days before expiry, −5 discard expired item.

---

## 7. Nutritional Intelligence

Integrations: USDA FoodData Central, Open Food Facts, Edamam, Nutritionix.

Dietary preferences: Vegetarian, Vegan, Gluten-Free, Dairy-Free, Nut-Free, Halal, Kosher, Low-FODMAP, Keto, Paleo.

**API:** `GET /api/recommendations/recipes?max_expiry_days=5&limit=10`