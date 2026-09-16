document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       ELEMENTS
    ====================================================== */
    const casesTable     = document.getElementById("casesTable");
    const tableBody      = document.getElementById("casesTableBody");
    const tableEmpty     = document.getElementById("tableEmpty");

    const searchInput    = document.getElementById("caseSearch");
    const searchClear    = document.getElementById("searchClear");
    const searchWrapper  = searchInput?.closest(".toolbar-search");

    const filterType     = document.getElementById("filterType");
    const filterStatus   = document.getElementById("filterStatus");
    const resetFilters   = document.getElementById("resetFilters");

    const selectAll      = document.getElementById("selectAll");

    const visibleCount   = document.getElementById("visibleCount");
    const totalCount     = document.getElementById("totalCount");

    const selectionBar   = document.getElementById("selectionBar");
    const selectedCount  = document.getElementById("selectedCount");
    const clearSelection = document.getElementById("clearSelection");
    const bulkDelete     = document.getElementById("bulkDelete");

    const deleteModal    = document.getElementById("deleteModal");
    const cancelDelete   = document.getElementById("cancelDelete");
    const confirmDelete  = document.getElementById("confirmDelete");


    /* =====================================================
       SEARCH
    ====================================================== */
    if (searchInput) {
        searchInput.addEventListener("input", function () {

            const value = this.value.trim();

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
       FILTERS
    ====================================================== */
    if (filterType)   filterType.addEventListener("change", filterTable);
    if (filterStatus) filterStatus.addEventListener("change", filterTable);

    if (resetFilters) {
        resetFilters.addEventListener("click", function () {

            if (searchInput) {
                searchInput.value = "";
                if (searchWrapper) searchWrapper.classList.remove("has-value");
            }

            if (filterType)   filterType.value = "";
            if (filterStatus) filterStatus.value = "";

            filterTable();

        });
    }


    /* =====================================================
       FILTER FUNCTION
    ====================================================== */
    function filterTable() {

        if (!tableBody) return;

        const searchValue = searchInput?.value.toLowerCase().trim() || "";
        const typeValue   = filterType?.value || "";
        const statusValue = filterStatus?.value || "";

        const rows = tableBody.querySelectorAll("tr[data-case-id]");

        let visibleRows = 0;

        rows.forEach(function (row) {

            const number = row.dataset.number?.toLowerCase() || "";
            const title  = row.dataset.title?.toLowerCase()  || "";

            const typeBadge   = row.querySelector(".badge.type");
            const statusBadge = row.querySelector(".badge.status");

            const type   = typeBadge?.classList[2]   || "";
            const status = statusBadge?.classList[2] || "";

            const matchSearch = !searchValue ||
                number.includes(searchValue) ||
                title.includes(searchValue);

            const matchType   = !typeValue   || type === typeValue;
            const matchStatus = !statusValue || status === statusValue;

            if (matchSearch && matchType && matchStatus) {
                row.style.display = "";
                visibleRows++;
            } else {
                row.style.display = "none";
            }

        });

        if (visibleCount) visibleCount.textContent = visibleRows;

        if (tableEmpty) {
            tableEmpty.style.display = visibleRows === 0 ? "flex" : "none";
        }

        updateSelectAllState();

    }


    /* =====================================================
       SELECT ALL
    ====================================================== */
    if (selectAll) {
        selectAll.addEventListener("change", function () {

            const rows = tableBody?.querySelectorAll("tr[data-case-id]");

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

    function updateSelectAllState() {

        if (!selectAll || !tableBody) return;

        const visibleRows = tableBody.querySelectorAll("tr[data-case-id]:not([style*='display: none'])");
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

            tableBody?.querySelectorAll(".row-check").forEach(cb => cb.checked = false);
            tableBody?.querySelectorAll("tr.selected").forEach(r => r.classList.remove("selected"));

            if (selectAll) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            }

            updateSelectionBar();

        });
    }


    /* =====================================================
       ROW ACTIONS
    ====================================================== */
    if (tableBody) {
        tableBody.addEventListener("click", function (e) {

            const btn = e.target.closest(".action-btn");
            if (!btn) return;

            const action = btn.dataset.action;
            const id     = btn.dataset.id;
            const row    = btn.closest("tr");
            const title  = row?.querySelector(".case-title-cell strong")?.textContent || "";

            if (action === "view")   handleView(id, title);
            if (action === "edit")   handleEdit(id, title);
            if (action === "delete") handleDelete(id, title);

        });
    }

    function handleView(id, title) {
        console.log("View case:", id, title);
    }

    function handleEdit(id, title) {
        console.log("Edit case:", id, title);
    }

    function handleDelete(id, title) {

        deleteModal.dataset.caseId = id;

        const textEl = deleteModal.querySelector("p");
        if (textEl) {
            textEl.innerHTML = `هل أنت متأكد من حذف القضية <strong>"${title}"</strong>؟<br>هذا الإجراء لا يمكن التراجع عنه.`;
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

            const caseId = deleteModal.dataset.caseId;
            console.log("Delete case:", caseId);

            const row = tableBody?.querySelector(`tr[data-case-id="${caseId}"]`);
            if (row) {
                row.style.transition = "opacity 0.3s, transform 0.3s";
                row.style.opacity = "0";
                row.style.transform = "translateX(-20px)";

                setTimeout(() => {
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

            const confirmed = confirm(`هل أنت متأكد من حذف ${checked.length} قضية؟`);
            if (!confirmed) return;

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
       UPDATE COUNTS
    ====================================================== */
    function updateTotalCount() {
        if (!totalCount || !tableBody) return;
        const count = tableBody.querySelectorAll("tr[data-case-id]").length;
        totalCount.textContent = count;
    }


    /* =====================================================
       SORTING
    ====================================================== */
    const sortableHeaders = casesTable?.querySelectorAll("th.sortable");

    sortableHeaders?.forEach(function (header) {

        header.addEventListener("click", function () {

            const sortKey = this.dataset.sort;
            const tbody = tableBody;
            if (!tbody) return;

            const rows = Array.from(tbody.querySelectorAll("tr[data-case-id]"));

            const currentDir = this.dataset.dir || "asc";
            const newDir = currentDir === "asc" ? "desc" : "asc";

            sortableHeaders.forEach(h => {
                h.dataset.dir = "";
                const icon = h.querySelector("i");
                if (icon) icon.className = "fa-solid fa-sort";
            });

            this.dataset.dir = newDir;
            const icon = this.querySelector("i");
            if (icon) {
                icon.className = newDir === "asc"
                    ? "fa-solid fa-sort-up"
                    : "fa-solid fa-sort-down";
            }

            rows.sort(function (a, b) {

                let aVal = a.dataset[sortKey] || "";
                let bVal = b.dataset[sortKey] || "";

                if (sortKey === "date") {
                    aVal = a.dataset.date || "";
                    bVal = b.dataset.date || "";
                }

                const cmp = aVal.toString().localeCompare(bVal.toString(), "ar");
                return newDir === "asc" ? cmp : -cmp;

            });

            rows.forEach(row => tbody.appendChild(row));

        });

    });


    /* =====================================================
       ADD CASE BUTTON
    ====================================================== */
    const addCaseBtn = document.getElementById("addCaseBtn");

    if (addCaseBtn) {
        addCaseBtn.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("Add new case");
        });
    }


    /* =====================================================
       INITIAL
    ====================================================== */
    updateTotalCount();

});