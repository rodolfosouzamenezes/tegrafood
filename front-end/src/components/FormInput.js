class FormInput extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(this.build());
    shadow.appendChild(this.styles());
  }


  build() {
    const inputContainer = document.createElement("div");
    inputContainer.setAttribute("class", "input__container");

    const leftIcon = document.createElement("i");
    leftIcon.setAttribute("class", this.getAttribute("icon-class"));

    const input = document.createElement("input");
    input.placeholder = this.getAttribute("placeholder") || "";
    input.id = this.getAttribute("input-id");
    input.type = this.getAttribute("type");

    inputContainer.appendChild(leftIcon);
    inputContainer.appendChild(input);

    return inputContainer;
  }

  styles() {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

      .input__container {
        display: flex;
        width: 100%;
        margin-bottom: 28px;
        border: 1px solid #EBF0FF;
        border-radius: 5px;
      }
      
      .input__container > i {
        padding: 16px;      
        font-size: 20px;
        color: #9098B1;
      }
      
      .input__container > input {
        flex: 1;
        border: none;
        padding: 16px;      
        outline: none;
        color: var(--info-color);
        font-size: 14px;
      }
      
      .input__container > input::placeholder {
        font-size: 14px;
        color: #9098B1;
      }
    `;

    return style;
  }
}

customElements.define("form-input", FormInput);