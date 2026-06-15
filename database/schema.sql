-- GET - Full PostgreSQL Schema + Seed Data

\c get_db;

-- TABLES

CREATE TABLE IF NOT EXISTS users (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            VARCHAR(50)  NOT NULL DEFAULT 'USER',
    avatar_url      TEXT,
    language        VARCHAR(10)  NOT NULL DEFAULT 'en',
    theme           VARCHAR(20)  NOT NULL DEFAULT 'light',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users (role);

CREATE TABLE IF NOT EXISTS households (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(200) NOT NULL,
    owner_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    invite_code VARCHAR(20)  NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_households_owner_id    ON households (owner_id);
CREATE INDEX IF NOT EXISTS idx_households_invite_code ON households (invite_code);

CREATE TABLE IF NOT EXISTS household_members (
    id           UUID       PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID       NOT NULL REFERENCES households (id) ON DELETE CASCADE,
    user_id      UUID       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role         VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (household_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_hm_household_id ON household_members (household_id);
CREATE INDEX IF NOT EXISTS idx_hm_user_id      ON household_members (user_id);

CREATE TABLE IF NOT EXISTS inventory_items (
    id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id    UUID           NOT NULL REFERENCES households (id) ON DELETE CASCADE,
    user_id         UUID           NOT NULL REFERENCES users (id),
    name            VARCHAR(255)   NOT NULL,
    brand           VARCHAR(150),
    barcode         VARCHAR(100),
    category        VARCHAR(100),
    quantity        DECIMAL(10, 3) NOT NULL DEFAULT 1,
    unit            VARCHAR(30)    NOT NULL DEFAULT 'pcs',
    expiration_date DATE,
    purchase_date   DATE,
    price           DECIMAL(10, 2),
    image_url       TEXT,
    notes           TEXT,
    status          VARCHAR(30)    NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_household_id    ON inventory_items (household_id);
CREATE INDEX IF NOT EXISTS idx_inv_user_id         ON inventory_items (user_id);
CREATE INDEX IF NOT EXISTS idx_inv_barcode         ON inventory_items (barcode);
CREATE INDEX IF NOT EXISTS idx_inv_category        ON inventory_items (category);
CREATE INDEX IF NOT EXISTS idx_inv_expiration_date ON inventory_items (expiration_date);
CREATE INDEX IF NOT EXISTS idx_inv_status          ON inventory_items (status);
CREATE INDEX IF NOT EXISTS idx_inv_name_trgm       ON inventory_items USING GIN (name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS nutritional_info (
    id       UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id  UUID           NOT NULL UNIQUE REFERENCES inventory_items (id) ON DELETE CASCADE,
    calories INT,
    protein  DECIMAL(8, 3),
    carbs    DECIMAL(8, 3),
    fat      DECIMAL(8, 3),
    fiber    DECIMAL(8, 3),
    sugar    DECIMAL(8, 3),
    sodium   DECIMAL(8, 3),
    vitamins JSONB
);

CREATE TABLE IF NOT EXISTS shopping_list_items (
    id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID           NOT NULL REFERENCES households (id) ON DELETE CASCADE,
    name         VARCHAR(255)   NOT NULL,
    category     VARCHAR(100),
    quantity     DECIMAL(10, 3) NOT NULL DEFAULT 1,
    unit         VARCHAR(30)    NOT NULL DEFAULT 'pcs',
    checked      BOOLEAN        NOT NULL DEFAULT FALSE,
    priority     INT            NOT NULL DEFAULT 0,
    added_by     UUID           NOT NULL REFERENCES users (id),
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    badge_name  VARCHAR(150) NOT NULL,
    badge_icon  VARCHAR(100) NOT NULL,
    points      INT          NOT NULL DEFAULT 0,
    unlocked_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type       VARCHAR(60)  NOT NULL,
    title      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT FALSE,
    item_id    UUID         REFERENCES inventory_items (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retailers (
    id      UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    name    VARCHAR(150) NOT NULL,
    website VARCHAR(255),
    api_key TEXT,
    active  BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS price_history (
    id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_barcode VARCHAR(100)   NOT NULL,
    retailer_id  UUID           NOT NULL REFERENCES retailers (id) ON DELETE CASCADE,
    price        DECIMAL(10, 2) NOT NULL,
    recorded_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    tx_hash     VARCHAR(100) NOT NULL UNIQUE,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(60)  NOT NULL,
    entity_id   UUID         NOT NULL,
    user_id     UUID         NOT NULL REFERENCES users (id),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- SEED DATA

INSERT INTO users (id, email, password_hash, first_name, last_name, role, avatar_url, language, theme)
VALUES
    (
        'a1b2c3d4-0001-0001-0001-000000000001',
        'alice@example.com',
        '$2a$12$4qCEUsNjSRakSYiMhsMlpuadRuMF3E/0mXaWHBLjPV1RFbrxF0Kyi',
        'Alice', 'Johnson', 'ADMIN',
        'https://ui-avatars.com/api/?name=Alice+Johnson&background=4CAF50&color=fff',
        'en', 'light'
    ),
    (
        'a1b2c3d4-0002-0002-0002-000000000002',
        'bob@example.com',
        '$2a$12$4qCEUsNjSRakSYiMhsMlpuadRuMF3E/0mXaWHBLjPV1RFbrxF0Kyi',
        'Bob', 'Smith', 'USER',
        'https://ui-avatars.com/api/?name=Bob+Smith&background=2196F3&color=fff',
        'en', 'dark'
    ),
    (
        'a1b2c3d4-0003-0003-0003-000000000003',
        'carol@example.com',
        '$2a$12$4qCEUsNjSRakSYiMhsMlpuadRuMF3E/0mXaWHBLjPV1RFbrxF0Kyi',
        'Carol', 'Williams', 'USER',
        'https://ui-avatars.com/api/?name=Carol+Williams&background=9C27B0&color=fff',
        'fr', 'light'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO households (id, name, owner_id, invite_code)
VALUES (
    'b1000000-0000-0000-0000-000000000001',
    'Johnson Family Home',
    'a1b2c3d4-0001-0001-0001-000000000001',
    'FAMILY-4X9Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO household_members (id, household_id, user_id, role)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'ADMIN'),
    ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002', 'MEMBER'),
    ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0003-0003-0003-000000000003', 'MEMBER')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inventory_items
    (id, household_id, user_id, name, brand, barcode, category, quantity, unit, expiration_date, purchase_date, price, status, notes)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Greek Yogurt', 'Chobani', '0072470000107', 'Dairy', 2, 'pcs', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '14 days', 3.49, 'ACTIVE', 'Plain, non-fat'),
    ('d0000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002', 'Whole Milk', 'Organic Valley', '0093966000067', 'Dairy', 1, 'gallon', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '10 days', 5.99, 'ACTIVE', NULL),
    ('d0000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Sliced Turkey Breast', 'Boar''s Head', '0042421000024', 'Deli', 3, 'pcs', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE - INTERVAL '5 days', 7.99, 'ACTIVE', 'Low sodium'),
    ('d0000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Orange Juice', 'Tropicana', '0048500000003', 'Beverages', 1, 'carton', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days', 4.49, 'ACTIVE', 'No pulp'),
    ('d0000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0003-0003-0003-000000000003', 'Eggs', 'Happy Egg Co.', '0810009000011', 'Eggs', 12, 'pcs', CURRENT_DATE + INTERVAL '12 days', CURRENT_DATE - INTERVAL '3 days', 5.29, 'ACTIVE', 'Free range, large'),
    ('d0000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Greek Olive Oil', 'Partanna', '0707003000013', 'Oils & Condiments', 1, 'bottle', CURRENT_DATE + INTERVAL '180 days', CURRENT_DATE - INTERVAL '7 days', 12.99, 'ACTIVE', 'Extra virgin'),
    ('d0000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Chicken Breast', 'Bell & Evans', '0023500000016', 'Meat', 2, 'lbs', CURRENT_DATE + INTERVAL '4 days', CURRENT_DATE - INTERVAL '1 day', 9.99, 'ACTIVE', 'Boneless, skinless')
ON CONFLICT (id) DO NOTHING;

INSERT INTO achievements (id, user_id, badge_name, badge_icon, points)
VALUES
    ('g0000000-0000-0000-0000-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Zero Waste Warrior', 'trophy_green', 100),
    ('g0000000-0000-0000-0000-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001', 'Early Bird', 'clock_star', 50),
    ('g0000000-0000-0000-0000-000000000003', 'a1b2c3d4-0002-0002-0002-000000000002', 'Household Hero', 'house_heart', 75)
ON CONFLICT (id) DO NOTHING;

INSERT INTO retailers (id, name, website, active)
VALUES
    ('h0000000-0000-0000-0000-000000000001', 'Whole Foods Market', 'https://www.wholefoodsmarket.com', true),
    ('h0000000-0000-0000-0000-000000000002', 'Kroger', 'https://www.kroger.com', true),
    ('h0000000-0000-0000-0000-000000000003', 'Walmart Grocery', 'https://www.walmart.com/grocery', true)
ON CONFLICT (id) DO NOTHING;
