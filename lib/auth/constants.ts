/**
 * Session lifetime configuration.
 *
 * The session expires after this many seconds of inactivity.
 * Each authenticated request refreshes the expiry (sliding window).
 */
export const SESSION_MAX_AGE = 60 * 60;
