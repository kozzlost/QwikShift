/**
 * Fraud Detection Module for QwikShift
 * Implements anomaly detection, behavioral analysis, and risk scoring
 * @module security/fraud-detection
 */

const crypto = require('crypto');

/**
 * Fraud Detection Engine
 * Analyzes user behavior and transactions for suspicious patterns
 */
class FraudDetectionEngine {
    constructor() {
          this.userProfiles = new Map();
          this.suspiciousActivities = new Map();
          this.blacklist = new Set();
          this.riskThreshold = 0.7;
          this.velocityLimits = {
                  login: { count: 10, window: 3600000 },
                  transaction: { count: 5, window: 3600000 },
                  profileChange: { count: 3, window: 86400000 },
          };
    }

  /**
     * Calculate risk score for user activity
     * @param {string} userId - User identifier
     * @param {object} activity - Activity details
     * @returns {number} Risk score 0-1
     */
  calculateRiskScore(userId, activity) {
        let riskScore = 0;
        const weights = {
                newDevice: 0.25,
                unusualLocation: 0.20,
                velocityAnomaly: 0.25,
                behavioralAnomaly: 0.15,
                identityMismatch: 0.15,
        };

      const userProfile = this.userProfiles.get(userId) || this.createUserProfile(userId);

      if (activity.isNewDevice) {
              riskScore += weights.newDevice;
      }

      if (this.isUnusualLocation(userId, activity.location)) {
              riskScore += weights.unusualLocation;
      }

      if (this.isVelocityAnomaly(userId, activity.type)) {
              riskScore += weights.velocityAnomaly;
      }

      if (this.isBehavioralAnomaly(userProfile, activity)) {
              riskScore += weights.behavioralAnomaly;
      }

      if (activity.identityVerified === false) {
              riskScore += weights.identityMismatch;
      }

      return Math.min(riskScore, 1);
  }

  /**
     * Create user profile from activity patterns
     * @param {string} userId - User identifier
     * @returns {object} User profile object
     */
  createUserProfile(userId) {
        const profile = {
                userId,
                createdAt: Date.now(),
                lastSeen: Date.now(),
                loginLocations: [],
                devices: [],
                typicalLoginTimes: [],
                averageTransactionAmount: 0,
                totalTransactions: 0,
                riskLevel: 'low',
                activities: [],
        };
        this.userProfiles.set(userId, profile);
        return profile;
  }

  /**
     * Check if location is unusual for user
     * @param {string} userId - User identifier
     * @param {object} location - Location data (lat, lon)
     * @returns {boolean} Is unusual location
     */
  isUnusualLocation(userId, location) {
        const profile = this.userProfiles.get(userId);
        if (!profile || !location) return false;

      if (profile.loginLocations.length === 0) {
              profile.loginLocations.push(location);
              return false;
      }

      const distances = profile.loginLocations.map(loc => 
                                                         this.calculateDistance(loc.lat, loc.lon, location.lat, location.lon)
                                                       );

      const minDistance = Math.min(...distances);
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;

      return minDistance > avgDistance * 5;
  }

  /**
     * Calculate distance between two coordinates (Haversine formula)
     * @param {number} lat1 - Latitude 1
     * @param {number} lon1 - Longitude 1
     * @param {number} lat2 - Latitude 2
     * @param {number} lon2 - Longitude 2
     * @returns {number} Distance in kilometers
     */
  calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
  }

  /**
     * Check for velocity anomalies (too many actions in short time)
     * @param {string} userId - User identifier
     * @param {string} activityType - Type of activity
     * @returns {boolean} Is velocity anomaly
     */
  isVelocityAnomaly(userId, activityType) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return false;

      const limit = this.velocityLimits[activityType];
        if (!limit) return false;

      const recentActivities = profile.activities.filter(
              a => a.type === activityType && Date.now() - a.timestamp < limit.window
            );

      return recentActivities.length >= limit.count;
  }

  /**
     * Check for behavioral anomalies
     * @param {object} profile - User profile
     * @param {object} activity - Activity data
     * @returns {boolean} Is behavioral anomaly
     */
  isBehavioralAnomaly(profile, activity) {
        if (!profile.typicalLoginTimes || profile.typicalLoginTimes.length === 0) {
                return false;
        }

      const currentHour = new Date().getHours();
        const typicalHours = profile.typicalLoginTimes.map(t => new Date(t).getHours());
        const avgHour = Math.round(typicalHours.reduce((a, b) => a + b, 0) / typicalHours.length);

      return Math.abs(currentHour - avgHour) > 6;
  }

  /**
     * Record user activity
     * @param {string} userId - User identifier
     * @param {object} activity - Activity object
     */
  recordActivity(userId, activity) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;

      profile.activities.push({
              ...activity,
              timestamp: Date.now(),
      });

      if (profile.activities.length > 100) {
              profile.activities = profile.activities.slice(-100);
      }

      profile.lastSeen = Date.now();
  }

  /**
     * Check if user/email is on blacklist
     * @param {string} identifier - Email or user ID
     * @returns {boolean} Is blacklisted
     */
  isBlacklisted(identifier) {
        return this.blacklist.has(identifier);
  }

  /**
     * Add to blacklist
     * @param {string} identifier - Email or user ID
     * @param {string} reason - Reason for blacklist
     */
  addToBlacklist(identifier, reason) {
        this.blacklist.add(identifier);
        const key = `blacklist:${identifier}`;
        this.suspiciousActivities.set(key, {
                identifier,
                reason,
                timestamp: Date.now(),
        });
  }

  /**
     * Detect credential stuffing attacks
     * @param {string} email - Email address
     * @param {string} password - Password hash
     * @returns {boolean} Likely credential stuffing
     */
  detectCredentialStuffing(email, password) {
        const profile = this.userProfiles.get(email);
        if (!profile) return false;

      const failedLogins = profile.activities.filter(
              a => a.type === 'login' && a.success === false && Date.now() - a.timestamp < 3600000
            );

      return failedLogins.length > 5;
  }

  /**
     * Detect account takeover attempts
     * @param {string} userId - User identifier
     * @param {object} loginAttempt - Login attempt data
     * @returns {boolean} Likely account takeover
     */
  detectAccountTakeover(userId, loginAttempt) {
        const riskScore = this.calculateRiskScore(userId, loginAttempt);
        return riskScore > this.riskThreshold;
  }
}

/**
 * Transaction Validator
 * Validates transactions for fraud indicators
 */
class TransactionValidator {
    constructor(fraudEngine) {
          this.fraudEngine = fraudEngine;
          this.transactionHistory = new Map();
    }

  /**
     * Validate transaction
     * @param {string} userId - User identifier
     * @param {object} transaction - Transaction object
     * @returns {Promise<{valid: boolean, reason: string}>}
     */
  async validateTransaction(userId, transaction) {
        const checks = [
                this.checkTransactionAmount(userId, transaction),
                this.checkTransactionFrequency(userId, transaction),
                this.checkPaymentMethodChange(userId, transaction),
                this.checkCVVMatch(transaction),
              ];

      const results = await Promise.all(checks);
        const failed = results.filter(r => !r.valid);

      if (failed.length > 0) {
              return {
                        valid: false,
                        reason: failed[0].reason,
              };
      }

      return { valid: true, reason: 'Transaction approved' };
  }

  /**
     * Check if transaction amount is unusual
     * @param {string} userId - User identifier
     * @param {object} transaction - Transaction object
     * @returns {object} Validation result
     */
  checkTransactionAmount(userId, transaction) {
        const profile = this.fraudEngine.userProfiles.get(userId);
        if (!profile) return { valid: true };

      const avgAmount = profile.averageTransactionAmount;
        if (transaction.amount > avgAmount * 10) {
                return {
                          valid: false,
                          reason: 'Transaction amount significantly higher than usual',
                };
        }

      return { valid: true };
  }

  /**
     * Check transaction frequency
     * @param {string} userId - User identifier
     * @param {object} transaction - Transaction object
     * @returns {object} Validation result
     */
  checkTransactionFrequency(userId, transaction) {
        const history = this.transactionHistory.get(userId) || [];
        const recentTransactions = history.filter(
                t => Date.now() - t.timestamp < 300000
              );

      if (recentTransactions.length >= 5) {
              return {
                        valid: false,
                        reason: 'Too many transactions in short time period',
              };
      }

      return { valid: true };
  }

  /**
     * Check for payment method changes
     * @param {string} userId - User identifier
     * @param {object} transaction - Transaction object
     * @returns {object} Validation result
     */
  checkPaymentMethodChange(userId, transaction) {
        const history = this.transactionHistory.get(userId) || [];
        const lastTransaction = history[history.length - 1];

      if (lastTransaction && lastTransaction.paymentMethod !== transaction.paymentMethod) {
              return {
                        valid: false,
                        reason: 'Payment method changed unexpectedly',
              };
      }

      return { valid: true };
  }

  /**
     * Validate CVV match
     * @param {object} transaction - Transaction object
     * @returns {object} Validation result
     */
  checkCVVMatch(transaction) {
        if (!transaction.cvv || transaction.cvv.length !== 3) {
                return {
                          valid: false,
                          reason: 'Invalid CVV format',
                };
        }

      return { valid: true };
  }
}

module.exports = {
    FraudDetectionEngine,
    TransactionValidator,
};
