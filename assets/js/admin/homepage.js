/**
 * ARISTA Management Panel - Homepage Content Engine (Sprint 14)
 */

let missionArray = [];

// =========================================================================
// 1. GANTI BLOK PALING ATAS DI HOMEPAGE.JS DENGAN KODE DI BAWAH INI
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    if (typeof firebase !== 'undefined') {
        // PENGAMAN: Jika session.js mati, inisialisasi Firebase secara mandiri agar tidak crash
        if (!firebase.apps.length && typeof ARISTA_CONFIG !== 'undefined') {
            firebase.initializeApp(ARISTA_CONFIG.firebaseConfig);
        }
        initHomepageCMS();
    }
});

// ... (Biarkan kode bagian tengah/form Anda tetap seperti aslinya) ...

// =========================================================================
// 2. GANTI POIN 5 (BAGIAN PALING BAWAH) DI HOMEPAGE.JS DENGAN KODE DI BAWAH INI
// =========================================================================
    // 5. Hubungkan Fungsi Kontrol Tombol Keluar (Logout)
    

function initHomepageCMS() {
    const database = firebase.database();
    const contentRef = database.ref("homepage_content");

    // Ambil Referensi Elemen Form Input
    const form = document.getElementById("homepageCmsForm");
    const heroHeadline = document.getElementById("heroHeadline");
    const heroSubheadline = document.getElementById("heroSubheadline");
    const heroCtaPrimaryText = document.getElementById("heroCtaPrimaryText");
    const heroCtaPrimaryUrl = document.getElementById("heroCtaPrimaryUrl");
    const heroCtaSecondaryText = document.getElementById("heroCtaSecondaryText");
    const heroCtaSecondaryUrl = document.getElementById("heroCtaSecondaryUrl");
    
    const aboutBadge = document.getElementById("aboutBadge");
    const aboutTitle = document.getElementById("aboutTitle");
    const aboutDesc = document.getElementById("aboutDesc");
    const aboutVision = document.getElementById("aboutVision");

    // Ambil Referensi Elemen Live Preview
    const prevHeroHeadline = document.getElementById("prevHeroHeadline");
    const prevHeroSubheadline = document.getElementById("prevHeroSubheadline");
    const prevHeroCtaPrimary = document.getElementById("prevHeroCtaPrimary");
    const prevHeroCtaSecondary = document.getElementById("prevHeroCtaSecondary");
    const prevAboutBadge = document.getElementById("prevAboutBadge");
    const prevAboutTitle = document.getElementById("prevAboutTitle");
    const prevAboutDesc = document.getElementById("prevAboutDesc");

    // 1. Ambil data asli dari Firebase Realtime Database
    contentRef.once("value").then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Isi Form dengan data lama jika ada
            heroHeadline.value = data.hero?.headline || "";
            heroSubheadline.value = data.hero?.subheadline || "";
            heroCtaPrimaryText.value = data.hero?.ctaPrimaryText || "";
            heroCtaPrimaryUrl.value = data.hero?.ctaPrimaryUrl || "";
            heroCtaSecondaryText.value = data.hero?.ctaSecondaryText || "";
            heroCtaSecondaryUrl.value = data.hero?.ctaSecondaryUrl || "";

            aboutBadge.value = data.about?.badge || "";
            aboutTitle.value = data.about?.title || "";
            aboutDesc.value = data.about?.desc || "";
            aboutVision.value = data.about?.vision || "";

            missionArray = data.about?.missions || [];
        } else {
            // Default Fallback jika database masih kosong kosong awal
            missionArray = [
                "Memberikan hasil cetak berkualitas tinggi dan presisi.",
                "Memberikan pelayanan yang cepat, responsif, dan profesional."
            ];
        }
        renderMissionList();
        updateLivePreview();
    }).catch(err => console.error("Gagal sinkronisasi data Firebase:", err));

    // 2. Event Listener Input untuk Mekanisme Live Preview
    const allInputs = form.querySelectorAll("input, textarea");
    allInputs.forEach(input => {
        input.addEventListener("input", updateLivePreview);
    });

    function updateLivePreview() {
        prevHeroHeadline.textContent = heroHeadline.value || "Judul Utama...";
        prevHeroSubheadline.textContent = heroSubheadline.value || "Deskripsi sub-headline...";
        prevHeroCtaPrimary.textContent = heroCtaPrimaryText.value || "Tombol Utama";
        prevHeroCtaSecondary.textContent = heroCtaSecondaryText.value || "Tombol Sekunder";
        prevAboutBadge.textContent = aboutBadge.value || "✨ Tentang Kami";
        prevAboutTitle.textContent = aboutTitle.value || "Judul About...";
        prevAboutDesc.textContent = aboutDesc.value || "Narasi profil perusahaan...";
    }

    // 3. Logika Manajemen Array Misi (Dinamis CRUD Row)
    document.getElementById("addMissionBtn").addEventListener("click", () => {
        missionArray.push("");
        renderMissionList();
    });

    window.removeMissionItem = function(index) {
        missionArray.splice(index, 1);
        renderMissionList();
    };

    window.updateMissionText = function(index, value) {
        missionArray[index] = value;
    };

    function renderMissionList() {
        const container = document.getElementById("missionListContainer");
        container.innerHTML = "";
        
        missionArray.forEach((mission, index) => {
            const row = document.createElement("div");
            row.className = "dynamic-item-row";
            row.innerHTML = `
                <input type="text" value="${mission.replace(/"/g, '&quot;')}" 
                       oninput="updateMissionText(${index}, this.value)" required 
                       placeholder="Tulis butir misi perusahaan...">
                <button type="button" class="btn-remove-mission" onclick="removeMissionItem(${index})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;
            container.appendChild(row);
        });
    }

    // 4. Proses Submit Form Validasi & Simpan ke Firebase
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const saveBtn = document.getElementById("saveBtn");
        saveBtn.disabled = true;
        saveBtn.querySelector("span").textContent = "Menyimpan...";

        // Bersihkan array misi dari string kosong pembawa bug
        const cleanMissions = missionArray.filter(m => m.trim() !== "");

        const updatePayload = {
            hero: {
                headline: heroHeadline.value.trim(),
                subheadline: heroSubheadline.value.trim(),
                ctaPrimaryText: heroCtaPrimaryText.value.trim(),
                ctaPrimaryUrl: heroCtaPrimaryUrl.value.trim(),
                ctaSecondaryText: heroCtaSecondaryText.value.trim(),
                ctaSecondaryUrl: heroCtaSecondaryUrl.value.trim()
            },
            about: {
                badge: aboutBadge.value.trim(),
                title: aboutTitle.value.trim(),
                desc: aboutDesc.value.trim(),
                vision: aboutVision.value.trim(),
                missions: cleanMissions
            }
        };

        contentRef.set(updatePayload)
            .then(() => {
                alert("Konten Beranda Berhasil Diperbarui!");
            })
            .catch((error) => {
                alert("Gagal menyimpan data: " + error.message);
            })
            .finally(() => {
                saveBtn.disabled = false;
                saveBtn.querySelector("span").textContent = "Simpan Perubahan";
            });
    });

    // 5. Hubungkan Fungsi Kontrol Tombol Keluar (Logout)
    // GANTI POIN 5 DI HOMEPAGE.JS
// 1. GANTI BLOK PALING ATAS DI HOMEPAGE.JS DENGAN INI:
document.addEventListener("DOMContentLoaded", () => {
    if (typeof firebase !== 'undefined') {
        // PROTEKSI: Nyalakan Firebase secara mandiri jika session.js sedang dimatikan
        if (typeof ARISTA_CONFIG !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(ARISTA_CONFIG.firebaseConfig);
        }
        initHomepageCMS();
    }
});

// ... (biarkan kode tengah/form tetap seperti asli Anda) ...

// 2. GANTI POIN 5 (BAGIAN PALING BAWAH) DI HOMEPAGE.JS DENGAN INI:
const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Mencegah reload halaman bawaan dari button
            
            if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
                // Pasang tanda penanda resmi ke localStorage agar session.js tidak mencegat rute
                localStorage.setItem('logout_redirect_index', 'true');
                
                firebase.auth().signOut().then(() => {
                    window.location.href = "../index.html";
                }).catch((error) => {
                    console.error("Gagal logout:", error);
                    window.location.href = "../index.html";
                });
            }
        });
    }
}
