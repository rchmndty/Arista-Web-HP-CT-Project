document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const form = document.getElementById("companyCmsForm");
        const compTagline = document.getElementById("compTagline");
        const compWhatsapp = document.getElementById("compWhatsapp");
        const compEmail = document.getElementById("compEmail");
        const compAddress = document.getElementById("compAddress");
        const compInstagram = document.getElementById("compInstagram");
        const compFacebook = document.getElementById("compFacebook");
        const compDays = document.getElementById("compDays");
        const compHours = document.getElementById("compHours");

        function loadGlobalSettings() {
            const storedData = localStorage.getItem("arista_mock_company");
            let profile = storedData ? JSON.parse(storedData) : null;

            if (!profile) {
                profile = {
                    tagline: "Solusi Cetak Cepat, Kilat & Berkualitas Tinggi",
                    whatsapp: "6282212345678",
                    email: "arista.print@gmail.com",
                    address: "Gemba, Waimital, Kec. Kairatu, Kabupaten Seram Bagian Barat, Maluku",
                    instagram: "https://instagram.com/arista.print",
                    facebook: "https://facebook.com/arista.print",
                    days: "Senin - Sabtu",
                    hours: "08:00 - 21:00 WIT"
                };
                localStorage.setItem("arista_mock_company", JSON.stringify(profile));
            }

            compTagline.value = profile.tagline || "";
            compWhatsapp.value = profile.whatsapp || "";
            compEmail.value = profile.email || "";
            compAddress.value = profile.address || "";
            compInstagram.value = profile.instagram || "";
            compFacebook.value = profile.facebook || "";
            compDays.value = profile.days || "";
            compHours.value = profile.hours || "";
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const updatedPayload = {
                tagline: compTagline.value.trim(),
                whatsapp: compWhatsapp.value.trim(),
                email: compEmail.value.trim(),
                address: compAddress.value.trim(),
                instagram: compInstagram.value.trim(),
                facebook: compFacebook.value.trim(),
                days: compDays.value.trim(),
                hours: compHours.value.trim()
            };

            localStorage.setItem("arista_mock_company", JSON.stringify(updatedPayload));
            alert("Seluruh konfigurasi bisnis berhasil diperbarui secara lokal!");
        });

        loadGlobalSettings();
    }, 600);
});
