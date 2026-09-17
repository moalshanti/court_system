document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const clientsList    = document.getElementById("clientsList");
    const tableEmpty     = document.getElementById("tableEmpty");

    const searchInput    = document.getElementById("clientSearch");
    const searchClear    = document.getElementById("searchClear");
    const searchWrapper  = searchInput?.closest(".toolbar-search");

    const filterCaseType = document.getElementById("filterCaseType");
    const resetFilters   = document.getElementById("resetFilters");

    const visibleCount   = document.getElementById("visibleCount");
    const totalCount     = document.getElementById("totalCount");

    const deleteModal    = document.getElementById("deleteModal");
    const cancelDelete   = document.getElementById("cancelDelete");
    const confirmDelete  = document.getElementById("confirmDelete");

    const getRecords = () => clientsList?.querySelectorAll(".case-record") || [];


    /* =========================================
       SEARCH
    ========================================= */
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const value = this.value.trim();
            if (searchWrapper) {
                searchWrapper.classList.toggle("has-value", value.length > 0);
            }
            filterRecords();
        });
    }

    if (searchClear) {
        searchClear.addEventListener("click", function () {
            searchInput.value = "";
            searchInput.focus();
            if (searchWrapper) searchWrapper.classList.remove("has-value");
            filterRecords();
        });
    }


    /* =========================================
       FILTERS
    ========================================= */
    if (filterCaseType) filterCaseType.addEventListener("change", filterRecords);

    if (resetFilters) {
        resetFilters.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
                if (searchWrapper) searchWrapper.classList.remove("has-value");
            }
            if (filterCaseType) filterCaseType.value = "";
            filterRecords();
        });
    }


    /* =========================================
       FILTER FUNCTION
    ========================================= */
    function filterRecords() {

        const searchValue = searchInput?.value.toLowerCase().trim() || "";
        const typeValue   = filterCaseType?.value || "";

        let visible = 0;

        getRecords().forEach(function (record) {

            const text = record.textContent.toLowerCase();
            const badge = record.querySelector(".case-type-badge span");
            const type = badge?.textContent.trim() || "";

            const matchSearch = !searchValue || text.includes(searchValue);
            const matchType   = !typeValue || type.includes(typeValue);

            if (matchSearch && matchType) {
                record.style.display = "";
                visible++;
            } else {
                record.style.display = "none";
            }
        });

        if (visibleCount) visibleCount.textContent = visible;
        if (totalCount)   totalCount.textContent   = getRecords().length;

        if (tableEmpty) {
            tableEmpty.style.display = visible === 0 ? "flex" : "none";
        }
    }


    /* =========================================
       ROW ACTIONS
    ========================================= */
    if (clientsList) {
        clientsList.addEventListener("click", function (e) {

            const btn = e.target.closest(".action-btn");
            if (!btn) return;

            const action = btn.dataset.action;
            const id     = btn.dataset.id;

            if (action === "view")   console.log("View:", id);
            if (action === "edit")   console.log("Edit:", id);
            if (action === "delete") openDeleteModal(id);
        });
    }

    function openDeleteModal(id) {
        deleteModal.dataset.recordId = id;
        deleteModal.classList.add("show");
    }

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

            const id = deleteModal.dataset.recordId;
            const record = clientsList?.querySelector(`.case-record[data-case-id="${id}"]`);

            if (record) {
                record.style.transition = "opacity 0.3s, transform 0.3s";
                record.style.opacity = "0";
                record.style.transform = "scale(0.9)";

                setTimeout(() => {
                    record.remove();
                    if (totalCount)   totalCount.textContent   = getRecords().length;
                    if (visibleCount) visibleCount.textContent = getRecords().length;
                }, 300);
            }

            deleteModal.classList.remove("show");
        });
    }


    /* =========================================
       INITIAL
    ========================================= */
    if (totalCount)   totalCount.textContent   = getRecords().length;
    if (visibleCount) visibleCount.textContent = getRecords().length;

});