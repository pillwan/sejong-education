// ===== Active Navigation Link (index.html 전용) =====
var sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  var scrollY = window.scrollY + 100;
  sections.forEach(function(section) {
    var top = section.offsetTop - 80;
    var bottom = top + section.offsetHeight;
    var id = section.getAttribute('id');
    var link = document.querySelector('.nav-menu a[href="#' + id + '"]');
    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

if (sections.length > 0) {
  window.addEventListener('scroll', updateActiveNav);
}

// ===== Volunteer Form Handler =====
var volunteerForm = document.getElementById('volunteerForm');

if (volunteerForm) {
  volunteerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = volunteerForm.querySelector('#volName').value.trim();
    var phone = volunteerForm.querySelector('#volPhone').value.trim();

    if (!name || !phone) {
      alert('이름과 연락처는 필수 입력 항목입니다.');
      return;
    }

    alert(
      '감사합니다, ' + name + '님!\n' +
      '자원봉사 신청이 접수되었습니다.\n' +
      '담당자가 곧 연락드리겠습니다.'
    );
    volunteerForm.reset();
  });
}

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  var reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function(el) {
    var windowHeight = window.innerHeight;
    var elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 120) {
      el.classList.add('revealed');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);
