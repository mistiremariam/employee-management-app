const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {string} userId - MongoDB user ID
 * @param {string} role - User role (optional)
 * @returns {string} JWT token
 */
const generateToken = (userId, role = 'staff') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token valid for 1 day
  });
};

/**
 * Format a date into readable format (e.g., Jan 1, 2025)
 * @param {Date} date
 * @returns {string}
 */
const formatDate = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

/**
 * Capitalize the first letter of each word
 * @param {string} text
 * @returns {string}
 */
const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Validate if a value is a positive number
 * @param {number} value
 * @returns {boolean}
 */
const isPositiveNumber = (value) => {
  return typeof value === 'number' && value >= 0;
};

module.exports = {
  generateToken,
  formatDate,
  capitalizeWords,
  isPositiveNumber,
};
