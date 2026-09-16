document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       PASSWORD VISIBILITY
    ====================================================== */
    document.querySelectorAll(".password-toggle").forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = this.dataset.target;
            const input    = targetId
                ? document.getElementById(targetId)
                : document.getElementById("password");

            const icon = this.querySelector("i");

            if (!input || !icon) return;

            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";

            icon.classList.toggle("fa-eye",       !isPassword);
            icon.classList.toggle("fa-eye-slash",  isPassword);

            this.setAttribute(
                "aria-label",
                isPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            );

        });

    });


    /* =====================================================
       LOGIN FORM — Loading + Validation
    ====================================================== */
    const loginForm   = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");

    if (loginForm && loginButton) {

        loginForm.addEventListener("submit", function (event) {

            const username = document.getElementById("username");
            const password = document.getElementById("password");

            if (username && !username.value.trim()) {
                event.preventDefault();
                username.focus();
                username.closest(".input-wrapper").style.borderColor = "rgba(239, 95, 115, 0.6)";
                setTimeout(() => {
                    username.closest(".input-wrapper").style.borderColor = "";
                }, 1500);
                return;
            }

            if (password && !password.value) {
                event.preventDefault();
                password.focus();
                password.closest(".input-wrapper").style.borderColor = "rgba(239, 95, 115, 0.6)";
                setTimeout(() => {
                    password.closest(".input-wrapper").style.borderColor = "";
                }, 1500);
                return;
            }

            loginButton.classList.add("loading");
            loginButton.disabled = true;

            setTimeout(function () {
                if (loginButton.disabled) {
                    loginButton.disabled = false;
                    loginButton.classList.remove("loading");
                }
            }, 10000);

        });

    }


    /* =====================================================
       INPUT FOCUS EFFECT
    ====================================================== */
    document.querySelectorAll(".input-wrapper input").forEach(function (input) {

        input.addEventListener("focus", function () {
            this.closest(".input-wrapper").classList.add("focused");
        });

        input.addEventListener("blur", function () {
            this.closest(".input-wrapper").classList.remove("focused");
        });

    });


    /* =====================================================
       REMEMBER ME — localStorage
    ====================================================== */
    const remember      = document.querySelector(".remember input");
    const usernameField = document.getElementById("username");

    if (remember && usernameField) {

        const savedUsername = localStorage.getItem("qada_remember_username");
        if (savedUsername) {
            usernameField.value = savedUsername;
            remember.checked = true;
        }

        remember.addEventListener("change", function () {
            if (this.checked && usernameField.value.trim()) {
                localStorage.setItem("qada_remember_username", usernameField.value.trim());
            } else if (!this.checked) {
                localStorage.removeItem("qada_remember_username");
            }
        });

        usernameField.addEventListener("input", function () {
            if (remember.checked) {
                localStorage.setItem("qada_remember_username", this.value.trim());
            }
        });

    }


    /* =====================================================
       FORGOT PASSWORD
    ====================================================== */
    const forgotLink = document.querySelector(".forgot");

    if (forgotLink && forgotLink.getAttribute("href") === "#") {
        forgotLink.addEventListener("click", function (e) {
            e.preventDefault();
            alert("يرجى التواصل مع مدير النظام لإعادة تعيين كلمة المرور.");
        });
    }


    /* =====================================================
       KEYBOARD SHORTCUTS
    ====================================================== */
    document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            if (loginForm) loginForm.requestSubmit();
        }
    });

});