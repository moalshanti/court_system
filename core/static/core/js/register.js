document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    const passwordButtons =
        document.querySelectorAll(".password-toggle");

    passwordButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId =
                this.dataset.target;

            const input =
                document.getElementById(targetId);

            const icon =
                this.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove(
                    "fa-eye"
                );

                icon.classList.add(
                    "fa-eye-slash"
                );

            } else {

                input.type = "password";

                icon.classList.remove(
                    "fa-eye-slash"
                );

                icon.classList.add(
                    "fa-eye"
                );
            }

        });

    });


    /* =========================================
       PASSWORD STRENGTH
    ========================================== */

    const password =
        document.getElementById("password");

    const strengthText =
        document.getElementById("strengthText");

    const strengthBars =
        document.querySelectorAll(
            ".strength-bar span"
        );


    if (password) {

        password.addEventListener("input", function () {

            const value = this.value;

            let strength = 0;

            if (value.length >= 8)
                strength++;

            if (/[A-Z]/.test(value))
                strength++;

            if (/[0-9]/.test(value))
                strength++;

            if (/[^A-Za-z0-9]/.test(value))
                strength++;


            strengthBars.forEach(function (bar, index) {

                if (index < strength) {

                    bar.style.background =
                        "linear-gradient(90deg, #7768e8, #dc3e86)";

                } else {

                    bar.style.background =
                        "rgba(255,255,255,.08)";
                }

            });


            if (value.length === 0) {

                strengthText.textContent =
                    "قوة كلمة المرور";

            } else if (strength <= 1) {

                strengthText.textContent =
                    "ضعيفة";

            } else if (strength === 2) {

                strengthText.textContent =
                    "متوسطة";

            } else if (strength === 3) {

                strengthText.textContent =
                    "جيدة";

            } else {

                strengthText.textContent =
                    "قوية";
            }

        });

    }


    /* =========================================
       CONFIRM PASSWORD
    ========================================== */

    const confirmPassword =
        document.getElementById(
            "confirm_password"
        );


    if (confirmPassword) {

        confirmPassword.addEventListener(
            "input",
            function () {

                if (
                    password.value !==
                    confirmPassword.value
                ) {

                    confirmPassword.style
                        .borderColor =
                        "rgba(239,95,115,.6)";

                } else {

                    confirmPassword.style
                        .borderColor =
                        "rgba(67,209,154,.5)";
                }

            }
        );

    }


    /* =========================================
       FORM
    ========================================== */

    const form =
        document.getElementById(
            "registerForm"
        );

    const button =
        document.getElementById(
            "registerButton"
        );


    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                if (
                    password.value !==
                    confirmPassword.value
                ) {

                    event.preventDefault();

                    alert(
                        "كلمتا المرور غير متطابقتين."
                    );

                    return;
                }


                if (button) {

                    button.classList.add(
                        "loading"
                    );

                }

            }
        );

    }

});