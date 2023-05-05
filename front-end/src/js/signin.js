const SIGNIN_URL = `http://localhost:3333/login`;

// Selecionar elementos do DOM
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const sendButton = document.getElementById('btn-send');
const googleButton = document.getElementById('btn-google');

// Listener disabilita o botão
[emailInput, passwordInput].forEach(input => {
  input.addEventListener('input', () => {
    if (emailInput.value !== '' &&
      passwordInput.value !== '') {
      sendButton.disabled = false;
    } else {
      sendButton.disabled = true;
    }
  });
});

sendButton.addEventListener('click', function (event) {
  event.preventDefault();

  signin()
});

googleButton.addEventListener('click', function (event) {
  showSnackbar('Desabilitado temporariamente')
});


function signin() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const data = { email, password };

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
