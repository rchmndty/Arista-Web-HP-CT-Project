/**
 * ARISTA Management Panel - FAQ Engine (Sprint 16)
 * [STANDALONE MOCK STORAGE SYSTEM - NO FIREBASE]
 */

document.addEventListener("DOMContentLoaded", () => {
    initFaqCMS();
});

function initFaqCMS() {
    const faqGrid = document.getElementById("faqCmsGrid");
    const faqModal = document.getElementById("faqModal");
    const faqForm = document.getElementById("faqForm");
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const modalTitle = document.getElementById("modalTitle");
    
    const faqIdInput = document.getElementById("faqId");
    const faqQuestionInput = document.getElementById("faqQuestion");
    const faqAnswerInput = document.getElementById("faqAnswer");

    let localFaqs = [];
    let isEditMode = false;

    // Load data dari localStorage
    function loadFaqs() {
        const data = localStorage.getItem("arista_mock_faqs");
        if (data) {
            localFaqs = JSON.parse(data);
        } else {
            // Data default jika localStorage kosong saat pertama kali dibuka
            localFaqs = [
                { 
                    id: "faq-1", 
                    question: "Apakah bisa cetak satuan?", 
                    answer: "Bisa! Kami melayani cetak dokumen, stiker, maupun merchandise tanpa minimal order." 
                }
            ];
            saveFaqs();
        }
        renderFaqs();
    }

    // Simpan data ke localStorage
    function saveFaqs() {
        localStorage.setItem("arista_mock_faqs", JSON.stringify(localFaqs));
    }

    // Render data ke tampilan Grid HTML
    function renderFaqs() {
        if (localFaqs.length === 0) {
            faqGrid.innerHTML = `<div class="loading-state-cms">Belum ada daftar FAQ terdaftar.</div>`;
            return;
        }
        faqGrid.innerHTML = "";
        localFaqs.forEach(item => {
            const card = document.createElement("div");
            card.className = "cms-product-card-item";
            card.innerHTML = `
                <div class="cms-card-details">
                    <h4 style="color: var(--color-primary, #007bff); font-size: 15px;">Q: ${item.question}</h4>
                    <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 10px 0 16px 0; line-height: 1.4;">A: ${item.answer}</p>
                    <div class="cms-card-actions-row">
                        <button class="btn-cms-action btn-edit" onclick="editFaq('${item.id}')">Ubah</button>
                        <button class="btn-cms-action btn-delete" onclick="deleteFaq('${item.id}')">Hapus</button>
                    </div>
                </div>
            `;
            faqGrid.appendChild(card);
        });
    }

    // Buka Modal (Mode Tambah / Ubah)
    function openModal(mode = "add", id = null) {
        faqForm.reset();
        faqIdInput.value = "";
        if (mode === "edit" && id) {
            isEditMode = true;
            modalTitle.textContent = "Ubah Tanya Jawab FAQ";
            const current = localFaqs.find(f => f.id === id);
            if (current) {
                faqIdInput.value = current.id;
                faqQuestionInput.value = current.question;
                faqAnswerInput.value = current.answer;
            }
        } else {
            isEditMode = false;
            modalTitle.textContent = "Tambah FAQ Baru";
        }
        faqModal.classList.add("active");
    }

    function closeModal() { 
        faqModal.classList.remove("active"); 
    }

    openAddModalBtn.addEventListener("click", () => openModal("add"));
    closeModalBtn.addEventListener("click", closeModal);
    cancelModalBtn.addEventListener("click", closeModal);

    // Kirim & Proses Data Form
    faqForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const payload = {
            id: isEditMode ? faqIdInput.value : "faq-" + Date.now(),
            question: faqQuestionInput.value.trim(),
            answer: faqAnswerInput.value.trim()
        };

        if (isEditMode) {
            const idx = localFaqs.findIndex(f => f.id === payload.id);
            if (idx !== -1) localFaqs[idx] = payload;
        } else {
            localFaqs.push(payload);
        }

        saveFaqs();
        renderFaqs();
        closeModal();
    });

    // Ekspos fungsi global agar tombol onclick di baris string html bisa memanggil fungsinya
    window.editFaq = (id) => openModal("edit", id);
    window.deleteFaq = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data tanya jawab ini?")) {
            localFaqs = localFaqs.filter(f => f.id !== id);
            saveFaqs();
            renderFaqs();
        }
    };

    // Logout fallback sync
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

    loadFaqs();
}
