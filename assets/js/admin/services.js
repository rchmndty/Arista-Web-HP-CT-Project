/**
 * ARISTA Management Panel - Services Engine (Sprint 16)
 * [STANDALONE MOCK STORAGE SYSTEM - NO FIREBASE]
 */

document.addEventListener("DOMContentLoaded", () => {
    initServicesCMS();
});

function initServicesCMS() {
    const servicesGrid = document.getElementById("servicesCmsGrid");
    const serviceModal = document.getElementById("serviceModal");
    const serviceForm = document.getElementById("serviceForm");
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const modalTitle = document.getElementById("modalTitle");
    
    const serviceIdInput = document.getElementById("serviceId");
    const serviceNameInput = document.getElementById("serviceName");
    const serviceIconInput = document.getElementById("serviceIcon");
    const serviceDescInput = document.getElementById("serviceDesc");

    let localServices = [];
    let isEditMode = false;

    function loadServices() {
        const data = localStorage.getItem("arista_mock_services");
        if (data) {
            localServices = JSON.parse(data);
        } else {
            localServices = [
                { id: "srv-1", name: "Cetak Kilat Doc", icon: "zap", desc: "Layanan cetak dokumen tanpa antre langsung selesai dalam hitungan menit." }
            ];
            saveServices();
        }
        renderServices();
    }

    function saveServices() {
        localStorage.setItem("arista_mock_services", JSON.stringify(localServices));
    }

    function renderServices() {
        if (localServices.length === 0) {
            servicesGrid.innerHTML = `<div class="loading-state-cms">Belum ada layanan terdaftar.</div>`;
            return;
        }
        servicesGrid.innerHTML = "";
        localServices.forEach(srv => {
            const card = document.createElement("div");
            card.className = "cms-product-card-item"; // Reuse layout style box produk
            card.innerHTML = `
                <div class="cms-card-details">
                    <span class="cms-card-category-slug">[Icon: ${srv.icon}]</span>
                    <h4 style="margin-top: 8px;">${srv.name}</h4>
                    <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 16px;">${srv.desc}</p>
                    <div class="cms-card-actions-row">
                        <button class="btn-cms-action btn-edit" onclick="editService('${srv.id}')">Ubah</button>
                        <button class="btn-cms-action btn-delete" onclick="deleteService('${srv.id}')">Hapus</button>
                    </div>
                </div>
            `;
            servicesGrid.appendChild(card);
        });
    }

    function openModal(mode = "add", id = null) {
        serviceForm.reset();
        serviceIdInput.value = "";
        if (mode === "edit" && id) {
            isEditMode = true;
            modalTitle.textContent = "Modifikasi Data Layanan";
            const current = localServices.find(s => s.id === id);
            if (current) {
                serviceIdInput.value = current.id;
                serviceNameInput.value = current.name;
                serviceIconInput.value = current.icon;
                serviceDescInput.value = current.desc;
            }
        } else {
            isEditMode = false;
            modalTitle.textContent = "Tambah Layanan Baru";
        }
        serviceModal.classList.add("active");
    }

    function closeModal() { serviceModal.classList.remove("active"); }

    openAddModalBtn.addEventListener("click", () => openModal("add"));
    closeModalBtn.addEventListener("click", closeModal);
    cancelModalBtn.addEventListener("click", closeModal);

    serviceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const payload = {
            id: isEditMode ? serviceIdInput.value : "srv-" + Date.now(),
            name: serviceNameInput.value.trim(),
            icon: serviceIconInput.value.trim(),
            desc: serviceDescInput.value.trim()
        };

        if (isEditMode) {
            const idx = localServices.findIndex(s => s.id === payload.id);
            if (idx !== -1) localServices[idx] = payload;
        } else {
            localServices.push(payload);
        }

        saveServices();
        renderServices();
        closeModal();
    });

    window.editService = (id) => openModal("edit", id);
    window.deleteService = (id) => {
        if (confirm("Hapus layanan ini?")) {
            localServices = localServices.filter(s => s.id !== id);
            saveServices();
            renderServices();
        }
    };

    // Logout system fallback sync
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Keluar dari panel?")) {
                localStorage.setItem('logout_redirect_index', 'true');
                window.location.href = "../index.html";
            }
        });
    }

    loadServices();
}
