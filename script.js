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

// 4. Projects gallery
const projectGrid = document.getElementById('project-grid');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

let currentProject = null;
let currentIndex = 0;

function showPhoto() {
  const total = currentProject.photos.length;
  lbImg.src = currentProject.photos[currentIndex];
  lbImg.alt = `${currentProject.title}, photo ${currentIndex + 1} of ${total}`;
  lbCaption.textContent = `${currentProject.title} · ${currentIndex + 1} / ${total}`;
  lbPrev.hidden = total < 2;
  lbNext.hidden = total < 2;
}

function step(direction) {
  const total = currentProject.photos.length;
  currentIndex = (currentIndex + direction + total) % total;
  showPhoto();
}

function openProject(project) {
  currentProject = project;
  currentIndex = 0;
  showPhoto();
  lightbox.showModal();
}

// Build one card per project
const finished = projects.filter(p => p.photos && p.photos.length > 0);

if (finished.length === 0) {
  const msg = document.createElement('p');
  msg.className = 'empty';
  msg.textContent = 'Our first completed projects will appear here soon.';
  projectGrid.append(msg);
}

finished.forEach(project => {
  const card = document.createElement('div');
  card.className = 'project';

  const photoBtn = document.createElement('button');
  photoBtn.type = 'button';
  photoBtn.className = 'project-photo';
  photoBtn.setAttribute('aria-label', `View photos of ${project.title}`);

  const img = document.createElement('img');
  img.src = project.photos[0];
  img.alt = '';
  img.loading = 'lazy';

  const count = document.createElement('span');
  count.className = 'photo-count';
  count.textContent = project.photos.length === 1 ? '1 photo' : `${project.photos.length} photos`;

  photoBtn.append(img, count);
  photoBtn.addEventListener('click', () => openProject(project));

  const body = document.createElement('div');
  body.className = 'project-body';

  const title = document.createElement('h3');
  title.textContent = project.title;

  const place = document.createElement('p');
  place.className = 'project-place';
  place.textContent = project.place || '';

  const story = document.createElement('p');
  story.textContent = project.story || '';

  body.append(title, place, story);
  card.append(photoBtn, body);
  projectGrid.append(card);
});

// Viewer controls
lbPrev.addEventListener('click', () => step(-1));
lbNext.addEventListener('click', () => step(1));
document.getElementById('lb-close').addEventListener('click', () => lightbox.close());

// Clicking the dark area outside the photo closes it
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});

// Arrow keys flip through photos (Escape closes the viewer by default)
document.addEventListener('keydown', (e) => {
  if (!lightbox.open) return;
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});