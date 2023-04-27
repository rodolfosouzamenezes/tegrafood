const urlCategorySelected = new URLSearchParams(window.location.search).get("category");
const categorySelected = parseInt(urlCategorySelected);
const url = `./src/js/products.json`;

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
      const products = data.filter((item) => {
        return !isCategoryValid || item.categories.includes(categorySelected);
      }).map((item) => productHTML(item));
      document.querySelector('.products__container').innerHTML = products.join('')
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
}

function productHTML(item) {
  return `
    <div class="product">
      <div class="product__infos">
        <img src="${item.imgUrl}" alt="${item.title}">
        <div class="product__description">
          <h2 class="title">${item.title}</h2>
          <p class="description">${item.description || ""} </p>
        </div>
      </div>

      <div class="product__cta">
        <p>${item.price}</p>
        <button class="btn btn__primary" onclick="showSnackbar(myFunction, 'Ítem adicionado ao carrinho', 'Ir para o carrinho')">Comprar</button>
      </div>
    </div>
  `;
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

