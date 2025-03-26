document.addEventListener('DOMContentLoaded', function() {

    const backgroundMusic = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = `<svg viewBox="0 0 60 60"><polygon points="0,0 0,60 60,30" /></svg>`;
    const pauseIcon = `<svg viewBox="0 0 60 60"><rect x="0" y="0" width="15" height="60"/><rect x="25" y="0" width="15" height="60"/></svg>`;
    let musicPlayedOnce = false; // Flag untuk autoplay

    // Fungsi untuk memainkan musik (menangani promise & autoplay restriction)
    function playMusic() {
        backgroundMusic.play().then(() => {
            playPauseBtn.innerHTML = pauseIcon;
            musicPlayedOnce = true;
        }).catch(error => {
            console.log("Autoplay mungkin diblokir:", error);
            // Jika autoplay gagal, biarkan tombol play & jangan set flag
            playPauseBtn.innerHTML = playIcon;
        });
    }

    // Coba autoplay saat halaman load
    // Browser modern mungkin memblokir ini sampai ada interaksi user
    // Kita akan coba mainkan saat user scroll atau klik pertama kali
    // playMusic(); // Komentari dulu autoplay langsung

    // Kontrol Tombol Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            playMusic();
        } else {
            backgroundMusic.pause();
            playPauseBtn.innerHTML = playIcon;
        }
    });

    // Coba mainkan musik saat user berinteraksi pertama kali (scroll/klik)
    function attemptPlayOnInteraction() {
        if (!musicPlayedOnce && backgroundMusic.paused) {
             playMusic();
             // Hapus listener ini setelah berhasil play atau dicoba
             document.removeEventListener('scroll', attemptPlayOnInteraction);
             document.removeEventListener('click', attemptPlayOnInteraction);
        }
    }
    document.addEventListener('scroll', attemptPlayOnInteraction, { once: true }); // Coba play saat scroll pertama
    document.addEventListener('click', attemptPlayOnInteraction, { once: true }); // Coba play saat klik pertama

    // Smooth Scroll untuk Link Navigasi (Jika CSS 'scroll-behavior' tidak cukup)
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Scroll ke bagian atas elemen
                });
            }
        });
    });

    // Intersection Observer untuk Efek Reveal on Scroll & Parallax Sederhana
    const observerOptions = {
        root: null, // relative to viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger saat 10% elemen terlihat
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // (Opsional) Efek Parallax Sederhana: Gerakkan sedikit saat muncul
                // Ini bisa diperluas atau diganti dengan library parallax
                if (entry.target.closest('.parallax-section')) {
                     // Tambahkan gaya parallax sederhana di sini jika mau
                     // Contoh: entry.target.style.transform = `translateY(calc(-${entry.intersectionRatio * 10}px))`;
                     // Atau, biarkan CSS .is-visible yang mengaturnya
                }

                 // (Opsional) Hentikan observasi setelah elemen terlihat jika tidak perlu di-reset
                 // observer.unobserve(entry.target);

            } else {
                // (Opsional) Sembunyikan kembali elemen saat scroll keluar viewport
                 entry.target.classList.remove('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Amati semua elemen yang butuh efek reveal
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });

    // Placeholder untuk Animasi Handwriting (Membutuhkan Library seperti Typed.js atau implementasi custom)
    const handwritingElement = document.getElementById('handwriting-text');
    if (handwritingElement) {
        const originalText = handwritingElement.innerHTML; // Simpan teks asli (termasuk <br>)
        handwritingElement.innerHTML = ''; // Kosongkan dulu
        handwritingElement.style.opacity = '1'; // Pastikan terlihat

        // ---- OPSI 1: Menggunakan Library (Contoh dengan Typed.js - PERLU di-include di HTML) ----
        /*
        Jika kamu menyertakan Typed.js:
        <script src="https://unpkg.com/typed.js@2.0.16/dist/typed.umd.js"></script>

        Lalu aktifkan kode di bawah ini:
        */
        /*
        if (typeof Typed !== 'undefined') {
             // Amati elemen surat menggunakan Intersection Observer
             const letterObserver = new IntersectionObserver((entries) => {
                 entries.forEach(entry => {
                     if (entry.isIntersecting) {
                         // Hanya jalankan Typed.js sekali saat elemen pertama kali terlihat
                         if (!entry.target.hasAttribute('data-typed-initiated')) {
                             new Typed('#handwriting-text', {
                                 strings: [originalText.replace(/<br\s*\/?>/ig, '\n')], // Ganti <br> dengan newline untuk Typed.js
                                 typeSpeed: 40, // Kecepatan ketik (ms)
                                 showCursor: true,
                                 cursorChar: '_',
                                 startDelay: 500, // Mulai setelah sedikit delay
                                 contentType: 'html', // Gunakan 'html' jika teks mengandung HTML
                                 autoInsertCss: true, // Typed.js akan menambahkan CSS kursor
                                 onComplete: (self) => {
                                     self.cursor.remove(); // Hapus kursor setelah selesai
                                 }
                             });
                             entry.target.setAttribute('data-typed-initiated', 'true'); // Tandai sudah dijalankan
                         }
                        // Hapus observasi setelah animasi dimulai
                        letterObserver.unobserve(entry.target);
                    }
                 });
             }, { threshold: 0.5 }); // Mulai animasi saat 50% terlihat

             letterObserver.observe(handwritingElement);

        } else {
            console.warn("Typed.js tidak ditemukan. Memuat teks secara langsung.");
            handwritingElement.innerHTML = originalText; // Tampilkan teks biasa jika library tidak ada
        }
        */

         // ---- OPSI 2: Animasi Fade-in Sederhana (Jika tidak pakai library) ----
         // Biarkan Observer di atas (yang menambah class .is-visible) menangani fade-in dasar.
         // Anda mungkin perlu menambahkan transisi opacity pada #handwriting-text di CSS.
          handwritingElement.innerHTML = originalText; // Langsung isi teksnya
          // Pastikan class 'reveal-on-scroll' sudah ada di elemen .digital-letter
          // Jika ingin animasi muncul kata per kata tanpa library, itu butuh JS yg lebih kompleks.

        // OPSI 3 (IMPLEMENTASI TANPA LIBRARY) : Mengisi teks asli saat elemen terlihat
        const letterObserver = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     if (!entry.target.hasAttribute('data-text-loaded')) {
                          handwritingElement.innerHTML = originalText; // Isi teks asli
                          entry.target.setAttribute('data-text-loaded', 'true'); // Tandai sudah diisi
                     }
                     // Hapus observasi setelah teks diisi agar tidak berulang
                     // letterObserver.unobserve(entry.target); // Anda bisa hapus observasi jika animasi tidak perlu diulang
                 } else {
                     // Kosongkan kembali jika keluar viewport (opsional, tergantung efek yg diinginkan)
                     // handwritingElement.innerHTML = '';
                     // entry.target.removeAttribute('data-text-loaded');
                 }
             });
         }, { threshold: 0.3 }); // Munculkan saat 30% bagian surat terlihat

         letterObserver.observe(document.querySelector('.digital-letter')); // Amati container suratnya


    } // Akhir dari if(handwritingElement)


    // Placeholder untuk Partikel Mengambang (Membutuhkan Library seperti particles.js/tsParticles atau CSS rumit)

    // ---- Contoh dengan tsParticles (PERLU di-include di HTML) ----
    /*
    Jika kamu menyertakan tsParticles:
    <script src="https://cdn.jsdelivr.net/npm/tsparticles@latest/tsparticles.bundle.min.js"></script>

    Lalu aktifkan kode di bawah ini dan sesuaikan konfigurasinya:
    */
    /*
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("particle-container", {
            fpsLimit: 60,
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } }, // Jumlah partikel
                color: { value: "#f0a5a5" }, // Warna partikel (pink lembut)
                shape: { type: "circle" },
                opacity: {
                    value: { min: 0.1, max: 0.5 }, // Opacity acak
                    anim: { enable: true, speed: 1, sync: false }
                },
                size: {
                    value: { min: 1, max: 3 }, // Ukuran acak
                },
                move: {
                    enable: true,
                    speed: 0.5, // Kecepatan gerak lambat
                    direction: "none", // Arah acak
                    random: true,
                    straight: false,
                    outModes: { // Apa yg terjadi di tepi
                        default: "out"
                    },
                    attract: { enable: false },
                    drift: 2 // Sedikit efek mengambang/melayang
                },
            },
            interactivity: {
                 detectsOn: "canvas",
                 events: {
                     onHover: { enable: false }, // Tidak interaktif saat hover
                     onClick: { enable: false }, // Tidak interaktif saat klik
                     resize: true,
                 },
             },
             detectRetina: true,
             background: {
                 color: "transparent", // Pastikan background container transparan
             }
        });
    } else {
        console.warn("tsParticles tidak ditemukan. Tidak ada animasi partikel.");
    }
    */

}); // Akhir dari DOMContentLoaded
