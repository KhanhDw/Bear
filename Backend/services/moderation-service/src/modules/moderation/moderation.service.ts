import { Pool } from 'pg';
import OpenAI from 'openai';
import { env } from '../../config/env.js';
import { 
  CreateModerationReportInput, 
  UpdateModerationReportInput,
  CreateModerationActionInput,
  CreateContentFilterInput,
  CreateUserBanInput,
  ModerationReport,
  ModerationAction,
  ContentFilter,
  UserBan
} from './moderation.types.js';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Initialize OpenAI client for content moderation
let openai: OpenAI | null = null;
if (env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

/**
 * Creates a new moderation report
 */
export const createModerationReportService = async (
  input: CreateModerationReportInput
): Promise<ModerationReport> => {
  const {
    reporter_user_id,
    reported_user_id,
    content_id,
    content_type,
    content_text,
    reason,
    description,
    severity_level
  } = input;

  // If content_text is provided, use AI to assess severity if not provided
  let assessedSeverity = severity_level;
  if (content_text && !severity_level && openai) {
    try {
      // Use OpenAI to analyze content and suggest severity
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content moderator. Assess the severity of this content on a scale of 1-5, where 1 is low severity and 5 is high severity. Respond with only the number.'
          },
          {
            role: 'user',
            content: `Content: ${content_text}\n\nReason reported: ${reason}`
          }
        ],
        max_tokens: 5,
        temperature: 0
      });
      
      const severityMatch = response.choices[0].message.content?.trim().match(/\d/);
      if (severityMatch) {
        assessedSeverity = Math.max(1, Math.min(5, parseInt(severityMatch[0])));
      }
    } catch (error) {
      console.error('Error assessing content severity:', error);
      // Default to level 3 if AI assessment fails
      assessedSeverity = severity_level || 3;
    }
  }

  const query = `
    INSERT INTO moderation_reports (
      report_id,
      reporter_user_id,
      reported_user_id,
      content_id,
      content_type,
      content_text,
      reason,
      description,
      severity_level
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    reporter_user_id,
    reported_user_id || null,
    content_id || null,
    content_type || null,
    content_text || null,
    reason,
    description || null,
    assessedSeverity || 1
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Creates a new moderation action
 */
export const createModerationActionService = async (
  input: CreateModerationActionInput
): Promise<ModerationAction> => {
  const {
    moderator_id,
    target_user_id,
    target_content_id,
    action_type,
    reason,
    duration_minutes
  } = input;

  const query = `
    INSERT INTO moderation_actions (
      action_id,
      moderator_id,
      target_user_id,
      target_content_id,
      action_type,
      reason,
      duration_minutes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    moderator_id,
    target_user_id || null,
    target_content_id || null,
    action_type,
    reason || null,
    duration_minutes || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Creates a new content filter
 */
export const createContentFilterService = async (
  input: CreateContentFilterInput
): Promise<ContentFilter> => {
  const {
    keyword,
    category,
    severity_level,
    is_active
  } = input;

  const query = `
    INSERT INTO content_filters (
      filter_id,
      keyword,
      category,
      severity_level,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    keyword,
    category,
    severity_level,
    is_active ?? true
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Creates a new user ban
 */
export const createUserBanService = async (
  input: CreateUserBanInput
): Promise<UserBan> => {
  const {
    user_id,
    moderator_id,
    reason,
    ban_type,
    expires_at
  } = input;

  const query = `
    INSERT INTO user_bans (
      ban_id,
      user_id,
      moderator_id,
      reason,
      ban_type,
      expires_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    user_id,
    moderator_id,
    reason || null,
    ban_type,
    expires_at || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Gets a moderation report by ID
 */
export const getModerationReportByIdService = async (
  reportId: string
): Promise<ModerationReport | null> => {
  const query = 'SELECT * FROM moderation_reports WHERE report_id = $1';
  const { rows } = await pool.query(query, [reportId]);

  return rows.length ? rows[0] : null;
};

/**
 * Gets moderation reports by status
 */
export const getModerationReportsByStatusService = async (
  status: string,
  limit: number = 20,
  offset: number = 0
): Promise<ModerationReport[]> => {
  const query = `
    SELECT * FROM moderation_reports 
    WHERE status = $1
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  `;
  const params = [status, limit.toString(), offset.toString()];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Updates a moderation report
 */
export const updateModerationReportService = async (
  reportId: string,
  input: UpdateModerationReportInput
): Promise<ModerationReport | null> => {
  const { status, assigned_moderator_id, resolution_notes } = input;
  
  const query = `
    UPDATE moderation_reports
    SET 
      status = COALESCE($1, status),
      assigned_moderator_id = COALESCE($2, assigned_moderator_id),
      resolution_notes = COALESCE($3, resolution_notes),
      updated_at = CURRENT_TIMESTAMP,
      resolved_at = CASE 
        WHEN $1 IN ('approved', 'rejected') AND resolved_at IS NULL 
        THEN CURRENT_TIMESTAMP 
        ELSE resolved_at 
      END
    WHERE report_id = $4
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [
    status || null,
    assigned_moderator_id || null,
    resolution_notes || null,
    reportId
  ]);
  return rows.length ? rows[0] : null;
};

/**
 * Gets content filters by category
 */
export const getContentFiltersByCategoryService = async (
  category: string
): Promise<ContentFilter[]> => {
  const query = 'SELECT * FROM content_filters WHERE category = $1 AND is_active = true ORDER BY severity_level DESC';
  const { rows } = await pool.query(query, [category]);

  return rows;
};

/**
 * Gets all content filters
 */
export const getAllContentFiltersService = async (): Promise<ContentFilter[]> => {
  const query = 'SELECT * FROM content_filters ORDER BY category, severity_level DESC';
  const { rows } = await pool.query(query);

  return rows;
};

/**
 * Checks if content contains filtered keywords
 */
export const checkContentForFiltersService = async (
  content: string,
  category?: string
): Promise<{ matched: boolean; matches: ContentFilter[] }> => {
  let query = 'SELECT * FROM content_filters WHERE is_active = true';
  const params: string[] = [];

  if (category) {
    query += ' AND category = $1';
    params.push(category);
  }

  query += ' ORDER BY severity_level DESC';
  
  const { rows } = await pool.query(query, params);
  const filters = rows as ContentFilter[];

  const lowerContent = content.toLowerCase();
  const matches = filters.filter(filter => 
    lowerContent.includes(filter.keyword.toLowerCase())
  );

  return {
    matched: matches.length > 0,
    matches
  };
};

/**
 * Gets active bans for a user
 */
export const getActiveUserBansService = async (
  userId: string
): Promise<UserBan[]> => {
  const query = `
    SELECT * FROM user_bans 
    WHERE user_id = $1 
      AND (lifted_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      AND (ban_type = 'permanent' OR expires_at > CURRENT_TIMESTAMP)
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);

  return rows;
};

/**
 * Lifts a user ban
 */
export const liftUserBanService = async (
  banId: string,
  moderatorId: string
): Promise<boolean> => {
  const query = `
    UPDATE user_bans
    SET 
      lifted_at = CURRENT_TIMESTAMP,
      lifted_by_moderator_id = $1
    WHERE ban_id = $2
    RETURNING ban_id
  `;
  
  const { rows } = await pool.query(query, [moderatorId, banId]);
  return rows.length > 0;
};