import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FOOTER_LINK_GROUPS } from '../../storefront-content';

@Component({
    selector: 'app-shop-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.component.html',
})
export class ShopFooterComponent {
    footerGroups = FOOTER_LINK_GROUPS;
}