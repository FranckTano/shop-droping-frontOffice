import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AppMenuitem} from './app.menuitem';

@Component({
	selector: 'app-menu, [app-menu]',
	standalone: true,
	imports: [CommonModule, AppMenuitem, RouterModule],
	template: `
		<ul class="layout-menu" #menuContainer>
			<ng-container *ngFor="let item of model; let i = index">
				<li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
				<li *ngIf="item.separator" class="menu-separator"></li>
			</ng-container>
		</ul>`
})
export class AppMenu {
	el: ElementRef = inject(ElementRef);

	@ViewChild('menuContainer') menuContainer!: ElementRef;

	model: MenuItem[] = [
		{
			label: 'Boutique',
			items: [
				{
					label: 'Tous les maillots',
					icon: 'pi pi-home',
					routerLink: ['/boutique']
				},
				{
					label: 'Promotions',
					icon: 'pi pi-percentage',
					routerLink: ['/boutique/promotions']
				},
				{
					label: 'Nouveautés',
					icon: 'pi pi-star',
					routerLink: ['/boutique/nouveautes']
				}
			]
		},
		{
			label: 'Mon Compte',
			items: [
				{
					label: 'Mon Panier',
					icon: 'pi pi-shopping-cart',
					routerLink: ['/boutique/panier']
				}
			]
		}

	];

}
