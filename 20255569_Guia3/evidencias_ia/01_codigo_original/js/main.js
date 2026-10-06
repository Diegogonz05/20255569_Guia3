/* Interacciones pequeñas; sin dependencias ni solicitudes a un servidor. */
document.documentElement.classList.add('js');

// Navegación móvil: el mismo nav se utiliza en todos los tamaños.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeNavigation() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeNavigation();
    toggle.focus();
  }
});
window.matchMedia('(max-width: 780px)').addEventListener('change', closeNavigation);

// Filtros del menú: los productos siguen presentes en el HTML sin JavaScript.
const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    document.querySelectorAll('.menu-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visible += 1;
    });
    document.querySelector('#menu-status').textContent = `${visible} productos en ${button.textContent}.`;
  });
});

// Adaptación del carrito volátil de Guía 1: cantidades, sin cobros ni precios.
const cartDialog = document.querySelector('#cart-dialog');
if (cartDialog) {
  let cart = [];
  const cartList = document.querySelector('#cart-items');
  const cartCount = document.querySelector('#cart-count');
  const cartStatus = document.querySelector('#cart-status');
  const orderStatus = document.querySelector('#order-status');
  const finishButton = document.querySelector('#finish-order');
  const clearButton = document.querySelector('#clear-cart');

  function renderCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    cartList.replaceChildren();
    finishButton.disabled = cart.length === 0;
    clearButton.disabled = cart.length === 0;
    if (cart.length === 0) {
      const empty = document.createElement('li');
      empty.textContent = 'Tu pedido está vacío.';
      cartList.append(empty);
      return;
    }
    cart.forEach(item => {
      const row = document.createElement('li');
      const label = document.createElement('strong');
      label.textContent = item.name;
      const controls = document.createElement('div');
      controls.className = 'quantity';
      const quantity = document.createElement('span');
      quantity.textContent = item.quantity;
      const minus = quantityButton('−', -1, item);
      const plus = quantityButton('+', 1, item);
      controls.append(minus, quantity, plus);
      row.append(label, controls);
      cartList.append(row);
    });
  }

  function quantityButton(symbol, delta, item) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-button';
    button.textContent = symbol;
    button.dataset.name = item.name;
    button.dataset.delta = delta;
    button.setAttribute('aria-label', `${delta > 0 ? 'Agregar' : 'Quitar'} una unidad de ${item.name}`);
    button.addEventListener('click', () => {
      item.quantity += delta;
      cart = cart.filter(product => product.quantity > 0);
      cartStatus.textContent = `${item.name}: ${item.quantity} unidades en tu pedido.`;
      renderCart();
      // Restaurar foco después de reconstruir la lista.
      const replacement = [...cartList.querySelectorAll('button')].find(control => control.dataset.name === item.name && Number(control.dataset.delta) === delta);
      (replacement || document.querySelector('#close-cart')).focus();
    });
    return button;
  }

  document.querySelectorAll('[data-product]').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.product;
      const existing = cart.find(item => item.name === name);
      if (existing) existing.quantity += 1;
      else cart.push({ name, quantity: 1 });
      cartStatus.textContent = '';
      renderCart();
      orderStatus.textContent = `${name} agregado. Tu pedido tiene ${cartCount.textContent} productos. Abre «Mi pedido» para revisarlo.`;
    });
  });
  document.querySelector('#open-cart').addEventListener('click', () => cartDialog.showModal());
  document.querySelector('#close-cart').addEventListener('click', () => cartDialog.close());
  clearButton.addEventListener('click', () => {
    cart = [];
    renderCart();
    cartStatus.textContent = 'Pedido vaciado.';
    orderStatus.textContent = 'Tu pedido está vacío. Puedes agregar tus favoritos.';
    document.querySelector('#close-cart').focus();
  });
  finishButton.addEventListener('click', () => {
    cart = [];
    renderCart();
    cartStatus.textContent = '¡Demostración completada! No se realizó ninguna compra ni se envió un pedido real.';
    orderStatus.textContent = 'Demostración completada. Puedes iniciar otra selección.';
    document.querySelector('#close-cart').focus();
  });
  renderCart();
}

// La validación HTML se complementa evitando nombres y mensajes de solo espacios.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  document.querySelector('#send-message').disabled = false;
  const requiredTexts = [document.querySelector('#nombre'), document.querySelector('#mensaje')];
  requiredTexts.forEach(field => {
    field.addEventListener('input', () => {
      field.setCustomValidity('');
      document.querySelector('#form-status').textContent = '';
    });
  });
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    requiredTexts.forEach(field => field.setCustomValidity(field.value.trim() ? '' : 'Escribe un texto, no solamente espacios.'));
    if (!contactForm.reportValidity()) return;
    document.querySelector('#form-status').textContent = 'Gracias. Tu mensaje ha sido registrado como demostración. No se ha enviado ni guardado ningún dato.';
    contactForm.reset();
  });
}
