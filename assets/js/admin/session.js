// /**
//  * ARISTA Core Admin - Universal Session Guard Engine
//  * [AMANDEMEN SPRINT 13-15: AMAN DENGAN / TANPA SDK FIREBASE]
//  */

// // Global Safe Fallback Object Rule untuk meredam potensi error dari page-transition.js
// if (typeof window.ARISTA_ANIM_CONFIG === 'undefined') {
//     window.ARISTA_ANIM_CONFIG = { timings: { transitionSpeed: 0 } };
// }

// // Inisialisasi Firebase secara terpusat untuk modul admin (jika script SDK Firebase dimuat di HTML)
// if (typeof firebase !== 'undefined' && typeof ARISTA_CONFIG !== 'undefined') {
//     if (!firebase.apps.length) {
//         firebase.initializeApp(ARISTA_CONFIG.firebaseConfig);
//     }
// }

// function checkAdminSession(requireAuth = true) {
//     const currentPath = window.location.pathname;
//     const isLoginPage = currentPath.includes('login.html');

//     // JALUR 1: Jika SDK Firebase Auth Terdeteksi di Halaman Terkait
//     if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') {
//         firebase.auth().onAuthStateChanged((user) => {
//             if (user) {
//                 // Jika user sudah login dan berada di halaman login, lempar ke dashboard
//                 if (isLoginPage) {
//                     window.location.href = 'dashboard.html';
//                 }
//             } else {
//                 // Jika user belum login dan berada di halaman admin berproteksi
//                 if (requireAuth && !isLoginPage) {
//                     handleUnauthenticatedState();
//                 }
//             }
//         });
//     } 
//     // JALUR 2: SPRINT 15 MOCK FALLBACK (Jika SDK Firebase sengaja tidak dimuat di HTML)
//     else {
//         // Simulasi pemeriksaan status login berbasis Local Memory Session
//         const mockUserActive = localStorage.getItem('arista_mock_session_active') === 'true';

//         if (mockUserActive) {
//             if (isLoginPage) {
//                 window.location.href = 'dashboard.html';
//             }
//         } else {
//             if (requireAuth && !isLoginPage) {
//                 handleUnauthenticatedState();
//             }
//         }
//     }
// }

// /**
//  * Fungsi pembantu penanganan rute keluar/tidak sah
//  */
// function handleUnauthenticatedState() {
//     // VALIDASI: Cek apakah user keluar secara resmi lewat klik tombol logout
//     if (localStorage.getItem('logout_redirect_index') === 'true') {
//         localStorage.removeItem('logout_redirect_index'); // Bersihkan token penanda
//         localStorage.removeItem('arista_mock_session_active'); // Bersihkan sesi mock jika ada
//         window.location.href = '../index.html'; // Lempar langsung ke index luar
//     } else {
//         window.location.href = 'login.html'; // Jika menyusup langsung tanpa login, lempar ke login
//     }
// }

// // Deteksi otomatis kebutuhan autentikasi berdasarkan lokasi file berkas halaman
// document.addEventListener("DOMContentLoaded", () => {
//     const isLoginPage = window.location.pathname.includes('login.html');
//     checkAdminSession(!isLoginPage);
// });
