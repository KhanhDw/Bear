export interface User {
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  salt: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface RefreshToken {
  token_id: string;
  user_id: string;
  token: string;
  expires_at: string;
  is_revoked: boolean;
  created_at: string;
}

export interface ApiKey {
  api_key_id: string;
  service_name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}