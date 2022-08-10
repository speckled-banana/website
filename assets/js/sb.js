const contactForm = document.getElementById('contact-form');
const gdprCheckbox = document.getElementById('gdpr');
const contactSubmitButton = document.getElementById('contact-submit-button');
const contactFormMessage = document.getElementById('contact-form-message');

let contactErrorCount = 0;
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendContactForm();
  });
}

if (gdprCheckbox) {
  if (gdprCheckbox.checked) {
    contactSubmitButton.disabled = false;
  } else {
    contactSubmitButton.disabled = true;
  }

  contactForm.addEventListener('change', (e) => {
    if (gdprCheckbox.checked) {
      contactSubmitButton.disabled = false;
    } else {
      contactSubmitButton.disabled = true;
    }
  });
}

async function sendContactForm() {
  contactForm.disabled = true;
  contactForm.classList.toggle('loading', true);

  const form = new FormData(contactForm);

  const res = await fetch('http://localhost:3000/contact', {
    method: 'POST',
    body: form,
  });

  contactForm.classList.toggle('loading', false);
  contactForm.disabled = false;

  if (res.status === 200) {
    contactFormMessage.innerHTML =
      "<p>✅ Message sent.</p><p>We'll be in touch as soon as possible.</p>";
    contactForm.classList.toggle('success', true);
    setTimeout(() => resetContactForm('success'), 5000);
  } else {
    contactForm.classList.toggle('failure', true);
    setTimeout(() => resetContactForm('failure'), 5000);
  }
}

function resetContactForm(outcome) {
  if (outcome === 'success') {
    contactForm.classList.toggle('success', false);
    document.getElementById('contact-email').value = null;
    document.getElementById('contact-message').value = null;
    document.getElementById('contact-info').value = null;
    contactFormMessage.innerHTML = null;
    gdprCheckbox.checked = false;
  } else {
    contactForm.classList.toggle('failure', false);
  }
}
