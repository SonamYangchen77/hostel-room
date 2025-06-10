document.addEventListener('DOMContentLoaded', () => {
  const showLogin = document.getElementById('showLogin');
  const showSignup = document.getElementById('showSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  // Toggle between Login and Signup forms
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    showLogin.classList.add('active');
    showSignup.classList.remove('active');
  });

  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    showSignup.classList.add('active');
    showLogin.classList.remove('active');
  });

  // Password toggle buttons (for both login and signup)
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');

  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.querySelector('i').classList.remove('fa-eye');
        btn.querySelector('i').classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        btn.querySelector('i').classList.remove('fa-eye-slash');
        btn.querySelector('i').classList.add('fa-eye');
      }
    });
  });

  // Login form submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    if (!email || !password) {
      alert('Please enter both email and password.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
      return;
    }

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.redirect || '/home';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });

  // Signup form submit
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing up...';

    const name = signupForm.name.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();

    if (!name || !email || !password) {
      alert('Please fill in all fields.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
      return;
    }

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.success || 'Signup successful! Please log in.');
        // Switch to login form
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        showLogin.classList.add('active');
        showSignup.classList.remove('active');
        signupForm.reset();
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    }
  });
});
