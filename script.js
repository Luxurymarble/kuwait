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
});

// 4. وظائف الـ Lightbox (خارج نطاق الـ ready لتعمل من الـ HTML)
function openLightbox(element) {
    const imgElement = element.querySelector('img');
    const imgUrl = imgElement.src; // يحصل على رابط الصورة الكامل
    const title = element.querySelector('.info h3').innerText;
    const desc = element.getAttribute('data-description') || "رخام فاخر من Luxury Marble.";
    
    // رقم الواتساب
    const phoneNumber = "201150142351";

    /* تجهيز الرسالة:
       تشمل اسم المنتج + رابط الصورة لكي تظهر معاينة (Preview) في الواتساب
    */
    const message = `السلام عليكم لاكشري ماربل،
أريد الاستفسار عن المنتج التالي:
*الاسم:* ${title}
*رابط الصورة:* ${imgUrl}`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // تعبئة بيانات النافذة (Lightbox)
    document.getElementById('lightbox-img').src = imgUrl;
    document.getElementById('lightbox-title').innerText = title;
    document.getElementById('lightbox-desc').innerText = desc;
    
    // ربط زر "اطلب الآن" بالرابط الجديد
    const orderBtn = document.getElementById('order-now-btn');
    orderBtn.href = whatsappURL;

    document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}
let currentProducts = []; // مصفوفة لتخزين المنتجات في القسم الحالي
let currentIndex = 0;    // مؤشر المنتج المفتوح حالياً

function openLightbox(element) {
    // 1. تحديد القسم الذي ينتمي إليه المنتج (Sinks, Furniture, or Stairs)
    const section = element.closest('.grid');
    // 2. جلب جميع المنتجات في هذا القسم فقط
    currentProducts = Array.from(section.querySelectorAll('.product-card'));
    // 3. تحديد ترتيب المنتج الحالي
    currentIndex = currentProducts.indexOf(element);

    updateLightbox();
    document.getElementById('lightbox').style.display = 'flex';
}

function updateLightbox() {
    const product = currentProducts[currentIndex];
    const imgUrl = product.querySelector('img').src;
    const title = product.querySelector('.info h3').innerText;
    const desc = product.getAttribute('data-description') || "رخام فاخر بتصميم حصري من لاكشري ماربل.";
    
    // تحديث المحتوى
    document.getElementById('lightbox-img').src = imgUrl;
    document.getElementById('lightbox-title').innerText = title;
    document.getElementById('lightbox-desc').innerText = desc;

    // تحديث رابط الواتساب
    const phoneNumber = "201150142351";
   const message = `السلام عليكم لاكشري ماربل،
أريد الاستفسار عن المنتج التالي:
*الاسم:* ${title}
*رابط الصورة:* ${imgUrl}`;
    document.getElementById('order-now-btn').href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

// وظيفة التنقل يمين ويسار
function changeProduct(direction) {
    currentIndex += direction;
    
    // لجعل السكرول دائري (Loop)
    if (currentIndex >= currentProducts.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = currentProducts.length - 1;

    updateLightbox();
}

// إغلاق النافذة
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// إغلاق عند الضغط على الخلفية السوداء فقط
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
});

// إمكانية التنقل باستخدام أسهم لوحة المفاتيح
document.addEventListener('keydown', function(e) {
    if (document.getElementById('lightbox').style.display === 'flex') {
        if (e.key === "ArrowRight") changeProduct(1);
        if (e.key === "ArrowLeft") changeProduct(-1);
        if (e.key === "Escape") closeLightbox();
    }
});
let touchstartX = 0;
let touchendX = 0;

const lightboxContainer = document.getElementById('lightbox');

// بدء اللمس
lightboxContainer.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, {passive: true});

// نهاية اللمس
lightboxContainer.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
}, {passive: true});

// حساب اتجاه السحب
function handleGesture() {
    // إذا كان السحب لليسار (التالي)
    if (touchstartX - touchendX > 50) {
        changeProduct(1);
    }
    // إذا كان السحب لليمين (السابق)
    if (touchendX - touchstartX > 50) {
        changeProduct(-1);
    }
}
