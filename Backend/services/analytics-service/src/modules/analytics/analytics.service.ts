import { Pool } from 'pg';
import moment from 'moment';
import { env } from '../../config/env.js';
import { 
  CreateUserAnalyticsInput, 
  CreateContentAnalyticsInput,
  CreateSystemAnalyticsInput,
  CreateUserEngagementInput,
  UserAnalytics,
  ContentAnalytics,
  SystemAnalytics,
  UserEngagement
} from './analytics.types.js';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Creates a new user analytics record
 */
export const createUserAnalyticsService = async (
  input: CreateUserAnalyticsInput
): Promise<UserAnalytics> => {
  const {
    user_id,
    metric_type,
    value,
    date_recorded
  } = input;

  const query = `
    INSERT INTO user_analytics (
      analytics_id,
      user_id,
      metric_type,
      value,
      date_recorded
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    user_id,
    metric_type,
    value,
    date_recorded || moment().format('YYYY-MM-DD')
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Creates a new content analytics record
 */
export const createContentAnalyticsService = async (
  input: CreateContentAnalyticsInput
): Promise<ContentAnalytics> => {
  const {
    content_id,
    content_type,
    metric_type,
    value,
    date_recorded
  } = input;

  const query = `
    INSERT INTO content_analytics (
      analytics_id,
      content_id,
      content_type,
      metric_type,
      value,
      date_recorded
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    content_id,
    content_type,
    metric_type,
    value,
    date_recorded || moment().format('YYYY-MM-DD')
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Creates a new system analytics record
 */
export const createSystemAnalyticsService = async (
  input: CreateSystemAnalyticsInput
): Promise<SystemAnalytics> => {
  const {
    metric_name,
    metric_value,
    date_recorded
  } = input;

  const query = `
    INSERT INTO system_analytics (
      analytics_id,
      metric_name,
      metric_value,
      date_recorded
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    metric_name,
    metric_value,
    date_recorded || moment().format('YYYY-MM-DD')
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Creates a new user engagement record
 */
export const createUserEngagementService = async (
  input: CreateUserEngagementInput
): Promise<UserEngagement> => {
  const {
    user_id,
    engaged_with_user_id,
    content_id,
    content_type,
    action_type,
    duration_seconds
  } = input;

  const query = `
    INSERT INTO user_engagement (
      engagement_id,
      user_id,
      engaged_with_user_id,
      content_id,
      content_type,
      action_type,
      duration_seconds
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    user_id,
    engaged_with_user_id || null,
    content_id || null,
    content_type || null,
    action_type,
    duration_seconds || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Gets user analytics by user ID and metric type
 */
export const getUserAnalyticsService = async (
  userId: string,
  metricType?: string,
  startDate?: string,
  endDate?: string
): Promise<UserAnalytics[]> => {
  let query = 'SELECT * FROM user_analytics WHERE user_id = $1';
  const params = [userId];
  let paramIndex = 2;

  if (metricType) {
    query += ` AND metric_type = $${paramIndex}`;
    params.push(metricType);
    paramIndex++;
  }

  if (startDate) {
    query += ` AND date_recorded >= $${paramIndex}`;
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    query += ` AND date_recorded <= $${paramIndex}`;
    params.push(endDate);
  }

  query += ' ORDER BY date_recorded DESC';

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets content analytics by content ID and metric type
 */
export const getContentAnalyticsService = async (
  contentId: string,
  metricType?: string,
  startDate?: string,
  endDate?: string
): Promise<ContentAnalytics[]> => {
  let query = 'SELECT * FROM content_analytics WHERE content_id = $1';
  const params = [contentId];
  let paramIndex = 2;

  if (metricType) {
    query += ` AND metric_type = $${paramIndex}`;
    params.push(metricType);
    paramIndex++;
  }

  if (startDate) {
    query += ` AND date_recorded >= $${paramIndex}`;
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    query += ` AND date_recorded <= $${paramIndex}`;
    params.push(endDate);
  }

  query += ' ORDER BY date_recorded DESC';

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets system analytics by metric name
 */
export const getSystemAnalyticsService = async (
  metricName?: string,
  startDate?: string,
  endDate?: string
): Promise<SystemAnalytics[]> => {
  let query = 'SELECT * FROM system_analytics';
  const params: string[] = [];
  let paramIndex = 1;

  if (metricName) {
    query += ` WHERE metric_name = $${paramIndex}`;
    params.push(metricName);
    paramIndex++;
  } else {
    query += ' WHERE ';
  }

  if (startDate) {
    if (params.length === 0) query += ' WHERE ';
    else query += ' AND ';
    query += `date_recorded >= $${paramIndex}`;
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    if (params.length === 0) query += ' WHERE ';
    else query += ' AND ';
    query += `date_recorded <= $${paramIndex}`;
    params.push(endDate);
  }

  query += ' ORDER BY date_recorded DESC';

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets user engagement by user ID and action type
 */
export const getUserEngagementService = async (
  userId: string,
  actionType?: string,
  startDate?: string,
  endDate?: string
): Promise<UserEngagement[]> => {
  let query = 'SELECT * FROM user_engagement WHERE user_id = $1';
  const params = [userId];
  let paramIndex = 2;

  if (actionType) {
    query += ` AND action_type = $${paramIndex}`;
    params.push(actionType);
    paramIndex++;
  }

  if (startDate) {
    query += ` AND created_at >= $${paramIndex}::timestamp`;
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    query += ` AND created_at <= $${paramIndex}::timestamp`;
    params.push(endDate);
  }

  query += ' ORDER BY created_at DESC';

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets aggregated user statistics
 */
export const getUserStatsService = async (
  userId: string
): Promise<any> => {
  const query = `
    SELECT 
      u.user_id,
      SUM(CASE WHEN ua.metric_type = 'post_created' THEN ua.value ELSE 0 END) as total_posts,
      SUM(CASE WHEN ua.metric_type = 'comment_added' THEN ua.value ELSE 0 END) as total_comments,
      SUM(CASE WHEN ua.metric_type = 'like_given' THEN ua.value ELSE 0 END) as likes_given,
      SUM(CASE WHEN ua.metric_type = 'follow' THEN ua.value ELSE 0 END) as total_follows,
      SUM(CASE WHEN ua.metric_type = 'login' THEN ua.value ELSE 0 END) as login_count
    FROM users u
    LEFT JOIN user_analytics ua ON u.user_id = ua.user_id
    WHERE u.user_id = $1
    GROUP BY u.user_id
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Gets daily active users
 */
export const getDailyActiveUsersService = async (
  date: string
): Promise<number> => {
  const query = `
    SELECT COUNT(DISTINCT user_id) as dau
    FROM user_analytics
    WHERE metric_type = 'login' AND date_recorded = $1
  `;

  const { rows } = await pool.query(query, [date]);
  return rows[0]?.dau || 0;
};

/**
 * Gets weekly active users
 */
export const getWeeklyActiveUsersService = async (
  date: string
): Promise<number> => {
  const query = `
    SELECT COUNT(DISTINCT user_id) as wau
    FROM user_analytics
    WHERE metric_type = 'login' 
      AND date_recorded >= $1::date - interval '7 days'
      AND date_recorded <= $1::date
  `;

  const { rows } = await pool.query(query, [date]);
  return rows[0]?.wau || 0;
};

/**
 * Gets monthly active users
 */
export const getMonthlyActiveUsersService = async (
  date: string
): Promise<number> => {
  const query = `
    SELECT COUNT(DISTINCT user_id) as mau
    FROM user_analytics
    WHERE metric_type = 'login' 
      AND date_recorded >= $1::date - interval '30 days'
      AND date_recorded <= $1::date
  `;

  const { rows } = await pool.query(query, [date]);
  return rows[0]?.mau || 0;
};