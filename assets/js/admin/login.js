/**
 * ARISTA Page Component - Admin Authentication Business Logic (Supabase Migrated)
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("adminLoginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const errorDisplay = document.getElementById("loginErrorMessage");
        const submitBtn = document.getElementById("btnAuthSubmit");

        if (!email || !password) return;

        // Visual State: Loading UI Active
        errorDisplay.classList.add("hidden");
        submitBtn.disabled = true;
        submitBtn.classList.add("loading");

        try {
            // Menggunakan Supabase Auth Client yang diinisialisasi global dari supabase.js
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // ✅ BERIKAN JEDA AMAN 500ms AGAR LOCALSTORAGE SELESAI MENULIS SESSION LOG IN
            // Ini mencegah user ditendang balik oleh session.js milik dashboard.html
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 500);

        } catch (error) {
            // Kembalikan visual state tombol ke semula jika gagal
            submitBtn.disabled = false;
            submitBtn.classList.remove("loading");
            errorDisplay.classList.remove("hidden");

            // Pemetaan pesan kesalahan Supabase Auth secara user-friendly
            if (error.status === 400 || error.message.toLowerCase().includes("credentials")) {
                errorDisplay.textContent = "Email atau kata sandi yang Anda masukkan salah.";
            } else if (error.message.toLowerCase().includes("email not confirmed")) {
                errorDisplay.textContent = "Alamat email administrator belum dikonfirmasi.";
            } else {
                errorDisplay.textContent = "Gagal masuk: " + error.message;
            }
        }
    });
});
