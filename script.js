document.addEventListener('DOMContentLoaded', function() {

    const backgroundMusic = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = `<svg viewBox="0 0 60 60"><polygon points="0,0 0,60 60,30" /></svg>`;
    const pauseIcon = `<svg viewBox="0 0 60 60"><rect x="0" y="0" width="15" height="60"/><rect x="25" y="0" width="15" height="60"/></svg>`;
    let musicPlayedOnce = false; // Flag untuk menandai apakah musik sudah pernah berhasil diputar

    // --- PERUBAHAN DIMULAI DI SINI ---

    // Fungsi untuk mencoba memainkan musik dan mengupdate tombol
    function attemptPlayMusic() {
        // Hanya coba putar jika belum pernah berhasil dan sedang paused
        if (!musicPlayedOnce && backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                // Berhasil! Update tombol ke pause dan set flag
                playPauseBtn.innerHTML = pauseIcon;
                musicPlayedOnce = true;
                console.log("Autoplay atau pemutaran berhasil.");
                 // Hapus listener interaksi jika autoplay berhasil di sini
                 document.removeEventListener('scroll', interactionPlayHandler);
                 document.removeEventListener('click', interactionPlayHandler);

            }).catch(error => {
                // Gagal (kemungkinan besar karena kebijakan autoplay)
                console.warn("Autoplay diblokir oleh browser:", error.message);
                // Pastikan tombol menampilkan ikon Play
                playPauseBtn.innerHTML = playIcon;
                musicPlayedOnce = false; // Set ulang flag jika gagal, agar interaksi bisa memicunya
                // Jangan hapus listener interaksi, karena autoplay gagal
            });
        } else if (!backgroundMusic.paused) {
             // Jika sudah bermain (mungkin dari cache state atau autoplay sebelumnya?), pastikan tombol benar
             playPauseBtn.innerHTML = pauseIcon;
             musicPlayedOnce = true; // Pastikan flag benar
             // Hapus listener interaksi karena sudah bermain
             document.removeEventListener('scroll', interactionPlayHandler);
             document.removeEventListener('click', interactionPlayHandler);
        }
    }

    // Coba putar musik segera setelah DOM siap
    attemptPlayMusic();

    // --- AKHIR PERUBAHAN UTAMA ---

    // Kontrol Tombol Play/Pause manual (Tetap diperlukan)
    playPauseBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            // Coba putar lagi jika di-klik
            attemptPlayMusic();
        } else {
            backgroundMusic.pause();
            playPauseBtn.innerHTML = playIcon;
            // Jangan set musicPlayedOnce = false di sini, karena user bisa pause/play manual
        }
    });

    // Fallback: Coba mainkan musik saat user berinteraksi pertama kali (scroll/klik) JIKA autoplay awal gagal
    // Gunakan handler yang sama untuk kedua event
    const interactionPlayHandler = () => {
        // Coba mainkan lagi saat ada interaksi pertama, hanya jika belum pernah berhasil main
        if (!musicPlayedOnce) {
             console.log("Mencoba memutar musik karena interaksi pengguna...");
            attemptPlayMusic(); // Coba lagi putar musiknya
        }
         // Hapus listener ini SETELAH interaksi PERTAMA terjadi,
         // baik musik berhasil diputar atau tidak, agar tidak terus menerus mencoba
         // Kecuali jika attemptPlayMusic gagal, listener akan tetap aktif via flag musicPlayedOnce
        // Jika attemptPlayMusic berhasil di sini, flag musicPlayedOnce jadi true, dan blok if di atas tidak akan jalan lagi.
    };

    // Tambahkan listener untuk interaksi pertama, akan dihapus di dalam attemptPlayMusic jika berhasil
    document.addEventListener('scroll', interactionPlayHandler, { once: false }); // once: false agar bisa mencoba lagi jika gagal
    document.addEventListener('click', interactionPlayHandler, { once: false }); // once: false


    // --- (Sisa kode JavaScript lainnya: Smooth Scroll, Intersection Observer, dll.) ---
    // (Pastikan kode ini berada di luar bagian yang baru ditambahkan/dimodifikasi)

    // Smooth Scroll... (Kode Anda sebelumnya)
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    // ... (rest of smooth scroll code) ...

    // Intersection Observer... (Kode Anda sebelumnya)
    const observerOptions = {
        // ...
    };
    const observerCallback = (entries, observer) => {
        // ...
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    // ... (rest of observer code) ...

    // Placeholder Handwriting / Particles... (Kode Anda sebelumnya)
    const handwritingElement = document.getElementById('handwriting-text');
    // ... (rest of handwriting/particle code) ...

}); // Akhir dari DOMContentLoaded
