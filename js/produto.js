
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTOS DA PÁGINA
    const mainImage = document.querySelector("#detailImage");
    const thumbnails = document.querySelectorAll(".thumbnail");

    const decreaseButton = document.querySelector("#decreaseQuantity");
    const increaseButton = document.querySelector("#increaseQuantity");
    const quantityDisplay = document.querySelector("#quantity");

    const addCartButton = document.querySelector("#detailAddCart");
    const cartCount = document.querySelector("#cartCount");

    // 1. TROCAR A IMAGEM PRINCIPAL
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
            const thumbnailImage = thumbnail.querySelector("img");

            if (!thumbnailImage || !mainImage) return;

            mainImage.src = thumbnailImage.src;
            mainImage.alt = thumbnailImage.alt;

            thumbnails.forEach((item) => {
                item.classList.remove("active");
            });

            thumbnail.classList.add("active");
        });
    });

    // 2. CONTROLAR A QUANTIDADE
    let quantity = 1;

    if (decreaseButton && increaseButton && quantityDisplay) {

        decreaseButton.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
            }
        });

        increaseButton.addEventListener("click", () => {
            quantity++;
            quantityDisplay.textContent = quantity;
        });

    }

    // 3. ATUALIZAR O CONTADOR DO CARRINHO
    function updateCartCount() {

        const cart = JSON.parse(
            localStorage.getItem("smartSalesCart")
        ) || [];

        const totalItems = cart.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        if (cartCount) {
            cartCount.textContent = totalItems;
        }

    }

    updateCartCount();

    // 4. ADICIONAR PRODUTO AO CARRINHO
    let addingToCart = false;

    if (addCartButton) {

        addCartButton.addEventListener("click", (event) => {

            event.preventDefault();

            // Evita adicionar novamente enquanto processa o clique
            if (addingToCart) return;

            addingToCart = true;
            addCartButton.disabled = true;

            const product = {
                id: 1,
                name: "Notebook Gamer Lenovo IdeaPad 3",
                price: 5499
            };

            let cart = JSON.parse(
                localStorage.getItem("smartSalesCart")
            ) || [];

            const existingProduct = cart.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({
                    ...product,
                    quantity: quantity
                });
            }

            localStorage.setItem(
                "smartSalesCart",
                JSON.stringify(cart)
            );

            updateCartCount();

            alert(
                `${quantity} unidade(s) adicionada(s) ao carrinho!`
            );

            addCartButton.disabled = false;
            addingToCart = false;

        });

    }

});
