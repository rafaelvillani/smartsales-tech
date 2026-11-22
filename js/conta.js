
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    const loginMessage = document.getElementById("loginMessage");
    const registerMessage = document.getElementById("registerMessage");

    const USERS_KEY = "smartSalesUsers";
    const SESSION_KEY = "smartSalesCurrentUser";

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch {
            return [];
        }
    }

    function showLogin() {
        loginForm.hidden = false;
        registerForm.hidden = true;

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginMessage.textContent = "";
        registerMessage.textContent = "";
    }

    function showRegister() {
        loginForm.hidden = true;
        registerForm.hidden = false;

        loginTab.classList.remove("active");
        registerTab.classList.add("active");

        loginMessage.textContent = "";
        registerMessage.textContent = "";
    }

    loginTab.addEventListener("click", showLogin);
    registerTab.addEventListener("click", showRegister);

    document.getElementById("goRegister")
        .addEventListener("click", showRegister);

    document.getElementById("goLogin")
        .addEventListener("click", showLogin);

    // Cadastro
    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const cpf = document.getElementById("registerCpf").value.replace(/\D/g, "");
        const phone = document.getElementById("registerPhone").value.replace(/\D/g, "");
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmation = document.getElementById("confirmPassword").value;

        if (cpf.length !== 11) {
            registerMessage.textContent = "Digite um CPF com 11 números.";
            registerMessage.className = "account-message error";
            return;
        }

        if (phone.length < 10 || phone.length > 11) {
            registerMessage.textContent = "Digite um telefone válido.";
            registerMessage.className = "account-message error";
            return;
        }

        if (password.length < 6) {
            registerMessage.textContent = "A senha precisa ter pelo menos 6 caracteres.";
            registerMessage.className = "account-message error";
            return;
        }

        if (password !== confirmation) {
            registerMessage.textContent = "As senhas não coincidem.";
            registerMessage.className = "account-message error";
            return;
        }

        const users = getUsers();

        const emailExists = users.some(user => user.email === email);

        if (emailExists) {
            registerMessage.textContent = "Este e-mail já possui cadastro.";
            registerMessage.className = "account-message error";
            return;
        }

        const cpfExists = users.some(user => user.cpf === cpf);

        if (cpfExists) {
            registerMessage.textContent = "Este CPF já possui cadastro.";
            registerMessage.className = "account-message error";
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            cpf,
            phone,
            email,
            password
        };

        users.push(newUser);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        registerMessage.textContent = "Cadastro realizado! Agora você pode entrar.";
        registerMessage.className = "account-message success";

        registerForm.reset();

        setTimeout(showLogin, 1200);
    });

    // Login
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(
            item => item.email === email && item.password === password
        );

        if (!user) {
            loginMessage.textContent = "E-mail ou senha incorretos.";
            loginMessage.className = "account-message error";
            return;
        }

        const session = {
            id: user.id,
            name: user.name,
            cpf: user.cpf,
            phone: user.phone,
            email: user.email
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));

        loginMessage.textContent = "Login realizado com sucesso!";
        loginMessage.className = "account-message success";

    setTimeout(() => {
    const redirectPage = localStorage.getItem("smartSalesRedirectAfterLogin");

    if (redirectPage) {
        localStorage.removeItem("smartSalesRedirectAfterLogin");
        window.location.href = redirectPage;
    } else {
        window.location.href = "index.html";
    }
}, 800);
});

    // Máscaras do cadastro
    const cpfInput = document.getElementById("registerCpf");
    const phoneInput = document.getElementById("registerPhone");

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
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
        }

        phoneInput.value = value;
    });
    
});
