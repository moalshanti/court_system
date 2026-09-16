document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       ELEMENTS
    ====================================================== */
    const usersTable    = document.getElementById("usersTable");
    const tableBody     = document.getElementById("usersTableBody");
    const tableEmpty    = document.getElementById("tableEmpty");

    const searchInput   = document.getElementById("userSearch");
    const searchClear   = document.getElementById("searchClear");
    const searchWrapper = searchInput?.closest(".toolbar-search");

    const filterRole    = document.getElementById("filterRole");
    const filterStatus  = document.getElementById("filterStatus");
    const resetFilters  = document.getElementById("resetFilters");

    const selectAll     = document.getElementById("selectAll");

    const visibleCount  = document.getElementById("visibleCount");
    const totalCount    = document.getElementById("totalCount");

    const selectionBar  = document.getElementById("selectionBar");
    const selectedCount = document.getElementById("selectedCount");
    const clearSelection = document.getElementById("clearSelection");
    const bulkDelete    = document.getElementById("bulkDelete");

    const deleteModal   = document.getElementById("deleteModal");
    const cancelDelete  = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");

    /* =====================================================
       SEARCH
    ====================================================== */
    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const value = this.value.trim();

            /* Show/Hide clear button */
            if (searchWrapper) {
                searchWrapper.classList.toggle("has-value", value.length > 0);
            }

            filterTable();

        });

    }

    if (searchClear) {
        searchClear.addEventListener("click", function () {
            searchInput.value = "";
            searchInput.focus();
            if (searchWrapper) searchWrapper.classList.remove("has-value");
            filterTable();
        });
    }

    /* =====================================================
       FILTER
    ====================================================== */
    if (filterRole)   filterRole.addEventListener("change", filterTable);
    if (filterStatus) filterStatus.addEventListener("change", filterTable);

    if (resetFilters) {
        resetFilters.addEventListener("click", function () {

            if (searchInput) {
                searchInput.value = "";
                if (searchWrapper) searchWrapper.classList.remove("has-value");
            }

            if (filterRole)   filterRole.value = "";
            if (filterStatus) filterStatus.value = "";

            filterTable();

        });
    }

    /* =====================================================
       FILTER TABLE FUNCTION
    ====================================================== */
    function filterTable() {

        if (!tableBody) return;

        const searchValue = searchInput?.value.toLowerCase().trim() || "";
        const roleValue   = filterRole?.value || "";
        const statusValue = filterStatus?.value || "";

        const rows = tableBody.querySelectorAll("tr:not(.empty-row)");

        let visibleRows = 0;

        rows.forEach(function (row) {

            const name  = row.dataset.name?.toLowerCase()  || "";
            const email = row.dataset.email?.toLowerCase() || "";

            const roleBadge   = row.querySelector(".badge.role");
            const statusBadge = row.querySelector(".badge.status");

            const role   = roleBadge?.classList[2] || "";
            const status = statusBadge?.classList[2] || "";

            const matchSearch = !searchValue ||
                name.includes(searchValue) ||
                email.includes(searchValue);

            const matchRole   = !roleValue || role === roleValue;
            const matchStatus = !statusValue || status === statusValue;

            if (matchSearch && matchRole && matchStatus) {
                row.style.display = "";
                visibleRows++;
            } else {
                row.style.display = "none";
            }

        });

        /* Update counts */
        if (visibleCount) visibleCount.textContent = visibleRows;

        /* Show empty state */
        if (tableEmpty) {
            tableEmpty.style.display = visibleRows === 0 ? "flex" : "none";
        }

        /* Update select-all state */
        updateSelectAllState();

    }

    /* =====================================================
       SELECT ALL
    ====================================================== */
    if (selectAll) {
        selectAll.addEventListener("change", function () {

            const rows = tableBody?.querySelectorAll("tr:not(.empty-row)");

            rows?.forEach(function (row) {

                if (row.style.display === "none") return;

                const checkbox = row.querySelector(".row-check");
                if (!checkbox) return;

                checkbox.checked = this.checked;
                row.classList.toggle("selected", this.checked);

            });

            updateSelectionBar();

        });
    }

    /* =====================================================
       INDIVIDUAL SELECTION
    ====================================================== */
    if (tableBody) {
        tableBody.addEventListener("change", function (e) {

            if (e.target.classList.contains("row-check")) {

                const row = e.target.closest("tr");
                if (!row) return;

                row.classList.toggle("selected", e.target.checked);

                updateSelectAllState();
                updateSelectionBar();

            }

        });
    }

    /* =====================================================
       UPDATE SELECT ALL STATE
    ====================================================== */
    function updateSelectAllState() {

        if (!selectAll || !tableBody) return;

        const visibleRows = tableBody.querySelectorAll("tr:not(.empty-row):not([style*='display: none'])");
        const checkedRows = tableBody.querySelectorAll(".row-check:checked");

        if (visibleRows.length === 0) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
            return;
        }

        selectAll.checked = checkedRows.length === visibleRows.length;
        selectAll.indeterminate = checkedRows.length > 0 && checkedRows.length < visibleRows.length;

    }

    /* =====================================================
       SELECTION BAR
    ====================================================== */
    function updateSelectionBar() {

        if (!selectionBar || !tableBody) return;

        const checked = tableBody.querySelectorAll(".row-check:checked").length;

        if (selectedCount) selectedCount.textContent = checked;

        selectionBar.classList.toggle("show", checked > 0);

    }

    if (clearSelection) {
        clearSelection.addEventListener("click", function () {

            tableBody?.querySelectorAll(".row-check").forEach(function (cb) {
                cb.checked = false;
            });

            tableBody?.querySelectorAll("tr.selected").forEach(function (row) {
                row.classList.remove("selected");
            });

            if (selectAll) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            }

            updateSelectionBar();

        });
    }

    /* =====================================================
       ROW ACTIONS (View / Edit / Delete)
    ====================================================== */
    if (tableBody) {
        tableBody.addEventListener("click", function (e) {

            const btn = e.target.closest(".action-btn");
            if (!btn) return;

            const action = btn.dataset.action;
            const id     = btn.dataset.id;
            const row    = btn.closest("tr");
            const name   = row?.querySelector(".user-details strong")?.textContent || "";

            if (action === "view") {
                handleView(id, name);
            }

            if (action === "edit") {
                handleEdit(id, name);
            }

            if (action === "delete") {
                handleDelete(id, name, row);
            }

        });
    }

    function handleView(id, name) {
        console.log("View user:", id, name);
        // TODO: افتح Modal أو انتقل لصفحة العرض
        // window.location.href = `/users/${id}/`;
    }

    function handleEdit(id, name) {
        console.log("Edit user:", id, name);
        // TODO: افتح صفحة التعديل
        // window.location.href = `/users/${id}/edit/`;
    }

    function handleDelete(id, name, row) {

        /* احفظ معلومات الحذف */
        deleteModal.dataset.userId = id;
        deleteModal.dataset.userName = name;
        deleteModal.dataset.rowRef = "current";

        /* اعرض اسم المستخدم في النص */
        const textEl = deleteModal.querySelector("p");
        if (textEl) {
            textEl.innerHTML = `هل أنت متأكد من حذف المستخدم <strong>"${name}"</strong>؟<br>هذا الإجراء لا يمكن التراجع عنه.`;
        }

        deleteModal.classList.add("show");

    }

    /* =====================================================
       DELETE MODAL
    ====================================================== */
    if (cancelDelete) {
        cancelDelete.addEventListener("click", function () {
            deleteModal.classList.remove("show");
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener("click", function (e) {
            if (e.target === deleteModal) {
                deleteModal.classList.remove("show");
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && deleteModal?.classList.contains("show")) {
            deleteModal.classList.remove("show");
        }
    });

    if (confirmDelete) {
        confirmDelete.addEventListener("click", function () {

            const userId = deleteModal.dataset.userId;
            console.log("Delete user:", userId);

            /* TODO: أرسل طلب الحذف للسيرفر
            fetch(`/users/${userId}/delete/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            }).then(...)
            */

            /* مؤقتاً — احذف الصف مباشرة */
            const row = tableBody?.querySelector(`tr[data-user-id="${userId}"]`);
            if (row) {
                row.style.transition = "opacity 0.3s, transform 0.3s";
                row.style.opacity = "0";
                row.style.transform = "translateX(-20px)";

                setTimeout(function () {
                    row.remove();
                    updateTotalCount();
                    filterTable();
                }, 300);
            }

            deleteModal.classList.remove("show");

        });
    }

    /* =====================================================
       BULK DELETE
    ====================================================== */
    if (bulkDelete) {
        bulkDelete.addEventListener("click", function () {

            const checked = tableBody?.querySelectorAll(".row-check:checked");

            if (!checked || checked.length === 0) return;

            const confirmed = confirm(`هل أنت متأكد من حذف ${checked.length} مستخدم؟`);
            if (!confirmed) return;

            console.log("Bulk delete:", checked.length, "users");

            /* TODO: أرسل الطلب للسيرفر */

            checked.forEach(function (cb) {
                const row = cb.closest("tr");
                if (row) {
                    row.style.transition = "opacity 0.3s";
                    row.style.opacity = "0";
                    setTimeout(() => row.remove(), 300);
                }
            });

            setTimeout(function () {
                updateTotalCount();
                updateSelectionBar();
                filterTable();
            }, 350);

        });
    }

    /* =====================================================
       UPDATE TOTAL COUNT
    ====================================================== */
    function updateTotalCount() {

        if (!totalCount || !tableBody) return;

        const count = tableBody.querySelectorAll("tr:not(.empty-row)").length;
        totalCount.textContent = count;

    }

    /* =====================================================
       SORTING
    ====================================================== */
    const sortableHeaders = usersTable?.querySelectorAll("th.sortable");

    sortableHeaders?.forEach(function (header) {

        header.addEventListener("click", function () {

            const sortKey = this.dataset.sort;
            const tbody = tableBody;
            if (!tbody) return;

            const rows = Array.from(tbody.querySelectorAll("tr:not(.empty-row)"));

            const currentDir = this.dataset.dir || "asc";
            const newDir = currentDir === "asc" ? "desc" : "asc";

            /* Reset all headers */
            sortableHeaders.forEach(h => {
                h.dataset.dir = "";
                const icon = h.querySelector("i");
                if (icon) icon.className = "fa-solid fa-sort";
            });

            /* Set current */
            this.dataset.dir = newDir;
            const icon = this.querySelector("i");
            if (icon) {
                icon.className = newDir === "asc"
                    ? "fa-solid fa-sort-up"
                    : "fa-solid fa-sort-down";
            }

            /* Sort */
            rows.sort(function (a, b) {

                let aVal = a.dataset[sortKey.replace("_", "")] || "";
                let bVal = b.dataset[sortKey.replace("_", "")] || "";

                if (sortKey === "name") {
                    aVal = a.dataset.name || "";
                    bVal = b.dataset.name || "";
                }

                if (sortKey === "email") {
                    aVal = a.dataset.email || "";
                    bVal = b.dataset.email || "";
                }

                if (sortKey === "last_login") {
                    aVal = a.dataset.lastLogin || "";
                    bVal = b.dataset.lastLogin || "";
                }

                const cmp = aVal.toString().localeCompare(bVal.toString(), "ar");
                return newDir === "asc" ? cmp : -cmp;

            });

            /* Re-append */
            rows.forEach(row => tbody.appendChild(row));

        });

    });

    /* =====================================================
       ADD USER BUTTON
    ====================================================== */
    const addUserBtn = document.getElementById("addUserBtn");

    if (addUserBtn) {
        addUserBtn.addEventListener("click", function () {
            console.log("Add new user");
            // TODO: افتح Modal أو انتقل لصفحة الإضافة
            // window.location.href = "/users/add/";
        });
    }

    /* =====================================================
       GET CSRF TOKEN (للطلبات)
    ====================================================== */
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    /* =====================================================
       INITIAL
    ====================================================== */
    updateTotalCount();

});