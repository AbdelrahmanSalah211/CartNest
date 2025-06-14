// import { Routes } from '@angular/router';
// import { UserFormComponent } from './pages/user-form/user-form.component';
// import { LayoutComponent } from './pages/layout/layout.component';
// import { ProductsComponent } from './pages/products/products.component';
// import { HomeComponent } from './pages/home/home.component';
// import { AboutComponent } from './pages/about/about.component';
// import { RoleGuard } from './guards/role.guard';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full'
//   },
//   {
//     path: 'register',
//     component: UserFormComponent,
//     data: {
//       mode: 'register'
//     }
//   },
//   {
//     path: 'login',
//     component: UserFormComponent,
//     data: {
//       mode: 'login'
//     }
//   },
//   {
//     path: 'home',
//     component: HomeComponent,
//   },
//   {
//     path: 'about',
//     component: AboutComponent,
//   },
//   {
//     path: '',
//     component: LayoutComponent,
//     children: [
//       { path: 'products', component: ProductsComponent, canActivate: [RoleGuard], data: { role: 'customer' } },
//       { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'admin' } }
//     ]
//   }
// ];

import { Routes } from '@angular/router';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProductsComponent } from './pages/products/products.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { RoleGuard } from './guards/role.guard';
import { OrdersComponent } from './pages/orders/orders.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'products', component: ProductsComponent, canActivate: [RoleGuard], data: { role: ['customer', 'admin'] } },
      { path: 'orders', component: OrdersComponent, canActivate: [RoleGuard], data: { role: ['admin'] } },
      { path: 'login', component: UserFormComponent, data: { mode: 'login' } },
      { path: 'register', component: UserFormComponent, data: { mode: 'register' } },
      { path: 'checkout', component: CheckoutComponent, canActivate: [RoleGuard], data: { role: ['customer'] } },
      { path: 'profile', component: ProfileComponent, canActivate: [RoleGuard], data: { role: ['customer'] } }
    ]
  }
];
