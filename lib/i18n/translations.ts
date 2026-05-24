import type { Locale } from "./locales";

export type TranslationKey =
  | "home"
  | "products"
  | "about"
  | "contact"
  | "viewProducts"
  | "viewDetails"
  | "discoverCategories"
  | "featuredProducts"
  | "newProducts"
  | "categories"
  | "ourCategories"
  | "contactUs"
  | "aboutUs"
  | "furnitureCatalog"
  | "qualityProduction"
  | "customDesign"
  | "fastCommunication"
  | "projectSupport"
  | "exploreCollection"
  | "getInTouch"
  | "navMenu"
  | "language"
  | "whatsapp"
  | "mockCategoryBlurb"
  | "mockCatKoltuk"
  | "mockCatYatak"
  | "mockCatYemek"
  | "mockCatTv"
  | "mockProdModernSofa"
  | "mockProdMinimalTv"
  | "mockProdWoodDining"
  | "mockProdComfortBedroom"
  | "mockHeroSlide1Tagline"
  | "mockHeroSlide1Title"
  | "mockHeroSlide2Tagline"
  | "mockHeroSlide2Title"
  | "mockHeroSlide3Tagline"
  | "mockHeroSlide3Title"
  | "benefitDescQuality"
  | "benefitDescCustom"
  | "benefitDescFast"
  | "benefitDescProject"
  | "aboutPreviewLead"
  | "aboutPreviewBody"
  | "footerExplore"
  | "footerCategories"
  | "allProducts"
  | "filterByCategory"
  | "productDetails"
  | "productCode"
  | "category"
  | "relatedProducts"
  | "noProductsFound"
  | "backToProducts"
  | "contactForProduct"
  | "contactForPrice"
  | "ourStory"
  | "visitUs"
  | "callUs"
  | "emailUs"
  | "addressLabel"
  | "socialMedia"
  | "openInMaps"
  | "weAreHereToHelp";

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  tr: {
    home: "Ana Sayfa",
    products: "Ürünler",
    about: "Hakkımızda",
    contact: "İletişim",
    viewProducts: "Ürünleri Gör",
    viewDetails: "Detayları Gör",
    discoverCategories: "Kategorileri Keşfet",
    featuredProducts: "Öne Çıkan Ürünler",
    newProducts: "Yeni Ürünler",
    categories: "Kategoriler",
    ourCategories: "Kategorilerimiz",
    contactUs: "Bize Ulaşın",
    aboutUs: "Hakkımızda",
    furnitureCatalog: "Mobilya Kataloğu",
    qualityProduction: "Kaliteli Üretim",
    customDesign: "Özel Tasarım",
    fastCommunication: "Hızlı İletişim",
    projectSupport: "Proje Desteği",
    exploreCollection: "Koleksiyonu Keşfet",
    getInTouch: "İletişime Geç",
    navMenu: "Menü",
    language: "Dil",
    whatsapp: "WhatsApp",
    mockCategoryBlurb: "Mekânınıza uygun seçkin parçalar.",
    mockCatKoltuk: "Koltuk Takımları",
    mockCatYatak: "Yatak Odası",
    mockCatYemek: "Yemek Odası",
    mockCatTv: "TV Üniteleri",
    mockProdModernSofa: "Modern Koltuk Takımı",
    mockProdMinimalTv: "Minimal TV Ünitesi",
    mockProdWoodDining: "Ahşap Yemek Masası",
    mockProdComfortBedroom: "Konfor Yatak Odası",
    mockHeroSlide1Tagline: "Şovroom",
    mockHeroSlide1Title: "Zamansız formlar, sakin lüks.",
    mockHeroSlide2Tagline: "Yaşam alanları",
    mockHeroSlide2Title: "Ölçünüze özel üretim ve danışmanlık.",
    mockHeroSlide3Tagline: "Koleksiyon",
    mockHeroSlide3Title: "Doğal dokular, yumuşak ışık, net çizgiler.",
    benefitDescQuality: "Dayanıklı malzeme ve özenli işçilikle uzun ömürlü mobilya.",
    benefitDescCustom: "Mekânınıza ve tarzınıza göre ölçü, kumaş ve detay seçenekleri.",
    benefitDescFast: "Tüm süreçte şeffaf ve hızlı iletişim.",
    benefitDescProject: "Konuttan ticari projelere kadar uçtan uca destek.",
    aboutPreviewLead: "Tasarımı, üretimi ve proje yönetimini tek çatı altında sunuyoruz.",
    aboutPreviewBody:
      "Sade bir şovroom deneyimi: seçkin koleksiyonlar, sakin bir dil ve size özel çözümler. Satış baskısı yok; doğru parçayı birlikte seçiyoruz.",
    footerExplore: "Keşfet",
    footerCategories: "Kategoriler",
    allProducts: "Tüm Ürünler",
    filterByCategory: "Kategoriye göre filtrele",
    productDetails: "Ürün detayı",
    productCode: "Ürün kodu",
    category: "Kategori",
    relatedProducts: "İlgili ürünler",
    noProductsFound: "Bu kriterlere uygun ürün bulunamadı.",
    backToProducts: "Ürünlere dön",
    contactForProduct: "Bu ürün için iletişim",
    contactForPrice: "Fiyat için iletişime geçin",
    ourStory: "Hikayemiz",
    visitUs: "Bizi ziyaret edin",
    callUs: "Bizi arayın",
    emailUs: "E-posta gönderin",
    addressLabel: "Adres",
    socialMedia: "Sosyal medya",
    openInMaps: "Haritada aç",
    weAreHereToHelp: "Sorularınız ve projeleriniz için buradayız; en kısa sürede dönüş yaparız.",
  },
  en: {
    home: "Home",
    products: "Products",
    about: "About",
    contact: "Contact",
    viewProducts: "View Products",
    viewDetails: "View Details",
    discoverCategories: "Discover Categories",
    featuredProducts: "Featured Products",
    newProducts: "New Products",
    categories: "Categories",
    ourCategories: "Our Categories",
    contactUs: "Contact Us",
    aboutUs: "About Us",
    furnitureCatalog: "Furniture Catalog",
    qualityProduction: "Quality Production",
    customDesign: "Custom Design",
    fastCommunication: "Fast Communication",
    projectSupport: "Project Support",
    exploreCollection: "Explore Collection",
    getInTouch: "Get in Touch",
    navMenu: "Menu",
    language: "Language",
    whatsapp: "WhatsApp",
    mockCategoryBlurb: "Curated pieces for calm, considered spaces.",
    mockCatKoltuk: "Sofa Sets",
    mockCatYatak: "Bedroom",
    mockCatYemek: "Dining Room",
    mockCatTv: "TV Units",
    mockProdModernSofa: "Modern Sofa Set",
    mockProdMinimalTv: "Minimal TV Unit",
    mockProdWoodDining: "Wooden Dining Table",
    mockProdComfortBedroom: "Comfort Bedroom Set",
    mockHeroSlide1Tagline: "Showroom",
    mockHeroSlide1Title: "Timeless forms, quiet luxury.",
    mockHeroSlide2Tagline: "Living spaces",
    mockHeroSlide2Title: "Bespoke production and guidance, tailored to you.",
    mockHeroSlide3Tagline: "Collection",
    mockHeroSlide3Title: "Natural textures, soft light, clean lines.",
    benefitDescQuality: "Long-lasting furniture with careful craftsmanship.",
    benefitDescCustom: "Dimensions, finishes, and details aligned to your space.",
    benefitDescFast: "Clear, responsive communication at every step.",
    benefitDescProject: "End-to-end support from residential to commercial projects.",
    aboutPreviewLead: "Design, manufacturing, and project coordination under one roof.",
    aboutPreviewBody:
      "A calm showroom experience: curated collections, understated language, and solutions shaped around you—without a pushy retail feel.",
    footerExplore: "Explore",
    footerCategories: "Categories",
    allProducts: "All Products",
    filterByCategory: "Filter by category",
    productDetails: "Product details",
    productCode: "Product code",
    category: "Category",
    relatedProducts: "Related products",
    noProductsFound: "No products match these filters.",
    backToProducts: "Back to products",
    contactForProduct: "Contact about this product",
    contactForPrice: "Contact us for price",
    ourStory: "Our story",
    visitUs: "Visit us",
    callUs: "Call us",
    emailUs: "Email us",
    addressLabel: "Address",
    socialMedia: "Social media",
    openInMaps: "Open in Maps",
    weAreHereToHelp: "We are here to help with questions and projects—we will get back to you promptly.",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    about: "من نحن",
    contact: "اتصل بنا",
    viewProducts: "عرض المنتجات",
    viewDetails: "عرض التفاصيل",
    discoverCategories: "استكشف الفئات",
    featuredProducts: "منتجات مميزة",
    newProducts: "منتجات جديدة",
    categories: "الفئات",
    ourCategories: "فئاتنا",
    contactUs: "تواصل معنا",
    aboutUs: "من نحن",
    furnitureCatalog: "كتالوج الأثاث",
    qualityProduction: "إنتاج عالي الجودة",
    customDesign: "تصميم مخصص",
    fastCommunication: "تواصل سريع",
    projectSupport: "دعم المشاريع",
    exploreCollection: "استكشف المجموعة",
    getInTouch: "تواصل معنا",
    navMenu: "القائمة",
    language: "اللغة",
    whatsapp: "واتساب",
    mockCategoryBlurb: "قطع مختارة لمساحات هادئة وأنيقة.",
    mockCatKoltuk: "أطقم الأرائك",
    mockCatYatak: "غرفة النوم",
    mockCatYemek: "غرفة الطعام",
    mockCatTv: "وحدات التلفاز",
    mockProdModernSofa: "طقم أرائك حديث",
    mockProdMinimalTv: "وحدة تلفاز بسيطة",
    mockProdWoodDining: "طاولة طعام خشبية",
    mockProdComfortBedroom: "طقم غرفة نوم مريح",
    mockHeroSlide1Tagline: "صالة العرض",
    mockHeroSlide1Title: "أشكال خالدة وفخامة هادئة.",
    mockHeroSlide2Tagline: "مساحات المعيشة",
    mockHeroSlide2Title: "إنتاج واستشارات مخصصة لاحتياجك.",
    mockHeroSlide3Tagline: "المجموعة",
    mockHeroSlide3Title: "نسيج طبيعي، إضاءة ناعمة، وخطوط واضحة.",
    benefitDescQuality: "أثاث طويل الأمد بحرفية دقيقة.",
    benefitDescCustom: "أبعاد وتشطيبات وتفاصيل تناسب مساحتك.",
    benefitDescFast: "تواصل واضح وسريع في كل مرحلة.",
    benefitDescProject: "دعم متكامل من المنازل إلى المشاريع التجارية.",
    aboutPreviewLead: "التصميم والتصنيع وتنسيق المشاريع تحت سقف واحد.",
    aboutPreviewBody:
      "تجربة صالة عرض هادئة: مجموعات مختارة ولغة بسيطة وحلول مصممة حولك—دون ضغط بيع مزعج.",
    footerExplore: "استكشف",
    footerCategories: "الفئات",
    allProducts: "جميع المنتجات",
    filterByCategory: "تصفية حسب الفئة",
    productDetails: "تفاصيل المنتج",
    productCode: "رمز المنتج",
    category: "الفئة",
    relatedProducts: "منتجات ذات صلة",
    noProductsFound: "لا توجد منتجات مطابقة لهذه المعايير.",
    backToProducts: "العودة إلى المنتجات",
    contactForProduct: "تواصل بخصوص هذا المنتج",
    contactForPrice: "تواصل معنا للسعر",
    ourStory: "قصتنا",
    visitUs: "زرنا",
    callUs: "اتصل بنا",
    emailUs: "راسلنا عبر البريد",
    addressLabel: "العنوان",
    socialMedia: "وسائل التواصل",
    openInMaps: "افتح في الخرائط",
    weAreHereToHelp: "نحن هنا لمساعدتك في الأسئلة والمشاريع، وسنعود إليك بأسرع وقت ممكن.",
  },
};
