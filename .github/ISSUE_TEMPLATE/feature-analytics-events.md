---
name: Add Enhanced Analytics Events
about: Track user interactions with Google Analytics events
title: 'feat: Add enhanced analytics event tracking'
labels: enhancement, analytics
assignees: ''

---

## Feature Request: Enhanced Analytics Events

### Description
Implement custom Google Analytics event tracking to better understand how visitors interact with the website. This will provide insights into which links are clicked, how far users scroll, and how long they engage with content.

### Current State
- Basic Google Analytics 4 (GA4) pageview tracking is implemented
- No custom event tracking

### Proposed Events to Track

#### 1. **Link Click Tracking**
Track clicks on external links to understand visitor interests:

```javascript
// Track clicks to portfolio sites
document.querySelectorAll('a[href*="adamsim.ms"], a[href*="pinchards.is"]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'click', {
      'event_category': 'portfolio',
      'event_label': link.href,
      'value': 1
    });
  });
});

// Track clicks to companies
document.querySelectorAll('a[href*="trello"], a[href*="atlassian"], a[href*="lightspeed"]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'click', {
      'event_category': 'company_link',
      'event_label': link.textContent.trim(),
      'value': 1
    });
  });
});

// Track social media clicks
document.querySelectorAll('a[href*="linkedin"], a[href*="instagram"]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'click', {
      'event_category': 'social',
      'event_label': link.href.includes('linkedin') ? 'LinkedIn' : 'Instagram',
      'value': 1
    });
  });
});

// Track meeting booking
document.querySelector('a[href*="booking.akiflow"]')?.addEventListener('click', () => {
  gtag('event', 'click', {
    'event_category': 'engagement',
    'event_label': 'Meeting Booking',
    'value': 5
  });
});
```

#### 2. **Scroll Depth Tracking**
Understand how far visitors read:

```javascript
let scrollDepths = [25, 50, 75, 100];
let triggeredDepths = new Set();

window.addEventListener('scroll', debounce(() => {
  const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
  
  scrollDepths.forEach(depth => {
    if (scrollPercent >= depth && !triggeredDepths.has(depth)) {
      triggeredDepths.add(depth);
      gtag('event', 'scroll', {
        'event_category': 'engagement',
        'event_label': `${depth}%`,
        'value': depth
      });
    }
  });
}, 500));
```

#### 3. **Time on Page**
Track engagement time:

```javascript
let startTime = Date.now();
let visibilityStart = Date.now();
let totalVisibleTime = 0;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    totalVisibleTime += Date.now() - visibilityStart;
  } else {
    visibilityStart = Date.now();
  }
});

window.addEventListener('beforeunload', () => {
  const activeTime = totalVisibleTime + (document.hidden ? 0 : Date.now() - visibilityStart);
  const totalTime = Date.now() - startTime;
  
  gtag('event', 'timing_complete', {
    'event_category': 'engagement',
    'name': 'time_on_page',
    'value': Math.round(activeTime / 1000), // seconds
    'event_label': getBucket(activeTime)
  });
});

function getBucket(ms) {
  const seconds = ms / 1000;
  if (seconds < 10) return '0-10s';
  if (seconds < 30) return '10-30s';
  if (seconds < 60) return '30-60s';
  if (seconds < 180) return '1-3min';
  if (seconds < 300) return '3-5min';
  return '5min+';
}
```

#### 4. **Section Visibility Tracking**
Track which sections users view:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      gtag('event', 'view_item', {
        'event_category': 'content',
        'event_label': entry.target.className,
        'value': 1
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.intro, .about, .extra, .footer').forEach(section => {
  observer.observe(section);
});
```

#### 5. **Copy/Share Actions** (Future)
If share buttons are added:

```javascript
function trackShare(platform) {
  gtag('event', 'share', {
    'event_category': 'social',
    'event_label': platform,
    'value': 3
  });
}
```

### Implementation Plan

1. **Create analytics.js file**
   - Centralize all tracking code
   - Include helper functions
   - Add debounce utility

2. **Update index.html**
   - Add script tag for analytics.js
   - Ensure it loads after gtag.js

3. **Test events**
   - Use GA4 DebugView
   - Verify all events fire correctly
   - Check data appears in GA4 reports

4. **Document events**
   - Create ANALYTICS.md
   - Document all tracked events
   - Include how to view reports

### Benefits

- **Understand user behavior**: See what content resonates
- **Optimize content**: Focus on what visitors care about
- **Measure engagement**: Track actual time spent vs. bounces
- **Improve conversion**: Identify drop-off points
- **A/B testing foundation**: Data for future experiments

### Privacy Considerations

- [ ] Update privacy policy (if needed)
- [ ] Consider cookie consent (GDPR/CCPA)
- [ ] Allow opt-out mechanism
- [ ] Don't track PII (personally identifiable information)
- [ ] Use Google Analytics IP anonymization

### Acceptance Criteria

- [ ] All link clicks are tracked
- [ ] Scroll depth events fire at 25%, 50%, 75%, 100%
- [ ] Time on page is accurately measured
- [ ] Section visibility tracking works
- [ ] Events appear in GA4 DebugView
- [ ] No performance impact (< 5ms overhead)
- [ ] Code is well-documented
- [ ] Helper utilities (debounce) are implemented
- [ ] Analytics can be disabled via user preference

### GA4 Custom Dimensions (Optional)

Consider adding these custom dimensions:
- `user_type`: returning vs. new visitor
- `device_category`: desktop, tablet, mobile
- `referrer_category`: social, search, direct, etc.

### Testing Checklist

- [ ] Test in Chrome DevTools
- [ ] Verify in GA4 DebugView
- [ ] Check events in real-time reports
- [ ] Test with ad blockers (graceful degradation)
- [ ] Mobile testing
- [ ] Test with gtag consent mode

### Resources

- [GA4 Events Documentation](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [Event Naming Best Practices](https://developers.google.com/analytics/devguides/collection/ga4/event-naming)

### Priority
**Low-Medium** - Useful for insights but not critical for site function

### Estimated Effort
**3-5 hours** including testing and documentation
