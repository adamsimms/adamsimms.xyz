/**
 * Lazy loading script for images
 * Add this to index.html if you add more images in the future
 */

if ('IntersectionObserver' in window) {
  // Use Intersection Observer for modern browsers
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // Remove loading class, add loaded class
        img.classList.remove('lazy');
        img.classList.add('loaded');
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before entering viewport
    threshold: 0.01
  });

  // Observe all images with lazy class
  document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img);
  });
} else {
  // Fallback for older browsers - load all images immediately
  document.querySelectorAll('img.lazy').forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    img.classList.remove('lazy');
    img.classList.add('loaded');
  });
}

// Add blur-up effect CSS if not already present
if (!document.getElementById('lazy-load-styles')) {
  const style = document.createElement('style');
  style.id = 'lazy-load-styles';
  style.textContent = `
    img.lazy {
      filter: blur(5px);
      transition: filter 0.3s;
    }
    
    img.loaded {
      filter: blur(0);
    }
  `;
  document.head.appendChild(style);
}
