// ===== 공유 네비게이션 + 푸터 동적 주입 =====

// 현재 페이지가 index.html인지 확인
function isIndexPage() {
  const path = window.location.pathname;
  return path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('\\index.html');
}

// 섹션 링크 prefix (index.html이 아닌 페이지에서는 index.html# 형태)
function sectionHref(hash) {
  return isIndexPage() ? hash : 'index.html' + hash;
}

// 네비게이션 HTML 생성
function getNavHTML(user) {
  const authSection = user
    ? '<div class="nav-auth">' +
        '<span class="nav-user-name"><i class="fas fa-user-circle"></i> ' + user.name + '</span>' +
        '<button id="logoutBtn" class="btn-nav-logout">로그아웃</button>' +
      '</div>'
    : '<div class="nav-auth">' +
        '<a href="login.html" class="btn-nav-login">로그인</a>' +
        '<a href="signup.html" class="btn-nav-signup">회원가입</a>' +
      '</div>';

  return '<nav class="navbar">' +
    '<div class="container nav-inner">' +
      '<a href="index.html" class="nav-logo">' +
        '<img src="https://img.asiatoday.co.kr/file/2022y/08m/08d/20220808010004791_1659945540_1.jpg" alt="원성수" class="logo-photo">' +
        '<span>원성수</span>' +
      '</a>' +
      '<div class="nav-menu">' +
        '<a href="' + sectionHref('#about') + '">소개</a>' +
        '<a href="' + sectionHref('#policies') + '">공약</a>' +
        '<a href="' + sectionHref('#achievements') + '">성과</a>' +
        '<a href="' + sectionHref('#news') + '">활동</a>' +
        '<a href="' + sectionHref('#support') + '">후원·참여</a>' +
      '</div>' +
      authSection +
      '<button class="hamburger" aria-label="메뉴 열기">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
    '</div>' +
  '</nav>';
}

// 푸터 HTML 생성
function getFooterHTML() {
  return '<footer class="footer">' +
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-info">' +
          '<div class="logo-text">원성수 선거사무소</div>' +
          '<p>' +
            '<i class="fas fa-map-marker-alt" style="margin-right:6px"></i>세종특별자치시 ○○로 ○○길 00<br>' +
            '<i class="fas fa-phone" style="margin-right:6px"></i>044-000-0000<br>' +
            '<i class="fas fa-envelope" style="margin-right:6px"></i>contact@example.com' +
          '</p>' +
        '</div>' +
        '<div class="footer-links">' +
          '<h4>바로가기</h4>' +
          '<a href="' + sectionHref('#about') + '">후보자 소개</a>' +
          '<a href="' + sectionHref('#policies') + '">핵심 공약</a>' +
          '<a href="' + sectionHref('#achievements') + '">주요 성과</a>' +
          '<a href="' + sectionHref('#news') + '">활동 소식</a>' +
          '<a href="' + sectionHref('#support') + '">후원·참여</a>' +
        '</div>' +
        '<div>' +
          '<h4>SNS</h4>' +
          '<div class="footer-social">' +
            '<a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>' +
            '<a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>' +
            '<a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>' +
            '<a href="#" aria-label="Blog"><i class="fas fa-blog"></i></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p>&copy; 2026 원성수 선거사무소. All rights reserved.</p>' +
        '<p class="legal">본 사이트는 공직선거법을 준수하여 운영됩니다. | 선거운동 기간 중 관련 법령에 따라 운영됩니다.</p>' +
      '</div>' +
    '</div>' +
  '</footer>';
}

// 인증 상태 확인 후 헤더/푸터 주입
async function initHeader() {
  let user = null;

  try {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
      const { data: profile } = await _supabase
        .from('profiles')
        .select('name')
        .eq('id', session.user.id)
        .single();
      user = { id: session.user.id, name: profile ? profile.name : session.user.email };
    }
  } catch (e) {
    // Supabase 미설정 시 무시
  }

  // 네비게이션 주입
  var navPlaceholder = document.getElementById('navbar-placeholder');
  if (navPlaceholder) {
    navPlaceholder.innerHTML = getNavHTML(user);
  }

  // 푸터 주입
  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = getFooterHTML();
  }

  // 햄버거 메뉴 이벤트
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
    var navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // 스크롤 시 네비바 효과
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 로그아웃 버튼
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      await _supabase.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // 모바일 메뉴에 인증 링크 추가 (768px 이하)
  if (navMenu) {
    var authDiv = document.querySelector('.nav-auth');
    if (authDiv && window.innerWidth <= 768) {
      var mobileAuth = authDiv.cloneNode(true);
      mobileAuth.classList.add('nav-auth-mobile');
      // 모바일 로그아웃 버튼에도 이벤트 연결
      var mobileLogout = mobileAuth.querySelector('#logoutBtn');
      if (mobileLogout) {
        mobileLogout.id = 'logoutBtnMobile';
        mobileLogout.addEventListener('click', async function() {
          await _supabase.auth.signOut();
          window.location.href = 'index.html';
        });
      }
      navMenu.appendChild(mobileAuth);
    }
  }
}

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', initHeader);
