let missionArray = [];

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length && typeof ARISTA_CONFIG !== 'undefined') {
                firebase.initializeApp(ARISTA_CONFIG.firebaseConfig);
            }
            initHomepageCMS();
        }
    }, 600);
});

function initHomepageCMS() {
    const database = firebase.database();
    const contentRef = database.ref("homepage_content");

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

    const prevHeroHeadline = document.getElementById("prevHeroHeadline");
    const prevHeroSubheadline = document.getElementById("prevHeroSubheadline");
    const prevHeroCtaPrimary = document.getElementById("prevHeroCtaPrimary");
    const prevHeroCtaSecondary = document.getElementById("prevHeroCtaSecondary");
    const prevAboutBadge = document.getElementById("prevAboutBadge");
    const prevAboutTitle = document.getElementById("prevAboutTitle");
    const prevAboutDesc = document.getElementById("prevAboutDesc");

    contentRef.once("value").then((snapshot) => {
        const data = snapshot.val();
        if (data) {
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
            missionArray = [
                "Memberikan hasil cetak berkualitas tinggi dan presisi.",
                "Memberikan pelayanan yang cepat, responsif, dan profesional."
            ];
        }
        renderMissionList();
        updateLivePreview();
    }).catch(err => console.error(err));

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

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const saveBtn = document.getElementById("saveBtn");
        saveBtn.disabled = true;
        saveBtn.querySelector("span").textContent = "Menyimpan...";

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
}
