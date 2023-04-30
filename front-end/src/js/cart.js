const URL = `./js/products.json`;

loadProducts();

function loadProducts() {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      const productsHTML = data.map((product) => generateProductHTML(product));
      const cardsContainer = document.querySelector('.cards__container');
      cardsContainer.innerHTML = productsHTML.join('');
      calculateTotal();
    })
    .catch(error => console.error('Error fetching products:', error));
}

function generateProductHTML(product) {
  const { title, description = "", price, imgUrl } = product;
  return `
    <div class="card__container">
      <div class="card__infos">
        <img src=".${imgUrl}" alt="${title}">
        <div class="card__description">
          <h2 class="title">${title}</h2>
          <p class="description">${description}</p>
        </div>
      </div>

      <div class="card__cta">
        <p>${price}</p>
        <button class="btn btn__primary">Comprar</button>
      </div>
    </div>
  `;
}

function calculateTotal() {
  const container = document.querySelector('.cards__container');
  const productCards = Array.from(container.children);

  const subTotalHTML = document.getElementById('sub-total');
  const discountHTML = document.getElementById('discount');
  const shippingHTML = document.getElementById('shipping');
  const totalHTML = document.getElementById('total');

  let subTotal, discount, shipping, total;

  // Calcular o subtotal
  subTotal = calculateSubTotal(productCards);
  const subTotalFormatted = formatCurrency(subTotal);
  subTotalHTML.textContent = subTotalFormatted;

  // Calcular o desconto e o preço com desconto
  discount = getDiscountFromHTML(discountHTML);
  const discountAmount = subTotal * discount;
  const discountedPrice = subTotal - discountAmount;

  // Calcular o frete e o preço total
  shipping = getShippingFromHTML(shippingHTML);
  total = discountedPrice + shipping;
  const totalFormatted = formatCurrency(total);
  totalHTML.textContent = totalFormatted;

  function calculateSubTotal(productCards) {
    let subTotal = 0;
    productCards.forEach((card) => {
      const priceText = card.querySelector('.card__cta p').textContent;
      const price = parseFloat(priceText.replace("R$", "").replace(",", "."));
      subTotal += price;
    });
    return subTotal;
  }

  function getDiscountFromHTML(discountHTML) {
    const discountPercentText = discountHTML.textContent;
    const discountPercent = parseFloat(discountPercentText.replace("%", "")) / 100;
    return discountPercent;
  }

  function getShippingFromHTML(shippingHTML) {
    const shippingText = shippingHTML.textContent;
    const shippingValue = parseFloat(shippingText.replace("R$", "").replace(",", ".")) || 0;
    return shippingValue;
  }

  // Função para formatar um valor como moeda
  function formatCurrency(value) {
    return `R$${value.toFixed(2)}`.replace('.', ',');
  }
}
