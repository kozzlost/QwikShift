/**
 * Encryption Module for QwikShift
 * Implements data encryption, password hashing, and secure communication
 * @module security/encryption
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Encryption Service
 * Handles symmetric encryption for sensitive data
 */
class EncryptionService {
    constructor(encryptionKey = null) {
          this.encryptionKey = encryptionKey || process.env.ENCRYPTION_KEY;
          this.algorithm = 'aes-256-gcm';
          this.encoding = 'hex';
    }

  /**
     * Encrypt sensitive data
     * @param {string} plaintext - Data to encrypt
     * @returns {object} Encrypted data with IV and auth tag
     */
  encrypt(plaintext) {
        if (!plaintext) return null;

      const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
                this.algorithm,
                Buffer.from(this.encryptionKey, this.encoding),
                iv
              );

      let encrypted = cipher.update(plaintext, 'utf-8', this.encoding);
        encrypted += cipher.final(this.encoding);

      const authTag = cipher.getAuthTag();

      return {
              encrypted,
              iv: iv.toString(this.encoding),
              authTag: authTag.toString(this.encoding),
      };
  }

  /**
     * Decrypt encrypted data
     * @param {object} encryptedData - Encrypted data object
     * @returns {string} Decrypted plaintext
     */
  decrypt(encryptedData) {
        if (!encryptedData || !encryptedData.encrypted) return null;

      const decipher = crypto.createDecipheriv(
              this.algorithm,
              Buffer.from(this.encryptionKey, this.encoding),
              Buffer.from(encryptedData.iv, this.encoding)
            );

      decipher.setAuthTag(Buffer.from(encryptedData.authTag, this.encoding));

      let decrypted = decipher.update(encryptedData.encrypted, this.encoding, 'utf-8');
        decrypted += decipher.final('utf-8');

      return decrypted;
  }

  /**
     * Encrypt object to JSON
     * @param {object} obj - Object to encrypt
     * @returns {object} Encrypted JSON
     */
  encryptObject(obj) {
        const jsonString = JSON.stringify(obj);
        return this.encrypt(jsonString);
  }

  /**
     * Decrypt object from encrypted JSON
     * @param {object} encryptedData - Encrypted data
     * @returns {object} Decrypted object
     */
  decryptObject(encryptedData) {
        const decrypted = this.decrypt(encryptedData);
        return JSON.parse(decrypted);
  }
}

/**
 * Password Hashing Service
 * Implements secure password hashing using bcryptjs
 */
class PasswordHashingService {
    constructor() {
          this.saltRounds = 12;
    }

  /**
     * Hash password
     * @param {string} password - Plain password
     * @returns {Promise<string>} Password hash
     */
  async hashPassword(password) {
        if (!password || password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
        }

      try {
              return await bcrypt.hash(password, this.saltRounds);
      } catch (error) {
              console.error('Password hashing error:', error);
              throw error;
      }
  }

  /**
     * Verify password against hash
     * @param {string} password - Plain password
     * @param {string} hash - Password hash
     * @returns {Promise<boolean>} Password match
     */
  async verifyPassword(password, hash) {
        try {
                return await bcrypt.compare(password, hash);
        } catch (error) {
                console.error('Password verification error:', error);
                return false;
        }
  }

  /**
     * Check if password needs rehashing
     * @param {string} hash - Password hash
     * @returns {boolean} Needs rehashing
     */
  needsRehashing(hash) {
        const rounds = parseInt(hash.split('$')[2]);
        return rounds < this.saltRounds;
  }
}

/**
 * HMAC Service
 * Generates and verifies HMAC signatures for data integrity
 */
class HMACService {
    constructor(hmacSecret = null) {
          this.hmacSecret = hmacSecret || process.env.HMAC_SECRET;
          this.algorithm = 'sha256';
    }

  /**
     * Generate HMAC signature
     * @param {string} data - Data to sign
     * @returns {string} HMAC signature
     */
  generateSignature(data) {
        return crypto
          .createHmac(this.algorithm, this.hmacSecret)
          .update(data)
          .digest('hex');
  }

  /**
     * Verify HMAC signature
     * @param {string} data - Original data
     * @param {string} signature - Signature to verify
     * @returns {boolean} Signature valid
     */
  verifySignature(data, signature) {
        const expectedSignature = this.generateSignature(data);
        return crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expectedSignature)
              );
  }
}

/**
 * JWT Token Service
 * Generates and validates JWT tokens
 */
class JWTService {
    constructor() {
          this.jwtSecret = process.env.JWT_SECRET;
          this.tokenExpiry = '24h';
    }

  /**
     * Generate JWT token
     * @param {object} payload - Token payload
     * @returns {string} JWT token
     */
  generateToken(payload) {
        const jwt = require('jsonwebtoken');
        return jwt.sign(payload, this.jwtSecret, {
                expiresIn: this.tokenExpiry,
        });
  }

  /**
     * Verify JWT token
     * @param {string} token - JWT token to verify
     * @returns {object} Token payload
     */
  verifyToken(token) {
        try {
                const jwt = require('jsonwebtoken');
                return jwt.verify(token, this.jwtSecret);
        } catch (error) {
                console.error('JWT verification error:', error);
                return null;
        }
  }

  /**
     * Decode JWT without verification
     * @param {string} token - JWT token
     * @returns {object} Token payload
     */
  decodeToken(token) {
        const jwt = require('jsonwebtoken');
        return jwt.decode(token);
  }
}

/**
 * Data Masking Service
 * Masks sensitive data for logging and display
 */
class DataMaskingService {
    /**
     * Mask email address
     * @param {string} email - Email to mask
     * @returns {string} Masked email
     */
  static maskEmail(email) {
        if (!email) return null;
        const [name, domain] = email.split('@');
        const maskedName = name.charAt(0) + '*'.repeat(Math.max(1, name.length - 2)) + name.charAt(name.length - 1);
        return `${maskedName}@${domain}`;
  }

  /**
     * Mask credit card
     * @param {string} cardNumber - Card number to mask
     * @returns {string} Masked card number
     */
  static maskCreditCard(cardNumber) {
        if (!cardNumber || cardNumber.length < 4) return null;
        const last4 = cardNumber.slice(-4);
        return '*'.repeat(cardNumber.length - 4) + last4;
  }

  /**
     * Mask phone number
     * @param {string} phone - Phone to mask
     * @returns {string} Masked phone
     */
  static maskPhoneNumber(phone) {
        if (!phone || phone.length < 4) return null;
        const last4 = phone.slice(-4);
        return '*'.repeat(phone.length - 4) + last4;
  }

  /**
     * Mask SSN
     * @param {string} ssn - SSN to mask
     * @returns {string} Masked SSN
     */
  static maskSSN(ssn) {
        if (!ssn || ssn.length !== 9) return null;
        return '***-**-' + ssn.slice(-4);
  }
}

module.exports = {
    EncryptionService,
    PasswordHashingService,
    HMACService,
    JWTService,
    DataMaskingService,
};
