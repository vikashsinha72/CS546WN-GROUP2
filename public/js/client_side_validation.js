function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  //validate password
  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
  
  //validate inputs for register form
  function validateRegisterForm() {
    const firstName = document.getElementById('firstNameInput').value.trim();
    const lastName = document.getElementById('lastNameInput').value.trim();
    const email = document.getElementById('emailAddressInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const confirmPassword = document.getElementById('confirmPasswordInput').value.trim();
    const role = document.getElementById('roleInput').value.trim().toLowerCase();
  
    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      alert('All fields must be entered.');
      return false;
    }
  
    //check first name format
    if (!/^[a-zA-Z]{2,25}$/.test(firstName)) {
      alert('First name must be 2-25 characters long and contain only letters.');
      return false;
    }
  
    //check last name format
    if (!/^[a-zA-Z]{2,25}$/.test(lastName)) {
      alert('Last name must be 2-25 characters long and contain only letters.');
      return false;
    }
  
    //check email format
    if (!isValidEmail(email)) {
      alert('Invalid email address format.');
      return false;
    }
  
    //check password format
    if (!isValidPassword(password)) {
      alert('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return false;
    }
  
    //check if password and confirm password match
    if (password !== confirmPassword) {
      alert('Password and confirm password do not match.');
      return false;
    }
  
    //check if role is either "admin" or "user"
    if (role !== 'admin' && role !== 'user') {
      alert('Role must be either admin or user.');
      return false;
    }

    return true;
  }
  

  //validate form inputs for login form
  function validateLoginForm() {
    const email = document.getElementById('emailAddressInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
  
    if (!email || !password) {
      alert('Email and password must both be entered.');
      return false;
    }
  
    //check email format
    if (!isValidEmail(email)) {
      alert('Invalid email address format.');
      return false;
    }
  
    //check password format
    if (!isValidPassword(password)) {
      alert('Invalid password format.');
      return false;
    }
  
    return true;
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
      registrationForm.addEventListener('submit', function(event) {
        if (!validateRegisterForm()) event.preventDefault();
      })
    }
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(event) {
        if (!validateLoginForm()) event.preventDefault;
      })
    }
  })