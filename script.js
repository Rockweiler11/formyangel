document.addEventListener('DOMContentLoaded', function() {

    // --- Elemen Utama ---
    const backgroundMusic = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const handwritingElement = document.getElementById('handwriting-text');

    // --- Ikon Tombol Musik (SVG sebagai string) ---
    const playIconSVG = `<svg viewBox="0 0 60 60" class="music-icon"><polygon points="0,0 0,60 60,30" /></svg>`;
    const pauseIconSVG = `<svg viewBox="0 0 60 60" class="music-icon"><rect x="5" y="0" width="15" height="60"/><rect x="35" y="0" width="15" height="60"/></svg>`; // Sedikit penyesuaian posisi ikon pause

    // --- Status Musik ---
    let musicPlaybackAllowed = false; // Apakah browser mengizinkan pemutaran?
    let userInteracted = false;      // Apakah pengguna sudah berinteraksi?

    // -------------------------------------------------------------
    // Fungsi Update Tampilan Tombol Play/Pause
    // -------------------------------------------------------------
    function updatePlayButtonIcon() {
        if (!backgroundMusic) return; // Exit jika elemen tidak ditemukan

        if (backgroundMusic.paused) {
            playPauseBtn.innerHTML = playIconSVG;
        } else {
            playPauseBtn.innerHTML = pauseIconSVG;
        }
    }

    // -------------------------------------------------------------
    // Fungsi Mencoba Memutar Musik (Handle Autoplay & Interaksi)
    // -------------------------------------------------------------
    function attemptPlayMusic() {
        if (!backgroundMusic || !backgroundMusic.paused) return; // Exit jika elemen tdk ada atau sudah bermain

        // Hanya coba play jika diizinkan ATAU pengguna sudah berinteraksi
        if (musicPlaybackAllowed || userInteracted) {
            backgroundMusic.play().then(() => {
                console.log("Pemutaran musik berhasil dimulai.");
                musicPlaybackAllowed = true; // Tandai bahwa pemutaran kini diizinkan
                updatePlayButtonIcon();
            }).catch(error => {
                console.warn("Pemutaran musik gagal:", error.message);
                musicPlaybackAllowed = false; // Playback tidak diizinkan (kemungkinan autoplay diblokir)
                updatePlayButtonIcon(); // Pastikan ikon play ditampilkan jika gagal
            });
        } else {
             console.log("Menunggu interaksi pengguna untuk memutar musik...");
             updatePlayButtonIcon(); // Pastikan ikon play tampil saat menunggu
        }
    }

    // -------------------------------------------------------------
    // Setup Awal Musik & Tombol
    // -------------------------------------------------------------
    if (backgroundMusic && playPauseBtn) {
        // 1. Set ikon awal berdasarkan status pause (jika halaman di-refresh)
        updatePlayButtonIcon();

        // 2. Coba Autoplay (mungkin gagal)
        // Set 'muted' dulu agar kemungkinan autoplay lebih besar, lalu unmute
        backgroundMusic.muted = true;
        backgroundMusic.play().then(() => {
            // Jika 'muted autoplay' berhasil, tandai playback boleh
            musicPlaybackAllowed = true;
            console.log("Autoplay (muted) berhasil, mencoba unmute...");
            backgroundMusic.pause(); // Jeda sebentar
            backgroundMusic.muted = false;
             // Coba play lagi tanpa muted (mungkin gagal lagi tergantung interaksi)
             if (userInteracted) { // Jika user sudah keburu interaksi sebelum ini selesai
                 attemptPlayMusic();
             } else {
                 // Tunda sebentar sebelum attempt play agar browser 'relax'
                 setTimeout(attemptPlayMusic, 100);
             }
        }).catch(error => {
            // Jika 'muted autoplay' pun gagal, izin tetap false
            console.warn("Autoplay (muted) juga gagal:", error.message);
            musicPlaybackAllowed = false;
            backgroundMusic.muted = false; // Pastikan unmute
            updatePlayButtonIcon();
        });

        // 3. Event Listener untuk Tombol Play/Pause Manual
        playPauseBtn.addEventListener('click', () => {
             userInteracted = true; // Klik tombol adalah interaksi
            if (backgroundMusic.paused) {
                attemptPlayMusic(); // Coba mainkan
            } else {
                backgroundMusic.pause();
                updatePlayButtonIcon();
            }
        });

        // 4. Event listener untuk mendeteksi interaksi pengguna PERTAMA kali
        const interactionHandler = () => {
            if (!userInteracted) {
                 console.log("Interaksi pengguna terdeteksi.");
                userInteracted = true;
                // Coba mainkan musik setelah interaksi pertama, HANYA jika sedang pause
                if (backgroundMusic.paused) {
                    attemptPlayMusic();
                }
                // Hapus listener interaksi setelah dijalankan sekali
                 document.removeEventListener('click', interactionHandler, { capture: true });
                 document.removeEventListener('scroll', interactionHandler, { capture: true });
                 document.removeEventListener('keydown', interactionHandler, { capture: true });
            }
        };

        document.addEventListener('click', interactionHandler, { capture: true, once: true });
        document.addEventListener('scroll', interactionHandler, { capture: true, once: true });
        document.addEventListener('keydown', interactionHandler, { capture: true, once: true }); // Tambah keydown sbg interaksi

    } else {
        console.error("Elemen audio (#background-music) atau tombol (#play-pause-btn) tidak ditemukan.");
    }

    // -------------------------------------------------------------
    // Smooth Scroll untuk Link Navigasi
    // -------------------------------------------------------------
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // -------------------------------------------------------------
    // Intersection Observer untuk Efek Reveal on Scroll
    // (MENYEDERHANAKAN logika teks surat)
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (revealElements.length > 0) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger saat 10% terlihat
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                     // PENTING: Jika elemen adalah container surat, biarkan CSS menghandle fade-in teksnya.
                     // Kita tidak perlu lagi mengosongkan dan mengisi ulang via JS di sini,
                     // kecuali jika Anda MENGGUNAKAN library handwriting seperti Typed.js.

                     // Opsional: Hanya amati sekali jika tidak perlu animasi keluar-masuk
                     // observer.unobserve(entry.target);
                } else {
                     // Jika ingin elemen hilang saat keluar viewport
                    entry.target.classList.remove('is-visible');
                }
            });
        };

        const revealObserver = new IntersectionObserver(observerCallback, observerOptions);
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });

    } else {
         console.warn("Tidak ada elemen '.reveal-on-scroll' yang ditemukan untuk diamati.");
    }

    // --- (Tambahan untuk memastikan Teks Surat Tampil) ---
    // Jika TIDAK menggunakan Typed.js atau library animasi teks,
    // Pastikan elemen teks (#handwriting-text) sudah berisi teks di HTML
    // dan CSS menghandlenya seperti ini:
    /*
       .digital-letter .reveal-on-scroll { // Asumsi container surat punya kelas ini
           opacity: 0; // Awalnya transparan
           transition: opacity 1.5s ease-out; // Transisi saat muncul
       }
       .digital-letter .reveal-on-scroll.is-visible {
           opacity: 1; // Jadi terlihat saat container visible
       }
       #handwriting-text {
            opacity: 0; // Awalnya teks di dalamnya juga bisa transparan
            transition: opacity 1s 0.5s ease-out; // Fade-in setelah container muncul
            transition-delay: 0.5s; // Sedikit delay
       }
       .digital-letter .reveal-on-scroll.is-visible #handwriting-text {
           opacity: 1; // Tampilkan teks
       }
    */
    // JIKA ANDA MENGGUNAKAN Typed.js, uncomment/gunakan kode Typed.js Anda DI DALAM observerCallback
    // ketika entry.target adalah elemen surat DAN entry.isIntersecting true.

    // -------------------------------------------------------------
    // Kode untuk Partikel (Misal: tsParticles) - DIKOMENTARI DULU
    // -------------------------------------------------------------
    /*
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("particle-container", {
            // ... konfigurasi partikel Anda ...
             particles: {
                 number: { value: 30, density: { enable: true, value_area: 800 } }, // Kurangi jumlah jika berat
                 color: { value: "#f0a5a5" },
                 // ... (sisa konfigurasi)
            },
             // ... (sisa konfigurasi)
        }).then(container => {
            console.log("tsParticles loaded");
        }).catch(error => {
            console.error("tsParticles loading error:", error);
        });
    } else {
        console.log("tsParticles library not found. Skipping particle effects.");
    }
    */

    // -------------------------------------------------------------
     console.log("For Angel Website Script Loaded Successfully.");
    // -------------------------------------------------------------

}); // Akhir dari DOMContentLoaded
