/**
 * ARISTA Management Panel - Product Catalog CMS (Sprint 17.4 - CRUD Live Engine)
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
    
    // Elemen DOM Pop-Up Modal & Form
    const productModal = document.getElementById("productModal"); 
    const productForm = document.getElementById("productForm"); 
    const closeModalBtn = document.getElementById("closeModalBtn"); 
    const cancelModalBtn = document.getElementById("cancelModalBtn"); 
    
    // Elemen DOM Input Field Form
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

    // Elemen Input File Unggahan Foto Galeri HP
    const productImageFileInput = document.getElementById("productImageFile");

    let localProductsCache = []; 
    let isEditMode = false; 
    let fileToUpload = null; 

    // =========================================================================
    // 1. Ambil Data (READ) dari Cloud Database via Helper Generic
    // =========================================================================
    async function loadSupabaseProducts() {
        if (productsGrid) {
            productsGrid.innerHTML = `<div class="loading-state-cms">Memuat data dari cloud database...</div>`;
        }
        
        try {
            // Memanggil Generic CRUD untuk menarik seluruh data dari tabel 'products'
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
        
        // Kembalikan status required URL ke setelan default HTML
        if (productImageUrlInput) productImageUrlInput.setAttribute("required", "required");

        if (imgCmsPreview) imgCmsPreview.style.display = "none"; 
        if (imgPlaceholderText) imgPlaceholderText.style.display = "block"; 
        
        if (mode === "edit" && productId) { 
            isEditMode = true; 
            if (modalTitle) modalTitle.textContent = "Modifikasi Data Produk"; 
            const currentItem = localProductsCache.find(p => p.id === productId); 
            if (currentItem) { 
                if (productIdInput) productIdInput.value = currentItem.id; 
                if (productTitleInput) productTitleInput.value = currentItem.title; 
                if (productCategorySelect) productCategorySelect.value = currentItem.category; 
                if (productBadgeInput) productBadgeInput.value = currentItem.badge || ""; 
                if (productPriceInput) productPriceInput.value = currentItem.price; 
                if (productUnitInput) productUnitInput.value = currentItem.unit; 
                if (productDescInput) productDescInput.value = currentItem.desc; 
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

    // Mengambil preview gambar jika admin memilih file dari penyimpanan lokal HP
    if (productImageFileInput) {
        productImageFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                fileToUpload = file;
                
                // Matikan required pada URL Input karena admin sudah mengunggah file fisik
                if (productImageUrlInput) productImageUrlInput.removeAttribute("required");

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

    // Mengambil preview gambar jika admin mengetikkan tautan URL eksternal
    if (productImageUrlInput) {
        productImageUrlInput.addEventListener("input", (e) => { 
            const val = e.target.value.trim(); 
            if (val) {
                fileToUpload = null; 
                if (productImageFileInput) productImageFileInput.value = ""; // Reset input file
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
                // Jika kosong dan tidak ada file, pasang kembali aturan wajib isi
                if (!fileToUpload) productImageUrlInput.setAttribute("required", "required");
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

            // -- Sub-Modul Validasi Form (Engine 17.3) --
            const validationRules = {
                title: { required: true, minLength: 4, label: "Nama Produk" },
                category: { required: true, label: "Kategori" },
                price: { required: true, label: "Harga Display" },
                unit: { required: true, label: "Satuan / Unit" },
                desc: { required: true, minLength: 10, label: "Deskripsi Detil Produk" }
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

            // Visual State: Kunci tombol submit untuk menghindari double-click data ganda
            const submitBtn = document.getElementById("saveProductBtn");
            if (submitBtn) {
                submitBtn.disabled = true;
                const spanBtn = submitBtn.querySelector("span");
                if (spanBtn) spanBtn.textContent = "Menyimpan Data...";
            }

            try {
                let finalImageUrl = productImageUrlInput.value.trim(); 

                // -- Sub-Modul Upload File ke Storage Bucket Supabase (Engine 17.3) --
                if (fileToUpload) {
                    finalImageUrl = await window.AristaCMS.CRUD.uploadFile('products', 'product-catalog', fileToUpload);
                }

                // Menyusun struktur data payload objek baris database
                const idProduct = isEditMode ? productIdInput.value : "prod-" + Date.now(); 
                const payload = {
                    id: idProduct,
                    title: productTitleInput.value.trim(), 
                    category: productCategorySelect.value, 
                    badge: productBadgeInput.value.trim() || null, 
                    price: productPriceInput.value.trim(), 
                    unit: productUnitInput.value.trim(), 
                    desc: productDescInput.value.trim(), 
                    image: finalImageUrl || null
                };

                // -- Sub-Modul Database Persistence --
                if (isEditMode) {
                    await window.AristaCMS.CRUD.update('products', idProduct, payload);
                } else {
                    await window.AristaCMS.CRUD.create('products', payload);
                }

                // Muat ulang daftar produk di UI dan tutup modal popup
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
    // 5. Integrasi Tombol Manipulasi Data Global (Akses Via Atribut HTML)
    // =========================================================================
    window.actionEditProduct = function(id) { 
        openModal("edit", id); 
    };

    window.actionDeleteProduct = async function(id) { 
        if (confirm("Apakah Anda yakin ingin menghapus item produk ini secara permanen dari Cloud Database?")) { 
            try {
                // Mengeksekusi penghapusan baris data di cloud via Helper Generic
                await window.AristaCMS.CRUD.delete('products', id);
                await loadSupabaseProducts();
            } catch (error) {
                alert("Gagal menghapus produk: " + error.message);
            }
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

    // Menjalankan penarikan data cloud database pertama kali saat halaman siap
    loadSupabaseProducts();
}
