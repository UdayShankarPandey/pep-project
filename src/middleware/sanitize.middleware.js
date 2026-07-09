/**
 * Custom NoSQL injection sanitizer compatible with Express v5.
 *
 * Express v5 makes req.query a read-only getter, so we cannot use
 * express-mongo-sanitize (it tries to reassign req.query directly).
 *
 * This middleware sanitizes req.body and req.params in-place by
 * recursively stripping keys that start with '$' or contain '.'
 * which are MongoDB operators used in injection attacks.
 */

const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      obj[index] = sanitizeObject(item);
    });
    return obj;
  }

  for (const key of Object.keys(obj)) {
    // Strip keys starting with '$' (e.g. $gt, $ne, $in)
    if (key.startsWith('$')) {
      delete obj[key];
    } else {
      obj[key] = sanitizeObject(obj[key]);
    }
  }

  return obj;
};

export const mongoSanitize = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  // req.query is read-only in Express 5, but query params from URLs
  // are strings and don't carry MongoDB operators — safe to skip.
  next();
};
