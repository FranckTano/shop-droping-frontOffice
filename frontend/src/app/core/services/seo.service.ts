import { Inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { APP_CONFIG } from '../../app.config';

/**
 * Small SEO helper service.
 * - Reads defaults from `APP_CONFIG` (provided from environment.appConfig)
 * - Exposes methods to set page title, description, social tags and canonical URL
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    @Inject(APP_CONFIG) private cfg: any,
  ) {
    this.applyDefaults();
  }

  private applyDefaults(): void {
    if (!this.cfg) return;
    if (this.cfg.title) this.setTitle(this.cfg.title);
    if (this.cfg.description) this.setMetaTags({ description: this.cfg.description });
    if (this.cfg.themeColor) {
      this.meta.updateTag({ name: 'theme-color', content: this.cfg.themeColor });
    }
    // OpenGraph / site name default
    if (this.cfg.appName) {
      this.meta.updateTag({ property: 'og:site_name', content: this.cfg.appName });
    }
  }

  /**
   * Set the document title using `appConfig.titleTemplate` when available.
   */
  setTitle(title?: string): void {
    const tpl = (this.cfg && this.cfg.titleTemplate) || '%s';
    const final = title ? tpl.replace('%s', title) : (this.cfg && this.cfg.title) || '';
    this.titleService.setTitle(final);
    this.meta.updateTag({ property: 'og:title', content: final });
    this.meta.updateTag({ name: 'twitter:title', content: final });
  }

  /**
   * Update common meta tags. Pass any subset of keys.
   */
  setMetaTags(tags: { description?: string; keywords?: string; author?: string; image?: string; url?: string }): void {
    if (tags.description) {
      this.meta.updateTag({ name: 'description', content: tags.description });
      this.meta.updateTag({ property: 'og:description', content: tags.description });
      this.meta.updateTag({ name: 'twitter:description', content: tags.description });
    }
    if (tags.keywords) {
      this.meta.updateTag({ name: 'keywords', content: tags.keywords });
    }
    if (tags.author) {
      this.meta.updateTag({ name: 'author', content: tags.author });
    }
    if (tags.image) {
      this.meta.updateTag({ property: 'og:image', content: tags.image });
      this.meta.updateTag({ name: 'twitter:image', content: tags.image });
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    }
    if (tags.url) {
      this.meta.updateTag({ property: 'og:url', content: tags.url });
      this.setCanonical(tags.url);
    }
  }

  /**
   * Create or update a canonical link tag
   */
  setCanonical(url?: string): void {
    if (!url) return;
    const linkSelector = "link[rel='canonical']";
    let element = document.querySelector<HTMLLinkElement>(linkSelector);
    if (element) {
      element.href = url;
    } else {
      element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', url);
      document.head.appendChild(element);
    }
  }

  /**
   * Utility to set metadata for a route using a small config object.
   * Example: seo.updateRouteMeta({ title: 'Product', description: '...' })
   */
  updateRouteMeta(data: { title?: string; description?: string; image?: string; url?: string; keywords?: string }): void {
    if (data.title) this.setTitle(data.title);
    this.setMetaTags({ description: data.description, image: data.image, url: data.url, keywords: data.keywords });
  }
}
