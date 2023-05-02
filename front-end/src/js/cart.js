const URL = `./js/cart.json`;

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
  const { title, description = "", price, imgUrl, quantity, id } = product;
  return `
    <div class="product__container" id="product-${id}">
      <div class="card__container">
        <div class="card__infos">
          <img src="${imgUrl}" alt="${title}">
          <div class="card__description">
            <h2 class="title">${title}</h2>
            <p class="description">${description}</p>
          </div>
        </div>

        <div class="card__cta">
          <p>${price}</p>
          <div class="quantity__container">
            <button onclick="changeQuantity('-', ${id})" class="btn btn__primary">-</button>
            <div class="quantity">${quantity}x</div>
            <button onclick="changeQuantity('+', ${id})" class="btn btn__primary">+</button>
          </div>
        </div>
      </div>
      <button onclick="removeFromCart(${id})" class="btn btn__remove">
        <i class="fa fa-trash"></i>
      </button>
    </div>
  `;
}

const couponInput = document.getElementById('coupon');
const couponButton = document.getElementById('coupon-button');

// Listener que habilita o botão do cupom
couponInput.addEventListener('input', () => {
  if (couponInput.value !== '') {
    couponButton.disabled = false;
  } else {
    couponButton.disabled = true;
  }
});

function changeQuantity(operation, productId) {
  const product = document.querySelector(`#product-${productId} .quantity`);
  let quantity = parseInt(product.textContent);

  if (operation === '+') {
    quantity++;
  } else if (operation === '-' && quantity > 1) {
    quantity--;
  }

  product.textContent = `${quantity}x`;

  calculateTotal()
}

function removeFromCart(productId) {
  const product = document.querySelector(`#product-${productId}`)

  product.remove();

  calculateTotal();
}


function verifyCoupon() {
  // Simulando uma validação do cupom
  let isValidCoupon = couponInput.value.startsWith('DESC');

  if (!isValidCoupon) {
    couponInput.value = '';
    couponButton.disabled = true;
    return
  };

  let coupon = couponInput.value.substring(4);

  const discountHTML = document.getElementById('discount');
  discountHTML.textContent = coupon + '%';

  calculateTotal()

  // Limpar os campos de entrada
  couponInput.value = '';
  couponButton.disabled = true;
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
      const quantityText = card.querySelector('.card__cta .quantity').textContent;
      const price = parseFloat(priceText.replace("R$", "").replace(",", "."));
      const quantity = parseInt(quantityText);

      subTotal += price * quantity;
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

// Simula um valor de entrega
function setShipping() {
  const shippingHTML = document.getElementById('shipping');
  shippingHTML.textContent = "R$15,90";
  calculateTotal();
}


function finalizeOrder() {
  const container = document.querySelector('.cards__container');

  container.innerHTML = '';

  const subTotalHTML = document.getElementById('sub-total');
  const discountHTML = document.getElementById('discount');
  const shippingHTML = document.getElementById('shipping');
  const totalHTML = document.getElementById('total');

  subTotalHTML.textContent = "R$0,00";
  discountHTML.textContent = "00%";
  shippingHTML.textContent = "Calcular";
  totalHTML.textContent = "R$0,00";
}