document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       PASSWORD VISIBILITY
    ====================================================== */

    const passwordInput =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");


    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            function () {

                const icon =
                    passwordToggle.querySelector("i");


                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    icon.classList.remove(
                        "fa-eye"
                    );

                    icon.classList.add(
                        "fa-eye-slash"
                    );

                    passwordToggle.setAttribute(
                        "aria-label",
                        "إخفاء كلمة المرور"
                    );

                } else {

                    passwordInput.type = "password";

                    icon.classList.remove(
                        "fa-eye-slash"
                    );

                    icon.classList.add(
                        "fa-eye"
                    );

                    passwordToggle.setAttribute(
                        "aria-label",
                        "إظهار كلمة المرور"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGIN FORM
    ====================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const loginButton =
        document.getElementById("loginButton");


    if (loginForm && loginButton) {

        loginForm.addEventListener(
            "submit",
            function () {

                /*
                 * لا نمنع الإرسال.
                 *
                 * Django سيستقبل الـ POST بشكل طبيعي.
                 */

                loginButton.classList.add(
                    "loading"
                );

            }
        );

    }


    /* =====================================================
       INPUT ANIMATION
    ====================================================== */

    const inputs =
        document.querySelectorAll(
            ".input-wrapper input"
        );


    inputs.forEach(function (input) {

        input.addEventListener(
            "focus",
            function () {

                this
                    .closest(".input-wrapper")
                    .classList.add("focused");

            }
        );


        input.addEventListener(
            "blur",
            function () {

                this
                    .closest(".input-wrapper")
                    .classList.remove("focused");

            }
        );

    });


    /* =====================================================
       REMEMBER CHECKBOX
    ====================================================== */

    const remember =
        document.querySelector(
            ".remember input"
        );


    if (remember) {

        remember.addEventListener(
            "change",
            function () {

                console.log(
                    "Remember me:",
                    this.checked
                );

            }
        );

    }


});