const page = window.location;
let clickOutside;
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
  //  await fetch('https://contact.speckledbanana.com/contact', {
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
      form.elements.disabled = false;
      // statusMsg.innerHTML = "<div><p>✅ Message sent.</p><p>We'll be in touch as soon as possible.</p></div>";
      alertHandler("<p>Message sent.</p><p>We'll be in touch as soon as possible.</p>", 'success', 5000);
      form.classList.toggle('success', true);
      scrollMsg();
      setTimeout(() => resetForm(), 5000);
    })
    .catch((err) => {
      processErr();
    });
};

const processErr = () => {
  form.classList.toggle('loading', false);
  form.elements.disabled = false;
  form.classList.toggle('failure', true);
  if (errCount == 0) {
    // statusMsg.innerHTML = "<p>❌ Sorry, that message didn't send.</p><p>Hopefully it was just a momentary blip, please retry.</p>";
    alertHandler("<p>Sorry, that message didn't send.</p><p>Hopefully it was just a momentary blip, please retry.</p>", 'failure', 3000);
    setTimeout(() => resetForm('failure'), 3000);
  } else {
    // statusMsg.innerHTML = `<div><p>❌ Sorry, something is still broken.</p>
    //       <p>
    //         <a href="mailto:hello@speckledbanana.com?subject=Contact%20Form%20Error!&body=${encodeURIComponent('Contact form error on: ' + page + '\n\n============================================\n\n' + document.getElementById('contact-message').value)}" target="_blank" rel="noopener noreferrer">Click here to open the message in your default email application</a></p>
    //       <p>Alternatively give us a call on +44 (0)208 0584946</p></div>`;
    alertHandler(
      `<p>Sorry, something is still broken.</p>
          <p>
            <a href="mailto:hello@speckledbanana.com?subject=Contact%20Form%20Error!&body=${encodeURIComponent('Contact form error on: ' + page + '\n\n============================================\n\n' + document.getElementById('contact-message').value)}" target="_blank" rel="noopener noreferrer">Click here to open the message in your default email application</a></p>
          <p>Alternatively give us a call on +44 (0)208 0584946</p>`,
      'failure'
    );
  }
  scrollMsg();
};

const resetForm = (err) => {
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

const alertHandler = (message, alertClass, timeout = 0) => {
  const alerts = document.getElementById('alert-container');
  if (clickOutside) document.removeEventListener(clickOutside);

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

    const close = document.createElement('span');
    close.classList.add('close-btn');

    alertBox.appendChild(alertIcon);
    alertBox.appendChild(alertMsg);

    // // Add message to alert box
    // const alertMsg = document.create(message);
    // alertBox.appendChild(alertMsg);

    // Add alert box to parent
    alerts.insertBefore(alertBox, alerts.childNodes[0]);
    const x = document.createTextNode('X');
    close.appendChild(x);
    close.onclick = () => {
      slideOut(alerts.childNodes[0]);
      resetForm('failure');
    };
    alertBox.appendChild(close);

    // Remove last alert box
    if (alerts.childNodes.length > 1) {
      slideOut(alerts.childNodes[1]);
    }

    if (timeout > 0) {
      setTimeout(function () {
        slideOut(alerts.childNodes[0]);
        // alerts.removeChild(alerts.lastChild);
      }, timeout);
    } else {
      clickOutside = document.addEventListener('click', outsideClickListener(alerts.childNodes[0]));
    }
  }
};

const outsideClickListener =
  (element) =>
  ({ target }) => {
    if (!element.contains(target)) {
      slideOut(element);
    }
  };

const slideOut = (element) => element.classList.add('slide-out');
