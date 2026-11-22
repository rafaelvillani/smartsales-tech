
document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "smartSalesCart";

    const checkoutProducts = document.getElementById("checkoutProducts");
    const checkoutSubtotal = document.getElementById("checkoutSubtotal");
    const checkoutShipping = document.getElementById("checkoutShipping");
    const checkoutDiscountLine = document.getElementById("checkoutDiscountLine");
    const checkoutDiscount = document.getElementById("checkoutDiscount");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutForm = document.getElementById("checkoutForm");

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

    function formatPrice(value) {
        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // =========================================
    // IDENTIFICAR CLIENTE LOGADO
    // =========================================

    function getCurrentUser() {
        try {
            return JSON.parse(
                localStorage.getItem("smartSalesCurrentUser")
            );
        } catch {
            return null;
        }
    }

    // =========================================
    // PREENCHER DADOS DO CLIENTE
    // =========================================

    function fillCustomerData() {
        const user = getCurrentUser();

        if (!user) return;

        document.getElementById("customerName").value =
            user.name || "";

        document.getElementById("customerCpf").value =
            user.cpf || "";

        document.getElementById("customerPhone").value =
            user.phone || "";

        document.getElementById("customerEmail").value =
            user.email || "";
    }

    // =========================================
    // MOSTRAR PRODUTOS E VALORES
    // =========================================

    function renderCheckout() {
        const cart = getCart();

        if (cart.length === 0) {
            checkoutProducts.innerHTML =
                "<p>Seu carrinho está vazio.</p>";

            checkoutForm.querySelector(
                ".place-order-button"
            ).disabled = true;

            checkoutSubtotal.textContent = formatPrice(0);
            checkoutShipping.textContent = "A calcular";
            checkoutDiscount.textContent = formatPrice(0);
            checkoutTotal.textContent = formatPrice(0);

            return;
        }

        const subtotal = cart.reduce((total, item) => {
            return total + Number(item.price) * Number(item.quantity);
        }, 0);

        const coupon = localStorage.getItem("smartSalesCoupon");

        const couponRates = {
            SMART10: 0.10,
            SMART20: 0.20
        };

        const discount = subtotal * (couponRates[coupon] || 0);

        const savedShipping = localStorage.getItem("smartSalesShipping");

        const shipping = savedShipping !== null
            ? Number(savedShipping)
            : 0;

        const total = subtotal - discount + shipping;

        checkoutProducts.innerHTML = "";

        cart.forEach(item => {
            const image = productImages[item.id] ||
                "assets/imagens/lenovo-ideapad-3-1.jpg";

            const product = document.createElement("div");
            product.className = "checkout-product";

            const imageElement = document.createElement("img");
            imageElement.src = image;
            imageElement.alt = item.name;

            const info = document.createElement("div");

            const name = document.createElement("strong");
            name.textContent = item.name;

            const quantity = document.createElement("span");
            quantity.textContent =
                `${item.quantity} unidade(s)`;

            info.append(name, quantity);

            const price = document.createElement("strong");
            price.textContent = formatPrice(
                Number(item.price) * Number(item.quantity)
            );

            product.append(imageElement, info, price);
            checkoutProducts.appendChild(product);
        });

        checkoutSubtotal.textContent = formatPrice(subtotal);

        checkoutShipping.textContent = savedShipping !== null
            ? formatPrice(shipping)
            : "A calcular";

        checkoutDiscount.textContent = "- " + formatPrice(discount);
        checkoutDiscountLine.hidden = discount <= 0;

        checkoutTotal.textContent = formatPrice(total);

        const headerCount = document.getElementById("cartCount");

        if (headerCount) {
            const totalItems = cart.reduce(
                (sum, item) => sum + Number(item.quantity),
                0
            );

            headerCount.textContent = totalItems;
        }
    }

    // =========================================
    // MÁSCARAS DE CPF, TELEFONE E CEP
    // =========================================

    const cpfInput = document.getElementById("customerCpf");
    const phoneInput = document.getElementById("customerPhone");
    const cepInput = document.getElementById("addressCep");

    cpfInput.addEventListener("input", () => {
        let value = cpfInput.value.replace(/\D/g, "").slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        cpfInput.value = value;
    });

    phoneInput.addEventListener("input", () => {
        let value = phoneInput.value.replace(/\D/g, "").slice(0, 11);

        if (value.length > 10) {
            value = value.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                "($1) $2-$3"
            );
        } else if (value.length > 6) {
            value = value.replace(
                /^(\d{2})(\d{4})(\d{0,4})$/,
                "($1) $2-$3"
            );
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
        }

        phoneInput.value = value;
    });

    cepInput.addEventListener("input", () => {
        let value = cepInput.value.replace(/\D/g, "").slice(0, 8);

        if (value.length > 5) {
            value = value.slice(0, 5) + "-" + value.slice(5);
        }

        cepInput.value = value;
    });

    // =========================================
    // BUSCAR ENDEREÇO PELO CEP
    // =========================================

    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");

        if (cep.length !== 8) return;

        try {
            const response = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );

            if (!response.ok) {
                throw new Error("Falha na consulta do CEP.");
            }

            const data = await response.json();

            if (data.erro) {
                alert("CEP não encontrado. Confira os números.");
                return;
            }

            document.getElementById("addressStreet").value =
                data.logradouro || "";

            document.getElementById("addressNeighborhood").value =
                data.bairro || "";

            document.getElementById("addressCity").value =
                data.localidade || "";

            document.getElementById("addressState").value =
                data.uf || "";

            document.getElementById("addressNumber").focus();

        } catch (error) {
            alert("Não foi possível consultar o CEP. Tente novamente.");
            console.error(error);
        }
    });

    // =========================================
    // CAMPOS OBRIGATÓRIOS
    // =========================================

    const requiredFields = [
        "customerName",
        "customerCpf",
        "customerPhone",
        "customerEmail",
        "addressCep",
        "addressState",
        "addressStreet",
        "addressNumber",
        "addressNeighborhood",
        "addressCity"
    ];

    requiredFields.forEach(id => {
        document.getElementById(id).required = true;
    });

    // =========================================
    // FINALIZAR COMPRA
    // =========================================

    checkoutForm.addEventListener("submit", event => {
        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        const cpf = cpfInput.value.replace(/\D/g, "");
        const phone = phoneInput.value.replace(/\D/g, "");
        const cep = cepInput.value.replace(/\D/g, "");

        if (cpf.length !== 11) {
            alert("Digite um CPF com 11 números.");
            cpfInput.focus();
            return;
        }

        if (phone.length !== 10 && phone.length !== 11) {
            alert("Digite um telefone válido com DDD.");
            phoneInput.focus();
            return;
        }

        if (cep.length !== 8) {
            alert("Digite um CEP válido com 8 números.");
            cepInput.focus();
            return;
        }

        const formData = new FormData(checkoutForm);
        const paymentMethod = formData.get("paymentMethod");

        if (!paymentMethod) {
            alert("Selecione uma forma de pagamento.");
            return;
        }

        const subtotal = cart.reduce((total, item) => {
            return total + Number(item.price) * Number(item.quantity);
        }, 0);

        const coupon = localStorage.getItem("smartSalesCoupon");

        const couponRates = {
            SMART10: 0.10,
            SMART20: 0.20
        };

        const discount = subtotal * (couponRates[coupon] || 0);

        const savedShipping = localStorage.getItem("smartSalesShipping");

        const shipping = savedShipping !== null
            ? Number(savedShipping)
            : 0;

        const currentUser = getCurrentUser();

        const order = {
            number: "ST" + Date.now(),
            date: new Date().toLocaleString("pt-BR"),

            // Associação com a conta cadastrada
            userId: currentUser ? currentUser.id : null,

            customer: {
                name: formData.get("customerName"),
                cpf: formData.get("customerCpf"),
                phone: formData.get("customerPhone"),
                email: formData.get("customerEmail")
            },

            address: {
                cep: formData.get("addressCep"),
                state: formData.get("addressState"),
                street: formData.get("addressStreet"),
                number: formData.get("addressNumber"),
                complement: formData.get("addressComplement"),
                neighborhood: formData.get("addressNeighborhood"),
                city: formData.get("addressCity")
            },

            products: cart,
            subtotal: subtotal,
            shipping: shipping,
            discount: discount,
            total: subtotal - discount + shipping,
            paymentMethod: paymentMethod
        };

        let orders = [];

        try {
            orders = JSON.parse(
                localStorage.getItem("smartSalesOrders")
            ) || [];
        } catch {
            orders = [];
        }

        orders.push(order);

        localStorage.setItem(
            "smartSalesOrders",
            JSON.stringify(orders)
        );

        localStorage.removeItem("smartSalesCart");
        localStorage.removeItem("smartSalesCoupon");
        localStorage.removeItem("smartSalesShipping");
        localStorage.removeItem("smartSalesCEP");

        document.querySelector(".checkout-page").innerHTML = `
            <div class="checkout-card" style="text-align:center; padding:50px 25px;">
                <h2 style="color:#218653;">Pedido realizado com sucesso!</h2>

                <p>Obrigado por comprar na SmartSales Tech.</p>

                <p>Seu número de pedido é:</p>

                <h2>${order.number}</h2>

                <p>Valor total:
                    <strong>${formatPrice(order.total)}</strong>
                </p>

                <p>Forma de pagamento: ${order.paymentMethod}</p>

                <a href="index.html" class="place-order-button"
                   style="display:inline-block; text-decoration:none; margin-top:20px;">
                    Voltar à loja
                </a>
            </div>
        `;

        const headerCount = document.getElementById("cartCount");

        if (headerCount) {
            headerCount.textContent = "0";
        }
    });

    // =========================================
    // INICIALIZAÇÃO
    // =========================================

    fillCustomerData();
    renderCheckout();
});
