
document.addEventListener("DOMContentLoaded", () => {
    const productsGrid = document.getElementById("productsGrid");
    const filterButtons = document.querySelectorAll(".catalog-filter");
    const sortSelect = document.getElementById("sortProducts");
    const productTotal = document.getElementById("productTotal");

    if (!productsGrid) return;

    const products = Array.from(
        productsGrid.querySelectorAll(".product-card")
    );

    let selectedCategory = "todos";

    function getProductPrice(product) {
        const priceElement = product.querySelector(".product-price");

        if (!priceElement) return 0;

        return Number(
            priceElement.textContent
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        );
    }

    function updateProducts() {
        const searchInput = document.getElementById("searchInput");
        const searchTerm = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        let visibleCount = 0;

        products.forEach(product => {
            const category = product.dataset.category;
            const name = product.dataset.name.toLowerCase();

            const matchesCategory =
                selectedCategory === "todos" ||
                category === selectedCategory;

            const matchesSearch =
                name.includes(searchTerm);

            const shouldShow = matchesCategory && matchesSearch;

            product.hidden = !shouldShow;

            if (shouldShow) visibleCount++;
        });

        if (productTotal) {
            productTotal.textContent =
                `${visibleCount} produto(s) encontrado(s)`;
        }

        const emptyMessage = document.getElementById("emptyMessage");

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount > 0;
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            updateProducts();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            const sortType = sortSelect.value;
            let sortedProducts = [...products];

            if (sortType === "price-asc") {
                sortedProducts.sort(
                    (a, b) => getProductPrice(a) - getProductPrice(b)
                );
            }

            if (sortType === "price-desc") {
                sortedProducts.sort(
                    (a, b) => getProductPrice(b) - getProductPrice(a)
                );
            }

            if (sortType === "name") {
                sortedProducts.sort((a, b) =>
                    a.dataset.name.localeCompare(
                        b.dataset.name,
                        "pt-BR"
                    )
                );
            }

            sortedProducts.forEach(product => {
                productsGrid.appendChild(product);
            });

            updateProducts();
        });
    }

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", updateProducts);
    }

    updateProducts();
});
