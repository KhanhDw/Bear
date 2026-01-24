/* =========================
 * USER
 * ========================= */
export interface User {
  user_id: string;            // UUID (postgres)
  email: string;
  password_hash: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;         // TIMESTAMP
  updated_at: string;         // TIMESTAMP
  last_login_at?: string;     // TIMESTAMP | null
}

/* =========================
 * REFRESH TOKEN
 * ========================= */
export interface RefreshToken {
  token_id: string;           // UUID
  user_id: string;            // UUID (FK users.user_id)
  token_hash: string;         // CHAR(64) — SHA256
  expires_at: string;         // TIMESTAMP
  is_revoked: boolean;
  created_at: string;         // TIMESTAMP
}

/* =========================
 * API KEY
 * ========================= */
export interface ApiKey {
  api_key_id: string;         // UUID
  service_name: string;
  api_key_hash: string;       // CHAR(64) — SHA256
  is_active: boolean;
  created_at: string;         // TIMESTAMP
  expires_at?: string;        // TIMESTAMP | null
}

/* =========================
 * INPUT DTOs
 * ========================= */
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

/* =========================
 * TOKEN PAIR (RETURNED TO CLIENT)
 * ========================= */
export interface TokenPair {
  access_token: string;
  refresh_token: string;      // RAW token (hash stored in DB)
}
