/**
 * ZipShift - Analytics Module
 * Tracks user events, conversions, and engagement metrics
 */

// Global trackEvent function for use across the application
window.trackEvent = function(eventName, eventData = {}) {
    Analytics.track(eventName, eventData);
};

const Analytics = {
    // Google Analytics 4 Measurement ID
    GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with actual ID

    // Mixpanel Token
    MIXPANEL_TOKEN: 'xxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with actual token

    /**
         * Initialize analytics
     */
    init() {
          this.initGoogleAnalytics();
          this.initMixpanel();
          this.trackPageView();
          this.setupEventTracking();
    },

    /**
         * Initialize Google Analytics 4
     */
    initGoogleAnalytics() {
          // Load GA4 script
      const script = document.createElement('script');
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
          document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
          function gtag() {
                  dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', this.GA_MEASUREMENT_ID, {
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure',
          });

      window.gtag = gtag;
    },

    /**
         * Initialize Mixpanel
     */
    initMixpanel() {
          // Load Mixpanel script
      (function(f, b) {
              if (!b.__SV) {
                        var a, e, i, g;
                        window.mixpanel = b;
                        b._i = [];
                        b.init = function(a, e, d) {
                                    function f(b, h) {
                                                  var a = h.split('.');
                                                  2 == a.length && ((b = b[a[0]]), (h = a[1]));
                                                  b[h] = function() {
                                                                  b.push([h].concat(Array.prototype.slice.call(arguments, 0)));
                                                  };
                                    }
                                    var c = b;
                                    for (
                                                  'undefined' == typeof d && (d = ''), a = c.split('.'); a.length > 1;

                                                )
                                                  (b = c[a.shift()]), (c = b[a[0]] = b[a[0]] || {});
                                    c = c[a[0]];
                                    b.push([c, 'init', a, d]);
                                    c.config = c.config || {};
                                    c.config['token'] = a;
                                    c.config['loaded'] = new Date().getTime();
                        };
                        b.track = function(a, b) {
                                    var c = new Image();
                                    c.src = '';
                        };
              }
      })(document, window.mixpanel || []);

      if (window.mixpanel && window.mixpanel.init) {
              window.mixpanel.init(this.MIXPANEL_TOKEN);
      }
    },

    /**
         * Track page view
     */
    trackPageView() {
          if (window.gtag) {
                  window.gtag('event', 'page_view', {
                            page_title: document.title,
                            page_location: window.location.href,
                            page_path: window.location.pathname,
                  });
          }

      if (window.mixpanel) {
              window.mixpanel.track('Page View', {
                        page: document.title,
                        url: window.location.href,
              });
      }
    },

    /**
         * Track custom event
     */
    track(eventName, eventData = {}) {
          // Google Analytics 4
      if (window.gtag) {
              window.gtag('event', eventName, eventData);
      }

      // Mixpanel
      if (window.mixpanel) {
              window.mixpanel.track(eventName, eventData);
      }

      // Console log for development
      if (process.env.NODE_ENV === 'development') {
              console.log(`📊 Event: ${eventName}`, eventData);
      }
    },

    /**
         * Setup automatic event tracking
     */
    setupEventTracking() {
          // Track form submissions
      document.querySelectorAll('form').forEach((form) => {
              form.addEventListener('submit', (e) => {
                        this.track('form_submit', {
                                    form_name: form.name || form.id || 'unknown',
                                    form_fields: Array.from(form.elements).map((el) => el.name),
                        });
              });
      });

      // Track link clicks
      document.querySelectorAll('a:not([href^="#"])').forEach((link) => {
              link.addEventListener('click', () => {
                        this.track('link_click', {
                                    link_text: link.textContent,
                                    link_url: link.href,
                                    link_target: link.target,
                        });
              });
      });

      // Track scroll depth
      this.trackScrollDepth();

      // Track time on page
      this.trackTimeOnPage();
    },

    /**
         * Track scroll depth
     */
    trackScrollDepth() {
          const scrollThresholds = [25, 50, 75, 100];
          const trackedThresholds = new Set();

      window.addEventListener('scroll', () => {
              const scrollPercent =
                        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

                                    scrollThresholds.forEach((threshold) => {
                                              if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                                                          trackedThresholds.add(threshold);
                                                          this.track('scroll_depth', {
                                                                        depth_percent: threshold,
                                                                        page: document.title,
                                                          });
                                              }
                                    });
      });
    },

    /**
         * Track time on page
     */
    trackTimeOnPage() {
          const startTime = Date.now();

      window.addEventListener('beforeunload', () => {
              const timeOnPage = Math.round((Date.now() - startTime) / 1000);
              this.track('time_on_page', {
                        seconds: timeOnPage,
                        page: document.title,
              });
      });
    },

    /**
         * Track conversion goals
     */
    trackConversion(conversionName, conversionValue = 1) {
          this.track('conversion', {
                  conversion_name: conversionName,
                  conversion_value: conversionValue,
                  timestamp: new Date().toISOString(),
          });

      if (window.gtag) {
              window.gtag('event', 'conversion', {
                        value: conversionValue,
                        currency: 'USD',
              });
      }
    },

    /**
         * Set user properties
     */
    setUserProperties(userId, properties = {}) {
          if (window.mixpanel) {
                  window.mixpanel.identify(userId);
                  window.mixpanel.people.set(properties);
          }

      if (window.gtag) {
              window.gtag('config', this.GA_MEASUREMENT_ID, {
                        user_id: userId,
                        ...properties,
              });
      }
    },

    /**
         * Track e-commerce event
     */
    trackEcommerce(action, items = [], value = 0) {
          const eventData = {
                  items: items,
                  value: value,
                  currency: 'USD',
          };

      this.track(`ecommerce_${action}`, eventData);
    },

    /**
         * Track signup funnel
     */
    trackSignupStep(step, data = {}) {
          this.track('signup_step', {
                  step: step,
                  timestamp: new Date().toISOString(),
                  ...data,
          });
    },

    /**
         * Track error
     */
    trackError(errorName, errorData = {}) {
          this.track('error', {
                  error_name: errorName,
                  error_message: errorData.message || 'Unknown error',
                  error_stack: errorData.stack || '',
                  page: document.title,
                  timestamp: new Date().toISOString(),
          });
    },
};

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
});

// Global error tracking
window.addEventListener('error', (event) => {
    Analytics.trackError(event.type, {
          message: event.message,
          stack: event.error?.stack,
          filename: event.filename,
          lineno: event.lineno,
    });
});
