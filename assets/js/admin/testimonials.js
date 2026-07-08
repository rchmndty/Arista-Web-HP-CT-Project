/**
 * ARISTA Management Panel - Full CRUD Testimonial Engine (Sprint 16)
 * [STANDALONE MOCK STORAGE SYSTEM - NO FIREBASE]
 */

document.addEventListener("DOMContentLoaded", () => {
    initTestimonialCMS();
});

function initTestimonialCMS() {
    const grid = document.getElementById("testimonialCmsGrid");
    const modal = document.getElementById("testimonialModal");
    const form = document.getElementById("testimonialForm");
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const modalTitle = document.getElementById("modalTitle");
    
    const testiIdInput = document.getElementById("testiId");
    const testiNameInput = document.getElementById("testiName");
    const testiRoleInput = document.getElementById("testiRole");
    const testiMessageInput = document.getElementById("testiMessage");

    let localTestimonials = [];
    let isEditMode = false;

    // [READ] Load data dari localStorage
    function loadTestimonials() {
        const data = localStorage.getItem("arista_mock_testimonials");
        if (data) {
            localTestimonials = JSON.parse(data);
        } else {
            // Data default awal
            localTestimonials = [
                { 
                    id: "tst-1", 
                    name: "Rian", 
                    role: "Mahasiswa Kairatu", 
                    message: "Cetak skripsi di Arista rapi banget, cepat, dan harganya pas di kantong mahasiswa." 
                }
            ];
            saveTestimonials();
        }
        renderTestimonials();
    }

    function saveTestimonials() {
        localStorage.setItem("arista_mock_testimonials", JSON.stringify(localTestimonials));
    }

    // [READ] Render data ke susunan Grid HTML
    function renderTestimonials() {
        if (localTestimonials.length === 0) {
            grid.innerHTML = `<div class="loading-state-cms">Belum ada testimonial pelanggan.</div>`;
            return;
        }
        grid.innerHTML = "";
        localTestimonials.forEach(item => {
            const card = document.createElement("div");
            card.className = "cms-product-card-item";
            card.innerHTML = `
                <div class="cms-card-details">
                    <h4>${item.name}</h4>
                    <span class="cms-card-category-slug" style="display:block; margin-top:2px;">${item.role}</span>
                    <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 12px 0 16px 0; line-height: 1.5; font-style: italic;">
                        "${item.message}"
                    </p>
                    <div class="cms-card-actions-row">
                        <button class="btn-cms-action btn-edit" onclick="editTestimonial('${item.id}')">Ubah</button>
                        <button class="btn-cms-action btn-delete" onclick="deleteTestimonial('${item.id}')">Hapus</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Buka Modal (Akomodasi Tambah & Ubah)
    function openModal(mode = "add", id = null) {
        form.reset();
        testiIdInput.value = "";
        if (mode === "edit" && id) {
            isEditMode = true;
            modalTitle.textContent = "Ubah Ulasan Pelanggan";
            const current = localTestimonials.find(t => t.id === id);
            if (current) {
                testiIdInput.value = current.id;
                testiNameInput.value = current.name;
                testiRoleInput.value = current.role;
                testiMessageInput.value = current.message;
            }
        } else {
            isEditMode = false;
            modalTitle.textContent = "Tambah Testimonial Baru";
        }
        modal.classList.add("active");
    }

    function closeModal() { 
        modal.classList.remove("active"); 
    }

    openAddModalBtn.addEventListener("click", () => openModal("add"));
    closeModalBtn.addEventListener("click", closeModal);
    cancelModalBtn.addEventListener("click", closeModal);

    // [CREATE & UPDATE] Kirim Form Data
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const payload = {
            id: isEditMode ? testiIdInput.value : "tst-" + Date.now(),
            name: testiNameInput.value.trim(),
            role: testiRoleInput.value.trim(),
            message: testiMessageInput.value.trim()
        };

        if (isEditMode) {
            const idx = localTestimonials.findIndex(t => t.id === payload.id);
            if (idx !== -1) localTestimonials[idx] = payload;
        } else {
            localTestimonials.push(payload);
        }

        saveTestimonials();
        renderTestimonials();
        closeModal();
    });

    // Ekspos ke lingkup window agar terbaca onclick HTML
    window.editTestimonial = (id) => openModal("edit", id);
    
    // [DELETE] Hapus Testimonial
    window.deleteTestimonial = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus testimonial ini?")) {
            localTestimonials = localTestimonials.filter(t => t.id !== id);
            saveTestimonials();
            renderTestimonials();
        }
    };

    // Logout handler sync
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Keluar dari panel admin?")) {
                localStorage.setItem('logout_redirect_index', 'true');
                window.location.href = "../index.html";
            }
        });
    }

    loadTestimonials();
}
