---
name: Add Contact Form
about: Implement a contact form for visitor inquiries
title: 'feat: Add contact form to website'
labels: enhancement, feature
assignees: ''
---

## Feature Request: Contact Form

### Description

Add a contact form to allow visitors to reach out directly through the website, rather than relying solely on external booking or social media links.

### Proposed Implementation

#### Option 1: Netlify Forms (Recommended)

**Pros:**

- No backend needed
- Built-in spam protection
- Free on Netlify
- Easy to implement

**Implementation:**

```html
<form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <p class="hidden">
    <label>Don't fill this out: <input name="bot-field" /></label>
  </p>
  <p>
    <label>Name: <input type="text" name="name" required /></label>
  </p>
  <p>
    <label>Email: <input type="email" name="email" required /></label>
  </p>
  <p>
    <label>Message: <textarea name="message" required></textarea></label>
  </p>
  <p>
    <button type="submit">Send Message</button>
  </p>
</form>
```

#### Option 2: Formspree

**Pros:**

- Simple integration
- Email notifications
- reCAPTCHA support
- Free tier available

#### Option 3: Custom Backend

**Pros:**

- Full control
- Can integrate with CRM
- Custom validation

**Cons:**

- Requires backend service
- More maintenance

### Requirements

1. **Form Fields**
   - Name (required)
   - Email (required)
   - Subject (optional)
   - Message (required)

2. **Features**
   - Client-side validation
   - Spam protection (honeypot or reCAPTCHA)
   - Success/error messages
   - Loading state during submission
   - Email notification to you
   - Auto-reply to sender (optional)

3. **Accessibility**
   - Proper labels with `for` attributes
   - ARIA error messages
   - Keyboard accessible
   - Screen reader friendly

4. **Design**
   - Match existing site aesthetic
   - Responsive layout
   - Clear error states
   - Success confirmation

### User Stories

- As a visitor, I want to contact Adam directly through the website
- As a visitor, I want confirmation that my message was sent
- As a visitor, I want clear error messages if something goes wrong
- As the site owner, I want to receive email notifications of new messages
- As the site owner, I want spam protection without forcing CAPTCHA on users

### Acceptance Criteria

- [ ] Form validates input before submission
- [ ] Form includes spam protection
- [ ] Success message displays after submission
- [ ] Error messages are clear and helpful
- [ ] Form is mobile-responsive
- [ ] Email notifications work correctly
- [ ] Form is accessible (passes WAVE audit)
- [ ] Loading state prevents double-submission

### Design Considerations

- Should the form be on the main page or a separate contact page?
- Should we keep the "Meet with me" booking link alongside the form?
- What tone should the success message have?

### Technical Notes

- Consider rate limiting to prevent abuse
- Store form submissions (optional) for backup
- Add Google Analytics event tracking for form submissions
- Consider adding file upload for portfolio inquiries (future enhancement)

### Resources

- [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
- [Formspree Documentation](https://help.formspree.io/)
- [Web Accessibility Initiative - Forms](https://www.w3.org/WAI/tutorials/forms/)

### Priority

**Medium** - Nice to have but not critical since external booking link exists

### Estimated Effort

**2-4 hours** depending on chosen implementation
