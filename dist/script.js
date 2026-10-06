const menuButton = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const navLinks = [...document.querySelectorAll('.nav-links a')];

function setMenu(open) {
  menuButton?.setAttribute('aria-expanded', String(open));
  navPanel?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .12 });
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

const sections = [...document.querySelectorAll('main section[id], header[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -60%', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const testimonialTrack = document.querySelector('[data-testimonial-track]');
const testimonials = testimonialTrack ? [...testimonialTrack.children] : [];
let reviewIndex = 0;

function visibleReviewCount() {
  return window.innerWidth > 900 ? 2 : 1;
}

function moveReviews(direction = 1) {
  const maxIndex = Math.max(0, testimonials.length - visibleReviewCount());
  reviewIndex += direction;
  if (reviewIndex > maxIndex) reviewIndex = 0;
  if (reviewIndex < 0) reviewIndex = maxIndex;
  if (!testimonials[reviewIndex]) return;
  const offset = testimonials[reviewIndex].offsetLeft - testimonialTrack.offsetLeft;
  testimonialTrack.style.transform = `translateX(-${offset}px)`;
}

document.querySelector('[data-review-next]')?.addEventListener('click', () => moveReviews(1));
document.querySelector('[data-next-review]')?.addEventListener('click', () => moveReviews(1));
document.querySelector('[data-review-prev]')?.addEventListener('click', () => moveReviews(-1));
window.addEventListener('resize', () => { reviewIndex = 0; moveReviews(0); });

const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('.form-status');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  formStatus.textContent = `${name || '고객'}님, 메시지가 준비되었어요! 데모 페이지에서는 실제로 전송되지 않습니다.`;
  form.reset();
});

const modal = document.querySelector('[data-video-modal]');
const openModal = () => {
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
};
const closeModal = () => {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  document.querySelector('[data-video-trigger]')?.focus();
};
document.querySelector('[data-video-trigger]')?.addEventListener('click', openModal);
document.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

document.querySelector('[data-year]').textContent = new Date().getFullYear();
