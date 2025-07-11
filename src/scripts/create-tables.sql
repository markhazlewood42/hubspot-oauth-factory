-- Create the hubspot_installs table with camelCase column names
CREATE TABLE IF NOT EXISTS hubspot_installs (
  id SERIAL PRIMARY KEY,
  appId SMALLINT NOT NULL UNIQUE,
  portalId VARCHAR(255) NOT NULL UNIQUE,
  accessToken TEXT NOT NULL,
  refreshToken TEXT NOT NULL,
  expiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on portalId for faster lookups
CREATE INDEX IF NOT EXISTS idx_hubspot_installs_portalId ON hubspot_installs(portalId);

-- Create the hubspot_apps table with camelCase column names
CREATE TABLE IF NOT EXISTS hubspot_apps (
  id SERIAL PRIMARY KEY,
  appId SMALLINT NOT NULL UNIQUE,
  clientId VARCHAR(100) NOT NULL UNIQUE,
  clientSecret VARCHAR(100) NOT NULL UNIQUE,
  installUrl TEXT,
  redirectUrl TEXT
);

CREATE INDEX IF NOT EXISTS idx_hubspot_apps_appId ON hubspot_apps(appId);
