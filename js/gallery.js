/**
 * Gallery System
 * Handles lazy loading and lightbox functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    let imagesLoaded = 0;
    const imagesPerLoad = 6;
    let allImages = [];
    
    /**
     * Create gallery item HTML element
     * @param {Object} imageData - Image data object
     * @returns {HTMLElement} - Gallery item element
     */
    function createGalleryItem(imageData) {
        const item = document.createElement('div');
        item.className = 'gallery-item loading';
        item.dataset.id = imageData.id;
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageData.path;
        img.alt = imageData.title;
        img.loading = 'lazy';
        
        // Handle image loading
        img.onload = function() {
            item.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        img.onerror = function() {
            item.classList.remove('loading');
            item.classList.add('error');
            img.src = 'assets/gallery-placeholder.jpg'; // Add a placeholder image
        };
        
        // Create info overlay
        const info = document.createElement('div');
        info.className = 'gallery-item-info';
        
        const title = document.createElement('div');
        title.className = 'gallery-item-title';
        title.textContent = imageData.title;
        
        const description = document.createElement('div');
        description.className = 'gallery-item-description';
        description.textContent = imageData.description;
        
        info.appendChild(title);
        info.appendChild(description);
        
        // Assemble item
        item.appendChild(img);
        item.appendChild(info);
        
        // Add click event for lightbox
        item.addEventListener('click', function() {
            openLightbox(imageData);
        });
        
        return item;
    }
    
    /**
     * Load images from JSON and render them
     * @param {number} count - Number of images to load
     */
    async function loadImages(count = imagesPerLoad) {
        const galleryGrid = document.getElementById('gallery-grid');
        
        if (!galleryGrid) {
            console.error('Gallery grid container not found');
            return;
        }
        
        try {
            // If first load, fetch all images
            if (allImages.length === 0) {
                const response = await fetch('gallery.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                allImages = data.images || [];
            }
            
            // Calculate slice of images to load
            const endIndex = Math.min(imagesLoaded + count, allImages.length);
            const imagesToLoad = allImages.slice(imagesLoaded, endIndex);
            
            // Render images
            imagesToLoad.forEach(imageData => {
                const galleryItem = createGalleryItem(imageData);
                galleryGrid.appendChild(galleryItem);
                imagesLoaded++;
            });
            
            // Hide load more button if all images are loaded
            if (imagesLoaded >= allImages.length) {
                const loadMoreBtn = document.getElementById('load-more');
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = 'none';
                }
            }
            
            console.log(`Loaded ${imagesToLoad.length} images (${imagesLoaded}/${allImages.length} total)`);
            
        } catch (error) {
            console.error('Error loading gallery images:', error);
            
            // Show error message
            const galleryGrid = document.getElementById('gallery-grid');
            galleryGrid.innerHTML = `
                <div class="gallery-loading">
                    <p>Failed to load gallery images. Please try again later.</p>
                    <button onclick="Gallery.loadImages()" class="btn btn-primary">Retry</button>
                </div>
            `;
        }
    }
    
    
    /**
     * Open lightbox with full image
     * @param {Object} imageData - Image data object
     */
    function openLightbox(imageData) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDescription = document.getElementById('lightbox-description');
        
        if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription) {
            console.error('Lightbox elements not found');
            return;
        }
        
        // Set lightbox content
        lightboxImage.src = imageData.path;
        lightboxImage.alt = imageData.title;
        lightboxTitle.textContent = imageData.title;
        lightboxDescription.textContent = imageData.description;
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add keyboard support
        document.addEventListener('keydown', handleLightboxKeydown);
    }
    
    /**
     * Close lightbox
     */
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            
            // Remove keyboard support
            document.removeEventListener('keydown', handleLightboxKeydown);
        }
    }
    
    /**
     * Handle keyboard events for lightbox
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleLightboxKeydown(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
    
    /**
     * Initialize gallery functionality
     */
    function initGallery() {
        // Load initial images
        loadImages();
        
        // Setup load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                loadImages();
            });
        }
        
        // Setup lightbox close button
        const lightboxClose = document.getElementById('lightbox-close');
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        // Close lightbox when clicking background
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        // Set current year in footer
        const currentYear = document.getElementById('current-year');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
        
        console.log('Gallery system initialized');
    }
    
    /**
     * Public API for gallery system
     */
    window.Gallery = {
        loadImages: loadImages,
        openLightbox: openLightbox,
        closeLightbox: closeLightbox,
        reload: () => {
            imagesLoaded = 0;
            allImages = [];
            document.getElementById('gallery-grid').innerHTML = '';
            loadImages();
        }
    };
    
    // Initialize gallery when DOM is ready
    initGallery();
});
