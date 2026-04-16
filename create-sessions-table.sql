-- Table pour stocker les sessions d'authentification
CREATE TABLE IF NOT EXISTS sessions (
  token VARCHAR(64) PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index pour nettoyer les vieilles sessions
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
