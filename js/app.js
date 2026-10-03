import { projects } from '../data/projects.js';
import { profile, contactItems } from '../data/config.js';

const projectGrid = document.querySelector('#project-grid');
projectGrid.innerHTML = projects.map((project, index) => `
  <article class="project-card reveal" data-project>
    <a class="project-visual project-${escapeHTML(project.visual)}" data-cursor="ABRIR" href="${safeUrl(project.liveUrl)}" target="_blank" rel="noreferrer" aria-label="Abrir ${escapeHTML(project.name)} em uma nova aba"><div class="project-cover"><img class="project-thumbnail" src="${escapeHTML(project.image)}" alt="Thumbnail de ${escapeHTML(project.name)}" loading="lazy"><span class="art-index">${escapeHTML(project.category)}</span><span class="art-corner">ABRIR PROJETO ↗</span></div></a>
    <div class="project-meta"><div><span class="project-number">PROJETO ${String(index + 1).padStart(2, '0')} ${project.featured ? '· EM DESTAQUE' : ''}</span><h3 class="project-name">${escapeHTML(project.name)}</h3><p class="project-description">${escapeHTML(project.description)}</p></div><span class="mono">↗</span></div>
    <div class="project-tech">${project.technologies.map(tech => `<span>${escapeHTML(tech)}</span>`).join('')}${project.note ? `<span class="project-note">${escapeHTML(project.note)}</span>` : ''}</div>
    <div class="project-links"><a href="${safeUrl(project.liveUrl)}" target="_blank" rel="noreferrer">Visualizar projeto <span>↗</span></a>${project.githubUrl ? `<a href="${safeUrl(project.githubUrl)}" target="_blank" rel="noreferrer">Código <span>↗</span></a>` : ''}</div>
  </article>`).join('');

const technologies = [
  ['JavaScript', 'Interatividade e lógica para experiências web.'], ['Java', 'Programação orientada a objetos e aplicações.'], ['Python', 'Automação, lógica e soluções versáteis.'], ['HTML', 'Estrutura semântica para a web.'], ['CSS', 'Estilo, layout e interfaces responsivas.'], ['Git / GitHub', 'Versionamento e colaboração em código.'], ['SQL', 'Consulta e organização de dados.']
];
document.querySelector('#stack-list').innerHTML = technologies.map(([name, desc], i) => `<div class="stack-item"><span class="stack-index">0${i + 1}</span><div><span class="stack-name">${name}</span><span class="stack-description">${desc}</span></div><span class="stack-arrow">↗</span></div>`).join('');

const contactLinks = document.querySelector('#contact-links');
contactLinks.innerHTML = contactItems.map(item => {
  const value = profile[item.key];
  const href = item.key === 'email' && value ? `mailto:${value}` : value;
  return `<a class="contact-link" ${href ? `href="${safeUrl(href)}" target="_blank" rel="noreferrer"` : 'href="#" aria-disabled="true"'}><span>${item.label}</span><strong>${value ? escapeHTML(item.name) : item.name + ' ↗'}</strong></a>`;
}).join('');
const cta = document.querySelector('#contact-cta');
if (profile.whatsapp) { cta.href = safeUrl(profile.whatsapp); cta.target = '_blank'; cta.rel = 'noreferrer'; }
else if (profile.email) { cta.href = `mailto:${profile.email}`; }
document.querySelector('#year').textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
const menu = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('open', open);
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menu'); }
});

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('[data-section]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.scroll-progress span').style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
    scrollQueued = false;
  });
}, { passive: true });

if (!touch && !reduceMotion) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  document.addEventListener('mousemove', event => { x = event.clientX; y = event.clientY; dot.style.opacity = ring.style.opacity = '1'; dot.style.transform = `translate(${x}px,${y}px)`; });
  const follow = () => { rx += (x - rx) * .16; ry += (y - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(follow); };
  follow();
  document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('hover'); ring.querySelector('span').textContent = el.dataset.cursor || ''; });
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  document.querySelectorAll('.project-visual').forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', event => { const rect = el.getBoundingClientRect(); el.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px,${(event.clientY - rect.top - rect.height / 2) * .12}px)`; });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function safeUrl(value) { return /^https?:\/\//i.test(value) || /^mailto:/i.test(value) ? escapeHTML(value) : '#'; }
