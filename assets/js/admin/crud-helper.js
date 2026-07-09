/**
 * ARISTA Core Engine - Generic CRUD, Validation, & Error Handling (Sprint 17.3)
 */

window.AristaCMS = {
    // ==========================================
    // MODULE 1: CENTRALIZED ERROR HANDLER
    // ==========================================
    Error: {
        parse(error) {
            if (!error) return "Terjadi kesalahan yang tidak diketahui.";
            console.error("📌 [AristaCMS Error Log]:", error);

            const msg = error.message ? error.message.toLowerCase() : "";
            const code = error.code ? String(error.code) : "";

            // 1. Pemetaan Kode Error Database PostgreSQL (PostgREST)
            const postgresErrors = {
                "23505": "Gagal menyimpan: Data dengan identitas/ID tersebut sudah ada.",
                "23503": "Gagal memproses: Data ini terikat dengan item lain di sistem.",
                "42P01": "Kesalahan Sistem: Tabel database tidak ditemukan.",
                "22P02": "Format data yang Anda masukkan tidak valid atau tidak cocok.",
                "PGRST116": "Data tidak ditemukan atau query menghasilkan baris ganda."
            };

            if (postgresErrors[code]) return postgresErrors[code];

            // 2. Pemetaan Berdasarkan Kata Kunci Pesan Error
            if (msg.includes("network") || msg.includes("fetch")) {
                return "Koneksi internet terputus atau gagal terhubung ke server cloud.";
            }
            if (msg.includes("row-level security") || msg.includes("violates rls")) {
                return "Akses ditolak: Anda tidak memiliki izin untuk mengubah data ini.";
            }
            if (msg.includes("storage/object-not-found")) {
                return "File atau gambar yang dicari tidak ditemukan di cloud storage.";
            }
            if (msg.includes("payload too large")) {
                return "Ukuran file terlalu besar! Maksimal batas upload adalah 2MB.";
            }

            // Default jika tidak terpetakan
            return error.message || "Terjadi kegagalan komunikasi data dengan cloud server.";
        }
    },

    // ==========================================
    // MODULE 2: FORM VALIDATION ENGINE
    // ==========================================
    Validator: {
        /**
         * Validasi payload berdasarkan aturan tertentu
         * @param {Object} data - Objek data dari form ({ title: '...', price: '...' })
         * @param {Object} rules - Aturan validasi
         * @returns {Object} { isValid: boolean, message: string }
         */
        validate(data, rules) {
            for (const field in rules) {
                const value = data[field] !== undefined && data[field] !== null ? String(data[field]).trim() : "";
                const rule = rules[field];

                // 1. Aturan Wajib Diisi (Required)
                if (rule.required && !value) {
                    return { isValid: false, message: Field `${rule.label || field} tidak boleh dikosongkan.` };
                }

                // 2. Aturan Angka Positif (Numeric & Positive)
                if (rule.numeric && value) {
                    if (isNaN(value) || Number(value) < 0) {
                        return { isValid: false, message: Field `${rule.label || field} harus berupa angka positif.` };
                    }
                }

                // 3. Aturan Panjang Karakter Minimum (Min Length)
                if (rule.minLength && value.length < rule.minLength) {
                    return { isValid: false, message: Field `${rule.label || field} minimal harus berisi ${rule.minLength} karakter.` };
                }
            }
            return { isValid: true, message: "Validasi sukses." };
        }
    },

    // ==========================================
    // MODULE 3: GENERIC CRUD & STORAGE SPEEDWAY
    // ==========================================
    CRUD: {
        // Ambil Semua Data (Read)
        async read(table, orderColumn = 'created_at', ascending = false) {
            try {
                const { data, error } = await window.supabase
                    .from(table)
                    .select('*')
                    .order(orderColumn, { ascending });

                if (error) throw error;
                return data || [];
            } catch (err) {
                throw new Error(window.AristaCMS.Error.parse(err));
            }
        },

        // Tambah Data Baru (Create)
        async create(table, payload) {
            try {
                const { data, error } = await window.supabase
                    .from(table)
                    .insert([payload])
                    .select();

                if (error) throw error;
                return data;
            } catch (err) {
                throw new Error(window.AristaCMS.Error.parse(err));
            }
        },

        // Perbarui Data (Update)
        async update(table, id, payload, idColumn = 'id') {
            try {
                const { data, error } = await window.supabase
                    .from(table)
                    .update(payload)
                    .eq(idColumn, id)
                    .select();

                if (error) throw error;
                return data;
            } catch (err) {
                throw new Error(window.AristaCMS.Error.parse(err));
            }
        },

        // Hapus Data (Delete)
        async delete(table, id, idColumn = 'id') {
            try {
                const { error } = await window.supabase
                    .from(table)
                    .delete()
                    .eq(idColumn, id);

                if (error) throw error;
                return true;
            } catch (err) {
                throw new Error(window.AristaCMS.Error.parse(err));
            }
        },

        // Hubungkan Otomatis ke Cloud Storage Bucket
        async uploadFile(bucket, folderName, file) {
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${folderName}/${fileName}`;

                // Eksekusi upload mentah
                const { error: uploadError } = await window.supabase.storage
                    .from(bucket)
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Ambil URL Publik Internet
                const { data: urlData } = window.supabase.storage
                    .from(bucket)
                    .getPublicUrl(filePath);

                return urlData.publicUrl;
            } catch (err) {
                throw new Error(window.AristaCMS.Error.parse(err));
            }
        }
    }
};
