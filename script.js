// ========================
// LOAD PRODUCTS FROM ADMIN
// ========================
const STORAGE_KEY = 'instafinds_products';

function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    if (storedProducts) {
        const products = JSON.parse(storedProducts);
        if (products.length > 0) {
            renderProductsFromAdmin(products);
        }
    }
}

function renderProductsFromAdmin(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    // Clear existing products
    productsGrid.innerHTML = '';

    // Render products from admin
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animation = `fadeInUp 0.6s ease backwards`;
        productCard.style.animationDelay = `${index * 0.1}s`;

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <span class="product-badge">-${product.discount || 0}%</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${Array(Math.floor(product.rating || 0)).fill('<i class="fas fa-star"></i>').join('')}
                    ${product.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    <span>(${product.reviews || 0} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>
                    <span class="price">Rp ${product.price.toLocaleString('id-ID')}</span>
                </div>
                <div class="affiliate-platforms" style="margin-bottom: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                    ${(product.platforms || []).map(platform => `
                        <a href="${product.affiliateLink}" target="_blank" class="platform-link" 
                           style="padding: 6px 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; border-radius: 12px; text-decoration: none; font-size: 12px; 
                                  font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                           onmouseover="this.style.opacity='0.8'; this.style.transform='scale(1.05)'"
                           onmouseout="this.style.opacity='1'; this.style.transform='scale(1)'"
                           onclick="trackProductClick('${product.id}')">
                            Beli di ${capitalizeFirst(platform)}
                        </a>
                    `).join('')}
                </div>
                <button class="btn btn-buy" onclick="trackAndRedirect('${product.affiliateLink}', '${product.id}')">
                    Beli Sekarang
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function trackProductClick(productId) {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const product = products.find(p => p.id === productId);
    if (product) {
        product.clicks = (product.clicks || 0) + 1;
        product.views = (product.views || 0) + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
}

function trackAndRedirect(link, productId) {
    trackProductClick(productId);
    window.open(link, '_blank');
}

// Load products on page load
document.addEventListener('DOMContentLoaded', loadProductsFromStorage);

// ========================
// SMOOTH SCROLL
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================
// ACTIVE NAV LINK
// ========================
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========================
// SCROLL ANIMATIONS
// ========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards and category cards
document.querySelectorAll('.product-card, .category-card, .promo-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ========================
// ADD TO CART / WISHLIST
// ========================
const cartBtns = document.querySelectorAll('.btn-buy');
const wishlistBtn = document.querySelector('.cart-btn:first-child');

let cart = JSON.parse(localStorage.getItem('instafindsCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('instafindWishlist')) || [];

cartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        
        cart.push({
            id: Date.now(),
            name: productName,
            price: productPrice,
            date: new Date().toLocaleString('id-ID')
        });
        
        localStorage.setItem('instafindsCart', JSON.stringify(cart));
        
        // Show notification
        showNotification(`${productName} ditambahkan ke keranjang!`);
        
        // Button effect
        const originalText = this.textContent;
        this.textContent = '✓ Ditambahkan';
        this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
        }, 2000);
    });
});

// Wishlist functionality
if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
        showNotification('Fitur wishlist akan segera hadir!');
        this.style.color = '#ff1493';
    });
}

// ========================
// NOTIFICATION SYSTEM
// ========================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================
// FORM HANDLING
// ========================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification(`Terima kasih! Kami akan mengirim promo eksklusif ke ${email}`);
            this.reset();
        }
    });
}

// ========================
// LOAD MORE PRODUCTS
// ========================
function addMoreProducts() {
    const productsGrid = document.querySelector('.products-grid');
    
    const newProducts = [
        {
            name: 'Perfume Mewah',
            price: 'Rp 259.000',
            originalPrice: 'Rp 349.000',
            discount: '-25%'
        },
        {
            name: 'Sunscreen Premium',
            price: 'Rp 189.000',
            originalPrice: 'Rp 249.000',
            discount: '-24%'
        },
        {
            name: 'Hair Treatment',
            price: 'Rp 179.000',
            originalPrice: 'Rp 239.000',
            discount: '-25%'
        }
    ];
    
    newProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="https://via.placeholder.com/280x280?text=${encodeURIComponent(product.name)}" alt="${product.name}">
                <span class="product-badge">${product.discount}</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span>(150+ reviews)</span>
                </div>
                <div class="product-price">
                    <span class="original-price">${product.originalPrice}</span>
                    <span class="price">${product.price}</span>
                </div>
                <button class="btn btn-buy">Beli Sekarang</button>
            </div>
        `;
        
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(20px)';
        productCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        productCard.style.transitionDelay = `${index * 0.1}s`;
        
        productsGrid.appendChild(productCard);
        
        setTimeout(() => {
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateY(0)';
        }, 10);
        
        // Add buy button functionality
        const buyBtn = productCard.querySelector('.btn-buy');
        buyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            cart.push({
                id: Date.now(),
                name: productName,
                price: productPrice,
                date: new Date().toLocaleString('id-ID')
            });
            
            localStorage.setItem('instafindsCart', JSON.stringify(cart));
            showNotification(`${productName} ditambahkan ke keranjang!`);
            
            const originalText = this.textContent;
            this.textContent = '✓ Ditambahkan';
            this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        });
    });
}

// ========================
// PAGE LOAD ANIMATIONS
// ========================
window.addEventListener('load', () => {
    // Fade in sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.animation = `fadeIn 0.6s ease forwards`;
        section.style.animationDelay = `${index * 0.1}s`;
    });
});

// Add fadeIn animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(fadeInStyle);

// ========================
// CART COUNTER
// ========================
function updateCartCounter() {
    const cartLength = cart.length;
    // Update cart display if needed
    console.log(`Items in cart: ${cartLength}`);
}

// Initial cart counter update
updateCartCounter();

// ========================
// RESPONSIVE NAVBAR TOGGLE
// ========================
function handleMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
    }
}

window.addEventListener('resize', handleMobileMenu);
handleMobileMenu();

// ========================
// SCROLL TO TOP BUTTON
// ========================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.1) translateY(-5px)';
});

scrollTopBtn.addEventListener('mouseout', function() {
    this.style.transform = 'scale(1) translateY(0)';
});

// Log when page loads
console.log('Instafinds.id website loaded successfully! 🎉');
