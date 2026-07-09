/**
 * ARISTA Management Panel - Product Catalog CMS (Sprint 17.3 - CRUD Helper Refactored)
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

    // Input File untuk Galeri HP
    const productImageFileInput = document.getElementById("productImageFile");

    let localProductsCache = []; 
    let isEditMode = false; 
    let fileToUpload = null; 

    // =========================================================================
    // 1. Ambil Data Menggunakan AristaCMS Generic CRUD (Realtime Fetch)
    // =========================================================================
    async function loadSupabaseProducts() {
        if (productsGrid) {
            productsGrid.innerHTML = `<div class="loading-state-cms">Memuat data dari cloud database...</div>`;
        }
        
        try {
            // Menggunakan helper generic untuk membaca tabel 'products'
            localProductsCache = await window.AristaCMS.CRUD.read('products', 'created_at', false);
            renderProductsGrid();
        } catch (error) {
            console.error("Gagal memuat produk:", error.message);
            if (productsGrid) {
                // Pesan error di bawah ini sudah otomatis terjemahan ramah user dari helper
                productsGrid.innerHTML = `<div class="loading-state-cms" style="color: var(--danger-color);">${error.message}</div>`;
            }
        }
    }

    // =========================================================================
    // 2. Fungsi Render List Grid Produk dengan Filter & Search Realtime (Tetap Utuh)
    // =========================================================================
    function renderProductsGrid() {
        const query = searchInput.value.toLowerCase().trim(); 
        const categoryFilter = filterSelect.value; 

        const filtered = localProductsCache.filter(prod => { 
            const matchesSearch = prod.title.toLowerCase().includes(query) || prod.desc.toLowerCase().includes(query); 
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
    // 3. Kontrol Modal & Penanganan Live Preview File Gambar (Tetap Utuh)
    // =========================================================================
    function openModal(mode = "add", productId = null) { 
        productForm.reset(); 
        productIdInput.value = ""; 
        fileToUpload = null;
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
                productImageUrlInput.value = currentItem.image || ""; 
                
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

    if (productImageFileInput) {
        productImageFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                fileToUpload = file;
                const reader = new FileReader();
                reader.onload = (event) => {
                    imgCmsPreview.src = event.target.result;
                    imgCmsPreview.style.display = "block";
                    imgPlaceholderText.style.display = "none";
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
                imgCmsPreview.src = val; 
                imgCmsPreview.style.display = "block"; 
                imgPlaceholderText.style.display = "none"; 
            } else {
                imgCmsPreview.style.display = "none"; 
                imgPlaceholderText.style.display = "block"; 
            }
        });
    }

    if (openAddModalBtn) openAddModalBtn.addEventListener("click", () => openModal("add")); 
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal); 
    if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal); 

    // =========================================================================
    // 4. Operasi Form Submit dengan Proteksi Validasi & Cloud Helper
    // =========================================================================
    productForm.addEventListener("submit", async (e) => { 
        e.preventDefault(); 

        // --- SUB-MODUL VALIDASI (17.3) ---
        const validationRules = {
            title: { required: true, minLength: 4, label: "Nama Produk" },
            category: { required: true, label: "Kategori Produk" },
            price: { required: true, numeric: true, label: "Harga Cetak" },
            unit: { required: true, label: "Satuan / Unit" }
        };

        const formDataToValidate = {
            title: productTitleInput.value.trim(),
            category: productCategorySelect.value,
            price: productPriceInput.value.trim(),
            unit: productUnitInput.value.trim()
        };

        const validation = window.AristaCMS.Validator.validate(formDataToValidate, validationRules);
        if (!validation.isValid) {
            alert(validation.message); // Hentikan proses jika validasi gagal
            return;
        }

        // Visual State: Loading Active
        const submitBtn = productForm.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Menyimpan...";
        }

        try {
            let imageUrl = productImageUrlInput.value.trim(); 

            // --- SUB-MODUL FILE UPLOAD (17.3) ---
            if (fileToUpload) {
                imageUrl = await window.AristaCMS.CRUD.uploadFile('products', 'product-catalog', fileToUpload);
            }

            const idProduct = isEditMode ? productIdInput.value : "prod-" + Date.now(); 
            const payload = {
                id: idProduct,
                title: productTitleInput.value.trim(), 
                category: productCategorySelect.value, 
                badge: productBadgeInput.value.trim() || null, 
                price: productPriceInput.value.trim(), 
                unit: productUnitInput.value.trim(), 
                desc: productDescInput.value.trim(), 
                image: imageUrl
            };

            // --- SUB-MODUL WRITE DATABASE (17.3) ---
            if (isEditMode) {
                await window.AristaCMS.CRUD.update('products', idProduct, payload);
            } else {
                await window.AristaCMS.CRUD.create('products', payload);
            }

            await loadSupabaseProducts();
            closeModal(); 
        } catch (error) {
            // Error handling otomatis menangkap terjemahan pesan error bahasa indonesia
            alert("Gagal memproses data: " + error.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = isEditMode ? "Simpan Perubahan" : "Tambah Item";
            }
        }
    });

    // =========================================================================
    // 5. Global Router Actions Untuk Hapus Data via Cloud Helper
    // =========================================================================
    window.actionEditProduct = function(id) { 
        openModal("edit", id); 
    };

    window.actionDeleteProduct = async function(id) { 
        if (confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen dari Cloud Database?")) { 
            try {
                // Menggunakan helper generic delete
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

    // =========================================================================
    // 6. Integrasi Tombol Keluar Resmi Menggunakan Supabase Auth (Tetap Utuh)
    // =========================================================================
    const logoutBtn = document.getElementById("logoutBtn"); 
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => { 
            e.preventDefault(); 
            if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) { 
                try {
                    localStorage.setItem('logout_redirect_index', 'true'); 
                    await window.supabase.auth.signOut();
                    window.location.href = "../index.html"; 
                } catch (error) {
                    window.location.href = "../index.html"; 
                }
            }
        });
    }

    // Jalankan penarikan data cloud pertama kali
    loadSupabaseProducts();
}
