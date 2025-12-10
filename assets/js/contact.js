const page = window.location;
// const contactServer = 'http://localhost:3000/contact';
const contactServer = 'https://contact.speckledbanana.com/contact';
let currentAlert;
const formTitle = `<h2>Contact Speckled Banana</h2>`;
const formIntroHTML = `<p>You can send us a message using the contact form below or reach us directly at:</p>
          <p>
            <a href="mailto:hello@speckledbanana.com">hello@speckledbanana.com</a>.
          </p>

          <hr />`;

const formHTML = `<form onsubmit="sendMsg()"
    class="contact column"
    id="contact-form"
  >
    <label for="contact-email">Your email</label>
    <input
      type="email"
      name="email"
      id="contact-email"
      required
    />
    <label class="form-error" id="contact-email-error" for="contact-email">❗ Please enter a valid email address</label>
    <label for="contact-message">Message</label>
    <textarea
      name="message"
      id="contact-message"
      required
    ></textarea>
    <label class="form-error" id="contact-message-error" for="contact-message">❗ Please enter a message</label>
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
        I'm happy for my data to be used to respond to my query.<p>We won't store or use your email address for any other purpose.  More details can be found in our <a href="./privacy-policy.html">privacy policy</a>.</p>
      </label>
    </div>

    <button
      type="submit"
      id="contact-submit-button"
      disabled
    >
      Send Message
    </button>
    <div id="form-sending"><div class="sending">Sending<span></span></div></div>
  </form>
     `;

const placeholder = document.getElementById('contact-placeholder');
if (placeholder) {
  placeholder.innerHTML = formTitle + (page.toString().indexOf('contact-us') > 0 ? formIntroHTML : '') + formHTML;
}

const form = document.getElementById('contact-form');
const gdpr = document.getElementById('gdpr');
const submitBtn = document.getElementById('contact-submit-button');

let errCount = 0;
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMsg;
  });
}

if (gdpr) {
  if (gdpr.checked) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }

  form.addEventListener('change', (e) => {
    if (gdpr.checked) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  });
}

const sendMsg = async () => {
  form.elements.disabled = true;
  form.classList.toggle('loading', true);

  const formData = new FormData(form);
  await fetch(contactServer, {
    method: 'POST',
    body: formData,
  })
    .then((res) => {
      if (res.status != 200) {
        throw new Error('Message send failure');
      }
      return res;
    })
    .then((res) => {
      form.classList.toggle('loading', false);
      form.elements.disabled = false;
      form.classList.toggle('success', true);
      alertHandler("<p>Message sent.</p><p>We'll be in touch as soon as possible.</p>", 'success', 3000);
    })
    .catch((err) => {
      processErr();
    });
};

const alertHandler = (message, alertClass, timeout = 0) => {
  const alerts = document.getElementById('alert-container');

  if (alerts.childElementCount < 2) {
    // Create alert box
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'slide-in', alertClass);

    const alertIcon = document.createElement('div');
    alertIcon.classList.add('alert-icon');

    const icon = document.createTextNode(alertClass === 'success' ? '✅' : '❌');
    alertIcon.appendChild(icon);

    const alertMsg = document.createElement('div');
    alertMsg.classList.add('alert-msg');
    alertMsg.innerHTML += message;

    // Append elements to alert
    alertBox.appendChild(alertIcon);
    alertBox.appendChild(alertMsg);

    // If no timeout add a close button
    if (timeout === 0) {
      const close = document.createElement('span');
      close.textContent = 'X';
      close.classList.add('close-btn');
      close.onclick = () => {
        slideOut(currentAlert);
      };

      alertBox.appendChild(close);
    }

    // Add alert box to parent
    alerts.insertBefore(alertBox, alerts.childNodes[0]);
    currentAlert = alerts.childNodes[0];

    // Remove last alert box
    if (alerts.childNodes.length > 1) {
      alerts.removeChild(alerts.lastChild);
    }

    if (timeout > 0) {
      setTimeout(function () {
        slideOut(currentAlert);
        //
      }, timeout);
    }
  }
};

const slideOut = (element) => {
  element.classList.add('slide-out');
  resetForm(element.classList.contains('failure') ? 'failure' : '');
};

const processErr = () => {
  form.classList.toggle('loading', false);
  form.elements.disabled = false;
  form.classList.toggle('failure', true);
  if (errCount == 0) {
    alertHandler("<p>Sorry, that message didn't send.</p><p>Hopefully it was just a momentary blip, please retry.</p>", 'failure', 3000);
  } else {
    alertHandler(
      `<p>Sorry, something is still broken.</p>
          <p>
            <a href="mailto:hello@speckledbanana.com?subject=Contact%20Form%20Error!&body=${encodeURIComponent('Contact form error on: ' + page + '\n\n============================================\n\n' + document.getElementById('contact-message').value)}" target="_blank" rel="noopener noreferrer">Click here to open the message in your default email application</a></p>`,
      'failure'
    );
  }
};

const resetForm = (err) => {
  console.log(errCount);
  if (!err) {
    form.classList.toggle('success', false);
  } else {
    form.classList.toggle('failure', false);

    if (errCount === 0) {
      errCount++;
      return;
    }
    errCount = 0;
  }

  document.getElementById('contact-email').value = null;
  document.getElementById('contact-message').value = null;
  document.getElementById('contact-info').value = null;
  gdpr.checked = false;
};
