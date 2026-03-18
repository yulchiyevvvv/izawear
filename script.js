const cartCount = document.getElementById('cartCount');
const toast = document.getElementById('toast');
const cartButton = document.getElementById('cartButton');
const buttons = document.querySelectorAll('.add-to-cart');
const cartItems = document.getElementById('cartItems');
const summaryCount = document.getElementById('summaryCount');
const summaryPrice = document.getElementById('summaryPrice');
const checkoutButton = document.getElementById('checkoutButton');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  summaryCount.textContent = totalItems;

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  summaryPrice.textContent = `$${totalPrice}`;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Корзина пока пустая</p>';
    localStorage.setItem('cart', JSON.stringify(cart));
    return;
  }

  cartItems.innerHTML = '';

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price} × ${item.quantity}</p>
      </div>

      <div class="cart-item-right">
        <button class="minus-btn" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="plus-btn" data-index="${index}">+</button>
        <button class="remove-btn" data-index="${index}">Удалить</button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  document.querySelectorAll('.plus-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      cart[index].quantity += 1;
      updateCart();
    });
  });

  document.querySelectorAll('.minus-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);

      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }

      updateCart();
    });
  });

  document.querySelectorAll('.remove-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      const removedItem = cart[index];
      cart.splice(index, 1);
      updateCart();
      showToast(`${removedItem.name} удалён из корзины`);
    });
  });

  localStorage.setItem('cart', JSON.stringify(cart));
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
    showToast(`${name} добавлен в корзину`);
  });
});

cartButton.addEventListener('click', () => {
  const cartSection = document.getElementById('cartSection');
  if (cartSection) {
    cartSection.scrollIntoView({ behavior: 'smooth' });
  }
});

if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Сначала добавь товары в корзину');
      return;
    }

    showToast('Заказ оформлен (демо-версия)');
  });
}

const submitOrder = document.getElementById('submitOrder');

if (submitOrder) {
  submitOrder.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (!name || !phone || !address) {
      showToast('Заполни все поля');
      return;
    }

    if (cart.length === 0) {
      showToast('Корзина пустая');
      return;
    }

    showToast('Заказ отправлен!');
    cart = [];
    updateCart();
  });
}

updateCart();