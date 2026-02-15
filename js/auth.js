/**
 * Authentication Handler
 * Manages signup and login for the political campaign website
 * Uses Supabase as the backend auth provider
 */

document.addEventListener('DOMContentLoaded', async function() {
  // Check if user is already logged in
  const { data: { user } } = await _supabase.auth.getUser();
  if (user && (isSignupPage() || isLoginPage())) {
    window.location.href = 'index.html';
    return;
  }

  // Initialize form handlers based on page
  if (isSignupPage()) {
    initSignupForm();
  } else if (isLoginPage()) {
    initLoginForm();
  }
});

/**
 * Check if current page is signup
 */
function isSignupPage() {
  return document.getElementById('signup-form') !== null;
}

/**
 * Check if current page is login
 */
function isLoginPage() {
  return document.getElementById('login-form') !== null;
}

/**
 * Initialize signup form handler
 */
function initSignupForm() {
  const form = document.getElementById('signup-form');
  const messageEl = document.getElementById('form-message');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const passwordConfirm = document.getElementById('passwordConfirm').value.trim();

    // Reset message
    messageEl.textContent = '';
    messageEl.classList.remove('show', 'error', 'success');

    // Validate inputs
    const validationError = validateSignup(name, phone, email, password, passwordConfirm);
    if (validationError) {
      showMessage(messageEl, validationError, 'error');
      return;
    }

    // Disable button during submission
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';

    try {
      // Sign up with Supabase
      const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            phone: phone
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        let errorMessage = '회원가입에 실패했습니다: ' + error.message;

        // Handle specific error messages
        if (error.message.includes('already registered')) {
          errorMessage = '이미 등록된 이메일입니다.';
        } else if (error.message.includes('invalid')) {
          errorMessage = '입력하신 정보가 올바르지 않습니다.';
        }

        showMessage(messageEl, errorMessage, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
      }

      // Success message
      showMessage(messageEl, '회원가입이 완료되었습니다!', 'success');

      // Redirect to login after 1.5 seconds
      setTimeout(function() {
        window.location.href = 'login.html';
      }, 1500);

    } catch (err) {
      showMessage(messageEl, '오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/**
 * Initialize login form handler
 */
function initLoginForm() {
  const form = document.getElementById('login-form');
  const messageEl = document.getElementById('form-message');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Reset message
    messageEl.textContent = '';
    messageEl.classList.remove('show', 'error', 'success');

    // Validate inputs
    if (!email || !password) {
      showMessage(messageEl, '이메일과 비밀번호를 모두 입력해주세요.', 'error');
      return;
    }

    // Disable button during submission
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';

    try {
      // Sign in with Supabase
      const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('Supabase login error:', error);
        showMessage(messageEl, '로그인 실패: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
      }

      // Success - redirect to home page
      window.location.href = 'index.html';

    } catch (err) {
      showMessage(messageEl, '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/**
 * Validate signup form
 * @param {string} name - User name
 * @param {string} phone - User phone number
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} passwordConfirm - Password confirmation
 * @returns {string|null} - Error message or null if valid
 */
function validateSignup(name, phone, email, password, passwordConfirm) {
  // Check all fields are filled
  if (!name || !phone || !email || !password || !passwordConfirm) {
    return '모든 필드를 입력해주세요.';
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식이 아닙니다.';
  }

  // Validate phone format (Korean: starts with 01, digits and dashes)
  const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return '올바른 전화번호 형식이 아닙니다. (예: 010-0000-0000)';
  }

  // Validate password length
  if (password.length < 6) {
    return '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  // Validate password match
  if (password !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }

  return null;
}

/**
 * Show message in message element
 * @param {HTMLElement} element - The message element
 * @param {string} message - The message text
 * @param {string} type - 'error' or 'success'
 */
function showMessage(element, message, type) {
  element.textContent = message;
  element.classList.add('show', type);
}
