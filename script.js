document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Menu Toggle ---
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      }
    });
  }

  // --- 2. Typewriter Effect (Home Page) ---
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const fullText = "React - UERJ";
    let currentText = "";
    let i = 0;
    
    // cursor element
    const cursor = document.createElement('span');
    cursor.className = "inline-block w-1 h-10 md:h-14 bg-gray-200 ml-2 animate-pulse align-bottom";
    typewriterElement.parentNode.appendChild(cursor);

    const typeWriter = setInterval(() => {
      currentText += fullText.charAt(i);
      typewriterElement.textContent = currentText;
      i++;
      if (i >= fullText.length) {
        clearInterval(typeWriter);
        setTimeout(() => {
             cursor.style.display = 'none'; // hide cursor after done typing
        }, 1500)
      }
    }, 150);
  }

  // --- 3. Photo Carousel (Registros Page) ---
  const carousels = document.querySelectorAll('.photo-carousel-container');
  
  carousels.forEach((carouselContainer) => {
    // Parse the image data from a data attribute
    const rawData = carouselContainer.getAttribute('data-photos');
    if (!rawData) return;
    
    const photos = JSON.parse(rawData);
    if (!photos || photos.length === 0) return;

    let currentIndex = 0;
    const mainImg = carouselContainer.querySelector('.carousel-main-img');
    const counterText = carouselContainer.querySelector('.carousel-counter');
    const prevBtn = carouselContainer.querySelector('.btn-prev');
    const nextBtn = carouselContainer.querySelector('.btn-next');
    const thumbContainer = carouselContainer.querySelector('.carousel-thumbnails');

    // Create thumbnails
    if (photos.length > 1 && thumbContainer) {
      photos.forEach((photo, index) => {
        const btn = document.createElement('button');
        btn.className = `flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${index === 0 ? 'border-blue-600 scale-105' : 'border-gray-300 hover:border-blue-400'}`;
        
        const img = document.createElement('img');
        img.src = photo;
        img.alt = `Miniatura ${index + 1}`;
        img.className = "w-full h-full object-cover";
        
        btn.appendChild(img);
        btn.addEventListener('click', () => updateCarousel(index));
        thumbContainer.appendChild(btn);
      });
    }

    const updateCarousel = (index) => {
      currentIndex = index;
      mainImg.src = photos[currentIndex];
      if (counterText) {
         counterText.textContent = `${currentIndex + 1} / ${photos.length}`;
      }
      
      // Update thumbnails styling
      if (thumbContainer) {
        const thumbBtns = thumbContainer.querySelectorAll('button');
        thumbBtns.forEach((btn, idx) => {
          if (idx === currentIndex) {
            btn.className = "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all border-blue-600 scale-105";
          } else {
            btn.className = "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all border-gray-300 hover:border-blue-400";
          }
        });
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
        updateCarousel(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
         const newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
         updateCarousel(newIndex);
      });
    }
  });

});

document.addEventListener('DOMContentLoaded', () => {
    // Make the menu functional by highlighting the correct page based on current URL path
    // For local files, pathname includes the full OS path. It's safer to just check the end of the URL.
    const currentUrl = window.location.href;
    const isIndex = currentUrl.endsWith('/') || currentUrl.endsWith('index.html');
    
    const navLinksList = document.querySelectorAll('nav a');
    
    navLinksList.forEach(link => {
       const href = link.getAttribute('href');
       
       // Handle classes based on current path and whether it's mobile or desktop
       const isCurrentPage = (href === 'index.html' && isIndex) || currentUrl.endsWith(href);
       
       if (isCurrentPage) {
           if(link.parentElement.classList.contains('flex-col')) {
              link.className = "w-full text-center px-4 py-3 rounded-md font-medium transition-colors duration-200 bg-purple-600 text-white shadow-sm";
           } else {
               link.className = "px-3 py-2 rounded-md font-medium transition-colors duration-200 bg-purple-600 text-white shadow-sm";
           }
       } else {
           if(link.parentElement.classList.contains('flex-col')) {
              link.className = "w-full text-center px-4 py-3 rounded-md font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-200";
           } else {
              link.className = "px-3 py-2 rounded-md font-medium transition-colors duration-200 text-gray-600 hover:bg-gray-200 hover:text-gray-800";
           }
       }
    });
});
