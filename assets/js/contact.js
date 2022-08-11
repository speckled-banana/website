const page = window.location;
const contactFormTitle = `<h2>Contact Speckled Banana</h2>`;
const contactFormIntroHTML = `<p>You can send us a message using the contact form below or alternatively reach us directly on:</p>
          <p>
            +44 (0)208 0584946 or
            <a href="mailto:hello@speckledbanana.com">hello@speckledbanana.com</a>.
          </p>

          <hr />`;

const contactFormHTML = `<form onsubmit="sendContactForm()"
    class="contact column"
    id="contact-form"
  >
    <label for="email">Your email</label>
    <input
      type="email"
      name="email"
      id="contact-email"
      required
    />
    <label for="message">Message</label>
    <textarea
      name="message"
      id="contact-message"
      required
    ></textarea>
    <label
      for="info"
      class="contact-info"
    >
      Info
    </label>
    <input
      type="text"
      name="info"
      id="contact-info"
      class="contact-info"
    />
    <input
      type="text"
      name="source"
      id="contact-source"
      class="contact-info"
      value="${page}"
    />
    <div class="row consent">
      <input
        type="checkbox"
        name="gdpr"
        id="gdpr"
      />
      <label for="gdpr">
        The data submitted on this contact form will only ever be used to respond to your query. More details can be found in our <a href="./privacy-policy.html">privacy policy</a>. Are you ok with this?
      </label>
    </div>

    <button
      type="submit"
      id="contact-submit-button"
      disabled
    >
      Send Message
    </button>
  </form>
     <div
          class="contact-form-message"
          id="contact-form-message"
        ></div>`;

const contactPlaceholder = document.getElementById('contact-placeholder');
if (contactPlaceholder) {
  contactPlaceholder.innerHTML = contactFormTitle + (page.toString().indexOf('contact-us') > 0 ? contactFormIntroHTML : '') + contactFormHTML;
}

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

  await fetch('http://localhost:3000/contact', {
    method: 'POST',
    body: form,
  })
    .then((res) => {
      if (res.status != 200) {
        throw new Error('Message send failure');
      }
      return res;
    })
    .then((res) => {
      contactForm.classList.toggle('loading', false);
      contactForm.disabled = false;
      contactFormMessage.innerHTML = "<p>✅ Message sent.</p><p>We'll be in touch as soon as possible.</p>";
      contactPlaceholder.classList.toggle('success', true);
      setTimeout(() => resetContactForm('success'), 5000);
    })
    .catch((err) => {
      console.log(err);
      processError();
    });
}

function processError() {
  contactForm.classList.toggle('loading', false);
  contactForm.disabled = false;
  contactPlaceholder.classList.toggle('failure', true);
  if (contactErrorCount == 0) {
    contactFormMessage.innerHTML = "<p>❌ Sorry, that message didn't send.</p><p>Hopefully it was just a momentary blip, please retry.</p>";
    setTimeout(() => resetContactForm('failure'), 3000);
  } else {
    contactFormMessage.innerHTML = `<p>❌ Sorry, something is still broken.</p>
          <p>
            <a href="mailto:hello@speckledbanana.com?subject=Contact%20Form%20Error!&body=${encodeURIComponent('Contact form error on: ' + page + '\n\n============================================\n\n' + document.getElementById('contact-message').value)}" target="_blank" rel="noopener noreferrer">Click here to open the message in your default email application</a></p>
          <p>Alternatively give us a call on +44 (0)208 0584946</p>`;
  }
}

function resetContactForm(outcome) {
  if (outcome === 'success') {
    contactPlaceholder.classList.toggle('success', false);
    document.getElementById('contact-email').value = null;
    document.getElementById('contact-message').value = null;
    document.getElementById('contact-info').value = null;

    gdprCheckbox.checked = false;
  } else {
    contactErrorCount++;
    contactPlaceholder.classList.toggle('failure', false);
  }
  contactFormMessage.innerHTML = null;
}
