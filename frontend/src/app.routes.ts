import {Routes} from '@angular/router';
import {AppLayout} from '@/layout/components/app.layout';

export const appRoutes: Routes = [
	{
		path: '',
		redirectTo: '/boutique',
		pathMatch: 'full'
	},
	{
		path: 'boutique',
		data: {breadcrumb: 'Boutique'},
		loadChildren: () => import('@/pages/ecommerce/ecommerce.routes')
	},
	{
		path: 'admin',
		component: AppLayout,
		children: [
			{path: '', redirectTo: '/boutique', pathMatch: 'full'}
		]
	},
	{
		path: 'connexion',
		loadComponent: () => import('@/login/login').then((c) => c.Login)
	},
	{
		path: 'notfound',
		loadComponent: () => import('@/pages/notfound/notfound').then((c) => c.Notfound)
	},
	{path: '**', redirectTo: '/notfound'}
];
