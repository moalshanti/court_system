document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =========================================
       COUNTRIES DATA
    ========================================== */
    const COUNTRIES = [
        { code: "PS", flag: "🇵🇸", dial: "+970", name: "فلسطين" },
        { code: "JO", flag: "🇯🇴", dial: "+962", name: "الأردن" },
        { code: "EG", flag: "🇪🇬", dial: "+20",  name: "مصر" },
        { code: "SA", flag: "🇸🇦", dial: "+966", name: "السعودية" },
        { code: "AE", flag: "🇦🇪", dial: "+971", name: "الإمارات" },
        { code: "QA", flag: "🇶🇦", dial: "+974", name: "قطر" },
        { code: "KW", flag: "🇰🇼", dial: "+965", name: "الكويت" },
        { code: "BH", flag: "🇧🇭", dial: "+973", name: "البحرين" },
        { code: "OM", flag: "🇴🇲", dial: "+968", name: "عمان" },
        { code: "TR", flag: "🇹🇷", dial: "+90",  name: "تركيا" },
        { code: "GB", flag: "🇬🇧", dial: "+44",  name: "بريطانيا" },
        { code: "US", flag: "🇺🇸", dial: "+1",   name: "أمريكا" },
        { code: "DE", flag: "🇩🇪", dial: "+49",  name: "ألمانيا" },
        { code: "FR", flag: "🇫🇷", dial: "+33",  name: "فرنسا" }
    ];

    const DEFAULT_COUNTRY = COUNTRIES[0];


    /* =========================================
       COUNTRY DROPDOWN
    ========================================== */
    const trigger      = document.getElementById("countryTrigger");
    const dropdown     = document.getElementById("countryDropdown");
    const selectedFlag = document.getElementById("selectedFlag");
    const selectedDial = document.getElementById("selectedDial");
    const hiddenSelect = document.getElementById("countryCodeHidden");
    const phoneWrapper = document.getElementById("phoneWrapper");

    let currentCountry = DEFAULT_COUNTRY;

    function buildDropdown() {

        if (!dropdown) return;

        dropdown.innerHTML = COUNTRIES.map(country => `
            <div class="country-option ${country.code === currentCountry.code ? "selected" : ""}"
                 data-code="${country.code}"
                 data-dial="${country.dial}"
                 data-flag="${country.flag}"
                 role="option">
                <span class="flag">${country.flag}</span>
                <span class="name">${country.name}</span>
                <span class="dial-code">${country.dial}</span>
            </div>
        `).join("");

    }

    function selectCountry(code, dial, flag) {

        currentCountry = { code, dial, flag };

        selectedFlag.textContent = flag;
        selectedDial.textContent = dial;

        if (hiddenSelect) {
            hiddenSelect.innerHTML = `<option value="${dial}" selected>${dial}</option>`;
        }

        dropdown.querySelectorAll(".country-option").forEach(opt => {
            opt.classList.toggle("selected", opt.dataset.code === code);
        });

        closeDropdown();

    }

    function openDropdown() {
        dropdown.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
    }

    function closeDropdown() {
        dropdown.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
    }

    if (trigger && dropdown && phoneWrapper) {

        buildDropdown();

        trigger.addEventListener("click", function (e) {
            e.stopPropagation();

            if (dropdown.classList.contains("open")) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        dropdown.addEventListener("click", function (e) {

            const option = e.target.closest(".country-option");
            if (!option) return;

            selectCountry(
                option.dataset.code,
                option.dataset.dial,
                option.dataset.flag
            );

        });

        document.addEventListener("click", function (e) {
            if (!phoneWrapper.contains(e.target)) {
                closeDropdown();
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeDropdown();
            }
        });

    }


    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================== */
    document.querySelectorAll(".password-toggle").forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = this.dataset.target;
            const input    = document.getElementById(targetId);
            const icon     = this.querySelector("i");

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


    /* =========================================
       PASSWORD STRENGTH
    ========================================== */
    const password     = document.getElementById("password");
    const strengthText = document.getElementById("passwordStrengthText");
    const strengthBars = document.querySelectorAll(".strength-bar span");

    const STRENGTH_CONFIG = [
        { color: "rgba(239, 95, 115, 0.9)",  label: "ضعيفة"  },
        { color: "rgba(255, 181, 71, 0.9)",  label: "متوسطة" },
        { color: "rgba(118, 104, 232, 0.9)", label: "جيدة"   },
        { color: "rgba(67, 209, 154, 0.9)",  label: "قوية"   }
    ];

    function calculateStrength(value) {

        if (!value) return 0;

        let score = 0;

        if (value.length >= 8)          score++;
        if (/[A-Z]/.test(value))        score++;
        if (/[0-9]/.test(value))        score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        if (value.length >= 12 && score < 4) score++;

        return Math.min(score, 4);

    }

    function updateStrengthUI(strength) {

        strengthBars.forEach((bar, index) => {
            bar.style.background = index < strength
                ? STRENGTH_CONFIG[strength - 1].color
                : "rgba(255, 255, 255, 0.08)";
        });

        if (!strengthText) return;

        if (strength === 0) {
            strengthText.textContent = "قوة كلمة المرور";
            strengthText.style.color = "";
            return;
        }

        const config = STRENGTH_CONFIG[strength - 1];
        strengthText.textContent = config.label;
        strengthText.style.color = config.color;

    }

    if (password) {
        password.addEventListener("input", function () {
            updateStrengthUI(calculateStrength(this.value));
        });
    }


    /* =========================================
       CONFIRM PASSWORD
    ========================================== */
    const confirmPassword = document.getElementById("confirm_password");

    if (password && confirmPassword) {

        confirmPassword.addEventListener("input", function () {

            if (!this.value) {
                this.style.borderColor = "";
                return;
            }

            const matches = password.value === this.value;

            this.style.borderColor = matches
                ? "rgba(67, 209, 154, 0.55)"
                : "rgba(239, 95, 115, 0.6)";

        });

    }


    /* =========================================
       PHONE (digits only)
    ========================================== */
    const phone = document.getElementById("phone");

    if (phone) {
        phone.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, 15);
        });
    }


    /* =========================================
       INTERACTIVE STEP INDICATOR
    ========================================== */
    const stepsIndicator = document.getElementById("stepsIndicator");

    if (stepsIndicator) {

        const stepEls    = stepsIndicator.querySelectorAll(".step");
        const dividerEls = stepsIndicator.querySelectorAll(".step-divider");
        const stepInputs = document.querySelectorAll("[data-step]");

        const STEP_FIELDS = {
            1: ["full_name", "username", "email", "phone"],
            2: ["password", "confirm_password"],
            3: ["terms"]
        };

        function isStepComplete(stepNumber) {

            const fieldIds = STEP_FIELDS[stepNumber];
            if (!fieldIds) return false;

            return fieldIds.every(id => {

                const field = document.getElementById(id);
                if (!field) return false;

                if (field.type === "checkbox") {
                    return field.checked;
                }

                if (id === "confirm_password") {
                    const pw = document.getElementById("password");
                    return field.value.length >= 6 && pw && pw.value === field.value;
                }

                if (id === "password") {
                    return field.value.length >= 6;
                }

                if (id === "phone") {
                    return field.value.replace(/\D/g, "").length >= 7;
                }

                if (id === "email") {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                }

                return field.value.trim().length > 0;

            });

        }

        function updateStepsUI() {

            let currentActive = 1;

            stepEls.forEach((stepEl, index) => {

                const stepNum = index + 1;
                const isComplete = isStepComplete(stepNum);

                stepEl.classList.remove("active", "completed");

                if (isComplete) {
                    stepEl.classList.add("completed");

                    const nextDivider = stepsIndicator.querySelector(
                        `[data-divider="${stepNum}"]`
                    );
                    if (nextDivider) nextDivider.classList.add("filled");
                } else {
                    if (stepNum === currentActive ||
                        (stepNum < currentActive && !isComplete)) {
                        stepEl.classList.add("active");
                    }
                }

                if (!isComplete && stepNum >= currentActive) {
                    stepEl.classList.add("active");
                    currentActive = stepNum + 1;
                }

            });

            dividerEls.forEach((div, index) => {
                const stepAfterDivider = index + 1;
                if (!isStepComplete(stepAfterDivider)) {
                    div.classList.remove("filled");
                }
            });

        }

        stepInputs.forEach(input => {

            const eventType = input.type === "checkbox" ? "change" : "input";

            input.addEventListener(eventType, updateStepsUI);

        });

        updateStepsUI();

    }


    /* =========================================
       FORM SUBMIT
    ========================================== */
    const form   = document.querySelector(".register-form");
    const button = document.querySelector(".register-button");

    if (form) {

        form.addEventListener("submit", function (event) {

            if (password && confirmPassword && password.value !== confirmPassword.value) {
                event.preventDefault();
                alert("كلمتا المرور غير متطابقتين.");
                confirmPassword.focus();
                return;
            }

            if (button) {

                button.disabled = true;
                const originalHTML = button.innerHTML;

                button.innerHTML = `
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>جارٍ إنشاء الحساب...</span>
                `;

                setTimeout(() => {
                    if (button.disabled) {
                        button.disabled = false;
                        button.innerHTML = originalHTML;
                    }
                }, 10000);

            }

        });

    }

});