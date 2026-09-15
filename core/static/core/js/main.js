document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       SIDEBAR
    ====================================================== */

    const sidebar = document.querySelector(".sidebar");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            openSidebar
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    /* =====================================================
       MENU ITEMS
    ====================================================== */

    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item"
        );


    menuItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                /*
                 * حالياً فقط Frontend.
                 * عندما نربط الصفحات بـ Django
                 * سنضع الروابط الحقيقية في href.
                 */

                menuItems.forEach(function (menu) {

                    menu.classList.remove(
                        "active"
                    );

                });


                this.classList.add("active");


                // إغلاق Sidebar على الموبايل
                if (
                    window.innerWidth <= 850
                ) {

                    closeSidebar();

                }

            }
        );

    });


    /* =====================================================
       NOTIFICATIONS
    ====================================================== */

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    const notificationBadge =
        document.getElementById(
            "notificationBadge"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Notifications clicked"
                );


                /*
                 * مؤقتاً نخفي رقم الإشعارات.
                 *
                 * لاحقاً عندما نربطه بـ Django
                 * سنعرض الإشعارات الحقيقية.
                 */

                if (notificationBadge) {

                    notificationBadge.style
                        .transform =
                        "scale(0)";

                }

            }
        );

    }


    /* =====================================================
       PROFILE
    ====================================================== */

    const profileButton =
        document.getElementById(
            "profileButton"
        );


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Profile clicked"
                );

                /*
                 * لاحقاً يمكن إضافة
                 * Profile Dropdown هنا.
                 */

            }
        );

    }


    /* =====================================================
       SEARCH
    ====================================================== */

    const searchInput =
        document.querySelector(
            ".search-input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const value =
                    this.value.trim();


                console.log(
                    "Search:",
                    value
                );

                /*
                 * حالياً لا يوجد بحث حقيقي.
                 *
                 * لاحقاً نربطه مع Django
                 * للبحث في القضايا والعملاء
                 * وغيرها.
                 */

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 850
            ) {

                closeSidebar();

            }

        }
    );


});