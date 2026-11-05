// 1. Footer year updates itself
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('main-nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? 'Close' : 'Menu';
}

menuBtn.addEventListener('click', () => {
  setMenu(!nav.classList.contains('open'));
});

// Close the menu after tapping a link, or pressing Escape
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

// 3. Contact form
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // stop the page reloading
  status.className = '';
  status.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Request failed');

    form.reset();
    status.textContent = 'Thank you! We will be in touch soon.';
  } catch (error) {
    status.className = 'error';
    status.textContent = 'Sorry, that did not send. Please email hello@yourdomain.co.uk instead.';
  } finally {
    submitBtn.disabled = false;
  }
});