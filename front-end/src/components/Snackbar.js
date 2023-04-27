function showSnackbar(btnFunction, text, btnText) {
  const mySnackbar = document.querySelector("my-snackbar")
  const shadowRoot = mySnackbar.shadowRoot;
  const snackbarContainer = shadowRoot.getElementById('snackbar');

  const snackbarText = shadowRoot.getElementById('text');
  snackbarText.textContent = text;

  const snackbarClassList = snackbarContainer.classList;
  snackbarClassList.add("show__snackbar");

  const btnSnackbar = shadowRoot.getElementById('btn-snackbar');
  btnSnackbar.onclick = handleBtnSackbar;
  btnSnackbar.textContent = btnText;


  function handleBtnSackbar() {
    snackbarClassList.remove("show__snackbar");
    btnFunction()
  }

  setTimeout(() => {
    if (snackbarClassList.contains('show__snackbar')) {
      snackbarClassList.remove("show__snackbar");
    }
  }, 3000);
}

class Snackbar extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(this.build());
    shadow.appendChild(this.styles());
  }


  build() {
    const snackbarContainer = document.createElement("div");
    snackbarContainer.id = "snackbar";
    snackbarContainer.setAttribute("class", "snackbar__container");

    const text = document.createElement("span");
    text.id = "text";

    const btnSnackbar = document.createElement("span");
    btnSnackbar.id = "btn-snackbar";

    snackbarContainer.appendChild(text);
    snackbarContainer.appendChild(btnSnackbar);
    return snackbarContainer;
  }

  styles() {
    const style = document.createElement("style");
    style.textContent = `
      .snackbar__container {
        display: flex;
        justify-content: space-between;
        padding: 16px; 
        min-width: 500px; 
        background: var(--info-color); 
        border-radius: 8px; 
        color: #FFFFFF; 
        font-size: 14px;

        visibility: hidden; 
        position: absolute; 
        z-index: 999; 
        left: 50%; 
        transform: translateX(-50%);
        bottom: 30px; 
      }

      .snackbar__container > #btn-snackbar {
        color: var(--secondary-color);
      }

      .snackbar__container > #btn-snackbar:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      
      .show__snackbar {
        visibility: visible !important; 
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
      }
      
      @-webkit-keyframes fadein {
        from {
          bottom: 0;
          opacity: 0;
        }
        to {
          bottom: 30px; 
          opacity: 1;
        }
      }
      
      @keyframes fadein {
        from {
          bottom: 0; 
          opacity: 0;
        }
        to {
          bottom: 30px; 
          opacity: 1;
        }
      }
      
      @-webkit-keyframes fadeout {
        from {
          bottom: 30px; 
          opacity: 1;
        }
        to {
          bottom: 0; 
          opacity: 0;
        }
      }
      
      @keyframes fadeout {
        from {
          bottom: 30px; 
          opacity: 1;
        }
        to {
          bottom: 0; 
          opacity: 0;
        }
      }
    `;

    return style;
  }
}

customElements.define("my-snackbar", Snackbar);