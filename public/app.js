// Client-side Application Script

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Navigation & Cards
  const authCard = document.getElementById('authCard');
  const dashboardCard = document.getElementById('dashboardCard');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');
  const switchLink = document.getElementById('switchLink');
  const footerText = document.getElementById('footerText');

  // Forms
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const regSubmitBtn = document.getElementById('regSubmitBtn');
  const loginSpinner = document.getElementById('loginSpinner');
  const regSpinner = document.getElementById('regSpinner');

  // Alert
  const alertBox = document.getElementById('alertBox');
  const alertIcon = document.getElementById('alertIcon');
  const alertMessage = document.getElementById('alertMessage');
  const alertCloseBtn = document.getElementById('alertCloseBtn');

  // Dashboard Elements
  const dashUsername = document.getElementById('dashUsername');
  const userAvatarBadge = document.getElementById('userAvatarBadge');
  const dashValUsername = document.getElementById('dashValUsername');
  const dashValEmail = document.getElementById('dashValEmail');
  const dashValId = document.getElementById('dashValId');
  const dashValJoined = document.getElementById('dashValJoined');
  const logoutBtn = document.getElementById('logoutBtn');

  // Password Toggles
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');

  const TOKEN_KEY = 'authguard_jwt_token';

  // --- Alert Notifications ---
  function showAlert(message, type = 'error') {
    alertBox.className = `alert ${type}`;
    alertIcon.textContent = type === 'error' ? '⚠️' : '✅';
    alertMessage.textContent = message;
    alertBox.classList.remove('hidden');
  }

  function clearAlert() {
    alertBox.classList.add('hidden');
  }

  alertCloseBtn.addEventListener('click', clearAlert);

  // --- Password Toggle ---
  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
      } else {
        input.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
      }
    });
  });

  // --- Mode Switching (Login vs Register) ---
  function setMode(mode) {
    clearAlert();
    if (mode === 'login') {
      tabLogin.classList.add('active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabRegister.classList.remove('active');
      tabRegister.setAttribute('aria-selected', 'false');

      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');

      cardTitle.textContent = 'Welcome back';
      cardSubtitle.textContent = 'Please enter your credentials to log in.';
      footerText.innerHTML = `Don't have an account? <a href="#" id="switchLink">Sign Up</a>`;
    } else {
      tabRegister.classList.add('active');
      tabRegister.setAttribute('aria-selected', 'true');
      tabLogin.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'false');

      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');

      cardTitle.textContent = 'Create an account';
      cardSubtitle.textContent = 'Fill in your information to register.';
      footerText.innerHTML = `Already have an account? <a href="#" id="switchLink">Sign In</a>`;
    }

    // Re-bind footer switch link
    document.getElementById('switchLink').addEventListener('click', (e) => {
      e.preventDefault();
      setMode(mode === 'login' ? 'register' : 'login');
    });
  }

  tabLogin.addEventListener('click', () => setMode('login'));
  tabRegister.addEventListener('click', () => setMode('register'));
  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    setMode('register');
  });

  // --- Show Dashboard after Authentication ---
  function showDashboard(user) {
    clearAlert();
    authCard.classList.add('hidden');
    dashboardCard.classList.remove('hidden');

    dashUsername.textContent = user.username;
    userAvatarBadge.textContent = user.username.charAt(0).toUpperCase();
    dashValUsername.textContent = user.username;
    dashValEmail.textContent = user.email;
    dashValId.textContent = user.id || user._id;

    if (user.createdAt) {
      const date = new Date(user.createdAt);
      dashValJoined.textContent = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else {
      dashValJoined.textContent = 'Today';
    }
  }

  function showAuthForms() {
    dashboardCard.classList.add('hidden');
    authCard.classList.remove('hidden');
  }

  // --- Button Loading State Helper ---
  function setLoading(btn, spinner, isLoading, defaultText) {
    const textSpan = btn.querySelector('.btn-text');
    if (isLoading) {
      btn.disabled = true;
      textSpan.textContent = 'Please wait...';
      spinner.classList.remove('hidden');
    } else {
      btn.disabled = false;
      textSpan.textContent = defaultText;
      spinner.classList.add('hidden');
    }
  }

  // --- SIGN IN SUBMISSION ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!identifier || !password) {
      showAlert('Please enter both your username/email and password.', 'error');
      return;
    }

    setLoading(loginSubmitBtn, loginSpinner, true, 'Sign In');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Save token and display dashboard
      localStorage.setItem(TOKEN_KEY, data.token);
      loginForm.reset();
      showDashboard(data.user);
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(loginSubmitBtn, loginSpinner, false, 'Sign In');
    }
  });

  // --- SIGN UP SUBMISSION ---
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Client-side validations
    if (!username || !email || !password || !confirmPassword) {
      showAlert('Please fill in all registration fields.', 'error');
      return;
    }

    if (username.length < 3) {
      showAlert('Username must be at least 3 characters long.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address.', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Passwords do not match. Please verify.', 'error');
      return;
    }

    setLoading(regSubmitBtn, regSpinner, true, 'Create Account');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // Automatically sign in upon successful registration
      localStorage.setItem(TOKEN_KEY, data.token);
      registerForm.reset();
      showDashboard(data.user);
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(regSubmitBtn, regSpinner, false, 'Create Account');
    }
  });

  // --- LOGOUT ---
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    showAuthForms();
    setMode('login');
    showAlert('You have been signed out.', 'success');
  });

  // --- CHECK EXISTING AUTHENTICATION SESSION ON LOAD ---
  async function checkSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        showDashboard(data.user);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.warn('Could not verify existing session:', error);
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  // Initial check
  checkSession();
});
