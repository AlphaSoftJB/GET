-- GET - Database Initialisation
-- This script runs once when the PostgreSQL container is first started.

\c get_db

-- UUID generation support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigram-based fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN index support
CREATE EXTENSION IF NOT EXISTS btree_gin;
