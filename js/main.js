
/* =========================================
   SMARTSALES TECH - FUNCIONALIDADES
========================================= */

// Produtos da loja
const products = [
    { id: 1, name: "Notebook Gamer Lenovo IdeaPad 3", price: 5499 },
    { id: 2, name: "iPhone 15 128GB", price: 4799 },
    { id: 3, name: "Fone Bluetooth JBL Tune 710BT", price: 1299 },
    { id: 4, name: "Smartwatch Galaxy Watch 4", price: 1299 },
    { id: 5, name: "PlayStation 5 + Controle", price: 4999 },
    { id: 6, name: "Mouse Gamer Logitech G Pro X", price: 549 }
];

// =========================================
// CARRINHO DE COMPRAS
// =========================================

let cart = JSON.parse(localStorage.getItem("smartSalesCart")) || [];

function saveCart() {
    localStorage.setItem("smartSalesCart", JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    cartCount.textContent = totalItems;
}

// Adicionar produto
document.querySelectorAll(".add-cart-button").forEach(button => {

    button.addEventListener("click", () => {

        const productId = Number(button.dataset.id);
        const product = products.find(item => item.id === productId);

        if (!product) return;

        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        saveCart();
        updateCartCount();

        const originalText = "Adicionar ao carrinho";

        button.textContent = "✓ Adicionado!";
        button.classList.add("added");

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("added");
        }, 1200);

    });

});

// =========================================
// PESQUISA DE PRODUTOS
// =========================================

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

function filterProducts(searchTerm = "", category = "") {

    const cards = document.querySelectorAll(".product-card");
    const emptyMessage = document.getElementById("emptyMessage");

    let visibleProducts = 0;

    cards.forEach(card => {

        const name = card.dataset.name.toLowerCase();
        const cardCategory = card.dataset.category;

        const matchesSearch = name.includes(searchTerm.toLowerCase());
        const matchesCategory = !category || cardCategory === category;

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
            visibleProducts++;
        } else {
            card.style.display = "none";
        }

    });

    emptyMessage.hidden = visibleProducts !== 0;

}

if (searchForm) {

    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        filterProducts(searchInput.value);

        document.getElementById("produtos").scrollIntoView({
            behavior: "smooth"
        });
    });

}

if (searchInput) {

    searchInput.addEventListener("input", () => {
        filterProducts(searchInput.value);
    });

}

// =========================================
// FILTRO POR CATEGORIA
// =========================================

document.querySelectorAll(".category-card").forEach(category => {

    category.addEventListener("click", () => {

        const selectedCategory = category.dataset.category;

        filterProducts("", selectedCategory);

    });

});

// =========================================
// FAVORITOS
// =========================================

document.querySelectorAll(".favorite-button").forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("favorited");

        if (button.classList.contains("favorited")) {
            button.textContent = "♥";
        } else {
            button.textContent = "♡";
        }

    });

});

// =========================================
// MENU MOBILE
// =========================================

const mobileMenuButton = document.getElementById("mobileMenuButton");
const navigation = document.getElementById("navigation");

if (mobileMenuButton && navigation) {

    mobileMenuButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
    });

    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            navigation.classList.remove("open");
        });

    });

}

// =========================================
// CONTROLE DE LOGIN E LOGOUT
// =========================================

function updateAccountButton() {
    const accountButtons = document.querySelectorAll(".account-button");

    const currentUser = localStorage.getItem("smartSalesCurrentUser");

    accountButtons.forEach(button => {
        if (currentUser) {
            button.textContent = "↪ Sair da conta";
            button.href = "#";
            button.setAttribute("aria-label", "Sair da conta");

            button.onclick = event => {
                event.preventDefault();

                const confirmLogout = confirm("Deseja realmente sair da sua conta?");

                if (!confirmLogout) return;

                localStorage.removeItem("smartSalesCurrentUser");

                window.location.href = "index.html";
            };

        } else {
            button.textContent = "♙ Minha conta";
            button.href = "login.html";
            button.setAttribute("aria-label", "Minha conta");
            button.onclick = null;
        }
    });
}

// =========================================
// INICIALIZAÇÃO
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();
    updateAccountButton();

});

