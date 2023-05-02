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
        <button class="btn btn__primary" onclick="showProductPopup(${item.id})">Editar</button>
      </div>
    </div>
  `;
}

function initImageUpload(box) {
  let uploadField = box.querySelector('.image-upload');

  uploadField.addEventListener('change', getFile);

  function getFile(e){
    let file = e.currentTarget.files[0];
    checkType(file);
  }
  
  function previewImage(file){
    let thumb = box.querySelector('.js--image-preview'),
        reader = new FileReader();

    reader.onload = function() {
      thumb.style.backgroundImage = 'url(' + reader.result + ')';
    }
    reader.readAsDataURL(file);
    thumb.className += ' js--no-default';
  }

  function checkType(file){
    let imageType = /image.*/;
    if (!file.type.match(imageType)) {
      throw 'Datei ist kein Bild';
    } else if (!file){
      throw 'Kein Bild gewählt';
    } else {
      previewImage(file);
    }
  }
}

// initialize box-scope
var boxes = document.querySelectorAll('.box');

for (let i = 0; i < boxes.length; i++) {
  let box = boxes[i];
  initImageUpload(box);
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

function addToCart(id) {
  const goToCart = () => {
    window.location.href = './src/cart.html';
  }

  console.log(id);
  
  showSnackbar('Ítem adicionado ao carrinho', 'ir para o carrinho', goToCart)
}



//Varun Dewan 2019
var $ = {
  get: function(selector){ 
     var ele = document.querySelectorAll(selector);
     for(var i = 0; i < ele.length; i++){
        this.init(ele[i]);
     }
     return ele;
  },
  template: function(html){
     var template = document.createElement('div');
     template.innerHTML = html.trim();
     return this.init(template.childNodes[0]);
  },
  init: function(ele){
     ele.on = function(event, func){ this.addEventListener(event, func); }
     return ele;
  }
};

//Build the plugin
var drop = function(info){var o = {
  options: info.options,
  selected: info.selected || [],
  preselected: info.preselected || [],
  open: false,
  html: {
     select: $.get(info.selector)[0],
     options: $.get(info.selector + ' option'),
     parent: undefined,
  },
  init: function(){
     //Setup Drop HTML
     this.html.parent = $.get(info.selector)[0].parentNode
     this.html.drop = $.template('<div class="drop"></div>')
     this.html.dropDisplay = $.template('<div class="drop-display">Display</div>')
     this.html.dropOptions = $.template('<div class="drop-options">Options</div>')
     this.html.dropScreen = $.template('<div class="drop-screen"></div>')
     
     this.html.parent.insertBefore(this.html.drop, this.html.select)
     this.html.drop.appendChild(this.html.dropDisplay)
     this.html.drop.appendChild(this.html.dropOptions)
     this.html.drop.appendChild(this.html.dropScreen)
     //Hide old select
     this.html.drop.appendChild(this.html.select);
     
     //Core Events
     var that = this;
     this.html.dropDisplay.on('click', function(){ that.toggle() });
     this.html.dropScreen.on('click', function(){ that.toggle() });
     //Run Render
     this.load()
     this.preselect()
     this.render();
  },
  toggle: function(){
     this.html.drop.classList.toggle('open');
  },
  addOption: function(e, element){ 
     var index = Number(element.dataset.index);
     this.clearStates()
     this.selected.push({
        index: Number(index),
        state: 'add',
        removed: false
     })
     this.options[index].state = 'remove';
     this.render()
  },
  removeOption: function(e, element){
     e.stopPropagation();
     this.clearStates()
     var index = Number(element.dataset.index);
     this.selected.forEach(function(select){
        if(select.index == index && !select.removed){
           select.removed = true
           select.state = 'remove'
        }
     })
     this.options[index].state = 'add'
     this.render();
  },
  load: function(){
     this.options = [];
     for(var i = 0; i < this.html.options.length; i++){
        var option = this.html.options[i]
        this.options[i] = {
           html:  option.innerHTML,
           value: option.value,
           selected: option.selected,
           state: ''
        }
     }
  },
  preselect: function(){
     var that = this;
     this.selected = [];
     this.preselected.forEach(function(pre){
        that.selected.push({
           index: pre,
           state: 'add',
           removed: false
        })
        that.options[pre].state = 'remove';
     })
  },
  render: function(){
     this.renderDrop()
     this.renderOptions()
  },
  renderDrop: function(){ 
     var that = this;
     var parentHTML = $.template('<div></div>')
     this.selected.forEach(function(select, index){ 
        var option = that.options[select.index];
        var childHTML = $.template('<span class="item '+ select.state +'">'+ option.html +'</span>')
        var childCloseHTML = $.template(
           '<span class="btnclose" data-index="'+select.index+'">x</span></span>')
        childCloseHTML.on('click', function(e){ that.removeOption(e, this) })
        childHTML.appendChild(childCloseHTML)
        parentHTML.appendChild(childHTML)
     })
     this.html.dropDisplay.innerHTML = ''; 
     this.html.dropDisplay.appendChild(parentHTML)
  },
  renderOptions: function(){  
     var that = this;
     var parentHTML = $.template('<div></div>')
     this.options.forEach(function(option, index){
        var childHTML = $.template(
           '<a data-index="'+index+'" class="'+option.state+'">'+ option.html +'</a>')
        childHTML.on('click', function(e){ that.addOption(e, this) })
        parentHTML.appendChild(childHTML)
     })
     this.html.dropOptions.innerHTML = '';
     this.html.dropOptions.appendChild(parentHTML)
  },
  clearStates: function(){
     var that = this;
     this.selected.forEach(function(select, index){ 
        select.state = that.changeState(select.state)
     })
     this.options.forEach(function(option){ 
        option.state = that.changeState(option.state)
     })
  },
  changeState: function(state){
     switch(state){
        case 'remove':
           return 'hide'
        case 'hide':
           return 'hide'
        default:
           return ''
      }
  },
  isSelected: function(index){
     var check = false
     this.selected.forEach(function(select){ 
        if(select.index == index && select.removed == false) check = true
     })
     return check
  }
}; o.init(); return o;}


//Set up some data
var options = [
  { html: 'cats', value: 'cats' },
  { html: 'fish', value: 'fish' },
  { html: 'squids', value: 'squids' },
  { html: 'cats', value: 'whales' },
  { html: 'cats', value: 'bikes' },
];

var myDrop = new drop({
  selector:  '#category',
  preselected: [2]
});