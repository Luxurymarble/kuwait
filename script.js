$(document).ready(function() {
    let lastScrollTop = 0;
    const mobileNav = $('.mobile-nav');

    // 1. وظائف السايد بار (فتح / إغلاق / إخفاء الأيقونة)
    $('.btn').click(function() {
        $(this).addClass("click"); 
        $('.sidebar').addClass("show");
    });

    function closeSidebar() {
        $('.sidebar').removeClass("show");
        $('.btn').removeClass("click");
    }

    // إغلاق السايد بار عند الضغط على الروابط أو خارج القائمة
    $('.sidebar ul li a').click(function() {
        closeSidebar();
    });

    $(document).mouseup(function(e) {
        var container = $(".sidebar, .btn");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            closeSidebar();
        }
    });

    // 2. وظيفة التنقل بين الأقسام (الربط الديناميكي)
    $('.nav-link').on('click', function(e) {
        var target = $(this).attr('href');
        
        if (target && target.startsWith("#")) {
            e.preventDefault();
            var sectionName = $(this).text().trim(); 
            
            // تمييز الرابط النشط
            $('.nav-link').removeClass('active-link');
            $(`.nav-link[href="${target}"]`).addClass('active-link');

            // إغلاق السايد بار فوراً عند الاختيار
            closeSidebar();

            if (target === "#top") {
                // العودة للرئيسية
                $('header#top').fadeIn(400); 
                $('#instagram-feed').fadeIn(800); 
                $('#section-header').fadeOut(500); 
                $('.section-content').hide();
                $('html, body').stop().animate({ scrollTop: 0 }, 1000);
            } else {
                // الانتقال لقسم فرعي
                var $targetElement = $(target);
                if ($targetElement.length) {
                    $('header#top').fadeOut(500); 
                    $('#instagram-feed').hide(); 

                    // --- التعديل المطلوب: إخفاء العنوان في صفحة من نحن فقط ---
                    if (target === "#about-section") {
                        $('#section-header').hide(); 
                    } else {
                        $('#dynamic-title').text(sectionName);
                        $('#section-header').fadeIn(400);
                    }

                    $('.section-content').hide();
                    $targetElement.fadeIn(100);
                    $('html, body').stop().animate({ scrollTop: 0 }, 100);
                }
            }
        }
    });

    // 3. التحكم في الشريط العلوي عند التمرير (الكمبيوتر والهاتف)
    $(window).on('scroll', function() {
        let currentScroll = $(this).scrollTop();

        // تأثير الشفافية (للكمبيوتر والهاتف)
        if (currentScroll > 50) {
            $('.desktop-nav').addClass('scrolled');
            mobileNav.addClass('scrolled');
        } else {
            $('.desktop-nav').removeClass('scrolled');
            mobileNav.removeClass('scrolled');
        }

        // تأثير الاختفاء عند التمرير لأسفل (للهاتف فقط)
        if (window.innerWidth < 992) {
            if (currentScroll > lastScrollTop && currentScroll > 150) {
                mobileNav.addClass('nav-hidden');
            } else {
                mobileNav.removeClass('nav-hidden');
            }
        }
        lastScrollTop = currentScroll;
    });

    // --- الجزء المعدل لمنع تكرار المنتجات ---
    let products = JSON.parse(localStorage.getItem('marbleProducts')) || [];

    products.forEach(product => {
        const productHTML = `
            <div class="product-card" data-description="${product.description}" onclick="openLightbox(this)">
                <img src="${product.image}">
                <div class="info"><h3>${product.title}</h3></div>
            </div>
        `;
        $(`#${product.category} .grid`).append(productHTML);
    });

    // --- إضافة التحقق من حالة الأدمن داخل document.ready لضمان الظهور الفوري ---
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        const navMenu = document.getElementById('nav-menu');
        const sidebarMenu = document.getElementById('sidebar-menu');
        
        if (navMenu) {
            const adminLi = document.createElement('li');
            adminLi.innerHTML = `
                <a href="admin.html" style="color: #000 !important; background: #d4af37; font-weight: bold; padding: 5px 12px; border-radius: 4px; margin-right: 5px; text-decoration: none; display: inline-block;">
                    <i class="fas fa-tools"></i> لوحة التحكم
                </a>
            `;
            navMenu.appendChild(adminLi);

            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `
                <button onclick="logoutAdmin()" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-family: 'Cairo'; font-weight: bold; margin-right: 5px;">
                    <i class="fas fa-sign-out-alt"></i> خروج
                </button>
            `;
            navMenu.appendChild(logoutLi);
        }

        if (sidebarMenu && !sidebarMenu.innerHTML.includes('admin.html')) {
            const sideLi = document.createElement('li');
            sideLi.innerHTML = `<a href="admin.html" class="nav-link" style="color: #d4af37;">لوحة التحكم</a>`;
            sidebarMenu.appendChild(sideLi);

            const sideLogoutLi = document.createElement('li');
            sideLogoutLi.innerHTML = `<a href="#" onclick="logoutAdmin()" class="nav-link" style="color: #e74c3c;">تسجيل الخروج</a>`;
            sidebarMenu.appendChild(sideLogoutLi);
        }
    }
});

// 4. وظائف الـ Lightbox
let currentProducts = []; 
let currentIndex = 0;    

function openLightbox(element) {
    const section = element.closest('.grid');
    currentProducts = Array.from(section.querySelectorAll('.product-card'));
    currentIndex = currentProducts.indexOf(element);
    updateLightbox();
    document.getElementById('lightbox').style.display = 'flex';
}

function updateLightbox() {
    const product = currentProducts[currentIndex];
    const imgUrl = product.querySelector('img').src;
    const title = product.querySelector('.info h3').innerText;
    const desc = product.getAttribute('data-description') || "رخام فاخر بتصميم حصري من لاكشري ماربل.";
    
    document.getElementById('lightbox-img').src = imgUrl;
    document.getElementById('lightbox-title').innerText = title;
    document.getElementById('lightbox-desc').innerText = desc;

    const phoneNumber = "201150142351";
    const message = `السلام عليكم لاكشري ماربل،
أريد الاستفسار عن المنتج التالي:
*الاسم:* ${title}
*رابط الصورة:* ${imgUrl}`;
    document.getElementById('order-now-btn').href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function changeProduct(direction) {
    currentIndex += direction;
    if (currentIndex >= currentProducts.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = currentProducts.length - 1;
    updateLightbox();
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// التحكم باللمس (Swipe) للـ Lightbox
let touchstartX = 0;
let touchendX = 0;
const lightboxContainer = document.getElementById('lightbox');

lightboxContainer.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, {passive: true});

lightboxContainer.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
}, {passive: true});

function handleGesture() {
    if (touchstartX - touchendX > 50) changeProduct(1);
    if (touchendX - touchstartX > 50) changeProduct(-1);
}

// إغلاق النافذة عند الضغط على الخلفية أو Esc
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
});

document.addEventListener('keydown', function(e) {
    if (document.getElementById('lightbox').style.display === 'flex') {
        if (e.key === "ArrowRight") changeProduct(1);
        if (e.key === "ArrowLeft") changeProduct(-1);
        if (e.key === "Escape") closeLightbox();
    }
});

// التحقق من حالة الأدمن وتسجيل الخروج
function logoutAdmin() {
    if(confirm("هل تريد تسجيل الخروج؟")) {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.reload();
    }
}
