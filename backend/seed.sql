-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BUSINESSES (belongs to a user)
CREATE TABLE IF NOT EXISTS businesses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slogan TEXT,
  industry TEXT NOT NULL,
  description TEXT,
  website TEXT,
  contact_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AGENTS (belongs to a business)
CREATE TABLE IF NOT EXISTS agents (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  custom_reactions JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SESSIONS (belongs to an agent)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  agent_id BIGINT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  start_dt TIMESTAMPTZ DEFAULT NOW(),
  end_dt TIMESTAMPTZ
);

-- CONVERSATION HISTORY (raw messages in JSONB, grouped per session)
CREATE TABLE IF NOT EXISTS conversations (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  agent_id BIGINT REFERENCES agents(id) ON DELETE SET NULL,
  user_input TEXT,
  llm_response TEXT,
  is_analyzed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUMMARIZED CONVERSATIONS (agent-generated insights)
CREATE TABLE IF NOT EXISTS analyzed_conversations (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  summary TEXT,
  intent TEXT,
  lead_quality TEXT,
  next_step TEXT,
  confidence DOUBLE PRECISION,
  metadata JSONB DEFAULT '{}'::jsonb,
  customer JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANALYTICS (per user activity/events)
CREATE TABLE IF NOT EXISTS analytics (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUTH TOKENS
CREATE TABLE auth_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

ALTER TABLE users
ADD COLUMN google_gmail_provider_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN google_gmail_provider_connected_at TIMESTAMPTZ;

ALTER TABLE auth_tokens
ADD COLUMN business_id BIGINT REFERENCES businesses(id) ON DELETE CASCADE;

ALTER TABLE users
DROP COLUMN google_gmail_provider_connected,
DROP COLUMN google_gmail_provider_connected_at;

-- CONTACT BASIC INFO (name, business id, etc)
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- CONTACT COMMS METHOD (actual communication methods)
CREATE TABLE contact_methods (
    id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE contact_segments (
    id SERIAL PRIMARY KEY,
    business_id INT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "VIP Clients", "LinkedIn Prospects"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE contact_segment_members (
    id SERIAL PRIMARY KEY,
    contact_segment_id INT NOT NULL REFERENCES contact_segments(id) ON DELETE CASCADE,
    contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    UNIQUE (contact_segment_id, contact_id)
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    instruction TEXT,
    context JSONB,
    business_id INT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    agent_id INT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    contact_segment_id INT REFERENCES contact_segments(id),
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    interval INTERVAL, -- NULL if one-time
    start_dt TIMESTAMPTZ DEFAULT NOW(),
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contacts TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contact_methods TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE auth_tokens TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE businesses TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE agents TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE analytics TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE sessions TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE conversations TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE analyzed_conversations TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contact_segment_members TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE contact_segments TO <user>;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE jobs TO <user>;
--
-- GRANT USAGE, SELECT ON SEQUENCE businesses_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE sessions_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE contacts_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE contact_methods_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE auth_tokens_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE agents_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE conversations_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE analyzed_conversations_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE analytics_id_seq TO <user>;'
-- GRANT USAGE, SELECT ON SEQUENCE contact_segment_members_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE contact_segments_id_seq TO <user>;
-- GRANT USAGE, SELECT ON SEQUENCE jobs_id_seq TO <user>;
