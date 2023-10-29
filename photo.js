// Your Unsplash API Key
const unsplashAPIKey = '-5A_6t-_cjgxoax4cNJtZ2tItwz6JWu0SQhBxDAgbw4';

// Array to store image data
let data = [];
let data1 = [];

// Function to fetch random images from Unsplash
async function fetchImages() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?count=10&client_id=${unsplashAPIKey}`);

        const gallery = document.querySelector('.gallery');
        data = await response.json();

        data.forEach((item) => {
            const img = document.createElement('img');
            img.src = item.urls.regular;
            img.alt = item.alt_description;

            img.addEventListener('click', () => openLightbox(item.urls.full));

            gallery.appendChild(img);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Search input and button
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        clearGallery();
        fetchImagesBySearch(searchTerm);
    }
});

// Function to clear the gallery
function clearGallery() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    data1 = []; // Clear the data1 array when searching
}

// Function to fetch images by search query
async function fetchImagesBySearch(query) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=10&client_id=${unsplashAPIKey}`);
        const searchData = await response.json();

        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = ''; // Clear the gallery

        searchData.results.forEach((item, index) => {
            const img = document.createElement('img');
            img.src = item.urls.regular;
            img.alt = item.alt_description;

            img.addEventListener('click', () => openLightbox(item.urls.full, index));

            gallery.appendChild(img);
        });

        data1 = searchData.results; // Update data1 with search results

        createSearchResultsCarousel(); // Create the carousel
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Function to close the lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

// Variable to keep track of the current image index in the lightbox
let currentImageIndex = 0;

// Function to open the lightbox and display a specific image
function openLightbox(imageUrl, index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = imageUrl;
    lightbox.style.display = 'block';
    currentImageIndex = index !== undefined ? index : 0; // Set the index to 0 if not provided

    // Update the previous and next buttons
    document.getElementById('prev-button').addEventListener('click', () => prevImage());
    document.getElementById('next-button').addEventListener('click', () => nextImage());
}

// Function to navigate to the previous image in the lightbox
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + data1.length) % data1.length;
    updateLightboxImage();
}

// Function to navigate to the next image in the lightbox
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % data1.length;
    updateLightboxImage();
}

// Function to update the displayed image in the lightbox
function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = data1[currentImageIndex].urls.full;
}

// Event listener to fetch random images when the page loads
window.addEventListener('load', () => {
    fetchImages();
});

// Function to create a carousel with search results
function createSearchResultsCarousel() {
    const carousel = document.querySelector('.carousel');

    // Clear the carousel
    carousel.innerHTML = '';

    data1.forEach((item) => {
        const img = document.createElement('img');
        img.src = item.urls.regular;
        img.alt = item.alt_description;

        img.addEventListener('click', () => openLightbox(item.urls.full));

        carousel.appendChild(img);
    });

    // Initialize the Slick carousel
    $(carousel).slick({
        slidesToShow: 9, // Number of slides to show
        slidesToScroll: 1, // Number of slides to scroll
        infinite: true,
        prevArrow: '<button id="prev-button" class="carousel-prev">&#9664;</button>',
        nextArrow: '<button id="next-button" class="carousel-next">&#9654;</button>',
    });
}
