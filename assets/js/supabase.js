/**
 * ARISTA Core Backend - Supabase Global Initialization Client
 */

if (typeof ARISTA_CONFIG !== 'undefined' && ARISTA_CONFIG.supabaseConfig) {
    try {
        // Menginisialisasi client Supabase secara aman ke window global
        window.supabase = supabase.createClient(
            ARISTA_CONFIG.supabaseConfig.url,
            ARISTA_CONFIG.supabaseConfig.anonKey
        );
    } catch (error) {
        console.error("Gagal membuat instance Supabase Client:", error.message);
    }
} else {
    console.error("Kesalahan Sistem: Konfigurasi ARISTA_CONFIG.supabaseConfig tidak ditemukan.");
}
