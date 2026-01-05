/**
 * ZipShift - Form Validation Module
 * Handles client-side form validation with real-time feedback
 */

const FormValidator = {
    form: null,
    fields: {},
    errors: {},

    /**
         * Initialize form validation
     */
    init() {
          this.form = document.querySelector('form[name="zipshift-beta"]');
          if (!this.form) return;

      // Get all form fields
      this.form.querySelectorAll('input, select').forEach((field) => {
              this.fields[field.name] = field;
              field.addEventListener('blur', () => this.validateField(field));
              field.addEventListener('change', () => this.validateField(field));
              field.addEventListener('input', () => this.validateField(field));
      });

      // Form submission
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    /**
         * Validate individual field
     */
    validateField(field) {
          const rules = this.getFieldRules(field.name);
          const value = field.value.trim();
          let isValid = true;

      // Clear previous error
      this.removeError(field);

      // Run validation rules
      for (const rule of rules) {
              if (!rule.validator(value)) {
                        this.showError(field, rule.message);
                        isValid = false;
                        break;
              }
      }

      return isValid;
    },

    /**
         * Get validation rules for a field
     */
    getFieldRules(fieldName) {
          const rules = {
                  name: [
                    {
                                validator: (value) => value.length >= 2,
                                message: 'Name must be at least 2 characters',
                    },
                    {
                                validator: (value) => /^[a-zA-Z\s'-]+$/.test(value),
                                message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
                    },
                          ],
                  email: [
                    {
                                validator: (value) => value.length > 0,
                                message: 'Email is required',
                    },
                    {
                                validator: (value) =>
                                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                                message: 'Please enter a valid email address',
                    },
                          ],
                  phone: [
                    {
                                validator: (value) => value.length >= 10,
                                message: 'Phone must be at least 10 digits',
                    },
                    {
                                validator: (value) => /^[\d\s()+-]+$/.test(value),
                                message: 'Please enter a valid phone number',
                    },
                          ],
                  company: [
                    {
                                validator: (value) => value.length >= 2,
                                message: 'Company name must be at least 2 characters',
                    },
                          ],
                  type: [
                    {
                                validator: (value) => value.length > 0,
                                message: 'Please select an event type',
                    },
                          ],
                  hiring: [
                    {
                                validator: (value) => value.length > 0,
                                message: 'Please select your typical hiring volume',
                    },
                          ],
          };

      return rules[fieldName] || [];
    },

    /**
         * Show error message
     */
    showError(field, message) {
          field.classList.add('error');
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message show';
          errorDiv.textContent = message;
          field.parentElement.appendChild(errorDiv);
    },

    /**
         * Remove error message
     */
    removeError(field) {
          field.classList.remove('error');
          const errorDiv = field.parentElement.querySelector('.error-message');
          if (errorDiv) {
                  errorDiv.remove();
          }
    },

    /**
         * Validate entire form
     */
    validateForm() {
          let isValid = true;
          for (const field of Object.values(this.fields)) {
                  if (!this.validateField(field)) {
                            isValid = false;
                  }
          }
          return isValid;
    },

    /**
         * Handle form submission
     */
    handleSubmit(e) {
          e.preventDefault();

      if (!this.validateForm()) {
              console.log('Form validation failed');
              return;
      }

      // Track form submission
      trackEvent('form_submitted', {
              form_name: 'zipshift_beta_signup',
              event_type: this.fields.type.value,
              hiring_volume: this.fields.hiring.value,
      });

      // Submit form (Netlify will handle it)
      this.form.submit();
    },
};

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FormValidator.init();
});
