// Production environment settings. Replace placeholder endpoints/IDs during CI/CD.
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.shopdroping.example/api',
  mediaBaseUrl: 'https://api.shopdroping.example',

  country: 'Côte d\'Ivoire',
  currency: 'FCFA',

  appConfig: {
    appName: 'Shop Droping',
    shortName: 'ShopDrop',
    title: 'Shop Droping — Curated Vintage & New',
    description:
      "Shop Droping — discover and buy curated vintage and modern apparel. Fast shipping and easy returns.",
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en'],
    themeColor: '#111827',
    defaultImage: '/assets/images/storefront/hero/hero-default.jpg',
    contactEmail: 'support@shopdroping.example',
    companyName: 'Shop Droping SAS',
  },

  seo: {
    titleTemplate: '%s | Shop Droping',
    twitterHandle: '@shopdroping',
    ogType: 'website',
    siteName: 'Shop Droping',
  },

  analytics: {
    enable: false,
    googleTagId: '',
    plausibleDomain: '',
  },

  features: {
    enableNewsletter: true,
    enableReviews: false,
    enableQuickAdd: true,
  },
};
