const crypto = require('crypto');

/**
 * Generate API Key with format: sk_live_xxxxxxxxxx
 */
function generateApiKey() {
  const randomString = crypto.randomBytes(32).toString('hex');
  return `sk_live_${randomString}`;
}

/**
 * Validate API Key format
 */
function isValidApiKeyFormat(apiKey) {
  return /^sk_live_[a-f0-9]{64}$/.test(apiKey);
}

module.exports = {
  generateApiKey,
  isValidApiKeyFormat
};