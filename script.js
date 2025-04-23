// Variáveis globais
let currentProduct = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();
let discount = 0;

// Funções do Modal
function openModal(productId, productName, productPrice, productDescription, productImage) {
    // Preencher os detalhes do modal
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-product-description').textContent = productDescription;
    document.getElementById('modal-product-price').textContent = productPrice.toFixed(2).replace('.', ',');
    document.getElementById('modal-product-image').src = productImage;

    // Exibir o modal
    document.getElementById('quantity-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('quantity-modal').style.display = 'none';
}
function proceedToPayment() {
    closePaymentModal();
}

function incrementQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1; // Removido o limite de 10
}

function decrementQuantity() {
    const input = document.getElementById('quantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Funções do Carrinho
function addToCart() {
    // Capturar os dados do modal
    const productName = document.getElementById('modal-product-name').textContent;
    const productPrice = parseFloat(document.getElementById('modal-product-price').textContent.replace(',', '.'));
    const productQuantity = parseInt(document.getElementById('quantity').value, 10);
    const productImage = document.getElementById('modal-product-image').src;

    // Verificar o limite de 20 itens no carrinho
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItemsInCart + productQuantity > 20) {
        alert('Você atingiu o limite máximo de 20 itens no carrinho.');
        return;
    }

    // Verificar se o produto já está no carrinho
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        // Atualizar a quantidade se o produto já estiver no carrinho
        existingProduct.quantity += productQuantity;
    } else {
        // Adicionar novo produto ao carrinho
        cart.push({
            name: productName,
            price: productPrice,
            quantity: productQuantity,
            image: productImage
        });
    }

    // Atualizar o contador do carrinho
    updateCartCount();

    // Atualizar o carrinho na interface
    updateCartUI();

    // Fechar o modal
    closeModal();

    // Abrir o carrinho
    openCart();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <h4>${item.name}</h4>
            <p>Quantidade: ${item.quantity}</p>
            <p>Preço unitário: ${formatPrice(item.price)}</p>
            <p>Subtotal: ${formatPrice(itemTotal)}</p>
            <button onclick="removeFromCart(${item.id})">Remover</button>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = formatPrice(total);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function removeSingleItemFromCart(productName) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity -= 1;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.name !== productName);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartUI();
}

function toggleCart() {
    const cartPanel = document.getElementById('shopping-cart');

    if (cartPanel.style.display === 'block') {
        cartPanel.style.display = 'none';
    } else {
        cartPanel.style.display = 'block';
    }
}


document.addEventListener('click', (e) => {
    const cartPanel = document.getElementById('shopping-cart');
    const cartIcon = document.querySelector('.cart-icon');

    if (cartPanel.classList.contains('active') &&
        !cartPanel.contains(e.target) &&
        !cartIcon.contains(e.target)) {
        cartPanel.classList.remove('active');
    }
});

window.onclick = function (event) {
    const modal = document.getElementById('quantity-modal');
    if (event.target == modal) {
        closeModal();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Quantidade: ${item.quantity}</p>
                <p>Preço: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
        `;


        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'remove-item';
        removeButton.onclick = () => {
            cart.splice(index, 1);
            updateCartUI();
            updateCartCount();
        };

        cartItem.appendChild(removeButton);
        cartItemsContainer.appendChild(cartItem);
    });


    cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
}

function openCart() {
    const cartPanel = document.getElementById('shopping-cart');
    cartPanel.style.display = 'block';
}

function closeCart() {
    const cartPanel = document.getElementById('shopping-cart');
    cartPanel.style.display = 'none';
}

function openPaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    const paymentItemsContainer = document.getElementById('payment-items');
    const paymentTotalElement = document.getElementById('payment-total');


    paymentItemsContainer.innerHTML = '';


    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const paymentItem = document.createElement('div');
        paymentItem.classList.add('payment-item');
        paymentItem.innerHTML = `
            <div class="payment-item-details">
                <img src="${item.image}" alt="${item.name}" class="payment-item-image">
                <div>
                    <h4>${item.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>Preço unitário: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    <p>Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
        `;
        paymentItemsContainer.appendChild(paymentItem);
    });


    paymentTotalElement.textContent = total.toFixed(2).replace('.', ',');


    paymentModal.style.display = 'block';
}

function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    paymentModal.style.display = 'none';
}

function proceedToPayment() {
    closePaymentModal();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';

    // Garantir que a mensagem desapareça suavemente
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.className = 'toast'; // Remove a classe após a animação
        }, 300); // Tempo da transição de fade-out
    }, 3000); // Tempo de exibição da mensagem
}

const cartItems = [
    { id: 1, name: 'Item 1', price: 10 },
    { id: 2, name: 'Item 2', price: 20 },
    { id: 3, name: 'Item 3', price: 30 },
];

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - R$${item.price}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.className = 'remove-item';
        removeButton.onclick = () => removeItem(item.id);

        listItem.appendChild(removeButton);
        cartItemsContainer.appendChild(listItem);
    });
}

function removeItem(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
        renderCart();
    }
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Limpar o conteúdo atual do carrinho
    cartItemsContainer.innerHTML = '';

    // Atualizar os itens do carrinho
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" width="50">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Quantidade: ${item.quantity}</p>
                        <p>Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button class="remove-item-btn" onclick="removeSingleItemFromCart('${item.name}')">Remover 1</button>
                `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Atualizar o total do carrinho
    cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
}

function removeFromCart(index) {
    cart.splice(index, 1); // Remove o item pelo índice
    updateCartUI();
    updateCartCount();
}

function openPrivacyModal() {
    document.getElementById('privacy-modal').style.display = 'block';
}

function closePrivacyModal() {
    document.getElementById('privacy-modal').style.display = 'none';
}

function openTermsModal() {
    document.getElementById('terms-modal').style.display = 'block';
}

function closeTermsModal() {
    document.getElementById('terms-modal').style.display = 'none';
}

function openAboutModal() {
    document.getElementById('about-modal').style.display = 'block';
}

function closeAboutModal() {
    document.getElementById('about-modal').style.display = 'none';
}

function openContactModal() {
    document.getElementById('contact-modal').style.display = 'block';
}

function closeContactModal() {
    document.getElementById('contact-modal').style.display = 'none';
}

// Fechar o modal ao clicar fora dele
window.onclick = function (event) {
    const aboutModal = document.getElementById('about-modal');
    if (event.target == aboutModal) {
        closeAboutModal();
    }

    const contactModal = document.getElementById('contact-modal');
    if (event.target == contactModal) {
        closeContactModal();
    }

    const privacyModal = document.getElementById('privacy-modal');
    if (event.target == privacyModal) {
        closePrivacyModal();
    }

    const termsModal = document.getElementById('terms-modal');
    if (event.target == termsModal) {
        closeTermsModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        document.getElementById('login-modal').style.display = 'flex';
    }
});

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aceitar qualquer email e senha
    if (username && password) {
        localStorage.setItem('isLoggedIn', true);
        document.getElementById('login-modal').style.display = 'none';
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

function skipLogin() {
    localStorage.setItem('isLoggedIn', true);
    document.getElementById('login-modal').style.display = 'none';
}

function showAdPopup() {
    const adPopup = document.getElementById('ad-popup');
    adPopup.style.display = 'block';
}

function closeAdPopup() {
    const adPopup = document.getElementById('ad-popup');
    adPopup.style.display = 'none';
}

// Exibir o popup de propaganda após 5 segundos
setTimeout(showAdPopup, 5000);

function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim();
    const couponMessage = document.getElementById('coupon-message');

    if (couponCode === 'DESCONTO10' || couponCode === 'teste') {
        discount = 0.1; // 10% de desconto
        couponMessage.textContent = 'Cupom aplicado com sucesso!';
        couponMessage.style.color = 'green';
        couponMessage.style.display = 'block';
    } else if (couponCode) {
        discount = 0;
        couponMessage.textContent = 'Cupom inválido!';
        couponMessage.style.color = 'red';
        couponMessage.style.display = 'block';
    } else {
        couponMessage.style.display = 'none'; // Remove a mensagem se não houver cupom
    }

    updatePaymentTotal();
}

function updatePaymentTotal() {
    const paymentTotalElement = document.getElementById('payment-total');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountedTotal = total - total * discount;
    paymentTotalElement.textContent = discountedTotal.toFixed(2).replace('.', ',');
}

function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDescription = product.querySelector('.description').textContent.toLowerCase();

        if (productName.includes(searchInput) || productDescription.includes(searchInput)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    body.classList.toggle('light-theme');

    if (body.classList.contains('light-theme')) {
        themeToggle.textContent = '⚫'; // Símbolo para o tema claro
    } else {
        themeToggle.textContent = '⚪'; // Símbolo para o tema escuro
    }
}

renderCart();
