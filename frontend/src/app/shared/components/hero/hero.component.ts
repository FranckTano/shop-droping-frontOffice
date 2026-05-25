import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-shop-hero',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.css'],
})
export class ShopHeroComponent {}
