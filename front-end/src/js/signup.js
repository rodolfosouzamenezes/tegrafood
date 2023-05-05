const SIGNIN_URL = `http://localhost:3333/signup`;

// Selecionar elementos do DOM
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

const sendButton = document.getElementById('btn-send');

// Listener disabilita o botão
[nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
  input.addEventListener('input', () => {
    if (nameInput.value !== '' &&
      emailInput.value !== '' &&
      passwordInput.value !== '' &&
      confirmPasswordInput.value !== ''
    ) {
      sendButton.disabled = false;
    } else {
      sendButton.disabled = true;
    }
  });
});

sendButton.addEventListener('click', function (event) {
  event.preventDefault();

  signup()
});


function signup() {
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 3) {
    return showSnackbar('A nome deve ter no mínimo 3 caracteres')
  }

  if (!emailValidation.test(email)) {
    return showSnackbar('Insira um email válido')
  }

  if (password.length < 6) {
    return showSnackbar('A senha deve ter no mínimo 6 caracteres')
  }

  if (confirmPassword !== password) {
    return showSnackbar('Senhas não conferem')
  }

  const data = { name, email, password };

  fetch(SIGNIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      const { token, isAdmin } = data;

      // Salvando o token localmente
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', isAdmin);

      if (isAdmin) {
        window.location.replace('https://tegrafood.vercel.app/products-adm.html');
      } else {
        window.location.replace('https://tegrafood.vercel.app/');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showSnackbar('Email ou senha inválidos');
    })
    .finally(() => {
      emailInput.value = '';
      passwordInput.value = '';
    });
}
