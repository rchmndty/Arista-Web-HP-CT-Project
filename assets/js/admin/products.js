/**
 * ARISTA Management Panel - Product Catalog CMS (Sprint 17 - Supabase Integrated)
 */

document.addEventListener("DOMContentLoaded", () => {
    initProductCMS();
});

function initProductCMS() {
    // Elemen DOM Halaman Utama
    const productsGrid = document.getElementById("productsCmsGrid"); //[span_7](start_span)[span_7](end_span)
    const searchInput = document.getElementById("cmsProductSearch"); //[span_8](start_span)[span_8](end_span)
    const filterSelect = document.getElementById("cmsCategoryFilter"); //[span_9](start_span)[span_9](end_span)
    const openAddModalBtn = document.getElementById("openAddModalBtn"); //[span_10](start_span)[span_10](end_span)
    
    // Elemen DOM Modul Pop-Up Modal
    const productModal = document.getElementById("productModal"); //[span_11](start_span)[span_11](end_span)
    const productForm = document.getElementById("productForm"); //[span_12](start_span)[span_12](end_span)
    const closeModalBtn = document.getElementById("closeModalBtn"); //[span_13](start_span)[span_13](end_span)
    const cancelModalBtn = document.getElementById("cancelModalBtn"); //[span_14](start_span)[span_14](end_span)
    
    // Elemen DOM Form Field
    const modalTitle = document.getElementById("modalTitle"); //[span_15](start_span)[span_15](end_span)
    const productIdInput = document.getElementById("productId"); //[span_16](start_span)[span_16](end_span)
    const productTitleInput = document.getElementById("productTitle"); //[span_17](start_span)[span_17](end_span)
    const productCategorySelect = document.getElementById("productCategory"); //[span_18](start_span)[span_18](end_span)
    const productBadgeInput = document.getElementById("productBadge"); //[span_19](start_span)[span_19](end_span)
    const productPriceInput = document.getElementById("productPrice"); //[span_20](start_span)[span_20](end_span)
    const productUnitInput = document.getElementById("productUnit"); //[span_21](start_span)[span_21](end_span)
    const productDescInput = document.getElementById("productDesc"); //[span_22](start_span)[span_22](end_span)
    const productImageUrlInput = document.getElementById("productImageUrl"); //[span_23](start_span)[span_23](end_span)
    const imgCmsPreview = document.getElementById("imgCmsPreview"); //[span_24](start_span)[span_24](end_span)
    const imgPlaceholderText = document.querySelector(".img-placeholder-text"); //[span_25](start_span)[span_25](end_span)

    // PENTING: Elemen Input File Baru untuk Tangkap Galeri HP (Tambahkan di HTML)
    const productImageFileInput = document.getElementById("productImageFile");

    let localProductsCache = []; //[span_26](start_span)[span_26](end_span)
    let isEditMode = false; //[span_27](start_span)[span_27](end_span)
    let fileToUpload = null; // Menyimpan temporary data file gambar galeri

    // 1. Ambil Data Langsung dari Supabase Database (Realtime Fetch)
    async function loadSupabaseProducts() {
        if (productsGrid) {
            productsGrid.innerHTML = `<div class="loading-state-cms">Memuat data dari cloud database...</div>`;
        }
        
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            localProductsCache = data || []; //[span_28](start_span)[span_28](end_span)
            renderProductsGrid();
        } catch (error) {
            console.error("Gagal memuat produk:", error.message);
            if (productsGrid) {
                productsGrid.innerHTML = `<div class="loading-state-cms" style="color: var(--danger-color);">Gagal memuat data: ${error.message}</div>`;
            }
        }
    }

    // 2. Fungsi Render List Grid Produk dengan Filter & Search Realtime
    function renderProductsGrid() {
        const query = searchInput.value.toLowerCase().trim(); //[span_29](start_span)[span_29](end_span)
        const categoryFilter = filterSelect.value; //[span_30](start_span)[span_30](end_span)

        const filtered = localProductsCache.filter(prod => { //[span_31](start_span)[span_31](end_span)
            const matchesSearch = prod.title.toLowerCase().includes(query) || prod.desc.toLowerCase().includes(query); //[span_32](start_span)[span_32](end_span)
            const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter; //[span_33](start_span)[span_33](end_span)
            return matchesSearch && matchesCategory; //[span_34](start_span)[span_34](end_span)
        });

        if (filtered.length === 0) { //[span_35](start_span)[span_35](end_span)
            productsGrid.innerHTML = `<div class="loading-state-cms">Tidak ada data produk ditemukan.</div>`; //[span_36](start_span)[span_36](end_span)
            return;
        }

        productsGrid.innerHTML = ""; //[span_37](start_span)[span_37](end_span)
        filtered.forEach((product) => { //[span_38](start_span)[span_38](end_span)
            const card = document.createElement("div"); //[span_39](start_span)[span_39](end_span)
            card.className = "cms-product-card-item"; //[span_40](start_span)[span_40](end_span)
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
            `; //[span_41](start_span)[span_41](end_span)
            productsGrid.appendChild(card); //[span_42](start_span)[span_42](end_span)
        });
    }

    if (searchInput) searchInput.addEventListener("input", renderProductsGrid); //[span_43](start_span)[span_43](end_span)
    if (filterSelect) filterSelect.addEventListener("change", renderProductsGrid); //[span_44](start_span)[span_44](end_span)

    // 3. Kontrol Modal & Penanganan Live Preview File Gambar
    function openModal(mode = "add", productId = null) { //[span_45](start_span)[span_45](end_span)
        productForm.reset(); //[span_46](start_span)[span_46](end_span)
        productIdInput.value = ""; //[span_47](start_span)[span_47](end_span)
        fileToUpload = null;
        imgCmsPreview.style.display = "none"; //[span_48](start_span)[span_48](end_span)
        imgPlaceholderText.style.display = "block"; //[span_49](start_span)[span_49](end_span)
        
        if (mode === "edit" && productId) { //[span_50](start_span)[span_50](end_span)
            isEditMode = true; //[span_51](start_span)[span_51](end_span)
            modalTitle.textContent = "Modifikasi Data Produk"; //[span_52](start_span)[span_52](end_span)
            const currentItem = localProductsCache.find(p => p.id === productId); //[span_53](start_span)[span_53](end_span)
            if (currentItem) { //[span_54](start_span)[span_54](end_span)
                productIdInput.value = currentItem.id; //[span_55](start_span)[span_55](end_span)
                productTitleInput.value = currentItem.title; //[span_56](start_span)[span_56](end_span)
                productCategorySelect.value = currentItem.category; //[span_57](start_span)[span_57](end_span)
                productBadgeInput.value = currentItem.badge || ""; //[span_58](start_span)[span_58](end_span)
                productPriceInput.value = currentItem.price; //[span_59](start_span)[span_59](end_span)
                productUnitInput.value = currentItem.unit; //[span_60](start_span)[span_60](end_span)
                productDescInput.value = currentItem.desc; //[span_61](start_span)[span_61](end_span)
                productImageUrlInput.value = currentItem.image || ""; //[span_62](start_span)[span_62](end_span)
                
                if (currentItem.image) { //[span_63](start_span)[span_63](end_span)
                    imgCmsPreview.src = currentItem.image; //[span_64](start_span)[span_64](end_span)
                    imgCmsPreview.style.display = "block"; //[span_65](start_span)[span_65](end_span)
                    imgPlaceholderText.style.display = "none"; //[span_66](start_span)[span_66](end_span)
                }
            }
        } else {
            isEditMode = false; //[span_67](start_span)[span_67](end_span)
            modalTitle.textContent = "Tambah Item Produk"; //[span_68](start_span)[span_68](end_span)
        }
        productModal.classList.add("active"); //[span_69](start_span)[span_69](end_span)
    }

    function closeModal() { //[span_70](start_span)[span_70](end_span)
        productModal.classList.remove("active"); //[span_71](start_span)[span_71](end_span)
    }

    // Listener 3A: Preview jika klien pilih gambar lewat file lokal/galeri HP
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

    // Listener 3B: Preview jika klien pakai alternatif link URL online
    if (productImageUrlInput) {
        productImageUrlInput.addEventListener("input", (e) => { //[span_72](start_span)[span_72](end_span)
            const val = e.target.value.trim(); //[span_73](start_span)[span_73](end_span)
            if (val) {
                fileToUpload = null; // Reset file lokal jika dia ngetik URL
                imgCmsPreview.src = val; //[span_74](start_span)[span_74](end_span)
                imgCmsPreview.style.display = "block"; //[span_75](start_span)[span_75](end_span)
                imgPlaceholderText.style.display = "none"; //[span_76](start_span)[span_76](end_span)
            } else {
                imgCmsPreview.style.display = "none"; //[span_77](start_span)[span_77](end_span)
                imgPlaceholderText.style.display = "block"; //[span_78](start_span)[span_78](end_span)
            }
        });
    }

    if (openAddModalBtn) openAddModalBtn.addEventListener("click", () => openModal("add")); //[span_79](start_span)[span_79](end_span)
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal); //[span_80](start_span)[span_80](end_span)
    if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal); //[span_81](start_span)[span_81](end_span)

    // 4. Operasi Form Submit (Cloud Storage Upload + Database Insert/Update)
    productForm.addEventListener("submit", async (e) => { //[span_82](start_span)[span_82](end_span)
        e.preventDefault(); //[span_83](start_span)[span_83](end_span)

        const submitBtn = productForm.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Menyimpan...";
        }

        try {
            let imageUrl = productImageUrlInput.value.trim(); // Ambil nilai default URL bawaan[span_84](start_span)[span_84](end_span)

            // PROSES OTO-UPLOAD: Jika klien memilih file fisik foto dari galeri HP
            if (fileToUpload) {
                const fileExt = fileToUpload.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `product-catalog/${fileName}`;

                // Upload file mentah ke Bucket Storage Supabase bernama 'products'
                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, fileToUpload);

                if (uploadError) throw uploadError;

                // Ambil link URL Publik hasil unggahan internet untuk disetor ke database
                const { data: urlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);
                
                imageUrl = urlData.publicUrl;
            }

            const idProduct = isEditMode ? productIdInput.value : "prod-" + Date.now(); //[span_85](start_span)[span_85](end_span)
            const payload = {
                id: idProduct,
                title: productTitleInput.value.trim(), //[span_86](start_span)[span_86](end_span)
                category: productCategorySelect.value, //[span_87](start_span)[span_87](end_span)
                badge: productBadgeInput.value.trim() || null, //[span_88](start_span)[span_88](end_span)
                price: productPriceInput.value.trim(), //[span_89](start_span)[span_89](end_span)
                unit: productUnitInput.value.trim(), //[span_90](start_span)[span_90](end_span)
                desc: productDescInput.value.trim(), //[span_91](start_span)[span_91](end_span)
                image: imageUrl
            };

            if (isEditMode) {
                // Update baris tabel produk di Supabase
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', idProduct);
                
                if (error) throw error;
            } else {
                // Insert baris data produk baru di Supabase
                const { error } = await supabase
                    .from('products')
                    .insert([payload]);
                
                if (error) throw error;
            }

            await loadSupabaseProducts();
            closeModal(); //[span_92](start_span)[span_92](end_span)
        } catch (error) {
            alert("Gagal menyimpan data ke cloud: " + error.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = isEditMode ? "Simpan Perubahan" : "Tambah Item";
            }
        }
    });

    // Global Router Actions untuk trigger tombol dari HTML string[span_93](start_span)[span_93](end_span)
    window.actionEditProduct = function(id) { //[span_94](start_span)[span_94](end_span)
        openModal("edit", id); //[span_95](start_span)[span_95](end_span)
    };

    window.actionDeleteProduct = async function(id) { //[span_96](start_span)[span_96](end_span)
        if (confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen dari Cloud Database?")) { //[span_97](start_span)[span_97](end_span)
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                await loadSupabaseProducts();
            } catch (error) {
                alert("Gagal menghapus produk: " + error.message);
            }
        }
    };

    function formatCategoryName(slug) { //[span_98](start_span)[span_98](end_span)
        const categories = { //[span_99](start_span)[span_99](end_span)
            "digital-printing": "Digital Printing", //[span_100](start_span)[span_100](end_span)
            "dokumen-jilid": "Dokumen & Jilid", //[span_101](start_span)[span_101](end_span)
            "cetak-foto": "Cetak Foto" //[span_102](start_span)[span_102](end_span)
        };
        return categories[slug] || slug; //[span_103](start_span)[span_103](end_span)
    }

    // 5. Integrasi Tombol Keluar Resmi Menggunakan Supabase Auth
    const logoutBtn = document.getElementById("logoutBtn"); //[span_104](start_span)[span_104](end_span)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => { //[span_105](start_span)[span_105](end_span)
            e.preventDefault(); //[span_106](start_span)[span_106](end_span)
            if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) { //[span_107](start_span)[span_107](end_span)
                try {
                    localStorage.setItem('logout_redirect_index', 'true'); //[span_108](start_span)[span_108](end_span)
                    await supabase.auth.signOut();
                    window.location.href = "../index.html"; //[span_109](start_span)[span_109](end_span)
                } catch (error) {
                    window.location.href = "../index.html"; //[span_110](start_span)[span_110](end_span)
                }
            }
        });
    }

    // Jalankan penarikan data cloud saat halaman CMS terbuka
    loadSupabaseProducts();
}
