// Enhanced email validation system with security features

interface EmailValidationResult {
  isValid: boolean;
  errors: string[];
  domain: string;
  isDisposable: boolean;
  hasValidMX: boolean;
}

interface DomainVerification {
  spf: boolean;
  dmarc: boolean;
  mx: boolean;
}

export class EmailValidationService {
  // RFC 5322 compliant email regex
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Allowed domains whitelist
  private static readonly ALLOWED_DOMAINS = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com',
    'aol.com'
  ];

  // Educational and government domain patterns
  private static readonly TRUSTED_DOMAIN_PATTERNS = [
    /\.edu$/,
    /\.gov$/,
    /\.org$/,
    /\.ac\.[a-z]{2}$/,
    /\.edu\.[a-z]{2}$/
  ];

  // Common disposable email domains
  private static readonly DISPOSABLE_DOMAINS = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com',
    'temp-mail.org',
    'throwaway.email',
    'getnada.com',
    'maildrop.cc',
    'sharklasers.com'
  ];

  static validateEmail(email: string): EmailValidationResult {
    const errors: string[] = [];
    const normalizedEmail = email.toLowerCase().trim();
    
    // Basic syntax validation
    if (!this.EMAIL_REGEX.test(normalizedEmail)) {
      errors.push('Invalid email format');
    }

    const domain = normalizedEmail.split('@')[1];
    
    if (!domain) {
      errors.push('Missing domain');
      return {
        isValid: false,
        errors,
        domain: '',
        isDisposable: false,
        hasValidMX: false
      };
    }

    // Check for disposable email
    const isDisposable = this.isDisposableEmail(domain);
    if (isDisposable) {
      errors.push('Disposable email addresses are not allowed');
    }

    // Domain validation
    if (!this.isDomainAllowed(domain)) {
      errors.push('Email domain is not in the allowed list');
    }

    // Length validation
    if (normalizedEmail.length > 254) {
      errors.push('Email address is too long');
    }

    // Local part validation (before @)
    const localPart = normalizedEmail.split('@')[0];
    if (localPart.length > 64) {
      errors.push('Email local part is too long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      domain,
      isDisposable,
      hasValidMX: true // Would be checked server-side
    };
  }

  static isDomainAllowed(domain: string): boolean {
    // Check whitelist
    if (this.ALLOWED_DOMAINS.includes(domain)) {
      return true;
    }

    // Check trusted patterns (.edu, .gov, etc.)
    return this.TRUSTED_DOMAIN_PATTERNS.some(pattern => pattern.test(domain));
  }

  static isDisposableEmail(domain: string): boolean {
    return this.DISPOSABLE_DOMAINS.includes(domain);
  }

  // Server-side domain verification (would be implemented on backend)
  static async verifyDomain(domain: string): Promise<DomainVerification> {
    // This would make actual DNS queries on the server
    // For client-side, we return a mock response
    return {
      spf: true,
      dmarc: true,
      mx: true
    };
  }

  // Rate limiting for email validation attempts
  static checkRateLimit(identifier: string): boolean {
    const key = `email_validation_${identifier}`;
    const attempts = parseInt(localStorage.getItem(key) || '0');
    const now = Date.now();
    const lastAttempt = parseInt(localStorage.getItem(`${key}_time`) || '0');

    // Reset if more than 1 hour has passed
    if (now - lastAttempt > 3600000) {
      localStorage.setItem(key, '1');
      localStorage.setItem(`${key}_time`, now.toString());
      return true;
    }

    // Check if under limit (5 attempts per hour)
    if (attempts < 5) {
      localStorage.setItem(key, (attempts + 1).toString());
      localStorage.setItem(`${key}_time`, now.toString());
      return true;
    }

    return false;
  }

  // Enhanced email normalization
  static normalizeEmail(email: string): string {
    const [localPart, domain] = email.toLowerCase().trim().split('@');
    
    // Gmail-specific normalization
    if (domain === 'gmail.com') {
      // Remove dots and plus addressing
      const normalizedLocal = localPart.replace(/\./g, '').split('+')[0];
      return `${normalizedLocal}@${domain}`;
    }

    return `${localPart}@${domain}`;
  }

  // Check for common typos in popular domains
  static suggestCorrection(email: string): string | null {
    const domain = email.split('@')[1];
    const localPart = email.split('@')[0];

    const corrections: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'outlok.com': 'outlook.com',
      'hotmial.com': 'hotmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com'
    };

    if (corrections[domain]) {
      return `${localPart}@${corrections[domain]}`;
    }

    return null;
  }
}

// Two-Factor Authentication utilities
export class TwoFactorAuth {
  // Generate TOTP secret
  static generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  // Generate QR code URL for authenticator apps
  static generateQRCodeURL(secret: string, email: string, issuer: string = 'QuickBriefs.ai'): string {
    const label = encodeURIComponent(`${issuer}:${email}`);
    const params = new URLSearchParams({
      secret,
      issuer,
      algorithm: 'SHA1',
      digits: '6',
      period: '30'
    });
    
    return `otpauth://totp/${label}?${params.toString()}`;
  }

  // Verify TOTP token (would be done server-side)
  static verifyTOTP(token: string, secret: string): boolean {
    // This would use a proper TOTP library on the server
    // For demo purposes, we'll accept any 6-digit number
    return /^\d{6}$/.test(token);
  }
}

// Rate limiting utility
export class RateLimiter {
  private static attempts: Map<string, { count: number; lastAttempt: number; blocked: boolean }> = new Map();
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour
  private static readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

  static canAttempt(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
      return true;
    }

    // Check if block period has expired
    if (record.blocked && now - record.lastAttempt > this.BLOCK_DURATION) {
      record.blocked = false;
      record.count = 1;
      record.lastAttempt = now;
      return true;
    }

    // If currently blocked
    if (record.blocked) {
      return false;
    }

    // Reset if window has passed
    if (now - record.lastAttempt > this.WINDOW_MS) {
      record.count = 1;
      record.lastAttempt = now;
      return true;
    }

    // Check if under limit
    if (record.count < this.MAX_ATTEMPTS) {
      record.count++;
      record.lastAttempt = now;
      return true;
    }

    // Block the identifier
    record.blocked = true;
    record.lastAttempt = now;
    return false;
  }

  static getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || !record.blocked) return 0;

    const elapsed = Date.now() - record.lastAttempt;
    return Math.max(0, this.BLOCK_DURATION - elapsed);
  }

  static getAttemptCount(identifier: string): number {
    const record = this.attempts.get(identifier);
    return record ? record.count : 0;
  }
}