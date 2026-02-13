// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop - 80;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Volunteer Form Handler =====
const volunteerForm = document.getElementById('volunteerForm');

if (volunteerForm) {
  volunteerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = volunteerForm.querySelector('#volName').value.trim();
    const phone = volunteerForm.querySelector('#volPhone').value.trim();

    if (!name || !phone) {
      alert('이름과 연락처는 필수 입력 항목입니다.');
      return;
    }

    alert(
      `감사합니다, ${name}님!\n` +
      '자원봉사 신청이 접수되었습니다.\n' +
      '담당자가 곧 연락드리겠습니다.'
    );

    volunteerForm.reset();
  });
}

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('revealed');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);
