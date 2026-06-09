// Translation keys and content for EN, FR, AR
export type Locale = 'en' | 'fr' | 'ar'

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.brand': 'Forward OS',
    'nav.browseDeals': 'Browse Deals',
    'nav.signIn': 'Sign In',

    // Hero Section
    'hero.title': 'The M&A Platform Built for Intelligent Deals',
    'hero.subtitle': 'AI-powered deal intelligence, institutional network, and professional services. Everything you need to acquire or sell with confidence.',
    'hero.cta1': 'Get Started Free',
    'hero.cta2': 'Browse Marketplace',
    'hero.trust': '✅ No credit card required • ✅ Instant access to 47+ deals • ✅ Bank-level security',

    // Features Section
    'features.title': 'Why Forward OS',
    'features.ai.title': '5 AI Models',
    'features.ai.desc': 'Success probability, optimal timing, fair pricing, growth forecasts, buyer matching.',
    'features.intelligence.title': 'Market Intelligence',
    'features.intelligence.desc': '500+ verified deals, real comparables, sector benchmarking, confidence scoring.',
    'features.network.title': 'Institutional Network',
    'features.network.desc': 'Verified brokers, integrations, white-label API, professional services network.',

    // Stats Section
    'stats.market': 'Annual M&A Market',
    'stats.deals': 'Verified Deals',
    'stats.accuracy': 'Prediction Accuracy',
    'stats.moat': 'Competitive Moat',

    // User Types Section
    'users.title': 'Built for Every Role',
    'users.sellers.title': 'For Sellers',
    'users.sellers.desc': 'Know your deal value. Find the right buyers. Time your exit perfectly.',
    'users.sellers.cta': 'List Your Business',
    'users.buyers.title': 'For Buyers',
    'users.buyers.desc': 'Find best deals before the market. Get AI intelligence on every opportunity.',
    'users.buyers.cta': 'Browse Deals',
    'users.brokers.title': 'For Brokers',
    'users.brokers.desc': 'Build reputation on outcomes. Get more deal flow. Close faster.',
    'users.brokers.cta': 'Join Network',

    // CTA Section
    'cta.title': 'Ready to Win?',
    'cta.subtitle': 'Join 500+ deal professionals using Forward OS to source, analyze, and close M&A transactions.',
    'cta.button1': 'Get Started Free →',
    'cta.button2': 'Enterprise Demo',

    // Footer
    'footer.product': 'Product',
    'footer.marketplace': 'Marketplace',
    'footer.institutional': 'Institutional',
    'footer.professional': 'Professional Services',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.help': 'Help Center',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.security': 'Security',
    'footer.connect': 'Connect',
    'footer.twitter': 'Twitter',
    'footer.linkedin': 'LinkedIn',
    'footer.github': 'GitHub',
    'footer.copyright': '© 2024 Forward OS. All rights reserved.',

    // Locale Selector
    'locale.english': 'English',
    'locale.french': 'Français',
    'locale.arabic': 'العربية',
    'locale.canada': 'Canada (CAD)',
    'locale.uae': 'UAE (AED)',
    'locale.us': 'United States (USD)',

    // Contact & Office
    'contact.headquarters': 'Headquarters',
    'contact.address': 'Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates',
    'contact.phone': '+971-4-XXX-XXXX',
    'contact.email': 'hello@forwardos.io',
    'contact.timezone': 'Asia/Dubai',
    'contact.hours': 'Sat-Thu, 9:00 AM - 6:00 PM GST',
  },
  fr: {
    // Navigation
    'nav.brand': 'Forward OS',
    'nav.browseDeals': 'Parcourir les offres',
    'nav.signIn': 'Se connecter',

    // Hero Section
    'hero.title': 'La plateforme de M&A construite pour les transactions intelligentes',
    'hero.subtitle': 'Intelligence des transactions alimentée par l\'IA, réseau institutionnel et services professionnels. Tout ce dont vous avez besoin pour acquérir ou vendre en toute confiance.',
    'hero.cta1': 'Commencer gratuitement',
    'hero.cta2': 'Parcourir la place de marché',
    'hero.trust': '✅ Pas de carte de crédit requise • ✅ Accès instantané à 47+ offres • ✅ Sécurité bancaire',

    // Features Section
    'features.title': 'Pourquoi Forward OS',
    'features.ai.title': '5 modèles d\'IA',
    'features.ai.desc': 'Probabilité de succès, timing optimal, tarification équitable, prévisions de croissance, correspondance des acheteurs.',
    'features.intelligence.title': 'Intelligence de marché',
    'features.intelligence.desc': '500+ transactions vérifiées, comparables réels, analyse sectorielle, notation de confiance.',
    'features.network.title': 'Réseau institutionnel',
    'features.network.desc': 'Courtiers vérifiés, intégrations, API label blanc, réseau de services professionnels.',

    // Stats Section
    'stats.market': 'Marché annuel de M&A',
    'stats.deals': 'Transactions vérifiées',
    'stats.accuracy': 'Précision des prédictions',
    'stats.moat': 'Avantage concurrentiel',

    // User Types Section
    'users.title': 'Conçu pour chaque rôle',
    'users.sellers.title': 'Pour les vendeurs',
    'users.sellers.desc': 'Connaître la valeur de votre transaction. Trouver les bons acheteurs. Chronométrer votre sortie parfaitement.',
    'users.sellers.cta': 'Lister votre entreprise',
    'users.buyers.title': 'Pour les acheteurs',
    'users.buyers.desc': 'Trouvez les meilleures offres avant le marché. Obtenez l\'intelligence IA sur chaque opportunité.',
    'users.buyers.cta': 'Parcourir les offres',
    'users.brokers.title': 'Pour les courtiers',
    'users.brokers.desc': 'Construisez votre réputation sur les résultats. Obtenez plus de flux de transactions. Fermez plus vite.',
    'users.brokers.cta': 'Rejoindre le réseau',

    // CTA Section
    'cta.title': 'Prêt à gagner ?',
    'cta.subtitle': 'Rejoignez 500+ professionnels des transactions utilisant Forward OS pour sourcer, analyser et conclure des transactions M&A.',
    'cta.button1': 'Commencer gratuitement →',
    'cta.button2': 'Démo d\'entreprise',

    // Footer
    'footer.product': 'Produit',
    'footer.marketplace': 'Place de marché',
    'footer.institutional': 'Institutionnel',
    'footer.professional': 'Services professionnels',
    'footer.company': 'Entreprise',
    'footer.about': 'À propos',
    'footer.contact': 'Contact',
    'footer.help': 'Centre d\'aide',
    'footer.legal': 'Légal',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions',
    'footer.security': 'Sécurité',
    'footer.connect': 'Connectez',
    'footer.twitter': 'Twitter',
    'footer.linkedin': 'LinkedIn',
    'footer.github': 'GitHub',
    'footer.copyright': '© 2024 Forward OS. Tous droits réservés.',

    // Locale Selector
    'locale.english': 'English',
    'locale.french': 'Français',
    'locale.arabic': 'العربية',
    'locale.canada': 'Canada (CAD)',
    'locale.uae': 'UAE (AED)',
    'locale.us': 'United States (USD)',

    // Contact & Office
    'contact.headquarters': 'Siège social',
    'contact.address': 'Bâtiment A1, Dubai Digital Park, Dubai Silicon Oasis, Dubaï, Émirats Arabes Unis',
    'contact.phone': '+971-4-XXX-XXXX',
    'contact.email': 'hello-ca@forwardos.io',
    'contact.timezone': 'Asie/Dubaï',
    'contact.hours': 'Sam-Jeu, 9:00 AM - 6:00 PM GST',
  },
  ar: {
    // Navigation
    'nav.brand': 'Forward OS',
    'nav.browseDeals': 'استعراض الصفقات',
    'nav.signIn': 'تسجيل الدخول',

    // Hero Section
    'hero.title': 'منصة الاندماج والاستحواذ المبنية للصفقات الذكية',
    'hero.subtitle': 'ذكاء الصفقات المدفوع بالذكاء الاصطناعي والشبكة المؤسسية والخدمات الاحترافية. كل ما تحتاجه للاستحواذ أو البيع بثقة.',
    'hero.cta1': 'ابدأ مجاناً',
    'hero.cta2': 'استعرض السوق',
    'hero.trust': '✅ لا تحتاج إلى بطاقة ائتمان • ✅ وصول فوري إلى 47+ صفقة • ✅ أمان على مستوى البنوك',

    // Features Section
    'features.title': 'لماذا Forward OS',
    'features.ai.title': '5 نماذج ذكاء اصطناعي',
    'features.ai.desc': 'احتمالية النجاح والتوقيت الأمثل والتسعير العادل وتوقعات النمو ومطابقة المشترين.',
    'features.intelligence.title': 'ذكاء السوق',
    'features.intelligence.desc': '500+ صفقة مُتحقق منها وقيمها الحقيقية ومعايير القطاع وتقييم الثقة.',
    'features.network.title': 'الشبكة المؤسسية',
    'features.network.desc': 'الوسطاء المتحقق منهم والتكاملات وواجهة برمجية بدون علامات تجارية وشبكة الخدمات الاحترافية.',

    // Stats Section
    'stats.market': 'سوق الاندماج السنوي',
    'stats.deals': 'الصفقات المُتحقق منها',
    'stats.accuracy': 'دقة التنبؤ',
    'stats.moat': 'الميزة التنافسية',

    // User Types Section
    'users.title': 'مبني لكل دور',
    'users.sellers.title': 'للبائعين',
    'users.sellers.desc': 'اعرف قيمة صفقتك. ابحث عن المشترين المناسبين. حدد توقيت خروجك بشكل مثالي.',
    'users.sellers.cta': 'اعرض عملك',
    'users.buyers.title': 'للمشترين',
    'users.buyers.desc': 'ابحث عن أفضل الصفقات قبل السوق. احصل على ذكاء الذكاء الاصطناعي في كل فرصة.',
    'users.buyers.cta': 'استعرض الصفقات',
    'users.brokers.title': 'للوسطاء',
    'users.brokers.desc': 'بناء السمعة على النتائج. احصل على المزيد من تدفق الصفقات. أغلق أسرع.',
    'users.brokers.cta': 'انضم إلى الشبكة',

    // CTA Section
    'cta.title': 'هل أنت مستعد للفوز؟',
    'cta.subtitle': 'انضم إلى 500+ محترف في الصفقات باستخدام Forward OS لإيجاد وتحليل وإغلاق صفقات الاندماج والاستحواذ.',
    'cta.button1': 'ابدأ مجاناً →',
    'cta.button2': 'عرض توضيحي للمؤسسة',

    // Footer
    'footer.product': 'المنتج',
    'footer.marketplace': 'السوق',
    'footer.institutional': 'المؤسسي',
    'footer.professional': 'الخدمات الاحترافية',
    'footer.company': 'الشركة',
    'footer.about': 'معلومات عنا',
    'footer.contact': 'اتصل بنا',
    'footer.help': 'مركز المساعدة',
    'footer.legal': 'قانوني',
    'footer.privacy': 'الخصوصية',
    'footer.terms': 'الشروط',
    'footer.security': 'الأمان',
    'footer.connect': 'تواصل',
    'footer.twitter': 'تويتر',
    'footer.linkedin': 'لينكدإن',
    'footer.github': 'جيثاب',
    'footer.copyright': '© 2024 Forward OS. جميع الحقوق محفوظة.',

    // Locale Selector
    'locale.english': 'English',
    'locale.french': 'Français',
    'locale.arabic': 'العربية',
    'locale.canada': 'Canada (CAD)',
    'locale.uae': 'UAE (AED)',
    'locale.us': 'United States (USD)',

    // Contact & Office
    'contact.headquarters': 'المقر الرئيسي',
    'contact.address': 'المبنى A1، دبي ديجيتال بارك، واحة دبي السيليكون، دبي، الإمارات العربية المتحدة',
    'contact.phone': '+971-4-XXX-XXXX',
    'contact.email': 'hello-ae@forwardos.io',
    'contact.timezone': 'آسيا/دبي',
    'contact.hours': 'السبت-الخميس، 9:00 صباحاً - 6:00 مساءً GST',
  },
}

export function t(key: string, locale: Locale = 'en'): string {
  return translations[locale]?.[key] ?? key
}

export const isRTL = (locale: Locale): boolean => locale === 'ar'

export const localeInfo = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' as const, currency: 'USD' },
  fr: { name: 'Français', nativeName: 'Français', dir: 'ltr' as const, currency: 'CAD' },
  ar: { name: 'العربية', nativeName: 'العربية', dir: 'rtl' as const, currency: 'AED' },
}
