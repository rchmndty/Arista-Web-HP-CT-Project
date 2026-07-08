/**
 * ARISTA Management Panel - Product Catalog CMS (Sprint 15)
 * [STANDALONE MOCK STATE SYSTEM - NO FIREBASE UNTIL SPRINT 18]
 */

document.addEventListener("DOMContentLoaded", () => {
    initProductCMS();
});

function initProductCMS() {
    // Elemen DOM Halaman Utama
    const productsGrid = document.getElementById("productsCmsGrid");
    const searchInput = document.getElementById("cmsProductSearch");
    const filterSelect = document.getElementById("cmsCategoryFilter");
    const openAddModalBtn = document.getElementById("openAddModalBtn");
    
    // Elemen DOM Modul Pop-Up Modal
    const productModal = document.getElementById("productModal");
    const productForm = document.getElementById("productForm");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    
    // Elemen DOM Form Field
    const modalTitle = document.getElementById("modalTitle");
    const productIdInput = document.getElementById("productId");
    const productTitleInput = document.getElementById("productTitle");
    const productCategorySelect = document.getElementById("productCategory");
    const productBadgeInput = document.getElementById("productBadge");
    const productPriceInput = document.getElementById("productPrice");
    const productUnitInput = document.getElementById("productUnit");
    const productDescInput = document.getElementById("productDesc");
    const productImageUrlInput = document.getElementById("productImageUrl");
    const imgCmsPreview = document.getElementById("imgCmsPreview");
    const imgPlaceholderText = document.querySelector(".img-placeholder-text");

    let localProductsCache = [];
    let isEditMode = false;

    // 1. Ambil Data dari Local Storage (Simulasi Fetch Database)
    function loadLocalProducts() {
        const storedData = localStorage.getItem("arista_mock_products");
        if (storedData) {
            localProductsCache = JSON.parse(storedData);
        } else {
            // Data default awal jika storage kosong agar tidak sepi sebelum di-CRUD
            localProductsCache = [
                {
                    id: "prod-1",
                    title: "Cetak Spanduk Flexi 280gr",
                    category: "digital-printing",
                    badge: "Populer",
                    price: "Rp 25.000",
                    unit: "/m²",
                    desc: "Cetak spanduk kilat luar ruangan menggunakan bahan Flexi China standar ekonomis dengan tinta tajam.",
                    image: "../assets/images/catalog/banner.jpg"
                }
            ];
            saveToLocalStorage();
        }
        renderProductsGrid();
    }

    function saveToLocalStorage() {
        localStorage.setItem("arista_mock_products", JSON.stringify(localProductsCache));
    }

    // 2. Fungsi Render List Grid Produk dengan Filter & Search Realtime
    function renderProductsGrid() {
        const query = searchInput.value.toLowerCase().trim();
        const categoryFilter = filterSelect.value;

        const filtered = localProductsCache.filter(prod => {
            const matchesSearch = prod.title.toLowerCase().includes(query) || prod.desc.toLowerCase().includes(query);
            const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        if (filtered.length === 0) {
            productsGrid.innerHTML = `<div class="loading-state-cms">Tidak ada data produk lokal ditemukan.</div>`;
            return;
        }

        productsGrid.innerHTML = "";
        filtered.forEach((product) => {
            const card = document.createElement("div");
            card.className = "cms-product-card-item";
            card.innerHTML = `
                <div class="cms-card-img-frame">
                    <img src="${product.image || '../assets/images/placeholder.jpg'}" alt="${product.title}" onerror="this.src='../assets/images/placeholder.jpg'">
                    ${product.badge ? `<span class="cms-badge-tag">${product.badge}</span>` : ''}
                </div>
                <div class="cms-card-details">
                    <span class="cms-card-category-slug">${formatCategoryName(product.category)}</span>
                    <h4>${product.title}</h4>
                    <p class="cms-card-price-display">${product.price}<small>${product.unit}</small></p>
                    <div class="cms-card-actions-row">
                        <button class="btn-cms-action btn-edit" onclick="actionEditProduct('${product.id}')">Ubah</button>
                        <button class="btn-cms-action btn-delete" onclick="actionDeleteProduct('${product.id}')">Hapus</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    searchInput.addEventListener("input", renderProductsGrid);
    filterSelect.addEventListener("change", renderProductsGrid);

    // 3. Kontrol Modal & Live Image Preview URL
    function openModal(mode = "add", productId = null) {
        productForm.reset();
        productIdInput.value = "";
        imgCmsPreview.style.display = "none";
        imgPlaceholderText.style.display = "block";
        
        if (mode === "edit" && productId) {
            isEditMode = true;
            modalTitle.textContent = "Modifikasi Data Produk";
            const currentItem = localProductsCache.find(p => p.id === productId);
            if (currentItem) {
                productIdInput.value = currentItem.id;
                productTitleInput.value = currentItem.title;
                productCategorySelect.value = currentItem.category;
                productBadgeInput.value = currentItem.badge || "";
                productPriceInput.value = currentItem.price;
                productUnitInput.value = currentItem.unit;
                productDescInput.value = currentItem.desc;
                productImageUrlInput.value = currentItem.image;
                
                if (currentItem.image) {
                    imgCmsPreview.src = currentItem.image;
                    imgCmsPreview.style.display = "block";
                    imgPlaceholderText.style.display = "none";
                }
            }
        } else {
            isEditMode = false;
            modalTitle.textContent = "Tambah Item Produk";
        }
        productModal.classList.add("active");
    }

    function closeModal() {
        productModal.classList.remove("active");
    }

    productImageUrlInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val) {
            imgCmsPreview.src = val;
            imgCmsPreview.style.display = "block";
            imgPlaceholderText.style.display = "none";
        } else {
            imgCmsPreview.style.display = "none";
            imgPlaceholderText.style.display = "block";
        }
    });

    openAddModalBtn.addEventListener("click", () => openModal("add"));
    closeModalBtn.addEventListener("click", closeModal);
    cancelModalBtn.addEventListener("click", closeModal);

    // 4. Operasi Form Submit (Simulasi Local Create & Update)
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const payload = {
            id: isEditMode ? productIdInput.value : "prod-" + Date.now(),
            title: productTitleInput.value.trim(),
            category: productCategorySelect.value,
            badge: productBadgeInput.value.trim() || null,
            price: productPriceInput.value.trim(),
            unit: productUnitInput.value.trim(),
            desc: productDescInput.value.trim(),
            image: productImageUrlInput.value.trim()
        };

        if (isEditMode) {
            const index = localProductsCache.findIndex(p => p.id === payload.id);
            if (index !== -1) {
                localProductsCache[index] = payload;
            }
        } else {
            localProductsCache.push(payload);
        }

        saveToLocalStorage();
        renderProductsGrid();
        closeModal();
    });

    // Global Router Actions untuk trigger dari HTML string
    window.actionEditProduct = function(id) {
        openModal("edit", id);
    };

    window.actionDeleteProduct = function(id) {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini dari list lokal?")) {
            localProductsCache = localProductsCache.filter(p => p.id !== id);
            saveToLocalStorage();
            renderProductsGrid();
        }
    };

    function formatCategoryName(slug) {
        const categories = {
            "digital-printing": "Digital Printing",
            "dokumen-jilid": "Dokumen & Jilid",
            "cetak-foto": "Cetak Foto"
        };
        return categories[slug] || slug;
    }

    // 5. Integrasi Tombol Keluar (Logout) Sesi Admin berbasis Mock Sesi
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
                localStorage.setItem('logout_redirect_index', 'true');
                // Karena belum pakai Firebase Auth, kita lempar manual ke halaman utama
                window.location.href = "../index.html";
            }
        });
    }

    // Pemicu pertama saat aplikasi siap
    loadLocalProducts();
}
