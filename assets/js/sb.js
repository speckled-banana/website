const contactForm = document.getElementById('contact-form');
let contactErrorCount = 0;
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendContactForm();
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
    contactForm.classList.toggle('success', true);
    setTimeout(() => resetContactForm('success'), 2000);
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
    document.getElementById('gdpr').value = false;
  } else {
    contactForm.classList.toggle('failure', false);
  }
}
