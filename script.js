ScrollReveal().reveal('.reveal', {
    delay: 200,
    distance: '50px',
    origin: 'bottom',
    duration: 1000,
    interval: 200,
    reset: true
});

ScrollReveal().reveal('.hero h1', { delay: 500, origin: 'top', distance: '30px' });
ScrollReveal().reveal('.hero-img', { delay: 300, scale: 0.8 });

const isMobile = () => window.innerWidth <= 600;

function openModal(fileSrc) {
    if (isMobile()) {
        // On mobile, open the image/video in a new tab
        window.open(fileSrc, '_blank');
        return;
    }

    const modal = document.getElementById("imageModal");
    const fullImg = document.getElementById("fullImg");
    const fullVideo = document.getElementById("fullVideo");
    const figmaEmbed = document.getElementById("figmaEmbed");
    const videoSource = document.getElementById("videoSource");

    document.body.classList.add('modal-open');

    // RESET EVERYTHING: Hide all three types first
    fullImg.style.display = "none";
    fullVideo.style.display = "none";
    if (figmaEmbed) figmaEmbed.style.display = "none"; // Hide Figma when opening image/video

    if (fileSrc.endsWith('.mp4')) {
        fullVideo.style.display = "block";
        videoSource.src = fileSrc;
        fullVideo.load();
        fullVideo.play();
    } else {
        fullImg.style.display = "block";
        fullImg.src = fileSrc;
    }

    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("open");
    }, 10);
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    const fullImg = document.getElementById("fullImg");
    const fullVideo = document.getElementById("fullVideo");
    const videoSource = document.getElementById("videoSource");
    const figmaEmbed = document.getElementById("figmaEmbed");
    const counter = document.getElementById('galleryCounter');
    const closeBtn = document.querySelector('.close-btn');

    document.body.classList.remove('modal-open');

    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    if (counter) counter.style.display = 'none';
    if (closeBtn) closeBtn.style.display = 'none';

    if (figmaEmbed) figmaEmbed.style.display = "none";
    if (fullImg) {
        fullImg.style.display = "none";
    }
    if (fullVideo) {
        fullVideo.style.display = "none";
        fullVideo.pause();
    }

    modal.classList.remove("open");
    document.body.classList.remove('modal-open');

    setTimeout(() => {
        modal.style.display = "none";

        // Clear sources so the browser releases the memory
        if (videoSource) videoSource.src = "";
        if (fullVideo) fullVideo.load();
        if (figmaEmbed) figmaEmbed.src = "";
        if (closeBtn) closeBtn.style.display = '';
    }, 400);
}

function openFigma(url) {
    if (isMobile()) {
        // Figma embeds are very heavy on mobile; 
        // opening the direct link is much smoother.
        window.open(url, '_blank');
        return;
    }

    const modal = document.getElementById("imageModal");
    const figmaEmbed = document.getElementById("figmaEmbed");
    const fullImg = document.getElementById("fullImg");
    const fullVideo = document.getElementById("fullVideo");

    // RESET EVERYTHING: Hide all three types first
    fullImg.style.display = "none";
    fullVideo.style.display = "none";

    // Show only Figma
    figmaEmbed.style.display = "block";
    figmaEmbed.src = url;

    modal.style.display = "flex";
    setTimeout(() => { modal.classList.add("open"); }, 10);
}

let scrollInterval;
const grid = document.getElementById('projectGrid');

function startScroll(speed) {
    stopScroll();
    function move() {
        grid.scrollLeft += speed;
        scrollInterval = requestAnimationFrame(move);
    }
    scrollInterval = requestAnimationFrame(move);
}

function stopScroll() {
    cancelAnimationFrame(scrollInterval);
}

function clickScroll(amount) {
    // Stops the hover scroll so they don't fight each other
    stopScroll();

    grid.scrollBy({
        left: amount,
        behavior: 'smooth'
    });
}

let currentGallery = [];
let currentIndex = 0;

function openGallery(images) {
    currentGallery = images;
    currentIndex = 0;

    document.body.classList.add('modal-open');

    document.getElementById('prevBtn').style.display = 'flex';
    document.getElementById('nextBtn').style.display = 'flex';

    updateGalleryImage();

    const modal = document.getElementById('imageModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('open'), 10);
}


const modal = document.getElementById('imageModal');
const img = document.getElementById('fullImg');


function changeSlide(direction) {
    currentIndex += direction;

    // Loop back to start/end
    if (currentIndex >= currentGallery.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = currentGallery.length - 1;

    updateGalleryImage();
}

function updateGalleryImage() {
    const fullImg = document.getElementById('fullImg');
    const counter = document.getElementById('galleryCounter');
    fullImg.src = currentGallery[currentIndex];
    fullImg.style.display = 'block';

    counter.innerText = `${currentIndex + 1} / ${currentGallery.length}`;
    counter.style.display = currentGallery.length > 1 ? 'block' : 'none';

    // Hide other modal types (video/figma)
    document.getElementById('fullVideo').style.display = 'none';
    document.getElementById('figmaEmbed').style.display = 'none';
}

// Keyboard Navigation for Gallery and Modal
document.addEventListener('keydown', function (event) {
    const modal = document.getElementById("imageModal");

    // Only run if the modal is actually open
    if (modal.style.display === "flex") {

        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault(); 
        }

        if (event.key === "ArrowRight") {
            if (document.getElementById('nextBtn').style.display === 'flex') {
                changeSlide(1);
            }
        }
        else if (event.key === "ArrowLeft") {
            if (document.getElementById('prevBtn').style.display === 'flex') {
                changeSlide(-1);
            }
        }
        else if (event.key === "Escape") {
            closeModal();
        }
    }
});

document.getElementById('modalOverlay').addEventListener('click', function () {
    if (!isMobile()) {
        // Only allow background-to-close on Desktop
        closeModal();
    }
});
