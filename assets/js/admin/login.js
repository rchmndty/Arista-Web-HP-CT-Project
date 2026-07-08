
/**
 * ARISTA Page Component - Admin Authentication Business Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("adminLoginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
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

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                // Berhasil login, perpindahan halaman akan ditangani oleh pengamat di session.js
                errorDisplay.classList.add("hidden");
            })
            .catch((error) => {
                // Tangani kesalahan kode response dari Firebase Auth secara user-friendly
                submitBtn.disabled = false;
                submitBtn.classList.remove("loading");
                errorDisplay.classList.remove("hidden");
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorDisplay.textContent = "Akun administrator tidak terdaftar.";
                        break;
                    case 'auth/wrong-password':
                        errorDisplay.textContent = "Kata sandi yang Anda masukkan salah.";
                        break;
                    case 'auth/invalid-email':
                        errorDisplay.textContent = "Format alamat email tidak valid.";
                        break;
                    default:
                        errorDisplay.textContent = "Gagal masuk: " + error.message;
                }
            });
    });
});
