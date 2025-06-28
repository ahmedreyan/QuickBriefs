// Security utilities and enhancements

export class SecurityService {
  // XSS Protection
  static sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // HTTPS Enforcement
  static enforceHTTPS(): void {
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
      window.location.replace(`https://${window.location.host}${window.location.pathname}`);
    }
  }

  // Secure Cookie Settings
  static setSecureCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; Secure; HttpOnly; SameSite=Strict`;
    
    // Note: HttpOnly can't be set from client-side JavaScript
    // This would need to be set server-side
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
  }

  // Input Validation
  static validateInput(input: string, type: 'email' | 'url' | 'text' | 'number'): boolean {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'url':
        try {
          new URL(input);
          return true;
        } catch {
          return false;
        }
      case 'text':
        return input.length > 0 && input.length <= 10000;
      case 'number':
        return !isNaN(Number(input));
      default:
        return false;
    }
  }

  // Content Security Policy Violation Reporting
  static setupCSPReporting(): void {
    if (typeof window !== 'undefined') {
      document.addEventListener('securitypolicyviolation', (e) => {
        console.warn('CSP Violation:', {
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          originalPolicy: e.originalPolicy
        });
        
        // In production, send to monitoring service
        // this.reportSecurityViolation(e);
      });
    }
  }

  // Password Strength Validation
  static validatePasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('One special character');

    // Additional checks
    if (password.length >= 12) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    return {
      score,
      feedback,
      isStrong: score >= 5
    };
  }

  // Session Management
  static generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Detect suspicious activity
  static detectSuspiciousActivity(): {
    rapidRequests: boolean;
    unusualLocation: boolean;
    deviceFingerprint: string;
  } {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem('request_times') || '[]');
    
    // Add current request
    requests.push(now);
    
    // Keep only last 10 requests
    const recentRequests = requests.slice(-10);
    localStorage.setItem('request_times', JSON.stringify(recentRequests));

    // Check for rapid requests (more than 5 in 1 minute)
    const oneMinuteAgo = now - 60000;
    const rapidRequests = recentRequests.filter((time: number) => time > oneMinuteAgo).length > 5;

    // Simple device fingerprinting
    const deviceFingerprint = this.generateDeviceFingerprint();

    return {
      rapidRequests,
      unusualLocation: false, // Would require geolocation API
      deviceFingerprint
    };
  }

  private static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL()
    };

    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  }

  // Audit logging
  static logSecurityEvent(event: string, details: Record<string, any>): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('Security Event:', logEntry);
    
    // In production, send to security monitoring service
    // this.sendToSecurityService(logEntry);
  }
}

// Error Tracking Service
export class ErrorTracker {
  private static errors: any[] = [];

  static trackError(error: Error, context?: Record<string, any>): void {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };

    this.errors.push(errorInfo);
    console.error('Tracked Error:', errorInfo);

    // In production, send to error monitoring service (e.g., Sentry)
    // this.sendToErrorService(errorInfo);
  }

  static getErrorStats(): {
    totalErrors: number;
    recentErrors: number;
    commonErrors: Array<{ message: string; count: number }>;
  } {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const recentErrors = this.errors.filter(
      error => new Date(error.timestamp) > last24Hours
    );

    const errorCounts = this.errors.reduce((acc, error) => {
      acc[error.message] = (acc[error.message] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonErrors = Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));

    return {
      totalErrors: this.errors.length,
      recentErrors: recentErrors.length,
      commonErrors
    };
  }
}

// Performance Monitoring
export class PerformanceMonitor {
  static measurePageLoad(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          const metrics = {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint()
          };

          console.log('Performance Metrics:', metrics);
          
          // In production, send to analytics service
          // this.sendToAnalytics(metrics);
        }, 0);
      });
    }
  }

  private static getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private static getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  static measureResourceLoad(resourceName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`Resource Load Time - ${resourceName}: ${duration}ms`);
      
      // In production, send to analytics
      // this.sendResourceMetric(resourceName, duration);
    };
  }
}