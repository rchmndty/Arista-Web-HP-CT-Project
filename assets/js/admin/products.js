/**
 * ARISTA Management Panel - Product Catalog CMS (Sprint 17.4 - CRUD Live Engine)
 * MODIFIED: Semua Form Opsional (Kecuali Kategori), Tampilan Kosong Tanpa Fallback Huruf, + Fitur CRUD Kategori.
 */

document.addEventListener("DOMContentLoaded", () => {
    initProductCMS();
});

function initProductCMS() {
    // Elemen DOM Utama Halaman
    const productsGrid = document.getElementById("productsCmsGrid"); 
    const searchInput = document.getElementById("cmsProductSearch"); 
    const filterSelect = document.getElementById("cmsCategoryFilter"); 
    const openAddModalBtn = document.getElementById("openAddModalBtn"); 
    
    // Elemen DOM Pop-Up Modal & Form Produk
    const productModal = document.getElementById("productModal"); 
    const productForm = document.getElementById("productForm"); 
    const closeModalBtn = document.getElementById("closeModalBtn"); 
    const cancelModalBtn = document.getElementById("cancelModalBtn"); 
    
    // Elemen DOM Input Field Form Produk
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
    const productImageFileInput = document.getElementById("productImageFile");

    // 🆕 Elemen DOM Pop-Up Modal & Form Manajemen Kategori
    const categoryModal = document.getElementById("categoryModal");
    const openCategoryModalBtn = document.getElementById("openCategoryModalBtn");
    const closeCatModalBtn = document.getElementById("closeCatModalBtn");
    const newCategoryNameInput = document.getElementById("newCategoryName");
    const saveCategoryBtn = document.getElementById("saveCategoryBtn");
    const categoryManagementList = document.getElementById("categoryManagementList");

    let localProductsCache = []; 
    let isEditMode = false; 
    let fileToUpload = null; 

    // 🆕 State Management Kategori (Menggunakan LocalStorage Terproteksi)
    let dynamicCategories = JSON.parse(localStorage.getItem("arista_categories")) || [
        { slug: "digital-printing", name: "Digital Printing" },
        { slug: "dokumen-jilid", name: "Dokumen & Jilid" },
        { slug: "cetak-foto", name: "Cetak Foto" }
    ];

    // =========================================================================
    // 🆕 ENGINE MANAJEMEN KATEGORI (Dinamis Dropdown & List)
    // =========================================================================
    function syncCategoriesToUI() {
        localStorage.setItem("arista_categories", JSON.stringify(dynamicCategories));

        // Update Dropdown Filter Halaman Utama
        if (filterSelect) {
            const currentVal = filterSelect.value;
            filterSelect.innerHTML = `<option value="all">Semua Kategori</option>`;
            dynamicCategories.forEach(cat => {
                filterSelect.innerHTML += `<option value="${cat.slug}">${cat.name}</option>`;
            });
            filterSelect.value = currentVal;
        }

        // Update Dropdown Pilihan Kategori di Form Popup Produk
        if (productCategorySelect) {
            const currentVal = productCategorySelect.value;
            productCategorySelect.innerHTML = ``;
            dynamicCategories.forEach(cat => {
                productCategorySelect.innerHTML += `<option value="${cat.slug}">${cat.name}</option>`;
            });
            if (currentVal) productCategorySelect.value = currentVal;
        }

        // Update List di dalam Modal Manajemen Kategori
        if (categoryManagementList) {
            categoryManagementList.innerHTML = "";
            dynamicCategories.forEach(cat => {
                const row = document.createElement("div");
                row.className = "category-item-row";
                row.innerHTML = `
                    <span>${cat.name} <small style="color:rgba(255,255,255,0.4);">(${cat.slug})</small></span>
                    <button class="btn-delete-cat" onclick="deleteCategoryEngine('${cat.slug}')">Hapus</button>
                `;
                categoryManagementList.appendChild(row);
            });
        }
    }

    // Aksi Tambah Kategori Baru
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener("click", () => {
            const name = newCategoryNameInput.value.trim();
            if (!name) return alert("Nama kategori tidak boleh kosong!");
            
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            if (dynamicCategories.some(c => c.slug === slug)) return alert("Kategori ini sudah terdaftar!");

            dynamicCategories.push({ slug, name });
            newCategoryNameInput.value = "";
            syncCategoriesToUI();
            renderProductsGrid();
        });
    }

    // Aksi Hapus Kategori Eksis
    window.deleteCategoryEngine = function(slug) {
        if (confirm("Apakah Anda yakin ingin menghapus kategori ini? Produk dengan kategori terkait tidak akan terhapus.")) {
            dynamicCategories = dynamicCategories.filter(c => c.slug !== slug);
            syncCategoriesToUI();
            renderProductsGrid();
        }
    };

    // Handler Buka Tutup Modal Kategori
    if (openCategoryModalBtn) openCategoryModalBtn.addEventListener("click", () => categoryModal.classList.add("active"));
    if (closeCatModalBtn) closeCatModalBtn.addEventListener("click", () => categoryModal.classList.remove("active"));

    // =========================================================================
    // 1. Ambil Data (READ) dari Cloud Database via Helper Generic
    // =========================================================================
    async function loadSupabaseProducts() {
        if (productsGrid) {
            productsGrid.innerHTML = `<div class="loading-state-cms">Memuat data dari cloud database...</div>`;
        }
        try {
            localProductsCache = await window.AristaCMS.CRUD.read('products', 'created_at', false);
            renderProductsGrid();
        } catch (error) {
            console.error("Gagal memuat produk:", error.message);
            if (productsGrid) {
                productsGrid.innerHTML = `<div class="loading-state-cms" style="color: var(--danger-color);">${error.message}</div>`;
            }
        }
    }

    // =========================================================================
    // 2. Render List Grid Produk dengan Fitur Search & Filter Kategori
    // =========================================================================
    function renderProductsGrid() {
        if (!productsGrid) return;

        const query = searchInput ? searchInput.value.toLowerCase().trim() : ""; 
        const categoryFilter = filterSelect ? filterSelect.value : "all"; 

        const filtered = localProductsCache.filter(prod => { 
            const matchesSearch = (prod.title || "").toLowerCase().includes(query) || (prod.desc || "").toLowerCase().includes(query); 
            const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter; 
            return matchesSearch && matchesCategory; 
        });

        if (filtered.length === 0) { 
            productsGrid.innerHTML = `<div class="loading-state-cms">Tidak ada data produk ditemukan.</div>`; 
            return;
        }

        productsGrid.innerHTML = ""; 
        filtered.forEach((product) => { 
            const card = document.createElement("div"); 
            card.className = "cms-product-card-item"; 
            
            // Pengondisian harga & unit agar tidak memunculkan teks jika sengaja dikosongkan
            const priceText = product.price ? product.price : "";
            const unitText = product.unit ? `<small>${product.unit}</small>` : "";
            const finalPriceDisplay = (priceText || unitText) ? `${priceText}${unitText}` : "";

            card.innerHTML = `
                <div class="cms-card-img-frame">
                    <img src="${product.image || '../assets/images/placeholder.jpg'}" alt="${product.title || ''}" onerror="this.src='../assets/images/placeholder.jpg'">
                    ${product.badge ? `<span class="cms-badge-tag">${product.badge}</span>` : ''}
                </div>
                <div class="cms-card-details">
                    <span class="cms-card-category-slug">${formatCategoryName(product.category)}</span>
                    <!-- 🆕 Diubah total: Tanpa fallback teks, murni kosong jika data tidak diisi -->
                    <h4>${product.title || ''}</h4>
                    <p class="cms-card-price-display">${finalPriceDisplay}</p>
                    <div class="cms-card-actions-row">
                        <button class="btn-cms-action btn-edit" onclick="actionEditProduct('${product.id}')">Ubah</button>
                        <button class="btn-cms-action btn-delete" onclick="actionDeleteProduct('${product.id}')">Hapus</button>
                    </div>
                </div>
            `; 
            productsGrid.appendChild(card); 
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderProductsGrid); 
    if (filterSelect) filterSelect.addEventListener("change", renderProductsGrid); 

    // =========================================================================
    // 3. Kontrol Manajemen Modal & Fungsi Live Preview Media
    // =========================================================================
    function openModal(mode = "add", productId = null) { 
        if (!productForm || !productModal) return;

        productForm.reset(); 
        productIdInput.value = ""; 
        fileToUpload = null;

        if (imgCmsPreview) imgCmsPreview.style.display = "none"; 
        if (imgPlaceholderText) imgPlaceholderText.style.display = "block"; 
        
        if (mode === "edit" && productId) { 
            isEditMode = true; 
            if (modalTitle) modalTitle.textContent = "Modifikasi Data Produk"; 
            const currentItem = localProductsCache.find(p => p.id === productId); 
            if (currentItem) { 
                if (productIdInput) productIdInput.value = currentItem.id; 
                if (productTitleInput) productTitleInput.value = currentItem.title || ""; 
                if (productCategorySelect) productCategorySelect.value = currentItem.category; 
                if (productBadgeInput) productBadgeInput.value = currentItem.badge || ""; 
                if (productPriceInput) productPriceInput.value = currentItem.price || ""; 
                if (productUnitInput) productUnitInput.value = currentItem.unit || ""; 
                if (productDescInput) productDescInput.value = currentItem.desc || ""; 
                if (productImageUrlInput) productImageUrlInput.value = currentItem.image || ""; 
                
                if (currentItem.image && imgCmsPreview && imgPlaceholderText) { 
                    imgCmsPreview.src = currentItem.image; 
                    imgCmsPreview.style.display = "block"; 
                    imgPlaceholderText.style.display = "none"; 
                }
            }
        } else {
            isEditMode = false; 
            if (modalTitle) modalTitle.textContent = "Tambah Item Produk"; 
        }
        productModal.classList.add("active"); 
    }

    function closeModal() { 
        if (productModal) productModal.classList.remove("active"); 
    }

    if (productImageFileInput) {
        productImageFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                fileToUpload = file;
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (imgCmsPreview && imgPlaceholderText) {
                        imgCmsPreview.src = event.target.result;
                        imgCmsPreview.style.display = "block";
                        imgPlaceholderText.style.display = "none";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (productImageUrlInput) {
        productImageUrlInput.addEventListener("input", (e) => { 
            const val = e.target.value.trim(); 
            if (val) {
                fileToUpload = null; 
                if (productImageFileInput) productImageFileInput.value = ""; 
                if (imgCmsPreview && imgPlaceholderText) {
                    imgCmsPreview.src = val; 
                    imgCmsPreview.style.display = "block"; 
                    imgPlaceholderText.style.display = "none"; 
                }
            } else {
                if (imgCmsPreview && imgPlaceholderText) {
                    imgCmsPreview.style.display = "none"; 
                    imgPlaceholderText.style.display = "block"; 
                }
            }
        });
    }

    if (openAddModalBtn) openAddModalBtn.addEventListener("click", () => openModal("add")); 
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal); 
    if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal); 

    // =========================================================================
    // 4. Operasi Kirim Form (CREATE / UPDATE) ke Cloud Database & Storage
    // =========================================================================
    if (productForm) {
        productForm.addEventListener("submit", async (e) => { 
            e.preventDefault(); 

            // 🆕 Semua aturan diubah menjadi `required: false`, menyisakan `category` yang murni terkunci wajib isi
            const validationRules = {
                title: { required: false, label: "Nama Produk" },
                category: { required: true, label: "Kategori" },
                price: { required: false, label: "Harga Display" },
                unit: { required: false, label: "Satuan / Unit" },
                desc: { required: false, label: "Deskripsi Detil Produk" }
            };

            const dataToValidate = {
                title: productTitleInput.value.trim(),
                category: productCategorySelect.value,
                price: productPriceInput.value.trim(),
                unit: productUnitInput.value.trim(),
                desc: productDescInput.value.trim()
            };

            const validation = window.AristaCMS.Validator.validate(dataToValidate, validationRules);
            if (!validation.isValid) {
                alert(validation.message);
                return;
            }

            const submitBtn = document.getElementById("saveProductBtn");
            if (submitBtn) {
                submitBtn.disabled = true;
                const spanBtn = submitBtn.querySelector("span");
                if (spanBtn) spanBtn.textContent = "Menyimpan Data...";
            }

            try {
                let finalImageUrl = productImageUrlInput.value.trim(); 

                if (fileToUpload) {
                    finalImageUrl = await window.AristaCMS.CRUD.uploadFile('products', 'product-catalog', fileToUpload);
                }

                const idProduct = isEditMode ? productIdInput.value : "prod-" + Date.now(); 
                
                // 🆕 Data dikirim apa adanya sesuai input formulir tanpa penimpaan teks default
                const payload = {
                    id: idProduct,
                    title: productTitleInput.value.trim() || "", 
                    category: productCategorySelect.value, 
                    badge: productBadgeInput.value.trim() || null, 
                    price: productPriceInput.value.trim() || "", 
                    unit: productUnitInput.value.trim() || "", 
                    desc: productDescInput.value.trim() || "", 
                    image: finalImageUrl || ""
                };

                if (isEditMode) {
                    await window.AristaCMS.CRUD.update('products', idProduct, payload);
                } else {
                    await window.AristaCMS.CRUD.create('products', payload);
                }

                await loadSupabaseProducts();
                closeModal(); 
            } catch (error) {
                alert("Gagal memproses penyimpanan data: " + error.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const spanBtn = submitBtn.querySelector("span");
                    if (spanBtn) spanBtn.textContent = "Simpan Data";
                }
            }
        });
    }

    // =========================================================================
    // 5. Integrasi Tombol Manipulasi Data Global
    // =========================================================================
    window.actionEditProduct = function(id) { 
        openModal("edit", id); 
    };

    window.actionDeleteProduct = async function(id) { 
        if (confirm("Apakah Anda yakin ingin menghapus item produk ini secara permanen dari Cloud Database?")) { 
            try {
                await window.AristaCMS.CRUD.delete('products', id);
                await loadSupabaseProducts();
            } catch (error) {
                alert("Gagal menghapus produk: " + error.message);
            }
        }
    };

    function formatCategoryName(slug) { 
        const found = dynamicCategories.find(c => c.slug === slug);
        return found ? found.name : slug; 
    }

    // Inisialisasi Pertama
    syncCategoriesToUI();
    loadSupabaseProducts();
}
