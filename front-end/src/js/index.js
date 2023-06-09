const token = localStorage.getItem('token');

window.onload = () => {
  if (!token) {
    window.location.replace('https://tegrafood.vercel.app/signin.html');
  }
}

const urlCategorySelected = new URLSearchParams(window.location.search).get("category");
const categorySelected = parseInt(urlCategorySelected);
const url = `https://tegrafood-api.onrender.com/products`;

const CATEGORIES = {
  0: "Pizza",
  1: "Sobremesa",
  2: "Lanche",
  3: "Açai",
  4: "Bebidas",
};

const isCategoryValid = categorySelected in CATEGORIES;

const spanCategorySelected = document.getElementById("category-selected");
spanCategorySelected.textContent = CATEGORIES[categorySelected] || "Todos";

const navItems = document.querySelectorAll('.nav__item');
const navItemSelected = navItems[categorySelected + 1] ? navItems[categorySelected + 1] : navItems[0];
navItemSelected.classList.add("nav__item-active")

loadProducts();

function loadProducts() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.statusCode === 401) {
        window.location.replace('https://tegrafood.vercel.app/signin.html')
      }

      const products = data.products.filter((item) => {
        return !isCategoryValid || item.categories.includes(categorySelected);
      }).map((item) => productHTML(item));
      document.querySelector('.products__container').innerHTML = products.join('')
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
}

function productHTML(item) {
  const price = item.priceInCents / 100;
  const priceFormatted = `R$${price.toFixed(2).replace('.', ',')}`

  return `
    <div class="product" id="${item.id}">
      <div class="product__infos">
        <img src="${item.imageUrl}" alt="${item.title}">
        <div class="product__description">
          <h2 class="title">${item.title}</h2>
          <p class="description">${item.description || ""} </p>
        </div>
      </div>

      <div class="product__cta">
        <p>${priceFormatted}</p>
        <button class="btn btn__primary btn__cart" onclick="addToCart(${item.id})">Comprar</button>
      </div>
    </div>
  `;
}

function addToCart(id) {
  const goToCart = () => {
    window.location.href = './cart.html';
  }

  fetch(`${url}/${id.id}/cart`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(() => {
      showSnackbar('Ítem adicionado ao carrinho', 'ir para o carrinho', goToCart)
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
  
}

function sortProducts(direction) {
  const container = document.querySelector('.products__container');
  const icon = document.querySelector('#sort-alphabetical i');
  const products = Array.from(container.children);
  const buttons = document.querySelectorAll('#sort-alphabetical .filter__dropdown button');

  // Mudando o ícone do botão dependendo da direção da ordenação
  // Desabilitando o botão selecionado
  icon.classList.remove('fa-sort-alpha-down', 'fa-sort-alpha-up');
  icon.classList.add(direction === 'asc' ? 'fa-sort-alpha-down' : 'fa-sort-alpha-up');
  icon.style.color = 'var(--secondary-color)';
  showSnackbar(direction === 'asc' ? 'Ítens organizados de A à Z' : 'Ítens organizados de Z à A')

  buttons.forEach((button, index) => {
    button.disabled = index !== (direction === 'asc' ? 1 : 0);
  });

  products.sort((a, b) => {
    const aTitle = a.querySelector('.title').textContent.toLowerCase();
    const bTitle = b.querySelector('.title').textContent.toLowerCase();
    return direction === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
  });

  container.textContent = '';
  products.forEach((product) => {
    container.appendChild(product);
  });
}

function filterByPrice(minPrice, maxPrice) {
  const container = document.querySelector('.products__container');
  const products = Array.from(container.children);
  const buttons = document.querySelectorAll('#filter-price .filter__dropdown button');

  const icon = document.querySelector('#filter-price i');
  icon.style.color = 'var(--secondary-color)';


  // desabilitando o botão selecionado
  buttons[0].disabled = minPrice === 5;
  buttons[1].disabled = minPrice === 26;
  buttons[2].disabled = minPrice === 46;

  showSnackbar(`Ítens filtrados de R$${minPrice} ${maxPrice ? 'à R$' + maxPrice : 'ou mais'}`)

  products.forEach((product) => {
    const price = parseInt(product.querySelector('.product__cta p').textContent.substring(2));
    if (minPrice === 46) {
      if (price >= minPrice) {
        product.style.display = 'flex';
      } else {
        product.style.display = 'none';
      }
    } else {
      if (price >= minPrice && price <= maxPrice) {
        product.style.display = 'flex';
      } else {
        product.style.display = 'none';
      }
    }
  });
}

const overlay = document.querySelector('.overlay');
const menu = document.querySelector('.menu');
const toggleMenu = document.getElementById('toggle-menu');

toggleMenu.addEventListener('click', () => {
  overlay.classList.add("overlay__show");
  menu.classList.add("menu__show");
});

overlay.addEventListener('click', () => {
  overlay.classList.remove("overlay__show");
  menu.classList.remove("menu__show");
});