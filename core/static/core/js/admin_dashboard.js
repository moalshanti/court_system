document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       ELEMENTS
    ====================================================== */
    const adminLayout      = document.getElementById("adminLayout");
    const sidebar          = document.getElementById("sidebar");
    const sidebarToggle    = document.getElementById("sidebarToggle");
    const mobileMenuBtn    = document.getElementById("mobileMenuBtn");
    const sidebarOverlay   = document.getElementById("sidebarOverlay");


    /* =====================================================
       SIDEBAR TOGGLE (Desktop — تصغير)
    ====================================================== */
    if (sidebarToggle && adminLayout) {

        /* استرجاع الحالة من localStorage */
        const collapsed = localStorage.getItem("qada_sidebar_collapsed") === "true";

        if (collapsed) {
            adminLayout.classList.add("sidebar-collapsed");
        }

        sidebarToggle.addEventListener("click", function () {

            adminLayout.classList.toggle("sidebar-collapsed");

            const isCollapsed = adminLayout.classList.contains("sidebar-collapsed");

            localStorage.setItem("qada_sidebar_collapsed", isCollapsed);

        });

    }


    /* =====================================================
       SIDEBAR TOGGLE (Mobile — Drawer)
    ====================================================== */
    function openMobileSidebar() {
        if (!sidebar || !sidebarOverlay) return;
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileSidebar() {
        if (!sidebar || !sidebarOverlay) return;
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", openMobileSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeMobileSidebar);
    }

    /* إغلاق بـ Escape */
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeMobileSidebar();
        }
    });


    /* =====================================================
       NAV ITEM — Active State
    ====================================================== */
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.addEventListener("click", function (e) {

            /* تجاهل لو الرابط # فقط */
            if (this.getAttribute("href") === "#") {
                e.preventDefault();
            }

            /* إزالة active من الكل */
            navItems.forEach(n => n.classList.remove("active"));

            /* إضافة active للعنصر الحالي */
            this.classList.add("active");

        });

    });


    /* =====================================================
       AUTO-CLOSE SIDEBAR على تغيير حجم الشاشة
    ====================================================== */
    let resizeTimer;
    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {

            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }

        }, 150);

    });


    /* =====================================================
       ACTIVE ITEM تلقائي حسب URL
    ====================================================== */
    const currentPath = window.location.pathname;

    navItems.forEach(function (item) {
        const href = item.getAttribute("href");
        if (href && href !== "#" && currentPath.includes(href)) {
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");
        }
    });

});