
document.addEventListener("DOMContentLoaded", () => {
    const cartProducts = document.getElementById("cartProducts");
    const emptyCart = document.getElementById("emptyCart");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");
    const cartItemsCount = document.getElementById("cartItemsCount");
    const checkoutButton = document.getElementById("checkoutButton");
    const clearCartButton = document.getElementById("clearCartButton");
    const couponInput = document.getElementById("couponInput");
    const applyCouponButton = document.getElementById("applyCouponButton");
    const couponMessage = document.getElementById("couponMessage");
    const couponDiscountLine = document.getElementById("couponDiscountLine");
    const couponDiscount = document.getElementById("couponDiscount");
    const cepInput = document.getElementById("cepInput");
    const calculateShippingButton = document.getElementById("calculateShippingButton");
    const shippingValue = document.getElementById("shippingValue");
    const shippingMessage = document.getElementById("shippingMessage");




    const CART_KEY = "smartSalesCart";

    // Imagens utilizadas no catálogo
    const productImages = {
        1: "assets/imagens/lenovo-ideapad-3-1.jpg",
        2: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&auto=format&fit=crop",
        3: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
        4: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
        5: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop",
        6: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop"
    };

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function formatPrice(value) {
        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function renderCart() {
        const cart = getCart();

        cartProducts.innerHTML = "";

        const totalItems = cart.reduce(
            (total, item) => total + Number(item.quantity),
            0
        );

        const subtotal = cart.reduce(
            (total, item) => total + Number(item.price) * Number(item.quantity),
            0
        );

        cartItemsCount.textContent =
            `${totalItems} ${totalItems === 1 ? "item" : "itens"}`;

        
const appliedCoupon = localStorage.getItem("smartSalesCoupon");

const couponRates = {
    SMART10: 0.10,
    SMART20: 0.20
};


const discountRate = couponRates[appliedCoupon] || 0;

const discount = subtotal * discountRate;

const savedShipping = localStorage.getItem("smartSalesShipping");
const shippingCost = savedShipping !== null
    ? Number(savedShipping)
    : 0;

const total = subtotal - discount + shippingCost;

cartSubtotal.textContent = formatPrice(subtotal);
cartTotal.textContent = formatPrice(total);

couponDiscount.textContent = "- " + formatPrice(discount);
couponDiscountLine.hidden = discount <= 0;

shippingValue.textContent = savedShipping !== null
    ? formatPrice(shippingCost)
    : "A calcular";

const savedCep = localStorage.getItem("smartSalesCEP");
if (savedCep) {
    cepInput.value = savedCep;
}


cartSubtotal.textContent = formatPrice(subtotal);
cartTotal.textContent = formatPrice(total);

couponDiscount.textContent = "- " + formatPrice(discount);
couponDiscountLine.hidden = discount <= 0;

if (appliedCoupon && discountRate > 0) {
    couponInput.value = appliedCoupon;
}


        emptyCart.hidden = cart.length > 0;
        cartProducts.hidden = cart.length === 0;
        checkoutButton.disabled = cart.length === 0;

        cart.forEach(item => {
            const product = document.createElement("article");
            product.className = "cart-item";

            const image = productImages[item.id] ||
                "assets/imagens/lenovo-ideapad-3-1.jpg";

            product.innerHTML = `
                <div class="cart-item-image">
                    <img src="${image}" alt="${item.name}">
                </div>

                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>

                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-minus"
                                data-id="${item.id}" aria-label="Diminuir quantidade">−</button>

                            <span>${item.quantity}</span>

                            <button class="quantity-plus"
                                data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
                        </div>

                        <button class="remove-cart-item" data-id="${item.id}">
                            Remover
                        </button>
                    </div>
                </div>

                <strong class="cart-item-total">
                    ${formatPrice(item.price * item.quantity)}
                </strong>
            `;

            cartProducts.appendChild(product);
        });

        // Atualiza o contador do cabeçalho
        const headerCount = document.getElementById("cartCount");
        if (headerCount) {
            headerCount.textContent = totalItems;
        }

// =========================================
// APLICAR CUPOM DE DESCONTO
// =========================================

applyCouponButton.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();

    const coupons = {
        SMART10: 0.10,
        SMART20: 0.20
    };

    if (getCart().length === 0) {
        couponMessage.textContent =
            "Adicione produtos antes de aplicar um cupom.";
        couponMessage.className = "coupon-message error";
        return;
    }

    if (!coupons[code]) {
        couponMessage.textContent =
            "Cupom inválido. Confira o código digitado.";
        couponMessage.className = "coupon-message error";
        return;
    }

    localStorage.setItem("smartSalesCoupon", code);

    couponMessage.textContent =
        `Cupom ${code} aplicado com sucesso!`;
    couponMessage.className = "coupon-message success";

    renderCart();
});


// =========================================
// CALCULAR FRETE
// =========================================

calculateShippingButton.addEventListener("click", () => {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        shippingMessage.textContent =
            "Digite um CEP válido com 8 números.";
        shippingMessage.className = "shipping-message error";
        return;
    }

    if (getCart().length === 0) {
        shippingMessage.textContent =
            "Adicione produtos antes de calcular o frete.";
        shippingMessage.className = "shipping-message error";
        return;
    }

    const firstDigit = Number(cep[0]);

    let cost;
    let days;

    if (firstDigit <= 3) {
        cost = 15.90;
        days = "2 a 4 dias úteis";
    } else if (firstDigit <= 5) {
        cost = 22.90;
        days = "3 a 6 dias úteis";
    } else if (firstDigit <= 8) {
        cost = 29.90;
        days = "5 a 8 dias úteis";
    } else {
        cost = 34.90;
        days = "6 a 10 dias úteis";
    }

    localStorage.setItem("smartSalesCEP", cep);
    localStorage.setItem("smartSalesShipping", cost);

    shippingMessage.textContent =
        `Entrega estimada: ${days}. Frete simulado com sucesso!`;

    shippingMessage.className = "shipping-message success";

    renderCart();
});


// =========================================
// FORMATAÇÃO AUTOMÁTICA DO CEP
// =========================================

cepInput.addEventListener("input", () => {
    let value = cepInput.value.replace(/\D/g, "").slice(0, 8);

    if (value.length > 5) {
        value = value.slice(0, 5) + "-" + value.slice(5);
    }

    cepInput.value = value;
});

    }

    cartProducts.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (!button) return;

        const id = Number(button.dataset.id);
        const cart = getCart();
        const item = cart.find(product => Number(product.id) === id);

        if (!item) return;

        if (button.classList.contains("quantity-plus")) {
            item.quantity++;
        }

        if (button.classList.contains("quantity-minus")) {
            item.quantity--;

            if (item.quantity <= 0) {
                const index = cart.findIndex(
                    product => Number(product.id) === id
                );
                cart.splice(index, 1);
            }
        }

        if (button.classList.contains("remove-cart-item")) {
            const index = cart.findIndex(
                product => Number(product.id) === id
            );
            cart.splice(index, 1);
        }

        saveCart(cart);
        renderCart();
    });

    checkoutButton.addEventListener("click", () => {
    if (getCart().length > 0) {
        const currentUser = localStorage.getItem("smartSalesCurrentUser");

        if (currentUser) {
            window.location.href = "checkout.html";
        } else {
            localStorage.setItem("smartSalesRedirectAfterLogin", "checkout.html");
            window.location.href = "login.html";
        }
    }
});

 clearCartButton.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) return;

    const confirmClear = window.confirm(
        "Tem certeza que deseja remover todos os produtos do carrinho?"
    );

    if (!confirmClear) return;

saveCart([]);
localStorage.removeItem("smartSalesCoupon");
couponInput.value = "";
couponMessage.textContent = "";
localStorage.removeItem("smartSalesCEP");
localStorage.removeItem("smartSalesShipping");

cepInput.value = "";
shippingMessage.textContent = "";
shippingValue.textContent = "A calcular";
renderCart();
});

    renderCart();
});
