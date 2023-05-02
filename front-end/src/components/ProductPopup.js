function showProductPopup(productId) {
  const productPopup = document.querySelector("product-popup");
  const shadowRoot = productPopup.shadowRoot;
  const overlay = shadowRoot.querySelector('.popup__overlay');
  overlay.classList.add('overlay__show');
  overlay.onclick = closePopup;

  function closePopup() {
    overlay.classList.remove('overlay__show');
  }

  const popupText = shadowRoot.getElementById('title');
  popupText.textContent = productId ? 'Editar produto' : 'Novo item';

  const btnSend = shadowRoot.getElementById('btn-send');
  btnSend.textContent = productId ? 'Atualizar' : 'Cadastrar';
}

class ProductPopup extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(this.build());
    shadow.appendChild(this.styles());
  }

  build() {
    // Overlay usado para dar desfocar o fundo e fechar o popup
    const overlay = document.createElement("div");
    overlay.classList.add("popup__overlay");

    const popupContainer = document.createElement("div");
    popupContainer.setAttribute("class", "popup__container");
    overlay.appendChild(popupContainer);
    
    const title = document.createElement("h1");
    title.id = "title";
    popupContainer.appendChild(title);

    const form = document.createElement("form");

    const inputsContainer = document.createElement("div");

    const inputsTop = document.createElement("div");
    const inputsTopLeft = document.createElement("div");

    const titleContainer = document.createElement("div");
    const titleLabel = document.createElement("label");
    const titleInput = document.createElement("input");
    titleContainer.appendChild(titleLabel);
    titleContainer.appendChild(titleInput);
    
    const categoryContainer = document.createElement("div");
    const categoryLabel = document.createElement("label");
    const categoryInput = document.createElement("input");
    categoryContainer.appendChild(categoryLabel);
    categoryContainer.appendChild(categoryInput);
    
    const descriptionContainer = document.createElement("div");
    const descriptionLabel = document.createElement("label");
    const descriptionTextarea = document.createElement("textarea");
    descriptionContainer.appendChild(descriptionLabel);
    descriptionContainer.appendChild(descriptionTextarea);
    
    const priceContainer = document.createElement("div");
    const priceLabel = document.createElement("label");
    const priceInput = document.createElement("input");
    priceContainer.appendChild(priceLabel);
    priceContainer.appendChild(priceInput);

    const popupBottom = document.createElement("div");
    popupBottom.classList.add("popup__bottom");
    
    const btnClose = document.createElement("button");
    btnClose.id = "btn-close";
    btnClose.textContent = "Cancelar"
    popupBottom.appendChild(btnClose)
    
    const btnSend = document.createElement("button");
    btnSend.id = "btn-send";
    popupBottom.appendChild(btnSend)

    popupContainer.appendChild(popupBottom)

    return overlay;
  }

  styles() {
    const style = document.createElement("style");
    style.textContent = `
      .popup__overlay {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1;
        transition: all .1s linear;
      }
      
      .overlay__show {
        display: flex;
      }
      
      .popup__container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 32px; 
        max-width: calc(100% - 90px); 
        height: calc(70%); 
        background: var(--primary-color); 
        border-radius: 8px; 
        color: var(--secondary-color); 
        width: 500px;
      }

      #title {
        margin: 0;
      }

      .popup__bottom {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-end;
      }

      #btn-close,
      #btn-send {
        cursor: pointer;
        position: relative;
        width: 140px;
        padding: 20px;
        color: #FFFFFF;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        border: none;
        transition: all 0.2s ease-in-out;
      }

      #btn-close {
        background: transparent;
        margin-right: 20px;
      }
      
      #btn-send {
        background: var(--secondary-color);
      }
      
      #btn-close:hover {
        background: rgba(255, 255, 255, 0.09)
      }
      #btn-send:hover {
        filter: brightness(78%);
      }
    `;

    return style;
  }
}

customElements.define("product-popup", ProductPopup);
