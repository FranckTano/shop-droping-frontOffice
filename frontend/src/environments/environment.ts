export const environment = {
  production: false,
  // API endpoints
  apiBaseUrl: 'http://localhost:8080/api',
  mediaBaseUrl: 'http://localhost:8080',

  // Localization / commerce defaults
  country: 'Côte d\'Ivoire',
  currency: 'FCFA',

  /**
   * Centralized application configuration.
   * Keep top-level, plain JS objects here so it's trivial to override per-build.
   * - `app` contains UI/branding values
   * - `seo` contains default metadata for routes/pages
   * - `analytics` toggles external trackers and IDs
   * - `features` enables/disables optional runtime features
   */
  appConfig: {
    appName: 'Shop Droping',
    shortName: 'ShopDrop',
    title: 'Shop Droping — Curated Vintage & New',
    description:
      "Shop Droping — discover and buy curated vintage and modern apparel. Fast shipping and easy returns.",
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en'],
    themeColor: '#ffffff', // used for meta theme-color
    defaultImage: '/assets/images/storefront/hero/hero-default.jpg', // OpenGraph / share image
    contactEmail: 'support@shopdroping.example',
    companyName: 'Shop Droping SAS',
  },

  seo: {
    titleTemplate: '%s | Shop Droping',
    // twitterHandle: '@shopdroping',
    ogType: 'website',
    siteName: 'Shop Droping',
  },

  analytics: {
    enable: false,
    googleTagId: '', // e.g. 'G-XXXXXXX'
    plausibleDomain: '',
  },

  features: {
    enableNewsletter: true,
    enableReviews: false,
    enableQuickAdd: true,
  },
};
