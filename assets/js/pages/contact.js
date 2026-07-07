/**
 * ARISTA Page Component - Contact Form Interaction Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    initContactFormHandler();
});

assets/js/pages/contact.js
function initContactFormHandler() {
    const formNode = document.getElementById("aristaContactForm");
    if (!formNode) return;

    formNode.addEventListener("submit", (e) => {
        e.preventDefault();

        // Mengambil data dari form menggunakan ID baru
        const name = document.getElementById("name").value.trim();
        const service = document.getElementById("service").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !service || !phone || !message) {
            alert("Harap isi seluruh field formulir.");
            return;
        }

        // Menyusun format pesan WhatsApp teks terstruktur
        const whatsappText = `Halo Admin Arista.\n\nNama : ${name}\nlayanan yang dibutuhkan : ${service}\nWhatsApp : ${phone}\n\nDetail Pesanan :\n${message}`;

        // Mengubah karakter khusus ke format URL aman (Encode)
        const encodedText = encodeURIComponent(whatsappText);

        // Nomor tujuan WhatsApp Admin Arista
        const adminPhoneNumber = "6285243000154";

        // Penggabungan URL utama wa.me
        const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedText}`;

        // Feedback visual tombol loading sebelum redirect
        const submitBtn = document.getElementById("sendBtn");
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `Menghubungkan ke WhatsApp...`;

        setTimeout(() => {
            window.open(whatsappUrl, "_blank");
            formNode.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 800);
    });
}
