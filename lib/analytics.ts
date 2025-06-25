// Analytics utilities for tracking user behavior and application metrics

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp: string;
}

export interface UserMetrics {
  totalSummaries: number;
  thisMonth: number;
  favoriteMode: 'business' | 'student' | 'code';
  timeSaved: number; // in hours
  joinDate: string;
  subscriptionStatus: 'free' | 'premium' | 'pay-per-use';
}

export class Analytics {
  private static events: AnalyticsEvent[] = [];
  
  static track(event: string, userId?: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId,
      properties,
      timestamp: new Date().toISOString()
    };
    
    this.events.push(analyticsEvent);
    
    // In production, this would send to analytics service
    console.log('Analytics Event:', analyticsEvent);
    
    // Store in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quickbriefs_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(analyticsEvent);
      localStorage.setItem('quickbriefs_analytics', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
    }
  }

  static trackSummaryGenerated(userId: string, mode: string, inputType: string, success: boolean) {
    this.track('summary_generated', userId, {
      mode,
      inputType,
      success,
      timestamp: new Date().toISOString()
    });
  }

  static trackUserSignup(userId: string, source: string) {
    this.track('user_signup', userId, {
      source,
      timestamp: new Date().toISOString()
    });
  }

  static trackSubscriptionPurchase(userId: string, plan: string, amount: number) {
    this.track('subscription_purchase', userId, {
      plan,
      amount,
      timestamp: new Date().toISOString()
    });
  }

  static trackPageView(page: string, userId?: string) {
    this.track('page_view', userId, {
      page,
      timestamp: new Date().toISOString()
    });
  }

  static getUserMetrics(userId: string): UserMetrics {
    // In production, this would query from Supabase
    // For demo, return mock data
    return {
      totalSummaries: 156,
      thisMonth: 23,
      favoriteMode: 'business',
      timeSaved: 24.5,
      joinDate: '2024-12-01',
      subscriptionStatus: 'free'
    };
  }

  static getUsageStats() {
    const events = this.events.filter(e => e.event === 'summary_generated');
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    
    return {
      totalSummaries: events.length,
      todaySummaries: events.filter(e => new Date(e.timestamp).toDateString() === today).length,
      thisMonthSummaries: events.filter(e => new Date(e.timestamp).getMonth() === thisMonth).length,
      popularModes: this.getModeDistribution(events),
      popularInputTypes: this.getInputTypeDistribution(events)
    };
  }

  private static getModeDistribution(events: AnalyticsEvent[]) {
    const modes = events.reduce((acc, event) => {
      const mode = event.properties?.mode;
      if (mode) {
        acc[mode] = (acc[mode] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(modes)
      .sort(([,a], [,b]) => b - a)
      .map(([mode, count]) => ({ mode, count }));
  }

  private static getInputTypeDistribution(events: AnalyticsEvent[]) {
    const types = events.reduce((acc, event) => {
      const type = event.properties?.inputType;
      if (type) {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(types)
      .sort(([,a], [,b]) => b - a)
      .map(([type, count]) => ({ type, count }));
  }

  // Revenue analytics
  static getRevenue() {
    const subscriptions = this.events.filter(e => e.event === 'subscription_purchase');
    const totalRevenue = subscriptions.reduce((sum, event) => {
      return sum + (event.properties?.amount || 0);
    }, 0);

    const thisMonth = new Date().getMonth();
    const thisMonthRevenue = subscriptions
      .filter(e => new Date(e.timestamp).getMonth() === thisMonth)
      .reduce((sum, event) => sum + (event.properties?.amount || 0), 0);

    return {
      totalRevenue: totalRevenue / 100, // Convert from cents
      thisMonthRevenue: thisMonthRevenue / 100,
      subscribers: subscriptions.length
    };
  }

  // Conversion metrics
  static getConversionMetrics() {
    const signups = this.events.filter(e => e.event === 'user_signup').length;
    const purchases = this.events.filter(e => e.event === 'subscription_purchase').length;
    
    return {
      signupToTrialConversion: signups > 0 ? (signups / signups) * 100 : 0, // All signups are trials
      trialToPaidConversion: signups > 0 ? (purchases / signups) * 100 : 0,
      totalSignups: signups,
      totalPurchases: purchases
    };
  }
}

// Error tracking
export class ErrorTracker {
  static trackError(error: Error, context?: Record<string, any>) {
    const errorEvent = {
      event: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
      }
    };

    console.error('Error tracked:', errorEvent);
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quickbriefs_errors') || '[]';
      const errors = JSON.parse(stored);
      errors.push(errorEvent);
      localStorage.setItem('quickbriefs_errors', JSON.stringify(errors.slice(-100))); // Keep last 100 errors
    }
  }

  static getErrorMetrics() {
    if (typeof window === 'undefined') return { totalErrors: 0, recentErrors: [] };

    const stored = localStorage.getItem('quickbriefs_errors') || '[]';
    const errors = JSON.parse(stored);
    
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const recentErrors = errors.filter((error: any) => 
      new Date(error.properties.timestamp) > last24Hours
    );

    return {
      totalErrors: errors.length,
      recentErrors: recentErrors.length,
      commonErrors: this.groupErrorsByMessage(errors)
    };
  }

  private static groupErrorsByMessage(errors: any[]) {
    const grouped = errors.reduce((acc, error) => {
      const message = error.properties.message;
      acc[message] = (acc[message] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));
  }
}