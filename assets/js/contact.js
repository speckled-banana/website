const page = window.location;
const formTitle = `<h2>Contact Speckled Banana</h2>`;
const formIntroHTML = `<p>You can send us a message using the contact form below or alternatively reach us directly on:</p>
          <p>
            +44 (0)208 0584946 or
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
  </form>
     <div
          class="contact-status-message"
          id="contact-status-message"
        ></div>`;

const placeholder = document.getElementById('contact-placeholder');
if (placeholder) {
  placeholder.innerHTML = formTitle + (page.toString().indexOf('contact-us') > 0 ? formIntroHTML : '') + formHTML;
}

const form = document.getElementById('contact-form');
const gdpr = document.getElementById('gdpr');
const submitBtn = document.getElementById('contact-submit-button');
const statusMsg = document.getElementById('contact-status-message');

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
  form.disabled = true;
  form.classList.toggle('loading', true);

  const formData = new FormData(form);

  await fetch('http://localhost:3000/contact', {
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
      form.disabled = false;
      statusMsg.innerHTML = "<p>✅ Message sent.</p><p>We'll be in touch as soon as possible.</p>";
      placeholder.classList.toggle('success', true);
      scrollMsg();
      setTimeout(() => resetForm(), 5000);
    })
    .catch((err) => {
      processErr();
    });
};

const processErr = () => {
  form.classList.toggle('loading', false);
  form.disabled = false;
  placeholder.classList.toggle('failure', true);
  if (errCount == 0) {
    statusMsg.innerHTML = "<p>❌ Sorry, that message didn't send.</p><p>Hopefully it was just a momentary blip, please retry.</p>";
    setTimeout(() => resetForm('failure'), 3000);
  } else {
    statusMsg.innerHTML = `<p>❌ Sorry, something is still broken.</p>
          <p>
            <a href="mailto:hello@speckledbanana.com?subject=Contact%20Form%20Error!&body=${encodeURIComponent('Contact form error on: ' + page + '\n\n============================================\n\n' + document.getElementById('contact-message').value)}" target="_blank" rel="noopener noreferrer">Click here to open the message in your default email application</a></p>
          <p>Alternatively give us a call on +44 (0)208 0584946</p>`;
  }
  scrollMsg();
};

const resetForm = (err) => {
  if (!err) {
    placeholder.classList.toggle('success', false);
    document.getElementById('contact-email').value = null;
    document.getElementById('contact-message').value = null;
    document.getElementById('contact-info').value = null;
    gdpr.checked = false;
  } else {
    errCount++;
    placeholder.classList.toggle('failure', false);
  }
  statusMsg.innerHTML = null;
};

const scrollMsg = () => window.scrollTo({ behaviour: 'smooth', top: findPosition(placeholder) });

const findPosition = (obj) => {
  const headerOffset = document.querySelector('header').getBoundingClientRect().bottom + 20;
  let top = 0;
  if (obj.offsetParent) {
    do {
      top += obj.offsetTop - headerOffset;
    } while ((obj = obj.offsetParent));
    return [top];
  }
};
