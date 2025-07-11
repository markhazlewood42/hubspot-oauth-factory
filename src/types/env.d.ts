declare namespace NodeJS {
  interface ProcessEnv {
    HUBSPOT_CLIENT_ID: string;
    HUBSPOT_CLIENT_SECRET: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  }
}

interface AppDatabaseRecord {
  id: number,
  app_id: number,
  client_id: string,
  client_secret: string,
  configured_scopes: string,
  install_url: string,
  redirect_url: string
}

interface InstallDatabaseRecord {
  id: number,
  app_id: number,
  portal_id: string,
  access_token: string,
  refresh_token: string,
  expires_at: Date,
  created_at: Date,
  updated_at: Date
}
