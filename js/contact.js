'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const fields = ['name', 'email', 'message'];

  function validate(field) {
    const input = form.elements[field];
    const value = input.value.trim();
    let error = '';
    if (!value) error = `Please enter your ${field}.`;
    else if (field === 'email' && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || input.validity.typeMismatch)) error = 'Please enter a valid email address.';
    input.setAttribute('aria-invalid', String(Boolean(error)));
    document.getElementById(`${field}-error`).textContent = error;
    return !error;
  }

  fields.forEach((field) => {
    form.elements[field].addEventListener('input', () => {
      status.textContent = '';
      if (form.elements[field].getAttribute('aria-invalid') === 'true') validate(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    const validity = fields.map(validate);
    if (validity.includes(false)) {
      form.elements[fields[validity.indexOf(false)]].focus();
      return;
    }
    status.textContent = 'Your message passed validation. This is a demo form, so nothing has been sent. Please contact Aarvan Labs through the social links below.';
  });
});
