// Product data structure
window.products = {
    classic1: {
        id: 'classic1',
        title: 'عباية كلاسيك',
        category: 'كلاسيك',
        description: 'عباية أنيقة بتصميم كلاسيكي',
        price: 1500,
        images: ['images/products/classic/classic-1.jpg', 'images/products/classic/classic-2.jpg', 'images/products/classic/classic-3.jpg', 'images/products/classic/classic-4.jpg'],
        features: ['قماش كريب فاخر', 'تصميم كلاسيكي', 'مناسبة للمناسبات الرسمية', 'تطريز راقي']
    },
    luxury1: {
        id: 'luxury1',
        title: 'عباية فاخرة',
        category: 'فاخر',
        description: 'عباية مميزة بتطريز راقي',
        price: 2200,
        images: ['images/products/luxury/luxury-1.jpg', 'images/products/luxury/luxury-2.jpg', 'images/products/luxury/luxury-3.jpg', 'images/products/luxury/luxury-4.jpg'],
        features: ['تطريز راقي', 'خامة حريرية فاخرة', 'تصميم مميز', 'مناسبة للمناسبات']
    },
    embroidered1: {
        id: 'embroidered1',
        title: 'عباية مطرزة',
        category: 'مطرز',
        description: 'عباية بتطريز يدوي فاخر',
        price: 1800,
        images: ['images/products/embroidered/embroidered-1.jpg', 'images/products/embroidered/embroidered-2.jpg', 'images/products/embroidered/embroidered-3.jpg', 'images/products/embroidered/embroidered-4.jpg'],
        features: ['تطريز يدوي فاخر', 'تصميم حصري', 'خامة حرير', 'مناسبة للمناسبات الخاصة']
    },
    casual1: {
        id: 'casual1',
        title: 'عباية كاجوال',
        category: 'كاجوال',
        description: 'عباية عصرية للإطلالة اليومية',
        price: 1200,
        images: ['images/products/casual/casual-1.jpg', 'images/products/casual/casual-2.jpg', 'images/products/casual/casual-3.jpg', 'images/products/casual/casual-4.jpg'],
        features: ['قماش مريح', 'تصميم عصري', 'مناسبة للإطلالة اليومية', 'متوفرة بعدة مقاسات']
    },
    modern1: {
        id: 'modern1',
        title: 'عباية عصرية مودرن',
        category: 'مودرن',
        description: 'عباية عصرية بتصميم مودرن وقصة مميزة',
        price: 950,
        images: ['images/products/modern/modern-1.jpg', 'images/products/modern/modern-2.jpg', 'images/products/modern/modern-3.jpg', 'images/products/modern/modern-4.jpg'],
        features: ['تصميم عصري', 'قصة مميزة', 'خامة عالية الجودة', 'مناسبة للإطلالات العصرية']
    },
    evening1: {
        id: 'evening1',
        title: 'عباية سهرة',
        category: 'سهرة',
        description: 'عباية سهرة فاخرة مع تطريز كريستال',
        price: 1600,
        images: ['images/products/evening/evening-1.jpg', 'images/products/evening/evening-2.jpg', 'images/products/evening/evening-3.jpg', 'images/products/evening/evening-4.jpg'],
        features: ['تطريز كريستال', 'خامة فاخرة', 'تصميم راقي', 'مناسبة للسهرات']
    },
    sport1: {
        id: 'sport1',
        title: 'عباية كاجوال سبور',
        category: 'سبور',
        description: 'عباية كاجوال سبور عملية ومريحة',
        price: 850,
        images: ['images/products/sport/sport-1.jpg', 'images/products/sport/sport-2.jpg', 'images/products/sport/sport-3.jpg', 'images/products/sport/sport-4.jpg'],
        features: ['خامة مريحة', 'تصميم عملي', 'مناسبة للرياضة', 'سهلة الحركة']
    },
    premium1: {
        id: 'premium1',
        title: 'عباية بريميم',
        category: 'بريميم',
        description: 'عباية من المجموعة الحصرية بريميم',
        price: 2600,
        images: ['images/products/premium/premium-1.jpg', 'images/products/premium/premium-2.jpg', 'images/products/premium/premium-3.jpg', 'images/products/premium/premium-4.jpg'],
        features: ['خامة حصرية', 'تصميم فريد', 'تطريز مميز', 'مناسبة للمناسبات الخاصة']
    },
    ramadan1: {
        id: 'ramadan1',
        title: 'عباية رمضان الخاصة',
        category: 'رمضان',
        description: 'عباية مميزة لشهر رمضان المبارك',
        price: 1100,
        images: ['images/products/ramadan/ramadan-1.jpg', 'images/products/ramadan/ramadan-2.jpg', 'images/products/ramadan/ramadan-3.jpg', 'images/products/ramadan/ramadan-4.jpg'],
        features: ['تصميم رمضاني', 'خامة مريحة', 'تطريز مميز', 'مناسبة للشهر الفضيل']
    },
    wedding1: {
        id: 'wedding1',
        title: 'عباية العروس',
        category: 'عروس',
        description: 'عباية فاخرة للعروس بتصميم ملكي',
        price: 1299,
        images: ['images/products/wedding/wedding-1.jpg', 'images/products/wedding/wedding-2.jpg', 'images/products/wedding/wedding-3.jpg', 'images/products/wedding/wedding-4.jpg'],
        features: ['تصميم ملكي', 'خامة فاخرة', 'تطريز راقي', 'مناسبة للعروس']
    },
    office1: {
        id: 'office1',
        title: 'عباية المكتب الأنيقة',
        category: 'مكتب',
        description: 'عباية عملية للمرأة العاملة',
        price: 475,
        images: ['images/products/office/office-1.jpg', 'images/products/office/office-2.jpg', 'images/products/office/office-3.jpg', 'images/products/office/office-4.jpg'],
        features: ['تصميم عملي', 'خامة مريحة', 'مناسبة للعمل', 'أناقة مكتبية']
    },
    travel1: {
        id: 'travel1',
        title: 'عباية السفر العملية',
        category: 'سفر',
        description: 'عباية مثالية للسفر والرحلات',
        price: 425,
        images: ['images/products/travel/travel-1.jpg', 'images/products/travel/travel-2.jpg', 'images/products/travel/travel-3.jpg', 'images/products/travel/travel-4.jpg'],
        features: ['خامة مريحة للسفر', 'تصميم عملي', 'سهلة العناية', 'مناسبة للرحلات']
    }
}; 